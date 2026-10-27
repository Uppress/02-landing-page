/**
 * Initializes the responsive navigation menu.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (!menuToggle || !primaryNav) return;

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
};

/**
 * Initializes the single-open, height-animated FAQ accordion.
 */
const initAccordion = () => {
  const closePanel = (button, panel) => {
    button.setAttribute("aria-expanded", "false");
    panel.style.height = `${panel.scrollHeight}px`;
    panel.offsetHeight;
    requestAnimationFrame(() => {
      if (button.getAttribute("aria-expanded") === "false") {
        panel.style.height = "0px";
      }
    });
  };

  const openPanel = (button, panel) => {
    button.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.style.height = "0px";
    requestAnimationFrame(() => {
      if (button.getAttribute("aria-expanded") === "true") {
        panel.style.height = `${panel.scrollHeight}px`;
      }
    });
  };

  document.querySelectorAll(".faq-question").forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    panel.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "height") return;
      if (button.getAttribute("aria-expanded") === "true") {
        panel.style.height = "auto";
      } else {
        panel.hidden = true;
      }
    });

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question[aria-expanded='true']").forEach((openButton) => {
        if (openButton === button) return;
        const openPanelId = openButton.getAttribute("aria-controls");
        const openPanelElement = openPanelId ? document.getElementById(openPanelId) : null;
        if (openPanelElement) closePanel(openButton, openPanelElement);
      });

      if (isExpanded) {
        closePanel(button, panel);
      } else {
        openPanel(button, panel);
      }
    });
  });
};

/**
 * Initializes the monthly/yearly pricing switch and savings label.
 */
const initPricingToggle = () => {
  const billingToggle = document.querySelector("#billing-toggle");
  const monthlyLabel = document.querySelector("#monthly-label");
  const yearlyLabel = document.querySelector("#yearly-label");
  const savingsLabel = document.querySelector("#yearly-savings");

  if (!billingToggle) return;

  const updatePricing = () => {
    const isYearly = billingToggle.checked;
    const billingPeriod = isYearly ? "yearly" : "monthly";

    document.querySelectorAll(".price-value").forEach((price) => {
      const amount = price.dataset[billingPeriod];
      if (amount) price.textContent = `$${amount}`;
    });
    document.querySelectorAll(".billing-detail").forEach((detail) => {
      detail.textContent = isYearly ? "Billed yearly" : "Billed monthly";
    });

    billingToggle.setAttribute("aria-label", isYearly ? "Switch to monthly pricing" : "Switch to yearly pricing");
    monthlyLabel?.classList.toggle("active", !isYearly);
    yearlyLabel?.classList.toggle("active", isYearly);
    if (savingsLabel) savingsLabel.hidden = !isYearly;
  };

  billingToggle.addEventListener("change", updatePricing);
  updatePricing();
};

/**
 * Adds a shadow to the sticky header once the page has scrolled.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeaderShadow = () => {
    header.classList.toggle("has-shadow", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Initializes the signup form and its plan shortcuts.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  document.querySelectorAll("[data-plan]").forEach((planLink) => {
    planLink.addEventListener("click", () => {
      const planSelect = document.querySelector("#plan");
      if (planSelect) planSelect.value = planLink.dataset.plan;
    });
  });

  if (!signupForm || !formMessage) return;

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.classList.remove("error");

    if (!signupForm.reportValidity()) {
      formMessage.textContent = "Please complete each field and accept the terms to continue.";
      formMessage.classList.add("error");
      return;
    }

    const formData = new FormData(signupForm);
    const name = formData.get("fullName")?.toString().trim() ?? "";
    formMessage.textContent = `Thanks, ${name}! Your project note is ready. Please email hello@uniqueprintingpress.com to send it to our studio.`;
    signupForm.reset();
  });
};

/**
 * Updates the copyright year and starts each page interaction.
 */
const init = () => {
  const currentYear = document.querySelector("#current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initSignupForm();
};

document.addEventListener("DOMContentLoaded", init);
