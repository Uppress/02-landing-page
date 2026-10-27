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
  const nameInput = document.querySelector("#full-name");
  const emailInput = document.querySelector("#email");
  const planSelect = document.querySelector("#plan");
  const termsCheckbox = document.querySelector("#terms");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll("[data-plan]").forEach((planLink) => {
    planLink.addEventListener("click", () => {
      if (planSelect) planSelect.value = planLink.dataset.plan;
    });
  });

  if (!signupForm || !formMessage || !nameInput || !emailInput || !planSelect || !termsCheckbox) return;

  const fields = [
    {
      input: nameInput,
      error: document.querySelector("#full-name-error"),
      validate: () => nameInput.value.trim().length >= 2,
      message: "Please enter a name with at least 2 characters."
    },
    {
      input: emailInput,
      error: document.querySelector("#email-error"),
      validate: () => emailPattern.test(emailInput.value.trim()),
      message: "Please enter a valid email address."
    },
    {
      input: planSelect,
      error: document.querySelector("#plan-error"),
      validate: () => planSelect.value !== "",
      message: "Please choose a plan or project type."
    },
    {
      input: termsCheckbox,
      error: document.querySelector("#terms-error"),
      validate: () => termsCheckbox.checked,
      message: "Please accept the terms before continuing."
    }
  ];

  const validateField = (field) => {
    const isValid = field.validate();
    field.input.setAttribute("aria-invalid", String(!isValid));
    if (field.error) field.error.textContent = isValid ? "" : field.message;
    return isValid;
  };

  fields.forEach((field) => {
    const eventName = field.input === termsCheckbox || field.input === planSelect ? "change" : "input";
    field.input.addEventListener(eventName, () => {
      validateField(field);
      formMessage.textContent = "";
      formMessage.classList.remove("error");
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "";
    formMessage.classList.remove("error");

    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) {
      const firstInvalidField = fields.find((field) => !field.validate());
      firstInvalidField?.input.focus();
      return;
    }

    const formData = new FormData(signupForm);
    const name = formData.get("fullName").toString().trim();
    const email = formData.get("email").toString().trim();
    const plan = formData.get("plan").toString();
    let signups;

    try {
      const savedSignups = localStorage.getItem("signups");
      signups = savedSignups ? JSON.parse(savedSignups) : [];
      if (!Array.isArray(signups)) {
        throw new TypeError('Stored "signups" data must be an array.');
      }
    } catch (error) {
      console.error("Could not read signups from localStorage.", error);
      formMessage.textContent = "We couldn’t access saved signups. Please check your browser storage settings and try again.";
      formMessage.classList.add("error");
      return;
    }

    const alreadySignedUp = signups.some(
      (signup) => signup && typeof signup.email === "string" && signup.email.toLowerCase() === email.toLowerCase()
    );
    if (alreadySignedUp) {
      formMessage.textContent = "You've already signed up";
      formMessage.classList.add("error");
      return;
    }

    signups.push({ name, email, plan, createdAt: new Date().toISOString() });
    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch (error) {
      console.error("Could not save signup to localStorage.", error);
      formMessage.textContent = "We couldn’t save your signup in this browser. Please check your storage settings and try again.";
      formMessage.classList.add("error");
      return;
    }

    signupForm.reset();
    fields.forEach((field) => {
      field.input.removeAttribute("aria-invalid");
      if (field.error) field.error.textContent = "";
    });
    formMessage.textContent = `Thanks, ${name}! Your signup has been saved.`;
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
