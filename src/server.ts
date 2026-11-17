import './lib/error-capture';
import {consumeLastCapturedError} from './lib/error-capture';
import {renderErrorPage} from './lib/error-page';
import type {D1Database} from '@cloudflare/workers-types';
import {articles,articleUrl,categories} from './lib/content';
import {advertising} from './config/advertising';
type ServerEntry={fetch:(request:Request,env:unknown,ctx:unknown)=>Promise<Response>|Response};
let serverEntryPromise:Promise<ServerEntry>|undefined;
async function getServerEntry(){if(!serverEntryPromise)serverEntryPromise=import('@tanstack/react-start/server-entry').then(m=>(m.default??m)as ServerEntry);return serverEntryPromise}
function protect(response:Response){const h=new Headers(response.headers);h.set('X-Content-Type-Options','nosniff');h.set('Referrer-Policy','strict-origin-when-cross-origin');h.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');h.set('Strict-Transport-Security','max-age=31536000; includeSubDomains');let adOrigin='';if(advertising.enabled&&advertising.scriptUrl){try{const u=new URL(advertising.scriptUrl);if(u.protocol==='https:')adOrigin=' '+u.origin}catch{/* fail closed */}}h.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'"+adOrigin+"; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"+adOrigin+"; frame-src 'self'"+adOrigin+"; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://*.higgsfield.app https://higgsfield.app https://*.higgsfield.ai https://fnf-dev.anwar-695.workers.dev https://feat-apps-marketplace-tools-fnf-dev.anwar-695.workers.dev;");return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h})}
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
async function contact(request:Request,env:{DB?:D1Database}){
 if(request.method!=='POST')return json({message:'Método não permitido.'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({message:'Origem inválida.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({message:'Formato inválido.'},415);
 const reader=request.body?.getReader();if(!reader)return json({message:'Corpo vazio.'},400);let bytes=0;const chunks:Uint8Array[]=[];while(true){const{value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>20000){await reader.cancel();return json({message:'Mensagem muito grande.'},413)}chunks.push(value)}
 let value:unknown;try{const out=new Uint8Array(bytes);let i=0;for(const c of chunks){out.set(c,i);i+=c.length}value=JSON.parse(new TextDecoder().decode(out))}catch{return json({message:'Dados inválidos.'},400)}
 if(!value||typeof value!=='object')return json({message:'Dados inválidos.'},400);const b=value as Record<string,unknown>;
 if(typeof b.website==='string'&&b.website.length>0)return json({message:'Não foi possível registrar a mensagem.'},400);
 const get=(k:string)=>typeof b[k]==='string'?(b[k] as string).trim():'';
 const name=get('name'),email=get('email'),subject=get('subject'),message=get('message');
 if(name.length<2||name.length>100||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!['redacao','correcao','privacidade','publicidade'].includes(subject)||message.length<20||message.length>4000||b.consent!=='yes')return json({message:'Confira nome, e-mail, assunto, mensagem e autorização.'},400);
 const db=env.DB;if(!db)return json({message:'Canal temporariamente indisponível. Tente novamente mais tarde.'},503);
 const now=Math.floor(Date.now()/1000);const ip=request.headers.get('cf-connecting-ip')??'unknown';
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+'|'+Math.floor(now/86400)+'|mancheteviva-contact'));const key=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
 await db.batch([db.prepare("DELETE FROM contact_limits WHERE expires_at < ?").bind(now),db.prepare("DELETE FROM contact_messages WHERE created_at < datetime('now','-180 days')")]);
 const row=await db.prepare('INSERT INTO contact_limits (key,hits,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET hits=hits+1 RETURNING hits').bind(key,now+86400).first<{hits:number}>();
 if((row?.hits??99)>5)return new Response(JSON.stringify({message:'Limite de mensagens atingido. Tente novamente amanhã.'}),{status:429,headers:{'Content-Type':'application/json','Retry-After':'86400','Cache-Control':'no-store'}});
 const id=crypto.randomUUID();await db.prepare('INSERT INTO contact_messages (id,name,email,subject,message) VALUES (?,?,?,?,?)').bind(id,name,email,subject,message).run();return json({id,message:'Mensagem registrada.'},201)
}
function xml(v:string){return v.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!))}
function feed(origin:string){return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Manchete Viva</title><link>'+origin+'</link><description>Informação com contexto.</description><language>pt-br</language>'+articles.map(a=>'<item><title>'+xml(a.title)+'</title><link>'+origin+articleUrl(a)+'</link><guid>'+origin+articleUrl(a)+'</guid><description>'+xml(a.excerpt)+'</description><pubDate>Mon, 16 Nov 2026 21:00:00 GMT</pubDate><source url="'+xml(a.sourceUrl??'')+'">Agência Brasil</source></item>').join('')+'</channel></rss>'}
export default{async fetch(request:Request,env:unknown,ctx:unknown){try{const u=new URL(request.url);let response:Response;
 if(u.pathname==='/api/contato')response=await contact(request,env as {DB?:D1Database});
 else if(u.pathname==='/ads.txt')response=new Response(advertising.adsTxtLines.join('\n')+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
 else if(u.pathname==='/rss.xml')response=new Response(feed(u.origin),{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public,max-age=600'}});
 else{const handler=await getServerEntry();response=await handler.fetch(request,env,ctx);if(response.status>=500){console.error(consumeLastCapturedError()??new Error('SSR error'));response=new Response(renderErrorPage(),{status:500,headers:{'Content-Type':'text/html; charset=utf-8'}})}}
 return protect(response)
 }catch(error){console.error(error instanceof Error?error.name:'ServerError');return protect(new Response('Serviço temporariamente indisponível.',{status:500,headers:{'Content-Type':'text/plain; charset=utf-8'}}))}}};
