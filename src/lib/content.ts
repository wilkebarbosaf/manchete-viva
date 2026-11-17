import raw from '../data/articles.json';
export type Article={slug:string;category:string;imageKey:string;image?:string;title:string;excerpt:string;sourceDate:string;sourceAuthor:string;credit:string;caption:string;paragraphs:string[];sourceUrl?:string};
export const articles=raw as Article[];
export const categories=[{slug:'brasil',name:'Brasil'},{slug:'politica',name:'Política'},{slug:'economia',name:'Economia'},{slug:'mundo',name:'Mundo'},{slug:'esportes',name:'Esportes'},{slug:'cultura',name:'Cultura'}];
export const categoryName=(slug:string)=>categories.find(c=>c.slug===slug)?.name??slug;
export const articleUrl=(a:Article)=>'/noticias/'+a.slug;
export const dateLabel=(date:string)=>date.slice(8,10)+'/'+date.slice(5,7)+'/'+date.slice(0,4);
export const EDITION='2026-11-16';
export const SITE='https://manchete-viva.higgsfield.app';
export function seo(title:string,description:string,path:string,image?:string){return {meta:[{title:title+' | Manchete Viva'},{name:'description',content:description},{property:'og:title',content:title+' | Manchete Viva'},{property:'og:description',content:description},{property:'og:url',content:SITE+path},{property:'og:image',content:image?SITE+image:SITE+'/assets/cover.png'}],links:[{rel:'canonical',href:SITE+path}]};}
