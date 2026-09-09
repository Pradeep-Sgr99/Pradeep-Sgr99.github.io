// ===== FORM DELIVERY (FormSubmit.co — no backend needed) =====
// After your FIRST real submission, check your inbox: click the FormSubmit
// activation link, then replace the email below with the random string
// FormSubmit sends you (e.g. "https://formsubmit.co/ajax/abc123...") so your
// address isn't exposed in the page source.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/Pradeepsgr1747@gmail.com';

function submitForm(payload) {
  return fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json());
}

// ===== ELEMENTS =====
const reception     = document.getElementById('reception');
const doorFrame     = document.getElementById('doorFrame');   // .door-wrap
const loginOverlay  = document.getElementById('loginOverlay');
const closeLoginBtn = document.getElementById('closeLogin');
const loginBtn      = document.getElementById('loginBtn');
const reqBtn        = document.getElementById('reqBtn');
const successMsg    = document.getElementById('successMsg');
const dashboard     = document.getElementById('dashboard');
const visitorName   = document.getElementById('visitorName');
const dashTime      = document.getElementById('dashTime');
const exitDashboard = document.getElementById('exitDashboard');
const sendContact   = document.getElementById('sendContact');
const tabBtns       = document.querySelectorAll('.tab-btn');
const navItems      = document.querySelectorAll('.nav-item');
const signDate      = document.getElementById('signDate');
const signTime      = document.getElementById('signTime');

// ===== PARTICLES =====
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:${5 + Math.random() * 70}%;
      --dur:${7 + Math.random() * 9}s;
      --delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}
spawnParticles();


// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  
  // Dashboard Clock
  const dashOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  if (dashTime) dashTime.textContent = now.toLocaleTimeString('en-IN', dashOpts);

  // Signage Date
  const dateOpts = { month: 'short', day: 'numeric', year: 'numeric' };
  if (signDate) signDate.textContent = now.toLocaleDateString('en-US', dateOpts);

  // Signage Time
  const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  if (signTime) signTime.textContent = now.toLocaleTimeString('en-US', timeOpts);
}
setInterval(updateClock, 1000);
updateClock();

// ===== TAB SWITCHING (LOGIN MODAL) =====
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + target).classList.add('active');
    successMsg.classList.add('hidden');
  });
});


// ===== CLOSE LOGIN =====
closeLoginBtn.addEventListener('click', () => {
  loginOverlay.classList.add('hidden');
});
loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) loginOverlay.classList.add('hidden');
});

// ===== DOOR INTERACTION (Hover reflection & Click) =====
doorFrame.addEventListener('mousemove', (e) => {
  const rect = doorFrame.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  const reflections = doorFrame.querySelectorAll('.glass-reflection');
  reflections.forEach(ref => {
    ref.style.backgroundPosition = `${x}% ${y}%`;
  });
});

doorFrame.addEventListener('mouseleave', () => {
  const reflections = doorFrame.querySelectorAll('.glass-reflection');
  reflections.forEach(ref => {
    ref.style.transition = 'background-position 0.5s ease';
    ref.style.backgroundPosition = '50% 50%';
    setTimeout(() => ref.style.transition = '', 500);
  });
});

doorFrame.addEventListener('click', () => {
  loginOverlay.classList.remove('hidden');
});

// ===== LOGIN BUTTON =====
loginBtn.addEventListener('click', () => {
  const uname   = document.getElementById('username').value.trim();
  const passcode = document.getElementById('passcode').value.trim();

  if (!uname) {
    shake(document.getElementById('username'));
    return;
  }
  if (passcode !== '1234') {
    shake(document.getElementById('passcode'));
    showToast('Incorrect passcode. Try: 1234');
    return;
  }
  // Trigger door open animation, then show dashboard
  loginOverlay.classList.add('hidden');
  openDoor(uname);
});

// ===== REQUEST ACCESS BUTTON =====
reqBtn.addEventListener('click', () => {
  const name  = document.getElementById('req-name').value.trim();
  const email = document.getElementById('req-email').value.trim();
  const msg   = document.getElementById('req-msg').value.trim();

  if (!name || !email) {
    if (!name) shake(document.getElementById('req-name'));
    if (!email) shake(document.getElementById('req-email'));
    return;
  }

  const original = reqBtn.textContent;
  reqBtn.disabled = true;
  reqBtn.textContent = 'Sending…';

  submitForm({
    _subject: 'Portfolio — Access request from ' + name,
    name: name,
    email: email,
    purpose: msg,
    form: 'Request Access'
  })
    .then(data => {
      if (data && (data.success === true || data.success === 'true')) {
        document.querySelector('#tab-request .inp-grp:first-of-type').style.display = 'none';
        document.querySelector('#tab-request .inp-grp:nth-of-type(2)').style.display = 'none';
        document.querySelector('#tab-request .inp-grp:nth-of-type(3)').style.display = 'none';
        reqBtn.style.display = 'none';
        successMsg.classList.remove('hidden');
      } else {
        throw new Error('send failed');
      }
    })
    .catch(() => {
      reqBtn.disabled = false;
      reqBtn.textContent = original;
      showToast('Could not send right now — email Pradeepsgr1747@gmail.com directly.');
    });
});

// ===== OPEN DOOR ANIMATION =====
function openDoor(name) {
  doorFrame.classList.add('open');
  if (name) visitorName.textContent = name;

  // Doors open slowly (2.5s). We wait another 2 seconds for impact.
  setTimeout(() => {
    reception.classList.add('scene-exit');
  }, 4500);

  // Switch to dashboard after the reception scene finishes fading out (1.5s transition)
  setTimeout(() => {
    reception.classList.add('hidden');
    dashboard.classList.remove('hidden');
    animateSkillBars();
  }, 6000);
}

// ===== EXIT DASHBOARD → back to reception =====
exitDashboard.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  reception.classList.remove('hidden');
  reception.classList.remove('scene-exit');
  doorFrame.classList.remove('open');
  document.getElementById('username').value = '';
  document.getElementById('passcode').value = '';
});

// ===== SIDEBAR NAVIGATION =====
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    switchSection(item.dataset.section);
  });
});

function switchSection(section) {
  navItems.forEach(i => i.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + section)?.classList.add('active');
  if (section === 'skills') animateSkillBars();
}

// ===== SKILL BARS =====
function animateSkillBars() {
  document.querySelectorAll('.sk-fill').forEach(bar => {
    const pct = bar.dataset.pct || 0;
    bar.style.width = pct + '%';
  });
}

// ===== CONTACT FORM =====
if (sendContact) {
  sendContact.addEventListener('click', () => {
    const name  = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const msg   = document.getElementById('c-msg').value.trim();
    if (!name || !email || !msg) {
      showToast('Please fill in all fields!');
      return;
    }

    const original = sendContact.textContent;
    sendContact.disabled = true;
    sendContact.textContent = 'Sending…';

    submitForm({
      _subject: 'Portfolio — Message from ' + name,
      name: name,
      email: email,
      message: msg,
      form: 'Contact'
    })
      .then(data => {
        if (data && (data.success === true || data.success === 'true')) {
          showToast('Message sent! ✅ I\'ll get back to you soon.', 'success');
          document.getElementById('c-name').value = '';
          document.getElementById('c-email').value = '';
          document.getElementById('c-msg').value = '';
        } else {
          throw new Error('send failed');
        }
      })
      .catch(() => {
        showToast('Could not send right now — email Pradeepsgr1747@gmail.com directly.');
      })
      .finally(() => {
        sendContact.disabled = false;
        sendContact.textContent = original;
      });
  });
}

// ===== SHAKE ANIMATION =====
function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  el.style.borderColor = '#f87171';
  setTimeout(() => (el.style.borderColor = ''), 800);
}

// ===== TOAST =====
function showToast(msg, type = 'error') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = [
      'position:fixed','bottom:24px','left:50%','transform:translateX(-50%) translateY(80px)',
      'background:#FEFBF6','border:1px solid rgba(176, 141, 87, 0.4)',
      'color:#2D2424','padding:12px 24px','border-radius:10px',
      'font-size:0.9rem','z-index:9999','transition:transform .3s ease',
      'box-shadow:0 10px 40px rgba(0,0,0,0.1)'
    ].join(';');
    document.body.appendChild(toast);
  }
  if (type === 'success') toast.style.borderColor = 'rgba(52,211,153,0.5)';
  else toast.style.borderColor = 'rgba(248,113,113,0.5)';
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; }, 3000);
}

// ===== CSS SHAKE KEYFRAME inject =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-5px)}
  80%{transform:translateX(5px)}
}
.shake { animation:shake 0.5s ease; }
`;
document.head.appendChild(shakeStyle);
