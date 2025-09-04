// Config placeholders (replace)
const CONFIG = {
  calendlyUrl: "YOUR_CALENDLY_URL",
  stripe: {
    firstHour: "STRIPE_LINK_FIRST_HOUR",
    consult: "STRIPE_LINK_CONSULT_20"
  },
  coinbaseCheckout: "COINBASE_CHECKOUT_URL",
  formspreeEndpoint: "https://formspree.io/f/FORM_ENDPOINT",
  wallets: { btc: "YOUR_BTC_ADDRESS", eth: "YOUR_ETH_ADDRESS" }
};

// Inject dynamic bits / sanity checks
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll(".calendly-inline-widget").forEach(el=>{
  if (CONFIG.calendlyUrl && CONFIG.calendlyUrl.startsWith("http")) {
    el.setAttribute("data-url", CONFIG.calendlyUrl);
  }
});

// IntersectionObserver for reveal animations
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("revealed"); io.unobserve(e.target); }
  });
},{ threshold: 0.1 });
document.querySelectorAll(".fade-in-up").forEach(el=>io.observe(el));

// Copy buttons for wallet addresses
document.querySelectorAll(".copy-btn").forEach(btn=>{
  btn.addEventListener("click", async ()=>{
    const txt = btn.dataset.copy || "";
    try { await navigator.clipboard.writeText(txt); btn.textContent="Copied"; setTimeout(()=>btn.textContent="Copy",1200); }
    catch { alert("Copy failed. Long-press to copy."); }
  });
});

// “Other payment method” mini form -> Formspree
document.getElementById("otherPaymentForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const data = new FormData(e.target);
  data.append("_subject","Other Payment Method (VersaCraft)");
  data.append("source","payments-modal");
  const res = await fetch(CONFIG.formspreeEndpoint,{ method:"POST", body:data });
  if(res.ok){ e.target.reset(); alert("Thanks! I’ll reply shortly."); }
  else { alert("Could not send right now. Please email help@versacraft.solutions"); }
  const modal = bootstrap.Modal.getInstance(document.getElementById("otherModal"));
  modal.hide();
});

// ===== ConsciousCraft schedule widget =====
// Apps Script Web App URL (replace with your deployed script URL)
const APP_URL = "<<PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE>>";

function ccISO(d) { return d.toISOString().slice(0,10); }

async function fetchSlots(start, end) {
  const url = `${APP_URL}?action=slots&start=${start}&end=${end}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to load slots');
  return res.json();
}

function renderSlots(data) {
  const wrap = document.getElementById('cc-slots');
  const empty = document.getElementById('cc-empty');
  wrap.innerHTML = '';
  if (!data.slots || !data.slots.length) {
    empty.classList.remove('d-none');
    return;
  }
  empty.classList.add('d-none');

  data.slots.forEach(s => {
    const col = document.createElement('div');
    col.className = 'col';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-secondary w-100';
    btn.textContent = s.label;
    btn.onclick = () => {
      document.getElementById('cc-selected').value = s.label;
      document.getElementById('cc-selected').dataset.start = s.startISO;
    };

    col.appendChild(btn);
    wrap.appendChild(col);
  });
}

async function refreshSlots() {
  const start = document.getElementById('cc-date-start').value;
  const end   = document.getElementById('cc-date-end').value;
  if (!start || !end) return;
  const status = document.getElementById('cc-status');
  status.textContent = 'Loading availability...';
  try {
    const data = await fetchSlots(start, end);
    renderSlots(data);
    status.textContent = '';
  } catch(e) {
    status.textContent = 'Could not load availability.';
  }
}

async function bookSelected(e) {
  e.preventDefault();
  const startISO = document.getElementById('cc-selected').dataset.start;
  const name     = document.getElementById('cc-name').value.trim();
  const email    = document.getElementById('cc-email').value.trim();
  const duration = parseInt(document.getElementById('cc-duration').value, 10);
  const status   = document.getElementById('cc-status');

  if (!startISO) { status.textContent = 'Pick a slot first.'; return; }

  status.textContent = 'Booking...';
  try {
    const res = await fetch(APP_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'book', name, email, startISO, durationMins: duration })
    });
    const data = await res.json();
    if (data.ok) {
      status.textContent = 'Booked! Check your email for the invite.';
      setTimeout(refreshSlots, 800);
    } else {
      status.textContent = data.error || 'Could not book the slot.';
    }
  } catch (err) {
    status.textContent = 'Booking failed.';
  }
}

function initScheduler() {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  document.getElementById('cc-date-start').value = ccISO(today);
  document.getElementById('cc-date-end').value   = ccISO(endDate);

  document.getElementById('cc-refresh').addEventListener('click', refreshSlots);
  document.getElementById('cc-book-form').addEventListener('submit', bookSelected);
  refreshSlots();
}

document.addEventListener('DOMContentLoaded', initScheduler);
