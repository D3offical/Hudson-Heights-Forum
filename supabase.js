
let hhClient = null;

function backendConfigured(){
  return window.HH_SUPABASE_URL &&
    window.HH_SUPABASE_ANON_KEY &&
    !window.HH_SUPABASE_URL.includes("PASTE_") &&
    !window.HH_SUPABASE_ANON_KEY.includes("PASTE_");
}

function getClient(){
  if(!backendConfigured()) return null;
  if(!hhClient){
    hhClient = window.supabase.createClient(window.HH_SUPABASE_URL, window.HH_SUPABASE_ANON_KEY);
  }
  return hhClient;
}

async function currentUser(){
  const client=getClient();
  if(!client) return null;
  const {data}=await client.auth.getUser();
  return data?.user || null;
}

async function signUp(email,password,username){
  const client=getClient();
  if(!client) throw new Error("Supabase is not configured yet.");
  const {data,error}=await client.auth.signUp({
    email,password,
    options:{data:{username}}
  });
  if(error) throw error;
  return data;
}

async function signIn(email,password){
  const client=getClient();
  if(!client) throw new Error("Supabase is not configured yet.");
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error) throw error;
  return data;
}

async function signOutUser(){
  const client=getClient();
  if(!client) return;
  await client.auth.signOut();
  location.href="index.html";
}

async function createThread(title,body,category="general"){
  const client=getClient(); const user=await currentUser();
  if(!client) throw new Error("Supabase is not configured yet.");
  if(!user) throw new Error("You must log in first.");
  const {data,error}=await client.from("threads").insert({
    title,body,category,user_id:user.id
  }).select().single();
  if(error) throw error;
  return data;
}

async function fetchThreads(){
  const client=getClient();
  if(!client) return [];
  const {data,error}=await client.from("threads")
    .select("id,title,body,category,created_at,user_id")
    .order("created_at",{ascending:false});
  if(error) throw error;
  return data || [];
}

async function createReply(threadId,body){
  const client=getClient(); const user=await currentUser();
  if(!client) throw new Error("Supabase is not configured yet.");
  if(!user) throw new Error("You must log in first.");
  const {data,error}=await client.from("replies").insert({
    thread_id:threadId,body,user_id:user.id
  }).select().single();
  if(error) throw error;
  return data;
}

async function submitFactionApplication(payload){
  const client=getClient(); const user=await currentUser();
  if(!client) throw new Error("Supabase is not configured yet.");
  if(!user) throw new Error("You must log in before submitting.");
  const {data,error}=await client.from("faction_applications").insert({
    ...payload,user_id:user.id,status:"pending"
  }).select().single();
  if(error) throw error;
  return data;
}

async function fetchApplications(){
  const client=getClient();
  if(!client) return [];
  const {data,error}=await client.from("faction_applications")
    .select("*").order("created_at",{ascending:false});
  if(error) throw error;
  return data || [];
}

async function updateApplicationStatus(id,status){
  const client=getClient();
  if(!client) throw new Error("Supabase is not configured yet.");
  const {error}=await client.from("faction_applications").update({status}).eq("id",id);
  if(error) throw error;
}

async function updateHeaderAuth(){
  const el=document.getElementById("authArea");
  if(!el) return;
  const user=await currentUser();
  if(user){
    const username=user.user_metadata?.username || user.email;
    el.innerHTML=`<span class="user-pill">${username}</span><button class="btn btn-ghost btn-sm" onclick="signOutUser()">Log out</button>`;
  }else{
    el.innerHTML=`<a class="btn btn-ghost btn-sm" href="auth.html">Log in</a><a class="btn btn-primary btn-sm" href="auth.html#register">Register</a>`;
  }
}
document.addEventListener("DOMContentLoaded",updateHeaderAuth);
