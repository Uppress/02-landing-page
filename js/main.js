const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    });
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));

    button.setAttribute("aria-expanded", String(!isExpanded));
    if (answer) answer.hidden = isExpanded;
  });
});

const billingToggle = document.querySelector("#billing-toggle");
const monthlyLabel = document.querySelector("#monthly-label");
const yearlyLabel = document.querySelector("#yearly-label");

if (billingToggle) {
  billingToggle.addEventListener("change", () => {
    const billingPeriod = billingToggle.checked ? "yearly" : "monthly";

    document.querySelectorAll(".price-value").forEach((price) => {
      price.textContent = `$${price.dataset[billingPeriod]}`;
    });
    document.querySelectorAll(".billing-detail").forEach((detail) => {
      detail.textContent = billingToggle.checked ? "Billed yearly" : "Billed monthly";
    });
    billingToggle.setAttribute("aria-label", billingToggle.checked ? "Switch to monthly pricing" : "Switch to yearly pricing");
    monthlyLabel?.classList.toggle("active", !billingToggle.checked);
    yearlyLabel?.classList.toggle("active", billingToggle.checked);
  });
}

document.querySelectorAll("[data-plan]").forEach((planLink) => {
  planLink.addEventListener("click", () => {
    const planSelect = document.querySelector("#plan");
    if (planSelect) planSelect.value = planLink.dataset.plan;
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.classList.remove("error");

    if (!signupForm.reportValidity()) {
      formMessage.textContent = "Please complete each field and accept the terms to continue.";
      formMessage.classList.add("error");
      return;
    }

    const name = new FormData(signupForm).get("fullName").toString().trim();
    formMessage.textContent = `Thanks, ${name}! Your project note is ready. Please email hello@uniqueprintingpress.com to send it to our studio.`;
    signupForm.reset();
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
