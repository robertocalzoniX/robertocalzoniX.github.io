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
    status.textContent=source==='x'?'Feed X':'Contenuti demo';
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
