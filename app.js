const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linkifyText=(value='')=>escapeHtml(value).replace(/(https?:\/\/[^\s<]+)/g,'<a class="article-link" href="$1" target="_blank" rel="noreferrer">$1 ↗</a>');
function loadXWidgets(){
  const render=()=>{
    if(!window.twttr||!window.twttr.widgets) return;
    document.querySelectorAll('.x-tweet-mount[data-tweet-id]').forEach(el=>{
      if(el.dataset.rendered==='1') return;
      el.dataset.rendered='1';
      const id=el.dataset.tweetId;
      el.innerHTML='';
      window.twttr.widgets.createTweet(id,el,{dnt:true,theme:'light',align:'center'}).then(node=>{
        if(!node){
          el.innerHTML='<p class="x-embed-error">Il post non può essere incorporato. <a href="'+escapeHtml(el.closest('.x-embed-card')?.querySelector('a')?.href||'https://x.com')+'" target="_blank" rel="noreferrer">Aprilo su X ↗</a></p>';
        }
      });
    });
  };
  if(window.twttr&&window.twttr.widgets){ render(); return; }
  let script=document.getElementById('x-widgets-script');
  if(!script){
    script=document.createElement('script');
    script.id='x-widgets-script';
    script.src='https://platform.twitter.com/widgets.js';
    script.async=true;
    script.charset='utf-8';
    document.head.appendChild(script);
  }
  script.addEventListener('load',render,{once:true});
}

async function loadPosts(limit=6){
  const container=document.getElementById('posts');
  const status=document.getElementById('feedStatus');
  try{
    const response=await fetch('posts.json',{cache:'no-store'});
    if(!response.ok) throw new Error('Feed non disponibile');
    const data=await response.json();
    const allPosts=Array.isArray(data)?data:(data.posts||[]);
    const posts=Number.isFinite(limit)?allPosts.slice(0,limit):allPosts;
    const source=Array.isArray(data)?'demo':(data.source||'demo');
    status.textContent=source==='manual'?'Aggiornamenti manuali':(source==='x'?'Feed X':'Aggiornamenti');
    if(!posts.length){ container.innerHTML='<p>Nessun aggiornamento ancora.</p>'; return; }
    container.innerHTML=posts.map((post,index)=>{
      if(post.type==='x-embed'&&post.tweet_id){
        return `<article class="x-embed-card">
          <div class="x-embed-meta"><span class="post-category">X</span><time>${escapeHtml(post.date||'')}</time></div>
          <div class="x-tweet-mount" id="x-tweet-${index}" data-tweet-id="${escapeHtml(post.tweet_id)}">
            <a href="${escapeHtml(post.url||'https://x.com')}" target="_blank" rel="noreferrer">Caricamento post X…</a>
          </div>
        </article>`;
      }
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
    if(posts.some(post=>post.type==='x-embed'&&post.tweet_id)) loadXWidgets();
  }catch(e){
    status.textContent='Feed non disponibile';
    container.innerHTML='<p>Gli aggiornamenti non sono al momento disponibili.</p>';
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
loadPosts(4);

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
      const image=article.image ? '<img class="article-image" src="'+escapeHtml(article.image)+'" alt="'+escapeHtml(article.title||'Immagine articolo')+'" loading="lazy">' : '';
      const summary=article.summary ? '<p class="article-summary">'+escapeHtml(article.summary)+'</p>' : '';
      const body=article.body ? '<div class="article-body">'+escapeHtml(article.body).replace(/\n/g,'<br>')+'</div>' : '';
      const articleLink=article.url ? '<a class="article-link-button" href="'+escapeHtml(article.url)+'" target="_blank" rel="noreferrer">'+escapeHtml(article.link_label||'Apri link')+' ↗</a>' : '';
      return '<article class="article-card">'+image+
        '<div class="article-meta">'+category+'<time>'+escapeHtml(article.date||'')+'</time></div>'+
        '<h3>'+escapeHtml(article.title||'Articolo')+'</h3>'+
        summary+
        (body?'<details><summary>Leggi articolo</summary>'+body+articleLink+'</details>':articleLink)+
        '</article>';
    }).join('');
  }catch(e){
    container.innerHTML='<div class="article-empty">Gli articoli non sono al momento disponibili.</div>';
  }
}
loadArticles();
