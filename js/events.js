/* ATEX IT — events.js
   Sin dependencias. Nav móvil, header al hacer scroll,
   animaciones de aparición y envío del formulario. */

(function () {
    "use strict";

    /* ---------- Header: sombra al hacer scroll ---------- */
    var header = document.querySelector(".site-header");
    window.addEventListener("scroll", function () {
        header.classList.toggle("scrolled", window.scrollY > 24);
    }, { passive: true });

    /* ---------- Menú móvil ---------- */
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");

    toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ---------- Animaciones de aparición ---------- */
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && "IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".reveal").forEach(function (el) {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("visible");
        });
    }

    /* ---------- Parallax sutil en la tarjeta del hero ---------- */
    var proof = document.getElementById("heroProof");
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    if (proof && finePointer && !reduceMotion) {
        var frame = proof.querySelector(".browser-frame");

        proof.addEventListener("pointermove", function (e) {
            var box = proof.getBoundingClientRect();
            var x = (e.clientX - box.left) / box.width - 0.5;
            var y = (e.clientY - box.top) / box.height - 0.5;
            frame.style.transform =
                "rotateX(" + (y * -3) + "deg) rotateY(" + (x * 4) + "deg)";
        });

        proof.addEventListener("pointerleave", function () {
            frame.style.transform = "";
        });
    }

    /* ---------- Formulario de contacto (Formspree) ---------- */
    var form = document.querySelector(".js-contact-form");
    if (!form) return;

    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        form.classList.add("sending");
        status.textContent = "";
        status.className = "form-status";

        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" }
        })
            .then(function (res) {
                if (res.ok) {
                    form.reset();
                    status.textContent = "Mensaje enviado. Te contactamos muy pronto.";
                    status.classList.add("ok");
                } else {
                    throw new Error("Respuesta no válida");
                }
            })
            .catch(function () {
                status.textContent =
                    "No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.";
                status.classList.add("error");
            })
            .finally(function () {
                form.classList.remove("sending");
            });
    });
})();
