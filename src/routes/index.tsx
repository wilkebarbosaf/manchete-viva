import {useEffect} from 'react';
import {createFileRoute} from '@tanstack/react-router';
import {Shell,Card,NewsImage,HighlightRail} from '../components/portal';
import {articles,articleUrl,seo} from '../lib/content';
export const Route=createFileRoute('/')({head:()=>seo('Notícias do Brasil e do mundo','Notícias de Brasil, política, economia, mundo, esportes e cultura. Fontes identificadas e informação com contexto.','/'),component:Home});
function Home(){
  const hero=articles[0];

  useEffect(()=>{
    if(typeof IntersectionObserver==='undefined')return;

    const targets=document.querySelectorAll<HTMLElement>('.home .other-grid > .news-card, .home .culture-band > .culture-intro, .home .culture-band > .news-card, .home .latest-list > article');
    const observer=new IntersectionObserver((entries,currentObserver)=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.setAttribute('data-revealed','');
        currentObserver.unobserve(entry.target);
      }
    },{rootMargin:'0px 0px -40px 0px',threshold:.12});

    targets.forEach(target=>observer.observe(target));
    return ()=>observer.disconnect();
  },[]);

  return <Shell><main id="conteudo" className="container home"><div className="lead-grid"><section aria-label="Principais notícias"><article className="hero"><a href={articleUrl(hero)}><NewsImage article={hero} priority/><div className="hero-scrim"/><div className="hero-copy"><span className="hero-category">POLÍTICA</span><h1>{hero.title}</h1><p>{hero.excerpt}</p><span className="hero-read">ENTENDA A PROPOSTA <span>↗</span></span></div></a></article><div className="hero-credit">Foto: {hero.credit}</div><div className="top-stories">{[articles[1],articles[2],articles[3]].map(a=><Card key={a.slug} article={a}/>)}</div><section className="more-stories"><h2 className="section-title">Outros destaques</h2><div className="other-grid">{[articles[4],articles[5]].map(a=><Card compact key={a.slug} article={a}/>)}</div></section></section><HighlightRail/></div><section className="culture-band"><div className="culture-intro"><span>CULTURA</span><h2>Arte que faz parte<br/>da nossa história.</h2><a href="/editoria/cultura">Explore a editoria ↗</a></div><Card article={articles[6]} compact/></section><section className="latest-section"><h2 className="section-title">Acompanhe os fatos</h2><div className="latest-list">{[...articles].sort((a,b)=>b.sourceDate.localeCompare(a.sourceDate)).slice(0,4).map(a=><article key={a.slug}><span>{a.sourceDate.slice(8,10)} NOV</span><div><a className="category" href={'/editoria/'+a.category}>{a.category==='politica'?'Política':a.category==='brasil'?'Brasil':a.category==='economia'?'Economia':a.category==='cultura'?'Cultura':'Mundo'}</a><h3><a href={articleUrl(a)}>{a.title}</a></h3></div><a href={articleUrl(a)} className="read-arrow" aria-label={'Ler '+a.title}>↗</a></article>)}</div></section></main></Shell>
}
