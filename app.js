async function loadPosts(){
  const container=document.getElementById('posts');
  try{
    const response=await fetch('posts.json',{cache:'no-store'});
    const posts=await response.json();
    container.innerHTML=posts.map(post=>`
      <article class="post-card">
        <div class="post-meta"><span>${post.category}</span><time>${post.date}</time></div>
        <h3>${post.title}</h3>
        <p>${post.text}</p>
        <a class="post-link" href="${post.url}">Apri aggiornamento →</a>
      </article>`).join('');
  }catch(e){
    container.innerHTML='<p>Gli aggiornamenti non sono al momento disponibili.</p>';
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
loadPosts();
