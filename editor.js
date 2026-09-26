const $=id=>document.getElementById(id);
const type=$('type'), text=$('text'), title=$('title'), url=$('url'), date=$('date');
const sourceAuthor=$('sourceAuthor'), quoteAuthor=$('quoteAuthor'), note=$('note');
const articleCategory=$('articleCategory'), articleSummary=$('articleSummary');
const output=$('jsonOutput'), preview=$('preview'), openGithub=$('openGithub'), status=$('copyStatus');

date.value=new Date().toISOString().slice(0,10);

const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateIt=s=>{
  if(!s) return '';
  const d=new Date(s+'T12:00:00');
  return new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric'}).format(d);
};

function build(){
  const kind=type.value;
  document.querySelectorAll('.post-field').forEach(el=>el.hidden=kind==='quote');
  document.querySelectorAll('.article-only').forEach(el=>el.hidden=kind!=='article');
  document.querySelectorAll('.repost-only').forEach(el=>el.hidden=kind!=='repost');
  document.querySelectorAll('.quote-only').forEach(el=>el.hidden=kind!=='quote');

  let obj;
  if(kind==='quote'){
    obj={
      text:text.value.trim(),
      author:quoteAuthor.value.trim()||'Anonimo',
      note:note.value.trim()
    };
    openGithub.href='https://github.com/robertocalzoniX/robertocalzoniX.github.io/edit/main/quotes.json';
    preview.innerHTML='<blockquote class="quote-card"><p class="quote-text">'+esc(obj.text||'La tua citazione apparirà qui.')+'</p><div class="quote-footer"><span class="quote-author">'+esc(obj.author)+'</span>'+(obj.note?'<span class="quote-note">'+esc(obj.note)+'</span>':'')+'</div></blockquote>';
  } else if(kind==='article'){
    obj={
      id:'article-'+Date.now(),
      date:dateIt(date.value),
      category:articleCategory.value.trim()||'Articolo',
      title:title.value.trim()||'Nuovo articolo',
      summary:articleSummary.value.trim(),
      body:text.value.trim()
    };
    openGithub.href='https://github.com/robertocalzoniX/robertocalzoniX.github.io/edit/main/articles.json';
    preview.innerHTML='<article class="article-card"><div class="article-meta"><span class="article-category">'+esc(obj.category)+'</span><time>'+esc(obj.date)+'</time></div><h3>'+esc(obj.title)+'</h3>'+(obj.summary?'<p class="article-summary">'+esc(obj.summary)+'</p>':'')+'<details open><summary>Leggi articolo</summary><div class="article-body">'+esc(obj.body||'Il testo dell\'articolo apparirà qui.').replace(/\n/g,'<br>')+'</div></details></article>';
  } else {
    const isRepost=kind==='repost';
    obj={
      id:'manual-'+Date.now(),
      date:dateIt(date.value),
      category:isRepost?'Repost':'X',
      title:isRepost?(sourceAuthor.value.trim()?('Repost da '+sourceAuthor.value.trim()):'Repost su X'):(title.value.trim()||'Post su X'),
      text:text.value.trim(),
      url:url.value.trim()||'#'
    };
    openGithub.href='https://github.com/robertocalzoniX/robertocalzoniX.github.io/edit/main/posts.json';
    preview.innerHTML='<article class="post-card editor-post-preview"><div class="post-accent"></div><div class="post-meta"><span class="post-category">'+esc(obj.category)+'</span><time>'+esc(obj.date)+'</time></div><h3>'+esc(obj.title)+'</h3><p>'+esc(obj.text||'Il testo apparirà qui.')+'</p><span class="post-link">Vedi post originale ↗</span></article>';
  }
  output.textContent=JSON.stringify(obj,null,2);
  return obj;
}

[type,text,title,url,date,sourceAuthor,quoteAuthor,note,articleCategory,articleSummary].forEach(el=>el.addEventListener('input',build));
type.addEventListener('change',build);

$('copyJson').addEventListener('click',async()=>{
  build();
  try{
    await navigator.clipboard.writeText(output.textContent);
    status.textContent='JSON copiato negli appunti.';
  }catch(e){
    status.textContent='Seleziona e copia manualmente il JSON qui a fianco.';
  }
});
build();
