/* Shared interactions: drawer, FAQ, forms, footer year, active nav
   EDIT: replace placeholder phone / WhatsApp / maps links with real clinic links.
*/
const SITE = {
  phoneDisplay: "+91 98220 12345",       // EDIT: clinic phone
  phoneHref: "tel:+919822012345",         // EDIT
  whatsapp: "https://wa.me/919822012345?text=Hello%20Aarogya%20Family%20Clinic%2C%20I%20would%20like%20to%20enquire%20about%20an%20appointment.", // EDIT or remove
  mapsUrl: "https://maps.google.com/?q=Baner+Road+Pune", // EDIT: real location
};

document.addEventListener("DOMContentLoaded", () => {
  // Year
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Wire call / whatsapp / maps links marked with data attributes
  document.querySelectorAll("[data-phone-href]").forEach(a => a.href = SITE.phoneHref);
  document.querySelectorAll("[data-phone-text]").forEach(el => el.textContent = SITE.phoneDisplay);
  document.querySelectorAll("[data-whatsapp]").forEach(a => a.href = SITE.whatsapp);
  document.querySelectorAll("[data-maps]").forEach(a => a.href = SITE.mapsUrl);

  // Active nav
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a, .drawer-panel a.dlink").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("active");
  });

  // Drawer
  const drawer = document.getElementById("drawer");
  document.getElementById("menuBtn")?.addEventListener("click", () => drawer?.classList.add("open"));
  document.getElementById("drawerClose")?.addEventListener("click", () => drawer?.classList.remove("open"));
  drawer?.querySelector(".drawer-scrim")?.addEventListener("click", () => drawer?.classList.remove("open"));

  // FAQ accordion (accessible)
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-q");
    btn?.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(o => {
        o.classList.remove("open");
        o.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Generic front-end validation + demo success state (no backend connected)
  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach(input => {
        const field = input.closest(".field");
        let bad = false;
        if (input.type === "checkbox") bad = !input.checked;
        else if (input.type === "tel") bad = !/^[+\d][\d\s-]{6,15}$/.test(input.value.trim());
        else if (input.type === "email" && input.value.trim() !== "") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        else bad = input.value.trim() === "";
        field?.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      const status = form.parentElement?.querySelector(".form-status") || form.querySelector(".form-status");
      if (!valid) {
        if (status) {
          status.className = "form-status errorbox";
          status.textContent = "Please check the highlighted fields and try again.";
        }
        return;
      }
      if (status) {
        status.className = "form-status success";
        status.textContent = form.dataset.success || "Thank you. Your enquiry has been noted for demonstration. Connect a backend or WhatsApp integration to receive real enquiries.";
      }
      form.reset();
    });
    form.querySelectorAll("input,select,textarea").forEach(i =>
      i.addEventListener("input", () => i.closest(".field")?.classList.remove("invalid"))
    );
  });
});
