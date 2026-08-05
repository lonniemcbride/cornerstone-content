const defaultPosts=[
 {id:1,title:'A calmer way to start your workday',caption:'Small rituals create room for better work. Here are three that changed our mornings.',channel:'Instagram',date:'2026-08-05',time:'09:30',owner:'Alex Lin',status:'Scheduled',theme:'Wellness'},
 {id:2,title:'What we learned building Moon Office',caption:'Five lessons from designing tools for modern creative teams.',channel:'LinkedIn',date:'2026-08-05',time:'13:00',owner:'Maya Ortiz',status:'Scheduled',theme:'Behind the scenes'},
 {id:3,title:'Desk reset in 20 seconds',caption:'Your sign to clear the clutter and make space for the next idea.',channel:'TikTok',date:'2026-08-06',time:'11:00',owner:'Jordan Chen',status:'Scheduled',theme:'Tips'},
 {id:4,title:'The field guide is here',caption:'Our new guide to focused, sustainable creative work is ready.',channel:'Instagram',date:'2026-08-07',time:'10:15',owner:'Alex Lin',status:'Scheduled',theme:'Product'},
 {id:5,title:'Friday thought: protect the pause',caption:'Not every empty space needs to be filled.',channel:'X',date:'2026-08-07',time:'15:30',owner:'Maya Ortiz',status:'Scheduled',theme:'Thought leadership'},
 {id:6,title:'Meet the makers: Jordan',caption:'The people behind the pixels — meet our product storyteller.',channel:'LinkedIn',date:'2026-08-09',time:'12:00',owner:'Alex Lin',status:'Draft',theme:'Team'}
];
const ideas=[
 {tag:'INSPIRED BY “WORKDAY”',title:'The 5-minute shutdown ritual',desc:'A carousel that helps your audience end the day with clarity and start tomorrow with less friction.'},
 {tag:'EXTEND “MEET THE MAKERS”',title:'What’s on our team’s desks?',desc:'A playful video series where each teammate shares one object that improves their creative process.'},
 {tag:'FOLLOW-UP OPPORTUNITY',title:'The field guide, in practice',desc:'Turn each chapter of your guide into a week-long series of small, actionable experiments.'},
 {tag:'AUDIENCE FAVORITE',title:'Unpopular productivity opinions',desc:'Ask the team for their spiciest takes, then invite the audience into the conversation.'},
 {tag:'REPURPOSE',title:'Three lessons, one minute',desc:'Distill your building journey into a fast-paced short video with a strong save-worthy hook.'},
 {tag:'NEW ANGLE',title:'A workspace that works for you',desc:'Show three distinct desk setups for different moods: focus, collaborate, and recharge.'}
];
const defaultAssets=[{name:'morning-ritual.jpg',type:'JPG · 2.4 MB',icon:'☀'},{name:'field-guide-cover.png',type:'PNG · 1.8 MB',icon:'▧'},{name:'desk-reset.mp4',type:'MP4 · 18.2 MB',icon:'▶'},{name:'content-plan.csv',type:'CSV · 42 KB',icon:'▦'}];
let posts=JSON.parse(localStorage.getItem('cornerstone-posts')||'null')||defaultPosts;
let assets=JSON.parse(localStorage.getItem('cornerstone-assets')||'null')||defaultAssets;
let editingId=null; let selectedChannel='Instagram';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const formatTime=t=>new Date(`2000-01-01T${t}`).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
const channelClass=c=>({LinkedIn:'li',TikTok:'tt',X:'x'}[c]||'ig');
const channelIcon=c=>({Instagram:'◎',LinkedIn:'in',TikTok:'♪',X:'𝕏'}[c]||'•');
function save(){localStorage.setItem('cornerstone-posts',JSON.stringify(posts));localStorage.setItem('cornerstone-assets',JSON.stringify(assets));}
function renderCalendar(){const days=['MON','TUE','WED','THU','FRI','SAT','SUN'];const nums=[3,4,5,6,7,8,9];$('#calendarGrid').innerHTML=days.map((day,i)=>{const date=`2026-08-${String(nums[i]).padStart(2,'0')}`;const cards=posts.filter(p=>p.date===date&&p.status!=='Draft').map(p=>`<article class="post-card ${channelClass(p.channel)}" data-id="${p.id}"><div class="platform"><span class="platform-dot">${channelIcon(p.channel)}</span>${p.channel}</div><h3>${p.title}</h3><time>${formatTime(p.time)}</time></article>`).join('');return `<div class="day ${nums[i]===5?'today':''}"><div class="day-head"><span>${day}</span><b>${nums[i]}</b></div>${cards}<button class="add-day" data-date="${date}">＋</button></div>`}).join('');$$('.post-card').forEach(el=>el.onclick=()=>openComposer(posts.find(p=>p.id==el.dataset.id)));$$('.add-day').forEach(el=>el.onclick=()=>openComposer(null,el.dataset.date));}
function renderUpNext(){const upcoming=posts.filter(p=>p.status==='Scheduled').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,3);$('#upNextGrid').innerHTML=upcoming.map((p,i)=>`<article class="next-card" data-id="${p.id}"><div class="thumb ${i===1?'orange':i===2?'purple':''}">${channelIcon(p.channel)}</div><div><small>${p.channel} · ${new Date(p.date+'T12:00').toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'})} at ${formatTime(p.time)}</small><h3>${p.title}</h3><small>Owner: ${p.owner}</small></div></article>`).join('');$$('.next-card').forEach(el=>el.onclick=()=>openComposer(posts.find(p=>p.id==el.dataset.id)));}
function renderContent(filter=''){const shown=posts.filter(p=>(p.title+p.caption+p.channel).toLowerCase().includes(filter.toLowerCase()));$('#contentTable').innerHTML=`<div class="table-row header"><span>Content</span><span>Channel</span><span>Publish date</span><span>Status</span><span></span></div>`+shown.map(p=>`<div class="table-row"><div class="content-name"><div class="mini-thumb"></div><strong>${p.title}</strong></div><span>${channelIcon(p.channel)} ${p.channel}</span><span>${new Date(p.date+'T12:00').toLocaleDateString([], {month:'short',day:'numeric'})} · ${formatTime(p.time)}</span><span class="status ${p.status.toLowerCase()}">${p.status}</span><button class="row-menu" data-id="${p.id}">•••</button></div>`).join('');$$('.row-menu').forEach(el=>el.onclick=()=>openComposer(posts.find(p=>p.id==el.dataset.id)));$('#contentCount').textContent=posts.length;}
function renderIdeas(){const saved=JSON.parse(localStorage.getItem('keystone-saved-ideas')||'[]');$('#ideasGrid').innerHTML=ideas.map((x,i)=>`<article class="idea-card"><span class="tag">${x.tag}</span><h3>${x.title}</h3><p>${x.desc}</p><button class="secondary idea-use" data-index="${i}">${saved.includes(i)?'✓ Saved to ideas':'＋ Add to calendar'}</button></article>`).join('');$$('.idea-use').forEach(b=>b.onclick=()=>{const i=+b.dataset.index;openComposer({title:ideas[i].title,caption:ideas[i].desc,channel:'Instagram',date:'2026-08-08',time:'10:00',owner:'Alex Lin'},'2026-08-08')});}
function renderAssets(){const icons={image:'▧',video:'▶','text/csv':'▦'};$('#assetGrid').innerHTML=assets.map(a=>`<article class="asset-card"><div class="asset-preview">${a.icon||icons[a.rawType]||'◇'}</div><div class="asset-meta"><strong>${a.name}</strong><small>${a.type}</small></div></article>`).join('');$('#assetCount').textContent=`${assets.length} file${assets.length===1?'':'s'}`;}
function refresh(){renderCalendar();renderUpNext();renderContent();renderIdeas();renderAssets();}
function switchView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#${name}View`).classList.add('active');$$('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===name));const meta={calendar:['Content calendar','Plan, polish, and publish — all in one place.'],content:['Content','Manage every post across your connected channels.'],ideas:['Ideas','Fresh angles, grounded in what you already create.'],assets:['Assets','Upload, organize, and reuse your creative material.']}[name];$('#pageTitle').textContent=meta[0];$('#pageSubtitle').textContent=meta[1];}
function openComposer(post,date){editingId=post?.id||null;$('#composerTitle').textContent=editingId?'Edit content':'Create content';$('#postTitle').value=post?.title||'';$('#postCaption').value=post?.caption||'';$('#postDate').value=post?.date||date||'2026-08-05';$('#postTime').value=post?.time||'09:00';$('#postOwner').value=post?.owner||'Alex Lin';selectedChannel=post?.channel||'Instagram';$$('#channelPicker button').forEach(b=>b.classList.toggle('selected',b.dataset.channel===selectedChannel));$('#charCount').textContent=`${$('#postCaption').value.length} / 2,200`;$('#scheduleBtn').textContent=editingId?'Save changes':'Schedule content';$('#composer').classList.add('open');$('#scrim').classList.add('open');}
function closeComposer(){ $('#composer').classList.remove('open');$('#scrim').classList.remove('open'); }
function commit(status){const title=$('#postTitle').value.trim();if(!title){$('#postTitle').focus();showToast('Add a title','Give this post an internal title first.');return}const data={title,caption:$('#postCaption').value.trim(),channel:selectedChannel,date:$('#postDate').value,time:$('#postTime').value,owner:$('#postOwner').value,status,theme:'Custom'};if(editingId){posts=posts.map(p=>p.id===editingId?{...p,...data}:p)}else posts.push({id:Date.now(),...data});save();refresh();closeComposer();showToast(status==='Draft'?'Draft saved':editingId?'Changes saved':'Content scheduled',status==='Draft'?'Come back whenever you’re ready.':`We’ll remind ${data.owner} ${$('#reminder').value}.`)}
function showToast(title,text){$('#toastTitle').textContent=title;$('#toastText').textContent=text;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2800)}
function ingest(files){[...files].forEach(f=>assets.unshift({name:f.name,type:`${(f.type.split('/')[1]||'FILE').toUpperCase()} · ${(f.size/1024/1024).toFixed(1)} MB`,rawType:f.type}));save();renderAssets();showToast(`${files.length} asset${files.length===1?'':'s'} uploaded`,'Ready to use in your content.');}
$$('.nav-item[data-view]').forEach(n=>n.onclick=()=>switchView(n.dataset.view));$('#newPostBtn').onclick=()=>openComposer();$('#closeComposer').onclick=closeComposer;$('#scrim').onclick=closeComposer;$('#scheduleBtn').onclick=()=>commit('Scheduled');$('#saveDraftBtn').onclick=()=>commit('Draft');$('#postCaption').oninput=e=>$('#charCount').textContent=`${e.target.value.length} / 2,200`;$$('#channelPicker button').forEach(b=>b.onclick=()=>{selectedChannel=b.dataset.channel;$$('#channelPicker button').forEach(x=>x.classList.toggle('selected',x===b))});
$('#improveBtn').onclick=()=>{const t=$('#postCaption');if(!t.value.trim())t.value='A fresh perspective, made for the way you work. Save this for your next creative reset. ✦';else t.value=t.value.replace(/\.$/,'')+' — here’s how to make it work for you. ✦';t.dispatchEvent(new Event('input'));showToast('Caption refreshed','A clearer hook and call to action were added.');};
$('#viewAllBtn').onclick=()=>switchView('content');$('#contentSearch').oninput=e=>renderContent(e.target.value);$('#generateIdeasBtn').onclick=()=>{renderIdeas();showToast('6 ideas generated','Based on the themes in your content calendar.');};$('#browseBtn').onclick=()=>$('#fileInput').click();$('#fileInput').onchange=e=>ingest(e.target.files);['dragenter','dragover'].forEach(ev=>$('#assetDrop').addEventListener(ev,e=>{e.preventDefault();$('#assetDrop').classList.add('drag')}));['dragleave','drop'].forEach(ev=>$('#assetDrop').addEventListener(ev,e=>{e.preventDefault();$('#assetDrop').classList.remove('drag');if(ev==='drop')ingest(e.dataTransfer.files)}));
$('#notifyBtn').onclick=e=>{e.stopPropagation();$('#notificationPanel').classList.toggle('open')};document.onclick=e=>{if(!e.target.closest('#notificationPanel')&&!e.target.closest('#notifyBtn'))$('#notificationPanel').classList.remove('open')};$('#notificationList').innerHTML=`<div class="notice"><span class="notice-dot"></span><div><p><strong>Instagram post in 45 minutes</strong><br>A calmer way to start your workday</p><small>Today at 9:30 AM · Alex Lin</small></div></div><div class="notice"><span class="notice-dot"></span><div><p><strong>Approval requested</strong><br>Maya added notes to “Field guide”</p><small>18 minutes ago</small></div></div><div class="notice"><span class="notice-dot"></span><div><p><strong>Post published</strong><br>Your LinkedIn post is now live</p><small>Yesterday at 1:00 PM</small></div></div>`;$('#markRead').onclick=()=>{$$('.notice-dot').forEach(x=>x.style.background='#cbd2ce');$('.notification-dot').style.display='none'};
$('#prevWeek').onclick=()=>{$('#weekLabel').textContent='July 27 – August 2, 2026';showToast('Previous week','Calendar moved back one week.')};$('#nextWeek').onclick=()=>{$('#weekLabel').textContent='August 10 – 16, 2026';showToast('Next week','Calendar moved forward one week.')};$('#todayBtn').onclick=()=>{$('#weekLabel').textContent='August 3 – 9, 2026'};refresh();

// Integrations: non-secret metadata persists; credentials live only in memory for this session.
let integrations=JSON.parse(localStorage.getItem('cornerstone-integrations')||'[]');
const sessionSecrets=new Map();
const originalSwitchView=switchView;
switchView=function(name){
  if(name!=='integrations') return originalSwitchView(name);
  $$('.view').forEach(v=>v.classList.remove('active'));
  $('#integrationsView').classList.add('active');
  $$('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===name));
  $('#pageTitle').textContent='Integrations';
  $('#pageSubtitle').textContent='Connect your APIs, models, and MCP tools.';
  renderIntegrations();
};
function persistIntegrations(){localStorage.setItem('cornerstone-integrations',JSON.stringify(integrations));}
function safeHost(url){try{return new URL(url).host}catch{return url||'Default endpoint'}}
function renderIntegrations(){
  const apis=integrations.filter(x=>x.type==='api'), mcps=integrations.filter(x=>x.type==='mcp');
  $('#apiGrid').innerHTML=apis.length?apis.map(x=>`<article class="integration-card"><div class="integration-card-top"><div class="provider-icon">${x.name.slice(0,2).toUpperCase()}</div><div><h3>${x.name}</h3><small>${x.enabled?'Connected':'Disabled'}</small></div><span class="connection-status ${x.enabled?'':'off'}"></span></div><div class="integration-detail"><span>${safeHost(x.url)}</span><span>${sessionSecrets.has(x.id)?'Key loaded':'Key needed'}</span></div><div class="integration-actions"><button data-toggle="${x.id}">${x.enabled?'Disable':'Enable'}</button><button data-rekey="${x.id}">Update key</button><button class="danger" data-remove="${x.id}">Remove</button></div></article>`).join(''):`<div class="empty-integration"><strong>No API providers yet</strong>Add your model or publishing API to get started.</div>`;
  $('#mcpList').innerHTML=mcps.length?mcps.map(x=>`<article class="mcp-row"><div class="provider-icon">M</div><div><h3>${x.name}</h3><p>${x.transport.toUpperCase()} · ${safeHost(x.url)}</p></div><span class="tool-count">Tools enabled</span><button data-remove="${x.id}">•••</button></article>`).join(''):`<div class="empty-integration"><strong>No MCP servers connected</strong>Connect a remote MCP endpoint to make its tools available here.</div>`;
  $('#integrationCount').textContent=integrations.filter(x=>x.enabled).length;
}
function openIntegrationModal(type='api',existingId=null){
  $('#integrationType').value=type;$('#integrationType').disabled=!!existingId;
  $('#integrationName').value='';$('#integrationKey').value='';$('#integrationBaseUrl').value='';$('#mcpUrl').value='';$('#mcpToken').value='';
  $('#integrationModal').dataset.editing=existingId||'';$('#integrationModalTitle').textContent=existingId?'Update connection':type==='mcp'?'Connect MCP server':'Add integration';
  updateIntegrationFields();$('#integrationModal').classList.add('open');$('#scrim').classList.add('open');
}
function closeIntegrationModal(){$('#integrationModal').classList.remove('open');$('#integrationKey').value='';$('#mcpToken').value='';$('#scrim').classList.remove('open')}
function updateIntegrationFields(){const mcp=$('#integrationType').value==='mcp';$('#apiFields').hidden=mcp;$('#mcpFields').hidden=!mcp}
function saveIntegration(){
  const type=$('#integrationType').value,name=$('#integrationName').value.trim(),editing=$('#integrationModal').dataset.editing;
  if(!name){$('#integrationName').focus();return}
  const url=type==='mcp'?$('#mcpUrl').value.trim():$('#integrationBaseUrl').value.trim();
  if(type==='mcp'&&!url){$('#mcpUrl').focus();return}
  const secret=type==='mcp'?$('#mcpToken').value:$('#integrationKey').value;
  const id=editing||String(Date.now());
  const item={id,type,name,url,transport:type==='mcp'?$('#mcpTransport').value:'rest',enabled:$('#enableConnection').checked,allowTools:$('#allowTools').checked};
  integrations=editing?integrations.map(x=>x.id===editing?item:x):[...integrations,item];
  if(secret)sessionSecrets.set(id,secret);
  persistIntegrations();renderIntegrations();closeIntegrationModal();showToast(editing?'Connection updated':'Integration added',`${name} is ${item.enabled?'enabled':'saved'}.`);
}
$('#addIntegrationBtn').onclick=()=>openIntegrationModal('api');$('#addMcpBtn').onclick=()=>openIntegrationModal('mcp');
$('#closeIntegrationModal').onclick=closeIntegrationModal;$('#cancelIntegration').onclick=closeIntegrationModal;$('#integrationType').onchange=updateIntegrationFields;$('#saveIntegration').onclick=saveIntegration;
$('#revealKey').onclick=()=>{const input=$('#integrationKey');input.type=input.type==='password'?'text':'password';$('#revealKey').textContent=input.type==='password'?'Show':'Hide'};
$('#scrim').addEventListener('click',closeIntegrationModal);
$('#integrationsView').addEventListener('click',e=>{const remove=e.target.dataset.remove,toggle=e.target.dataset.toggle,rekey=e.target.dataset.rekey;if(remove){integrations=integrations.filter(x=>x.id!==remove);sessionSecrets.delete(remove);persistIntegrations();renderIntegrations();showToast('Integration removed','The connection metadata was deleted.')}if(toggle){integrations=integrations.map(x=>x.id===toggle?{...x,enabled:!x.enabled}:x);persistIntegrations();renderIntegrations()}if(rekey){const x=integrations.find(i=>i.id===rekey);openIntegrationModal(x.type,x.id);$('#integrationName').value=x.name;$('#integrationBaseUrl').value=x.url||'';}});
integrations=integrations.map(x=>({...x,id:String(x.id).replace(/[^a-zA-Z0-9_-]/g,''),name:String(x.name||'Integration').replace(/[<>]/g,''),url:String(x.url||'').replace(/[<>"']/g,''),transport:['http','sse','rest'].includes(x.transport)?x.transport:'rest'}));
renderIntegrations();

// Authenticated encrypted vault (Web Crypto API).
let vaultKey=null,vaultEntries={};
const vaultStorageKey='cornerstone-encrypted-vault-v1';
const vaultContext=new TextEncoder().encode('cornerstone-credential-vault-v1');
const bytesToB64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const b64ToBytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
async function deriveVaultKey(password,salt){
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:600000},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function writeEncryptedVault(){
  const existing=JSON.parse(localStorage.getItem(vaultStorageKey)||'null');
  const salt=existing?b64ToBytes(existing.salt):crypto.getRandomValues(new Uint8Array(32));
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const plain=new TextEncoder().encode(JSON.stringify({check:'cornerstone-v1',secrets:vaultEntries}));
  const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:vaultContext,tagLength:128},vaultKey,plain);
  localStorage.setItem(vaultStorageKey,JSON.stringify({version:1,kdf:'PBKDF2-SHA-256',iterations:600000,cipher:'AES-256-GCM',salt:bytesToB64(salt),iv:bytesToB64(iv),data:bytesToB64(cipher)}));
}
async function unlockEncryptedVault(password){
  const stored=JSON.parse(localStorage.getItem(vaultStorageKey)||'null');
  if(!stored)return false;
  const key=await deriveVaultKey(password,b64ToBytes(stored.salt));
  try{
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64ToBytes(stored.iv),additionalData:vaultContext,tagLength:128},key,b64ToBytes(stored.data));
    const payload=JSON.parse(new TextDecoder().decode(plain));
    if(payload.check!=='cornerstone-v1')return false;
    vaultKey=key;vaultEntries=payload.secrets||{};sessionSecrets.clear();Object.entries(vaultEntries).forEach(([id,value])=>sessionSecrets.set(id,value));return true;
  }catch{return false}
}
function vaultExists(){return !!localStorage.getItem(vaultStorageKey)}
function updateVaultUi(){const unlocked=!!vaultKey;$('#vaultButton').textContent=unlocked?'✓ Vault unlocked':vaultExists()?'Unlock vault':'Set up vault';$('#vaultButton').classList.toggle('unlocked',unlocked);renderIntegrations()}
function openVaultModal(){
  const exists=vaultExists();$('#vaultModalTitle').textContent=exists?'Unlock your vault':'Create your vault';$('#vaultCopy').textContent=exists?'Enter your master password to decrypt credentials for this session.':'Choose a strong master password. It never leaves this device and cannot be recovered.';$('#vaultConfirmWrap').hidden=exists;$('#submitVault').textContent=exists?'Unlock vault':'Create encrypted vault';$('#vaultPassword').value='';$('#vaultConfirm').value='';$('#passwordMeter').style.width='0';$('#vaultModal').classList.add('open');$('#scrim').classList.add('open');setTimeout(()=>$('#vaultPassword').focus(),50)
}
function closeVaultModal(){$('#vaultPassword').value='';$('#vaultConfirm').value='';$('#vaultModal').classList.remove('open');if(!$('#integrationModal').classList.contains('open'))$('#scrim').classList.remove('open')}
async function submitVault(){
  const password=$('#vaultPassword').value;
  if(vaultExists()){
    $('#submitVault').disabled=true;$('#submitVault').textContent='Decrypting…';
    const ok=await unlockEncryptedVault(password);$('#submitVault').disabled=false;
    if(!ok){$('#submitVault').textContent='Unlock vault';showToast('Vault remains locked','The master password was not accepted.');return}
    closeVaultModal();updateVaultUi();showToast('Vault unlocked','Credentials are available for this session.');return;
  }
  if(password.length<12||password!==$('#vaultConfirm').value){showToast('Check your password',password.length<12?'Use at least 12 characters.':'The passwords do not match.');return}
  const salt=crypto.getRandomValues(new Uint8Array(32));vaultKey=await deriveVaultKey(password,salt);
  const iv=crypto.getRandomValues(new Uint8Array(12)),plain=new TextEncoder().encode(JSON.stringify({check:'cornerstone-v1',secrets:{}}));
  const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:vaultContext,tagLength:128},vaultKey,plain);
  localStorage.setItem(vaultStorageKey,JSON.stringify({version:1,kdf:'PBKDF2-SHA-256',iterations:600000,cipher:'AES-256-GCM',salt:bytesToB64(salt),iv:bytesToB64(iv),data:bytesToB64(cipher)}));vaultEntries={};closeVaultModal();updateVaultUi();showToast('Encrypted vault created','API and MCP credentials can now be stored securely.');
}
async function secureSaveIntegration(){
  const type=$('#integrationType').value,name=$('#integrationName').value.trim(),editing=$('#integrationModal').dataset.editing;
  if(!name){$('#integrationName').focus();return}
  const url=type==='mcp'?$('#mcpUrl').value.trim():$('#integrationBaseUrl').value.trim();if(type==='mcp'&&!url){$('#mcpUrl').focus();return}
  const secret=type==='mcp'?$('#mcpToken').value:$('#integrationKey').value;if(secret&&!vaultKey){openVaultModal();showToast('Unlock the vault first','Credentials must be encrypted before they are saved.');return}
  const id=editing||String(Date.now()),item={id,type,name,url,transport:type==='mcp'?$('#mcpTransport').value:'rest',enabled:$('#enableConnection').checked,allowTools:$('#allowTools').checked};
  integrations=editing?integrations.map(x=>x.id===editing?item:x):[...integrations,item];
  if(secret){vaultEntries[id]=secret;sessionSecrets.set(id,secret);await writeEncryptedVault()}
  persistIntegrations();renderIntegrations();closeIntegrationModal();showToast(editing?'Connection updated':'Integration added',`${name} is ${item.enabled?'enabled':'saved'} with encrypted credentials.`)
}
$('#saveIntegration').onclick=secureSaveIntegration;$('#vaultButton').onclick=()=>{if(vaultKey){vaultKey=null;vaultEntries={};sessionSecrets.clear();updateVaultUi();showToast('Vault locked','Decrypted credentials were cleared from memory.')}else openVaultModal()};
$('#closeVaultModal').onclick=closeVaultModal;$('#cancelVault').onclick=closeVaultModal;$('#submitVault').onclick=submitVault;
$('#vaultPassword').oninput=e=>{const value=e.target.value,score=[value.length>=12,/[a-z]/.test(value)&&/[A-Z]/.test(value),/\d/.test(value),/[^\w]/.test(value)].filter(Boolean).length;$('#passwordMeter').style.width=`${score*25}%`;$('#passwordMeter').style.background=['#d15c5c','#d15c5c','#d49a37','#4d9e72','#24724a'][score]};
$('#scrim').addEventListener('click',closeVaultModal);updateVaultUi();
$('#integrationsView').addEventListener('click',async e=>{const id=e.target.dataset.remove;if(id&&vaultKey&&vaultEntries[id]){delete vaultEntries[id];await writeEncryptedVault()}},true);
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
renderIntegrations=function(){
  const apis=integrations.filter(x=>x.type==='api'),mcps=integrations.filter(x=>x.type==='mcp');
  $('#apiGrid').innerHTML=apis.length?apis.map(x=>`<article class="integration-card"><div class="integration-card-top"><div class="provider-icon">${escapeHtml(x.name.slice(0,2).toUpperCase())}</div><div><h3>${escapeHtml(x.name)}</h3><small>${x.enabled?'Connected':'Disabled'}</small></div><span class="connection-status ${x.enabled?'':'off'}"></span></div><div class="integration-detail"><span>${escapeHtml(safeHost(x.url))}</span><span>${sessionSecrets.has(x.id)?'Key loaded':'Key needed'}</span></div><div class="integration-actions"><button data-toggle="${escapeHtml(x.id)}">${x.enabled?'Disable':'Enable'}</button><button data-rekey="${escapeHtml(x.id)}">Update key</button><button class="danger" data-remove="${escapeHtml(x.id)}">Remove</button></div></article>`).join(''):`<div class="empty-integration"><strong>No API providers yet</strong>Add your model or publishing API to get started.</div>`;
  $('#mcpList').innerHTML=mcps.length?mcps.map(x=>`<article class="mcp-row"><div class="provider-icon">M</div><div><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.transport.toUpperCase())} · ${escapeHtml(safeHost(x.url))}</p></div><span class="tool-count">Tools enabled</span><button data-remove="${escapeHtml(x.id)}">•••</button></article>`).join(''):`<div class="empty-integration"><strong>No MCP servers connected</strong>Connect a remote MCP endpoint to make its tools available here.</div>`;
  $('#integrationCount').textContent=integrations.filter(x=>x.enabled).length;
};
updateVaultUi();

// Workspaces and collaborators.
const defaultWorkspaces=[{id:'mcbride',name:'McBride',purpose:'Consulting content and campaigns',active:true,members:[{id:'alex',name:'Alex Lin',email:'alex@mcbrideconsulting.net',role:'Owner',status:'Active'},{id:'maya',name:'Maya Ortiz',email:'maya@mcbrideconsulting.net',role:'Editor',status:'Active'},{id:'jordan',name:'Jordan Chen',email:'jordan@mcbrideconsulting.net',role:'Publisher',status:'Active'}]}];
let workspaces=JSON.parse(localStorage.getItem('cornerstone-workspaces')||'null')||defaultWorkspaces;
let selectedWorkspaceId=workspaces.find(x=>x.active)?.id||workspaces[0].id;
const integrationsSwitchView=switchView;
switchView=function(name){
  if(name!=='workspaces')return integrationsSwitchView(name);
  $$('.view').forEach(v=>v.classList.remove('active'));$('#workspacesView').classList.add('active');$$('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===name));$('#pageTitle').textContent='Workspaces';$('#pageSubtitle').textContent='Organize teams, roles, and content access.';renderWorkspaces();
};
function saveWorkspaces(){localStorage.setItem('cornerstone-workspaces',JSON.stringify(workspaces))}
function initials(name){return String(name).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()}
function renderWorkspaces(){
  $('#workspaceTotal').textContent=`${workspaces.length} workspace${workspaces.length===1?'':'s'}`;
  $('#workspaceList').innerHTML=workspaces.map(w=>`<button class="workspace-list-item ${w.id===selectedWorkspaceId?'active':''}" data-workspace="${escapeHtml(w.id)}"><span class="workspace-logo">${escapeHtml(initials(w.name))}</span><span><strong>${escapeHtml(w.name)}</strong><small>${w.members.length} member${w.members.length===1?'':'s'}</small></span>${w.active?'<i>●</i>':''}</button>`).join('');
  const w=workspaces.find(x=>x.id===selectedWorkspaceId)||workspaces[0];if(!w)return;
  const active=w.members.filter(m=>m.status==='Active'),pending=w.members.filter(m=>m.status==='Pending');
  $('#workspaceDetail').innerHTML=`<div class="workspace-detail-head"><div class="workspace-identity"><span class="workspace-logo">${escapeHtml(initials(w.name))}</span><div><h2>${escapeHtml(w.name)}</h2><p>${escapeHtml(w.purpose||'Cornerstone workspace')}</p></div></div><button class="primary" data-invite>＋ Invite people</button></div><div class="member-section"><div class="member-section-head"><strong>Members</strong><span>${active.length} active</span></div>${active.map(m=>memberRow(m,false)).join('')}</div>${pending.length?`<div class="member-section"><div class="member-section-head"><strong>Pending invitations</strong><span>${pending.length} awaiting response</span></div>${pending.map(m=>memberRow(m,true)).join('')}</div>`:''}<div class="workspace-settings"><button class="secondary" data-switch-workspace="${escapeHtml(w.id)}">${w.active?'Current workspace':'Switch to workspace'}</button></div>`;
}
function memberRow(m,pending){return `<div class="member-row"><div class="member-person"><span class="member-avatar">${escapeHtml(initials(m.name||m.email))}</span><div><strong>${escapeHtml(m.name||m.email.split('@')[0])}</strong><small>${escapeHtml(m.email)}</small></div></div><span class="role-pill">${escapeHtml(m.role)}</span><span class="${pending?'invite-status':''}">${pending?'Pending':'Active'}</span>${pending?`<div><button class="member-menu" data-copy-invite="${escapeHtml(m.token||'')}" title="Copy invite link">⧉</button><button class="member-menu" data-revoke="${escapeHtml(m.id)}" title="Revoke invite">×</button></div>`:`<button class="member-menu" data-member="${escapeHtml(m.id)}">•••</button>`}</div>`}
function openTeamModal(id){$(id).classList.add('open');$('#scrim').classList.add('open')}
function closeTeamModal(id){$(id).classList.remove('open');if(!$('.modal.open')&&!$('#composer').classList.contains('open'))$('#scrim').classList.remove('open')}
function openInvite(){const w=workspaces.find(x=>x.id===selectedWorkspaceId);$('#inviteWorkspaceName').textContent=w.name;$('#inviteEmails').value='';$('#inviteMessage').value='';openTeamModal('#inviteModal')}
function sendInvitations(){
  const raw=$('#inviteEmails').value.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean),valid=raw.filter(x=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
  if(!valid.length){$('#inviteEmails').focus();showToast('Add a valid email','Separate multiple email addresses with commas.');return}
  const w=workspaces.find(x=>x.id===selectedWorkspaceId),existing=new Set(w.members.map(m=>m.email.toLowerCase())),fresh=[...new Set(valid)].filter(email=>!existing.has(email));
  if(!fresh.length){showToast('Already invited','Everyone entered already belongs to this workspace.');return}
  fresh.forEach(email=>w.members.push({id:`invite-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,name:'',email,role:$('#inviteRole').value,status:'Pending',token:Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>b.toString(16).padStart(2,'0')).join(''),invitedAt:new Date().toISOString()}));saveWorkspaces();renderWorkspaces();closeTeamModal('#inviteModal');showToast(`${fresh.length} invitation${fresh.length===1?'':'s'} created`,'Copy each invite link from the pending invitation list.');
}
function createWorkspace(){const name=$('#newWorkspaceName').value.trim();if(!name){$('#newWorkspaceName').focus();return}const id=`workspace-${Date.now()}`;workspaces.push({id,name:name.replace(/[<>]/g,''),purpose:$('#newWorkspacePurpose').value.trim().replace(/[<>]/g,''),active:false,members:[{id:'alex',name:'Alex Lin',email:'alex@mcbrideconsulting.net',role:'Owner',status:'Active'}]});selectedWorkspaceId=id;saveWorkspaces();renderWorkspaces();closeTeamModal('#workspaceModal');showToast('Workspace created',`${name} is ready for collaborators.`)}
$('#workspaceList').onclick=e=>{const button=e.target.closest('[data-workspace]');if(button){selectedWorkspaceId=button.dataset.workspace;renderWorkspaces()}};
$('#workspaceDetail').onclick=async e=>{if(e.target.closest('[data-invite]'))openInvite();const copyToken=e.target.closest('[data-copy-invite]')?.dataset.copyInvite;if(copyToken){const link=new URL(location.href);link.search=`?invite=${encodeURIComponent(copyToken)}`;await navigator.clipboard.writeText(link.href);showToast('Invite link copied','Share it directly with the intended collaborator.')}const revoke=e.target.closest('[data-revoke]')?.dataset.revoke;if(revoke){const w=workspaces.find(x=>x.id===selectedWorkspaceId);w.members=w.members.filter(m=>m.id!==revoke);saveWorkspaces();renderWorkspaces();showToast('Invitation revoked','The pending invitation can no longer be used.')}const switchId=e.target.closest('[data-switch-workspace]')?.dataset.switchWorkspace;if(switchId){workspaces.forEach(w=>w.active=w.id===switchId);saveWorkspaces();const w=workspaces.find(x=>x.id===switchId);$('.workspace strong').textContent=w.name;$('.workspace-logo').textContent=initials(w.name);renderWorkspaces();showToast('Workspace switched',`You’re now working in ${w.name}.`)}};
$('.workspace').onclick=()=>switchView('workspaces');$('#createWorkspaceBtn').onclick=()=>{$('#newWorkspaceName').value='';$('#newWorkspacePurpose').value='';openTeamModal('#workspaceModal')};
$('#closeInviteModal').onclick=()=>closeTeamModal('#inviteModal');$('#cancelInvite').onclick=()=>closeTeamModal('#inviteModal');$('#sendInvites').onclick=sendInvitations;$('#closeWorkspaceModal').onclick=()=>closeTeamModal('#workspaceModal');$('#cancelWorkspace').onclick=()=>closeTeamModal('#workspaceModal');$('#saveWorkspace').onclick=createWorkspace;$('#scrim').addEventListener('click',()=>{closeTeamModal('#inviteModal');closeTeamModal('#workspaceModal')});renderWorkspaces();

// Installable app and invitation acceptance.
let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installAppBtn').style.display='flex'});
window.addEventListener('appinstalled',()=>{installPrompt=null;showToast('Cornerstone installed','You can now launch it like any other app.')});
$('#installAppBtn').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null}else showToast('Install from your browser','Use the browser menu and choose “Install Cornerstone” or “Add to Home Screen”.')};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
const inviteToken=new URLSearchParams(location.search).get('invite');
if(inviteToken){const invitedWorkspace=workspaces.find(w=>w.members.some(m=>m.token===inviteToken&&m.status==='Pending')),invitedMember=invitedWorkspace?.members.find(m=>m.token===inviteToken&&m.status==='Pending');if(invitedWorkspace&&invitedMember){$('#gateWorkspaceName').textContent=invitedWorkspace.name;$('#gateRole').textContent=invitedMember.role;$('#gateInviteCopy').textContent=`${invitedMember.email} was invited to collaborate in Cornerstone.`;$('#inviteGate').hidden=false;$('#acceptInviteBtn').onclick=()=>{const name=$('#gateName').value.trim();if(!name){$('#gateName').focus();return}invitedMember.name=name.replace(/[<>]/g,'');invitedMember.status='Active';delete invitedMember.token;saveWorkspaces();$('#inviteGate').hidden=true;history.replaceState({},'',location.pathname);selectedWorkspaceId=invitedWorkspace.id;switchView('workspaces');showToast('Welcome to Cornerstone',`You joined ${invitedWorkspace.name} as ${invitedMember.role}.`)}}else{$('#inviteGate').hidden=false;$('#gateWorkspaceName').textContent='an unavailable workspace';$('#gateInviteCopy').textContent='This invitation is invalid, expired, or has already been used.';$('#gateName').hidden=true;$('#acceptInviteBtn').hidden=true}}

// Local account authentication. Hosted multi-device identity should use an external auth provider.
const authStorageKey='cornerstone-auth-v1',authSessionKey='cornerstone-session-v1';
let authStore=JSON.parse(localStorage.getItem(authStorageKey)||'{"users":[]}');
const authB64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
async function passwordDigest(password,salt){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:600000},material,256))}
function constantTimeEqual(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0}
function setAuthSession(user){sessionStorage.setItem(authSessionKey,JSON.stringify({email:user.email,name:user.name,issuedAt:Date.now()}));$('.profile strong').textContent=user.name;$('.profile small').textContent=user.role||'Collaborator';$('.avatar').textContent=initials(user.name);$('#authGate').hidden=true}
function currentAuthUser(){try{const session=JSON.parse(sessionStorage.getItem(authSessionKey)||'null');return session&&authStore.users.find(u=>u.email===session.email)}catch{return null}}
function showAuth(){const setup=authStore.users.length===0;$('#authEyebrow').textContent=setup?'SECURE ACCOUNT SETUP':'WELCOME BACK';$('#authTitle').textContent=setup?'Create your owner account':'Sign in to Cornerstone';$('#authCopy').textContent=setup?'Set up the first account for this Cornerstone installation.':'Enter your account credentials to continue.';$('#authNameWrap').hidden=!setup;$('#authSubmit').textContent=setup?'Create account':'Sign in';$('#authPassword').autocomplete=setup?'new-password':'current-password';$('#authPassword').value='';$('#authError').textContent='';$('#authGate').hidden=false}
async function submitAuth(){
  const email=$('#authEmail').value.trim().toLowerCase(),password=$('#authPassword').value,name=$('#authName').value.trim();$('#authError').textContent='';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ $('#authError').textContent='Enter a valid email address.';return }
  $('#authSubmit').disabled=true;$('#authSubmit').textContent='Checking…';
  if(authStore.users.length===0){if(!name||password.length<12){$('#authError').textContent='Enter your name and a password of at least 12 characters.';$('#authSubmit').disabled=false;$('#authSubmit').textContent='Create account';return}const salt=crypto.getRandomValues(new Uint8Array(32)),digest=await passwordDigest(password,salt),user={id:crypto.randomUUID(),name:name.replace(/[<>]/g,''),email,role:'Owner',salt:authB64(salt),digest:authB64(digest),createdAt:new Date().toISOString()};authStore.users.push(user);localStorage.setItem(authStorageKey,JSON.stringify(authStore));setAuthSession(user);showToast('Owner account created','You are securely signed in.')}else{const user=authStore.users.find(u=>u.email===email);let valid=false;if(user){const salt=Uint8Array.from(atob(user.salt),c=>c.charCodeAt(0)),actual=await passwordDigest(password,salt),expected=Uint8Array.from(atob(user.digest),c=>c.charCodeAt(0));valid=constantTimeEqual(actual,expected)}if(valid){setAuthSession(user);showToast('Welcome back',`Signed in as ${user.name}.`)}else $('#authError').textContent='Email or password is incorrect.'}
  $('#authSubmit').disabled=false;$('#authSubmit').textContent=authStore.users.length===1&&!currentAuthUser()?'Sign in':'Continue';$('#authPassword').value='';
}
$('#authSubmit').onclick=submitAuth;$('#authPassword').addEventListener('keydown',e=>{if(e.key==='Enter')submitAuth()});
$('#logoutBtn').onclick=()=>{sessionStorage.removeItem(authSessionKey);vaultKey=null;vaultEntries={};sessionSecrets.clear();updateVaultUi();showAuth();showToast('Signed out','Your session and decrypted credentials were cleared.')};
if(inviteToken){const workspaceForInvite=workspaces.find(w=>w.members.some(m=>m.token===inviteToken&&m.status==='Pending')),memberForInvite=workspaceForInvite?.members.find(m=>m.token===inviteToken&&m.status==='Pending');if(memberForInvite){$('#authGate').hidden=true;$('#acceptInviteBtn').onclick=async()=>{const name=$('#gateName').value.trim(),password=$('#gatePassword').value;if(!name||password.length<12){showToast('Complete your account','Enter your name and a password of at least 12 characters.');return}const salt=crypto.getRandomValues(new Uint8Array(32)),digest=await passwordDigest(password,salt),user={id:crypto.randomUUID(),name:name.replace(/[<>]/g,''),email:memberForInvite.email.toLowerCase(),role:memberForInvite.role,salt:authB64(salt),digest:authB64(digest),createdAt:new Date().toISOString()};authStore.users=authStore.users.filter(u=>u.email!==user.email);authStore.users.push(user);localStorage.setItem(authStorageKey,JSON.stringify(authStore));memberForInvite.name=user.name;memberForInvite.status='Active';delete memberForInvite.token;saveWorkspaces();setAuthSession(user);$('#inviteGate').hidden=true;history.replaceState({},'',location.pathname);selectedWorkspaceId=workspaceForInvite.id;switchView('workspaces');showToast('Welcome to Cornerstone',`You joined ${workspaceForInvite.name} as ${memberForInvite.role}.`)}}}else{const signedIn=currentAuthUser();if(signedIn)setAuthSession(signedIn);else showAuth()}

// User settings, administration, and accessibility preferences.
let adminPreferences=JSON.parse(localStorage.getItem('cornerstone-admin-preferences')||'{"approvalRequired":true,"memberInvites":false,"defaultRole":"Viewer"}');
let accessibilityPreferences=JSON.parse(localStorage.getItem('cornerstone-accessibility')||'{"largeText":false,"highContrast":false,"reducedMotion":false,"underlineLinks":false}');
const workspaceViewSwitch=switchView;
switchView=function(name){if(name!=='userSettings')return workspaceViewSwitch(name);$$('.view').forEach(v=>v.classList.remove('active'));$('#userSettingsView').classList.add('active');$$('.nav-item[data-view]').forEach(n=>n.classList.remove('active'));$('#pageTitle').textContent='User settings';$('#pageSubtitle').textContent='Account, security, administration, and accessibility.';populateUserSettings()};
function populateUserSettings(){const user=currentAuthUser();if(user){$('#settingsName').value=user.name;$('#settingsEmail').value=user.email;$('#settingsRole').value=user.role||'Collaborator';$('#settingsDisplayName').textContent=user.name;$('#settingsAvatar').textContent=initials(user.name)}$('#approvalRequired').checked=adminPreferences.approvalRequired;$('#memberInvites').checked=adminPreferences.memberInvites;$('#defaultInviteRole').value=adminPreferences.defaultRole;$('#largeTextSetting').checked=accessibilityPreferences.largeText;$('#highContrastSetting').checked=accessibilityPreferences.highContrast;$('#reducedMotionSetting').checked=accessibilityPreferences.reducedMotion;$('#underlineLinksSetting').checked=accessibilityPreferences.underlineLinks}
function applyAccessibility(){document.body.classList.toggle('a11y-large-text',accessibilityPreferences.largeText);document.body.classList.toggle('a11y-high-contrast',accessibilityPreferences.highContrast);document.body.classList.toggle('a11y-reduce-motion',accessibilityPreferences.reducedMotion);document.body.classList.toggle('a11y-underline-links',accessibilityPreferences.underlineLinks)}
$$('.settings-tab').forEach(tab=>tab.onclick=()=>{$$('.settings-tab').forEach(x=>x.classList.toggle('active',x===tab));$$('.settings-panel').forEach(panel=>panel.classList.toggle('active',panel.dataset.settingsPanel===tab.dataset.settingsTab))});
$('#profileMenuBtn').onclick=()=>switchView('userSettings');
$('#saveAccountSettings').onclick=()=>{const user=currentAuthUser(),name=$('#settingsName').value.trim().replace(/[<>]/g,''),email=$('#settingsEmail').value.trim().toLowerCase();if(!user||!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast('Check account details','Enter a name and valid email address.');return}if(authStore.users.some(u=>u.id!==user.id&&u.email===email)){showToast('Email already in use','Choose another account email.');return}user.name=name;user.email=email;localStorage.setItem(authStorageKey,JSON.stringify(authStore));setAuthSession(user);populateUserSettings();showToast('Account updated','Your profile information was saved.')};
$('#changePasswordBtn').onclick=async()=>{const user=currentAuthUser(),current=$('#currentPassword').value,next=$('#newPassword').value,confirm=$('#confirmNewPassword').value;if(!user||next.length<12||next!==confirm){showToast('Check your new password',next.length<12?'Use at least 12 characters.':'The new passwords do not match.');return}const oldSalt=Uint8Array.from(atob(user.salt),c=>c.charCodeAt(0)),actual=await passwordDigest(current,oldSalt),expected=Uint8Array.from(atob(user.digest),c=>c.charCodeAt(0));if(!constantTimeEqual(actual,expected)){showToast('Current password is incorrect','Your password was not changed.');return}const newSalt=crypto.getRandomValues(new Uint8Array(32)),newDigest=await passwordDigest(next,newSalt);user.salt=authB64(newSalt);user.digest=authB64(newDigest);localStorage.setItem(authStorageKey,JSON.stringify(authStore));$('#currentPassword').value='';$('#newPassword').value='';$('#confirmNewPassword').value='';showToast('Password changed','Your new password is active now.')};
$('#saveAdminSettings').onclick=()=>{adminPreferences={approvalRequired:$('#approvalRequired').checked,memberInvites:$('#memberInvites').checked,defaultRole:$('#defaultInviteRole').value};localStorage.setItem('cornerstone-admin-preferences',JSON.stringify(adminPreferences));$('#inviteRole').value=adminPreferences.defaultRole;showToast('Admin controls saved','Workspace defaults were updated.')};
$('#saveAccessibilitySettings').onclick=()=>{accessibilityPreferences={largeText:$('#largeTextSetting').checked,highContrast:$('#highContrastSetting').checked,reducedMotion:$('#reducedMotionSetting').checked,underlineLinks:$('#underlineLinksSetting').checked};localStorage.setItem('cornerstone-accessibility',JSON.stringify(accessibilityPreferences));applyAccessibility();showToast('Accessibility updated','Your display preferences were applied.')};
$('#settingsLogoutBtn').onclick=()=>$('#logoutBtn').click();applyAccessibility();
