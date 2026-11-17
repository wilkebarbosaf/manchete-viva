import {createFileRoute,notFound} from '@tanstack/react-router';
import {Shell,Card} from '../components/portal';
import {articles,categories,categoryName,seo} from '../lib/content';
export const Route=createFileRoute('/editoria/$slug')({loader:({params})=>{if(!categories.some(c=>c.slug===params.slug))throw notFound();return {slug:params.slug}},head:({loaderData})=>seo(categoryName(loaderData?.slug??''),'Notícias de '+categoryName(loaderData?.slug??'')+' com fontes e contexto.','/editoria/'+(loaderData?.slug??'')),component:Category});
function Category(){const{slug}=Route.useLoaderData();return <Shell><main className="container page" id="conteudo"><div className="breadcrumbs"><a href="/">Início</a> / Editorias</div><h1 className="page-title">{categoryName(slug)}</h1><p className="page-intro">Os fatos, suas fontes e o contexto para entender.</p><div className="category-grid">{articles.filter(a=>a.category===slug).map(a=><Card key={a.slug} article={a}/>)}</div></main></Shell>}
