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
