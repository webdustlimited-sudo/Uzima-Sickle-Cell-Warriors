const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=document.querySelector('.links').classList.toggle('open');menu.setAttribute('aria-expanded',open)});const d=document.querySelector('dialog');document.querySelectorAll('[data-donate]').forEach(b=>b.addEventListener('click',()=>d.showModal()));document.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('5316922662358855');document.querySelector('#status').textContent='Donation identifier copied.'}catch{document.querySelector('#status').textContent='Please select and copy the identifier above.'}});if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))}const accountForm = document.querySelector('#account-form');
if (accountForm) {
 let mode = 'login', csrf = '';
 const authStatus = document.querySelector('#auth-status');
 const profileStatus = document.querySelector('#profile-status');
 function render(data) {
  csrf = data.csrf || '';
  const signedIn = !!data.user;
  document.querySelector('#auth-panel').hidden = signedIn;
  document.querySelector('#profile-panel').hidden = !signedIn;
  document.querySelectorAll('.signin-link').forEach(a => {a.textContent = signedIn ? 'My account' : 'Sign in';});
  if (signedIn) {
   document.querySelector('#profile-greeting').textContent = 'Welcome, ' + data.user.name + '.';
   document.querySelector('#profile-name').value = data.user.name;
   document.querySelector('#profile-email').value = data.user.email;
   accountForm.reset();
  }
 }
 async function request(path, body) {
  const response = await fetch(path, {method: body ? 'POST' : 'GET', credentials:'same-origin',headers: body ? {'Content-Type':'application/json','X-CSRF-Token':csrf} : {},body:body ? JSON.stringify(body) : undefined});
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to complete this request.');
  return result;
 }
 function changeMode(next) {
  mode = next;
  document.querySelector('#show-login').setAttribute('aria-pressed',mode==='login');
  document.querySelector('#show-register').setAttribute('aria-pressed',mode==='register');
  document.querySelector('#register-name').hidden = mode!=='register';
  document.querySelector('#account-name').required = mode==='register';
  document.querySelector('#account-password').autocomplete = mode==='register' ? 'new-password' : 'current-password';
  document.querySelector('#account-submit').textContent = mode==='register' ? 'Create account' : 'Sign in';
  authStatus.textContent = '';
 }
 document.querySelector('#show-login').addEventListener('click',()=>changeMode('login'));
 document.querySelector('#show-register').addEventListener('click',()=>changeMode('register'));
 accountForm.addEventListener('submit',async e=>{
  e.preventDefault();const button=document.querySelector('#account-submit');button.disabled=true;authStatus.textContent='Please wait…';
  try {render(await request('/api/'+mode,Object.fromEntries(new FormData(accountForm))));authStatus.textContent='';} catch(error) {authStatus.textContent=error instanceof SyntaxError ? 'Accounts are available in the updated preview on port 8766.' : error.message;} finally {button.disabled=false;}
 });
 document.querySelector('#profile-form').addEventListener('submit',async e=>{
  e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;
  try {render(await request('/api/profile',{name:document.querySelector('#profile-name').value}));profileStatus.textContent='Profile saved.';} catch(error) {profileStatus.textContent=error.message;} finally {button.disabled=false;}
 });
 document.querySelector('#signout').addEventListener('click',async()=>{
  try {await request('/api/logout',{});render({user:null});authStatus.textContent='You have signed out.';profileStatus.textContent='';} catch(error) {profileStatus.textContent=error.message;}
 });
 request('/api/me').then(render).catch(()=>{authStatus.textContent='Please open the updated account preview on port 8766 to sign in.';});
}
const shareButton = document.querySelector('#share-campaign');
if(shareButton) shareButton.addEventListener('click',async()=>{
 const status=document.querySelector('#share-status');
 try {if(navigator.share){await navigator.share({title:'Help stop Sickle Cell Anaemia',url:location.href});}else{await navigator.clipboard.writeText(location.href);status.textContent='Campaign link copied. This local preview link works only on this computer.';}}
 catch(error){if(error.name!=='AbortError')status.textContent='Copy the page address to share this cause.';}
});

// Each full-page navigation starts a fresh contribution reminder timer.
if (d) {
 setInterval(() => {
  const active = document.activeElement;
  const typing = active && (active.matches('input, textarea, select') || active.isContentEditable);
  if (!document.hidden && !d.open && !typing) d.showModal();
 }, 120000);
}
