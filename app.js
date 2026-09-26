const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadPosts(){
  const container=document.getElementById('posts');
  const status=document.getElementById('feedStatus');
  try{
    const response=await fetch('posts.json',{cache:'no-store'});
    if(!response.ok) throw new Error('Feed non disponibile');
    const data=await response.json();
    const posts=Array.isArray(data)?data:data.posts;
    const source=Array.isArray(data)?'demo':(data.source||'demo');
    status.textContent=source==='manual'?'Aggiornamenti manuali':(source==='x'?'Feed X':'Aggiornamenti');
    if(!posts.length){ container.innerHTML='<p>Nessun aggiornamento ancora.</p>'; return; }
    container.innerHTML=posts.map(post=>{
      const href=post.url&&post.url!=='#'?post.url:'#';
      const external=href!=='#'?' target="_blank" rel="noreferrer"':'';
      return `<article class="post-card">
        <div class="post-accent" aria-hidden="true"></div>
        <div class="post-meta"><span class="post-category">${escapeHtml(post.category||'Aggiornamento')}</span><time>${escapeHtml(post.date||'')}</time></div>
        <h3>${escapeHtml(post.title||'Aggiornamento')}</h3>
        <p>${escapeHtml(post.text||'')}</p>
        <a class="post-link" href="${escapeHtml(href)}"${external}>${href==='#'?'Anteprima':'Vedi post originale ↗'}</a>
      </article>`;
    }).join('');
  }catch(e){
    status.textContent='Feed non disponibile';
    container.innerHTML='<p>Gli aggiornamenti non sono al momento disponibili.</p>';
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
loadPosts();

async function loadQuotes(){
  const container=document.getElementById('quotes');
  if(!container) return;
  try{
    const response=await fetch('quotes.json',{cache:'no-store'});
    if(!response.ok) throw new Error('Citazioni non disponibili');
    const data=await response.json();
    const quotes=Array.isArray(data)?data:(data.quotes||[]);
    if(!quotes.length){
      container.innerHTML='<div class="quote-empty">Nessuna citazione ancora.</div>';
      return;
    }
    container.innerHTML=quotes.map(function(quote){
      const note=quote.note ? '<span class="quote-note">'+escapeHtml(quote.note)+'</span>' : '';
      return '<blockquote class="quote-card"><p class="quote-text">'+escapeHtml(quote.text||'')+'</p><div class="quote-footer"><span class="quote-author">'+escapeHtml(quote.author||'Anonimo')+'</span>'+note+'</div></blockquote>';
    }).join('');
  }catch(e){
    container.innerHTML='<div class="quote-empty">Le citazioni non sono al momento disponibili.</div>';
  }
}
loadQuotes();


async function loadArticles(){
  const container=document.getElementById('articles');
  if(!container) return;
  try{
    const response=await fetch('articles.json',{cache:'no-store'});
    if(!response.ok) throw new Error('Articoli non disponibili');
    const data=await response.json();
    const articles=Array.isArray(data)?data:(data.articles||[]);
    if(!articles.length){
      container.innerHTML='<div class="article-empty">Nessun articolo ancora.</div>';
      return;
    }
    container.innerHTML=articles.map(article=>{
      const category=article.category ? '<span class="article-category">'+escapeHtml(article.category)+'</span>' : '';
      const summary=article.summary ? '<p class="article-summary">'+escapeHtml(article.summary)+'</p>' : '';
      const body=article.body ? '<div class="article-body">'+escapeHtml(article.body).replace(/\n/g,'<br>')+'</div>' : '';
      return '<article class="article-card">'+
        '<div class="article-meta">'+category+'<time>'+escapeHtml(article.date||'')+'</time></div>'+
        '<h3>'+escapeHtml(article.title||'Articolo')+'</h3>'+
        summary+
        (body?'<details><summary>Leggi articolo</summary>'+body+'</details>':'')+
        '</article>';
    }).join('');
  }catch(e){
    container.innerHTML='<div class="article-empty">Gli articoli non sono al momento disponibili.</div>';
  }
}
loadArticles();
