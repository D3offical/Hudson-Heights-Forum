const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const mainNav = document.getElementById('mainNav');

document.getElementById('mobileMenu').addEventListener('click', () => {
  mainNav.classList.toggle('show');
});

document.querySelectorAll('.main-nav a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelectorAll('.main-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    mainNav.classList.remove('show');
  });
});

function openModal(html) {
  modalContent.innerHTML = html;
  modalBackdrop.classList.add('show');
}

function closeModal() {
  modalBackdrop.classList.remove('show');
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.modal;
    if (type === 'login') {
      openModal(`
        <h2>Log in</h2>
        <p>Demo interface. Connect Supabase or another backend to enable real accounts.</p>
        <div class="field"><label>Email or Username</label><input placeholder="Enter username"></div>
        <div class="field"><label>Password</label><input type="password" placeholder="••••••••"></div>
        <button class="btn btn-primary full" onclick="demoAuth()">LOG IN</button>
      `);
    } else {
      openModal(`
        <h2>Create Account</h2>
        <p>Register for the Hudson Heights community.</p>
        <div class="field"><label>Username</label><input placeholder="Choose a username"></div>
        <div class="field"><label>Email</label><input type="email" placeholder="you@example.com"></div>
        <div class="field"><label>Password</label><input type="password" placeholder="Create a password"></div>
        <button class="btn btn-primary full" onclick="demoAuth()">REGISTER</button>
      `);
    }
  });
});

window.demoAuth = function() {
  openModal(`
    <h2>Backend Required</h2>
    <div class="notice">This GitHub Pages starter is currently frontend-only. Add Supabase/Firebase to save accounts, threads, replies, roles, and applications.</div>
    <button class="btn btn-primary full" onclick="document.getElementById('modalBackdrop').classList.remove('show')">GOT IT</button>
  `);
};

document.querySelectorAll('.forum-row').forEach(row => {
  row.addEventListener('click', e => {
    e.preventDefault();
    const name = row.dataset.forum;
    openModal(`
      <h2>${name}</h2>
      <p>This forum section is ready to connect to a database.</p>
      <div class="notice">
        In the full version, clicking this opens a list of threads with prefixes, author avatars, reply counts, views, timestamps, pagination, and a Create Thread button.
      </div>
      <button class="btn btn-primary full" onclick="document.getElementById('modalBackdrop').classList.remove('show')">CLOSE</button>
    `);
  });
});

document.getElementById('newPostBtn').addEventListener('click', () => {
  openModal(`
    <h2>Create Thread</h2>
    <p>Frontend preview of the thread composer.</p>
    <div class="field"><label>Forum</label><input value="Faction Applications"></div>
    <div class="field"><label>Thread Title</label><input placeholder="Enter a title"></div>
    <div class="field"><label>Message</label><textarea rows="7" placeholder="Write your post..."></textarea></div>
    <button class="btn btn-primary full" onclick="demoAuth()">POST THREAD</button>
  `);
});

['discordBtn','discordLink'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    e.preventDefault();
    alert('Replace this with your Hudson Heights Discord invite in app.js.');
  });
});

document.getElementById('connectBtn').addEventListener('click', () => {
  alert('Replace this button with your FiveM cfx.re/join link.');
});
