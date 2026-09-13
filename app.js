
const backdrop = document.getElementById('modalBackdrop');
const content = document.getElementById('modalContent');
const menu = document.getElementById('mainNav');
const menuBtn = document.getElementById('mobileMenu');

if(menuBtn) menuBtn.onclick = () => menu.classList.toggle('show');
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => menu.classList.remove('show')));

function openModal(html){ content.innerHTML = html; backdrop.classList.add('show'); }
function closeModal(){ backdrop.classList.remove('show'); }
if(document.getElementById('modalClose')) document.getElementById('modalClose').onclick = closeModal;
if(backdrop) backdrop.onclick = e => { if(e.target === backdrop) closeModal(); };

document.querySelectorAll('[data-modal]').forEach(btn => btn.onclick = () => {
  const reg = btn.dataset.modal === 'register';
  openModal(`<h2>${reg?'Create Account':'Log in'}</h2>
  <p>This interface is ready for a Supabase backend.</p>
  <div class="field"><label>${reg?'Username':'Email or Username'}</label><input placeholder="${reg?'Choose a username':'Enter username'}"></div>
  ${reg?'<div class="field"><label>Email</label><input type="email" placeholder="you@example.com"></div>':''}
  <div class="field"><label>Password</label><input type="password" placeholder="••••••••"></div>
  <button class="btn btn-primary full" onclick="demoBackend()">${reg?'REGISTER':'LOG IN'}</button>`);
});

window.demoBackend = () => openModal(`<h2>Backend Required</h2>
<div class="notice">Connect Supabase to enable real accounts, threads, replies, faction applications, staff roles, and persistent data.</div>
<button class="btn btn-primary full" onclick="document.getElementById('modalBackdrop').classList.remove('show')">CLOSE</button>`);

const np = document.getElementById('newPostBtn');
if(np) np.onclick = () => openModal(`<h2>Create Thread</h2>
<div class="field"><label>Prefix</label><select><option>Discussion</option><option>Question</option><option>Application</option></select></div>
<div class="field"><label>Title</label><input placeholder="Thread title"></div>
<div class="field"><label>Message</label><textarea rows="7" placeholder="Write your post..."></textarea></div>
<button class="btn btn-primary full" onclick="demoBackend()">POST THREAD</button>`);

const form = document.getElementById('factionForm');
if(form) form.onsubmit = e => {
  e.preventDefault();
  openModal(`<h2>Application Ready</h2>
  <div class="notice">The application form is complete visually. Connect Supabase to save submissions and let Faction Management review them.</div>
  <button class="btn btn-primary full" onclick="document.getElementById('modalBackdrop').classList.remove('show')">CLOSE</button>`);
};

const connect = document.getElementById('connectBtn');
if(connect) connect.onclick = () => alert('Replace this with your FiveM cfx.re/join URL in app.js.');

['discordBtn','discordFooter','discordQuick'].forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.onclick=e=>{e.preventDefault();alert('Replace this with your Hudson Heights Discord invite in app.js.');};
});

const factionData = {
  'pnv': {
    name:'PNV / 6Block', borough:'Brooklyn', tier:'Tier 2', status:'Official',
    members:'20+', standing:'Good Standing', leader:'Faction Leader', co:'Co-Leader',
    turf:'6Block / Brooklyn', summary:'An official Hudson Heights faction focused on consistent neighborhood roleplay, positive interactions, events, and faction story development.'
  },
  'queensbridge': {
    name:'Queensbridge', borough:'Queens', tier:'Tier 1', status:'Official',
    members:'18', standing:'Good Standing', leader:'Faction Leader', co:'Co-Leader',
    turf:'Queensbridge', summary:'A recognized Queens faction built around active neighborhood roleplay, community presence, and faction-driven storylines.'
  },
  'hilltop': {
    name:'HillTop', borough:'Manhattan', tier:'Pending', status:'Under Review',
    members:'14', standing:'Pending Review', leader:'Faction Leader', co:'Co-Leader',
    turf:'Harlem', summary:'A faction application currently under review by Faction Management.'
  },
  'mtm': {
    name:'MTM / StainGang', borough:'Queens', tier:'Tier 3', status:'Official',
    members:'22', standing:'Good Standing', leader:'Faction Leader', co:'Co-Leader',
    turf:'Ravenswood / Queens', summary:'An official faction centered around active storylines, neighborhood identity, and regular faction interactions.'
  }
};

function loadFactionProfile(){
  const host=document.getElementById('factionProfile');
  if(!host) return;
  const key=new URLSearchParams(location.search).get('f') || 'pnv';
  const d=factionData[key] || factionData.pnv;
  document.getElementById('fpName').textContent=d.name;
  document.getElementById('fpLocation').textContent=d.borough;
  document.getElementById('fpTier').textContent=d.tier;
  document.getElementById('fpStatus').textContent=d.status;
  document.getElementById('fpMembers').textContent=d.members;
  document.getElementById('fpStanding').textContent=d.standing;
  document.getElementById('fpTurf').textContent=d.turf;
  document.getElementById('fpSummary').textContent=d.summary;
  document.getElementById('fpLeader').textContent=d.leader;
  document.getElementById('fpCo').textContent=d.co;
}
loadFactionProfile();
