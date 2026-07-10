(() => {
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const nav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -40px" });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  const showcase = document.querySelector(".hero-showcase");
  if (showcase && window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showcase.addEventListener("pointermove", (event) => {
      const box = showcase.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      showcase.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
    });
    showcase.addEventListener("pointerleave", () => {
      showcase.style.transform = "translate3d(0,0,0)";
    });
  }

  const contactForm = document.querySelector(".js-contact-form");
  if (contactForm) {
    const status = contactForm.querySelector(".form-status");
    const submitButton = contactForm.querySelector(".contact-submit");

    const showStatus = (type, message) => {
      status.textContent = message;
      status.classList.remove("is-success", "is-error");
      status.classList.add(type === "success" ? "is-success" : "is-error");
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      contactForm.classList.add("is-sending");
      submitButton.disabled = true;
      status.textContent = "";
      status.classList.remove("is-success", "is-error");

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Formspree rejected the request");
        contactForm.reset();
        showStatus("success", "Gracias. Recibimos tu mensaje y te contactaremos muy pronto.");
      } catch (error) {
        showStatus("error", "No pudimos enviar el mensaje. Escríbenos por WhatsApp y te atendemos directamente.");
      } finally {
        contactForm.classList.remove("is-sending");
        submitButton.disabled = false;
      }
    });
  }

  const chatbot = document.getElementById("atexChatbot");
  if (chatbot) {
    const toggle = chatbot.querySelector(".chatbot-toggle");
    const close = chatbot.querySelector(".chatbot-close");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");
    const messages = document.getElementById("chatbotMessages");
    const quickButtons = chatbot.querySelectorAll(".quick-question");
    const whatsappUrl = "https://wa.me/525574370673?text=Hola%20ATEX%20IT%2C%20quiero%20una%20asesor%C3%ADa%20para%20mi%20proyecto.";

    const knowledge = [
      {
        keys: ["servicio", "servicios", "ofrecen", "hacen"],
        text: "Creamos sitios web, ecommerce, sistemas a la medida, APIs, automatización, soluciones cloud y asistentes con IA."
      },
      {
        keys: ["precio", "costo", "cuesta", "web", "pagina", "página"],
        text: "El costo depende del alcance. Una landing es distinta a un ecommerce o sistema interno. Podemos revisar tu objetivo y darte una cotización clara, sin compromiso."
      },
      {
        keys: ["tiempo", "tardan", "entrega", "duracion", "duración"],
        text: "Una landing puede resolverse en pocos días. Un sitio corporativo, ecommerce o sistema requiere más tiempo según contenido, integraciones y alcance."
      },
      {
        keys: ["cotizar", "cotizacion", "cotización", "contacto", "whatsapp", "asesoria", "asesoría"],
        text: "Cuéntanos brevemente qué necesitas y revisamos tu proyecto contigo.",
        cta: true
      }
    ];

    const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const addMessage = (text, type = "bot", cta = false) => {
      const bubble = document.createElement("div");
      bubble.className = type === "user" ? "user-message" : "bot-message";
      bubble.textContent = text;

      if (cta) {
        const link = document.createElement("a");
        link.className = "chatbot-whatsapp";
        link.href = whatsappUrl;
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Hablar por WhatsApp';
        bubble.appendChild(link);
      }

      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    };

    const answerFor = (question) => {
      const clean = normalize(question);
      return knowledge.find((item) => item.keys.some((key) => clean.includes(normalize(key)))) || {
        text: "Puedo orientarte sobre servicios, costos, tiempos o cotizaciones. Para una respuesta precisa, cuéntanos tu idea por WhatsApp.",
        cta: true
      };
    };

    const sendQuestion = (question) => {
      const clean = question.trim();
      if (!clean) return;
      addMessage(clean, "user");
      input.value = "";
      window.setTimeout(() => {
        const answer = answerFor(clean);
        addMessage(answer.text, "bot", Boolean(answer.cta));
      }, 260);
    };

    const setChat = (open) => {
      chatbot.classList.toggle("is-open", open);
      if (open) window.setTimeout(() => input.focus(), 160);
    };

    toggle?.addEventListener("click", () => setChat(!chatbot.classList.contains("is-open")));
    close?.addEventListener("click", () => setChat(false));
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      sendQuestion(input.value);
    });
    quickButtons.forEach((button) => button.addEventListener("click", () => sendQuestion(button.textContent || "")));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setChat(false);
    });
  }
})();
