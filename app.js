
const menu=document.getElementById('mainNav'), menuBtn=document.getElementById('mobileMenu');
if(menuBtn) menuBtn.onclick=()=>menu.classList.toggle('show');

function showMsg(id,text,ok=false){
  const el=document.getElementById(id);
  if(!el) return;
  el.textContent=text;
  el.className='message show '+(ok?'ok':'err');
}

document.addEventListener("DOMContentLoaded",async()=>{
  // Auth page
  const authForm=document.getElementById("authForm");
  if(authForm){
    const mode=location.hash==="#register"?"register":"login";
    setAuthMode(mode);
  }

  // Threads page
  const dynamicThreads=document.getElementById("dynamicThreads");
  if(dynamicThreads){
    if(!backendConfigured()){
      dynamicThreads.innerHTML='<div style="padding:16px;color:#9298a5">Supabase is not configured yet. The static demo threads remain available below.</div>';
    }else{
      try{
        const rows=await fetchThreads();
        dynamicThreads.innerHTML=rows.length?rows.map(t=>`
          <a class="thread-row" href="thread-live.html?id=${t.id}">
            <div class="avatar">${(t.category||'TH').slice(0,2).toUpperCase()}</div>
            <div class="thread-main"><h3><span class="prefix info">${t.category||'GENERAL'}</span>${escapeHtml(t.title)}</h3><p>${new Date(t.created_at).toLocaleString()}</p></div>
            <div class="thread-stat"><strong>-</strong><span>Replies</span></div>
            <div class="thread-stat"><strong>-</strong><span>Views</span></div>
            <div class="latest"><strong>Member</strong><span>Recent</span></div>
          </a>`).join(''):'<div style="padding:16px;color:#9298a5">No live threads yet.</div>';
      }catch(e){dynamicThreads.innerHTML='<div style="padding:16px;color:#ff8a94">'+escapeHtml(e.message)+'</div>'}
    }
  }

  // Faction form
  const factionForm=document.getElementById("factionForm");
  if(factionForm) factionForm.addEventListener("submit",submitFactionForm);

  // Admin applications
  const adminApps=document.getElementById("adminApplications");
  if(adminApps) loadAdminApplications();

  // Live thread page
  const liveThread=document.getElementById("liveThread");
  if(liveThread) loadLiveThread();
});

function escapeHtml(s=''){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}

function setAuthMode(mode){
  const isReg=mode==="register";
  document.getElementById("authTitle").textContent=isReg?"Create Account":"Log in";
  document.getElementById("usernameField").style.display=isReg?"block":"none";
  document.getElementById("authSubmit").textContent=isReg?"REGISTER":"LOG IN";
  document.getElementById("switchAuth").innerHTML=isReg?'Already have an account? <a href="#login" onclick="setAuthMode(\'login\')">Log in</a>':'Need an account? <a href="#register" onclick="setAuthMode(\'register\')">Register</a>';
  document.getElementById("authForm").dataset.mode=mode;
}

async function handleAuthSubmit(e){
  e.preventDefault();
  const mode=e.currentTarget.dataset.mode||"login";
  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value;
  const username=document.getElementById("username").value.trim();
  try{
    if(mode==="register"){
      await signUp(email,password,username);
      showMsg("authMsg","Account created. Check your email if confirmation is enabled.",true);
    }else{
      await signIn(email,password);
      showMsg("authMsg","Logged in. Redirecting...",true);
      setTimeout(()=>location.href="index.html",700);
    }
  }catch(err){showMsg("authMsg",err.message)}
}

async function handleCreateThread(e){
  e.preventDefault();
  try{
    const title=document.getElementById("threadTitle").value.trim();
    const body=document.getElementById("threadBody").value.trim();
    const category=document.getElementById("threadCategory").value;
    const t=await createThread(title,body,category);
    showMsg("threadMsg","Thread created.",true);
    setTimeout(()=>location.href=`thread-live.html?id=${t.id}`,600);
  }catch(err){showMsg("threadMsg",err.message)}
}

async function submitFactionForm(e){
  e.preventDefault();
  const f=e.currentTarget;
  try{
    await submitFactionApplication({
      faction_name:f.faction_name.value.trim(),
      leader_name:f.leader_name.value.trim(),
      discord_username:f.discord_username.value.trim(),
      member_count:Number(f.member_count.value),
      turf:f.turf.value.trim(),
      requested_tier:f.requested_tier.value,
      background:f.background.value.trim(),
      roleplay_plan:f.roleplay_plan.value.trim(),
      forum_thread_link:f.forum_thread_link.value.trim(),
      media_link:f.media_link.value.trim()
    });
    showMsg("factionMsg","Faction application submitted successfully.",true);
    f.reset();
  }catch(err){showMsg("factionMsg",err.message)}
}

async function loadAdminApplications(){
  const host=document.getElementById("adminApplications");
  if(!backendConfigured()){host.innerHTML='<tr><td colspan="6">Supabase is not configured yet.</td></tr>';return}
  try{
    const rows=await fetchApplications();
    host.innerHTML=rows.map(a=>`<tr>
      <td>${escapeHtml(a.faction_name)}</td>
      <td>${escapeHtml(a.leader_name)}</td>
      <td>${a.member_count}</td>
      <td>${escapeHtml(a.requested_tier)}</td>
      <td>${escapeHtml(a.status)}</td>
      <td><button class="btn btn-sm btn-primary" onclick="adminSetStatus('${a.id}','accepted')">Accept</button> <button class="btn btn-sm btn-dark" onclick="adminSetStatus('${a.id}','denied')">Deny</button></td>
    </tr>`).join('') || '<tr><td colspan="6">No applications.</td></tr>';
  }catch(err){host.innerHTML=`<tr><td colspan="6">${escapeHtml(err.message)}</td></tr>`}
}

async function adminSetStatus(id,status){
  try{await updateApplicationStatus(id,status);await loadAdminApplications()}catch(err){alert(err.message)}
}

async function loadLiveThread(){
  const id=new URLSearchParams(location.search).get("id");
  const host=document.getElementById("liveThread");
  if(!backendConfigured()){host.innerHTML='<div class="card" style="padding:18px">Supabase is not configured yet.</div>';return}
  if(!id){host.innerHTML='<div class="card" style="padding:18px">No thread selected.</div>';return}
  const client=getClient();
  try{
    const {data:t,error:e1}=await client.from("threads").select("*").eq("id",id).single();
    if(e1) throw e1;
    const {data:r,error:e2}=await client.from("replies").select("*").eq("thread_id",id).order("created_at",{ascending:true});
    if(e2) throw e2;
    host.innerHTML=`<div class="post-card"><aside class="post-user"><div class="avatar">OP</div><h4>Member</h4></aside><section class="post-body"><div class="post-head"><span>${new Date(t.created_at).toLocaleString()}</span><span>#1</span></div><h2>${escapeHtml(t.title)}</h2><p>${escapeHtml(t.body)}</p></section></div>`+
      (r||[]).map((x,i)=>`<div class="post-card"><aside class="post-user"><div class="avatar">RP</div><h4>Member</h4></aside><section class="post-body"><div class="post-head"><span>${new Date(x.created_at).toLocaleString()}</span><span>#${i+2}</span></div><p>${escapeHtml(x.body)}</p></section></div>`).join('');
    document.getElementById("replyThreadId").value=id;
  }catch(err){host.innerHTML=`<div class="card" style="padding:18px">${escapeHtml(err.message)}</div>`}
}

async function handleLiveReply(e){
  e.preventDefault();
  try{
    const id=document.getElementById("replyThreadId").value;
    const body=document.getElementById("replyBody").value.trim();
    await createReply(id,body);
    location.reload();
  }catch(err){showMsg("replyMsg",err.message)}
}
