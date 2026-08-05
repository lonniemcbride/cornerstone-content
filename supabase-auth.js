/* Cornerstone Supabase Auth — publishable key only. Never place a service-role key in this app. */
const CS_SUPABASE_URL='https://aljolqjatsrfueupjeoo.supabase.co';
const CS_SUPABASE_KEY='sb_publishable_Au3ICQuLSb907IN8kXEQJQ_g8QpszUQ';
const CS_SESSION_KEY='cornerstone-supabase-session-v1';
const csBaseHeaders={'apikey':CS_SUPABASE_KEY,'Authorization':`Bearer ${CS_SUPABASE_KEY}`,'Content-Type':'application/json'};
const csRedirectUrl=()=>`${location.origin}${location.pathname}?confirmed=1`;
let csSession=JSON.parse(localStorage.getItem(CS_SESSION_KEY)||'null');

async function csRequest(path,options={}){
  const response=await fetch(`${CS_SUPABASE_URL}${path}`,{...options,headers:{...csBaseHeaders,...options.headers}});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload.msg||payload.message||payload.error_description||'Authentication request failed.');
  return payload;
}
function csSaveSession(session){csSession=session;localStorage.setItem(CS_SESSION_KEY,JSON.stringify(session))}
function csLocalUser(remoteUser){
  const email=remoteUser.email.toLowerCase(),name=remoteUser.user_metadata?.full_name||email.split('@')[0],role=remoteUser.user_metadata?.role||'Collaborator';
  let local=authStore.users.find(user=>user.email===email);
  if(!local){local={id:remoteUser.id,name,email,role,source:'supabase'};authStore.users.push(local)}else Object.assign(local,{id:remoteUser.id,name,email,role,source:'supabase'});
  localStorage.setItem(authStorageKey,JSON.stringify(authStore));return local;
}
function csApplySession(session){csSaveSession(session);const local=csLocalUser(session.user);setAuthSession(local);authMode='login';$('#authError').textContent=''}
function csShowConfirmation(email){
  $('#authEyebrow').textContent='CONFIRM YOUR EMAIL';$('#authTitle').textContent='Check your inbox';$('#authCopy').textContent=`We sent a secure confirmation link to ${email}. Open it to activate your account and access the desktop installation.`;$('#authNameWrap').hidden=true;$('#authEmail').parentElement?.classList?.add('confirmed-email');$('#authEmail').disabled=true;$('#authPassword').disabled=true;$('#authSubmit').hidden=true;$('#authSwitch').textContent='Use a different email address';$('#authError').textContent='The confirmation link may take a minute to arrive.';
}
async function csSubmitAuth(){
  const email=$('#authEmail').value.trim().toLowerCase(),password=$('#authPassword').value,name=$('#authName').value.trim();
  $('#authError').textContent='';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ $('#authError').textContent='Enter a valid email address.';return }
  $('#authSubmit').disabled=true;$('#authSubmit').textContent=authMode==='setup'?'Creating account…':'Signing in…';
  try{
    if(authMode==='setup'){
      if(!name||password.length<12)throw new Error('Enter your name and a password of at least 12 characters.');
      const result=await csRequest(`/auth/v1/signup?redirect_to=${encodeURIComponent(csRedirectUrl())}`,{method:'POST',body:JSON.stringify({email,password,data:{full_name:name.replace(/[<>]/g,''),role:'Owner'}})});
      if(result.access_token)csApplySession(result);else csShowConfirmation(email);
    }else{
      const result=await csRequest('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});csApplySession(result);showToast('Welcome back',`Signed in as ${result.user.user_metadata?.full_name||email}.`);
    }
  }catch(error){$('#authError').textContent=error.message}
  finally{$('#authSubmit').disabled=false;if(!$('#authSubmit').hidden)$('#authSubmit').textContent=authMode==='setup'?'Create account':'Sign in';$('#authPassword').value=''}
}
async function csRestoreSession(){
  if(!csSession?.refresh_token)return false;
  try{const refreshed=await csRequest('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:csSession.refresh_token})});csApplySession(refreshed);return true}catch{localStorage.removeItem(CS_SESSION_KEY);csSession=null;return false}
}
async function csLogout(){
  if(csSession?.access_token)await csRequest('/auth/v1/logout',{method:'POST',headers:{Authorization:`Bearer ${csSession.access_token}`}}).catch(()=>{});
  localStorage.removeItem(CS_SESSION_KEY);csSession=null;sessionStorage.removeItem(authSessionKey);vaultKey=null;vaultEntries={};sessionSecrets.clear();updateVaultUi();authMode='login';showAuth();showToast('Signed out','Your session and decrypted credentials were cleared.');
}
async function csHandleConfirmation(){
  const params=new URLSearchParams(location.hash.replace(/^#/,''));
  if(params.get('access_token')){const user=await csRequest('/auth/v1/user',{headers:{Authorization:`Bearer ${params.get('access_token')}`}});csApplySession({access_token:params.get('access_token'),refresh_token:params.get('refresh_token'),expires_in:Number(params.get('expires_in')||3600),token_type:'bearer',user});history.replaceState({},'',`${location.pathname}?confirmed=1`);$('#inviteInstallAction').hidden=false;showToast('Email confirmed','Your Cornerstone account is ready to install.')}
  else if(new URLSearchParams(location.search).get('confirmed')==='1'){$('#inviteInstallAction').hidden=false}
}
async function csUpdateAccount(){
  if(!csSession?.access_token)return;
  const name=$('#settingsName').value.trim().replace(/[<>]/g,''),email=$('#settingsEmail').value.trim().toLowerCase();
  try{const user=await csRequest('/auth/v1/user',{method:'PUT',headers:{Authorization:`Bearer ${csSession.access_token}`},body:JSON.stringify({email,data:{full_name:name,role:currentAuthUser()?.role||'Collaborator'}})});csSession.user=user;csApplySession(csSession);populateUserSettings();showToast('Account updated','Supabase saved your profile information.')}catch(error){showToast('Account not updated',error.message)}
}
async function csChangePassword(){
  const next=$('#newPassword').value,confirm=$('#confirmNewPassword').value;if(next.length<12||next!==confirm){showToast('Check your new password',next.length<12?'Use at least 12 characters.':'The new passwords do not match.');return}
  try{await csRequest('/auth/v1/user',{method:'PUT',headers:{Authorization:`Bearer ${csSession.access_token}`},body:JSON.stringify({password:next})});$('#currentPassword').value='';$('#newPassword').value='';$('#confirmNewPassword').value='';showToast('Password changed','Your Supabase password is active now.')}catch(error){showToast('Password not changed',error.message)}
}

$('#authSubmit').onclick=csSubmitAuth;
$('#authPassword').onkeydown=event=>{if(event.key==='Enter')csSubmitAuth()};
$('#authSwitch').onclick=()=>{if($('#authSubmit').hidden){$('#authSubmit').hidden=false;$('#authEmail').disabled=false;$('#authPassword').disabled=false}authMode=authMode==='setup'?'login':'setup';showAuth()};
$('#logoutBtn').onclick=csLogout;$('#saveAccountSettings').onclick=csUpdateAccount;$('#changePasswordBtn').onclick=csChangePassword;
csHandleConfirmation().then(()=>csSession?csRestoreSession():false).then(restored=>{if(!restored&&!csSession&&!new URLSearchParams(location.hash.replace(/^#/,'')).get('access_token')){authMode=authStore.users.some(user=>user.source==='supabase')?'login':'setup';showAuth()}});
