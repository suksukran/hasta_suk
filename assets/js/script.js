
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. SELECTOR
    // =====================================

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const nav = $("#navMenu");
    const navLinks = $$(".nav-link");
    const themeToggle = $("#themeToggle");


    // =====================================
    // 2. NAVIGASI AKTIF
    // =====================================

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    // Mengubah menu aktif ketika halaman digulir

    const sections = $$("main section[id]");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${currentId}`
                        );

                    });

                }

            });

        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

    }


    // =====================================
    // 3. DARK / LIGHT MODE
    // =====================================

    themeToggle?.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

        const icon = $("#themeToggle i");

        if (icon) {

            icon.className = document.body.classList.contains("light-theme")
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";

        }

    });


    // =====================================
    // 4. PORTFOLIO TABS
    // =====================================

    const tabs = $$(".tab");
    const panels = $$(".tab-panel");

    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            const targetId = tab.dataset.tab;

            tabs.forEach((item) => {

                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");

            });

            panels.forEach((panel) => {
                panel.classList.remove("active");
            });

            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            $(`#${targetId}`)?.classList.add("active");

        });

    });


    // =====================================
    // 5. ID CARD DRAG INTERACTION
    // =====================================

    const stage = $("#idCardStage");
    const card = $("#draggableIdCard");
    const rig = $("#lanyardRig");

    if (stage && card && rig) {

        let down = false;
        let pointerId = null;

        let startX = 0;
        let startY = 0;

        let originX = 0;
        let originY = 0;

        let x = 0;
        let y = 0;

        let velocityX = 0;
        let velocityY = 0;

        let rotation = 0;
        let animationFrame = 0;

        const clamp = (value, min, max) => {
            return Math.max(min, Math.min(max, value));
        };


        // Mengatur posisi kartu dan tali

        const paint = () => {

            card.style.transform =
                `translate3d(calc(-50% + ${x}px), ${y}px, 0) rotate(${rotation * .72}deg)`;

            rig.style.transform =
                `translateX(-50%) rotate(${rotation}deg)`;

        };


        // Animasi kartu kembali ke posisi semula

        const settle = () => {

            if (down) return;

            velocityX += -x * .018;
            velocityY += -y * .018;

            velocityX *= .91;
            velocityY *= .91;

            x += velocityX;
            y += velocityY;

            rotation += -rotation * .085;

            if (
                Math.abs(x) < .15 &&
                Math.abs(y) < .15 &&
                Math.abs(rotation) < .15 &&
                Math.abs(velocityX) < .15 &&
                Math.abs(velocityY) < .15
            ) {

                x = 0;
                y = 0;
                rotation = 0;

                velocityX = 0;
                velocityY = 0;

                paint();

                animationFrame = 0;

                return;

            }

            paint();

            animationFrame = requestAnimationFrame(settle);

        };


        // Mulai menarik kartu

        card.addEventListener("pointerdown", (event) => {

            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }

            down = true;
            pointerId = event.pointerId;

            stage.classList.add("is-dragging");

            card.setPointerCapture(event.pointerId);

            startX = event.clientX;
            startY = event.clientY;

            originX = x;
            originY = y;

            velocityX = 0;
            velocityY = 0;

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = 0;

            event.preventDefault();

        });


        // Gerakan kartu

        card.addEventListener("pointermove", (event) => {

            if (!down || event.pointerId !== pointerId) {
                return;
            }

            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;

            const previousX = x;
            const previousY = y;

            x = clamp(originX + deltaX, -125, 125);
            y = clamp(originY + deltaY, -25, 115);

            rotation = clamp(
                x * .19 + deltaX * .025,
                -28,
                28
            );

            velocityX = x - previousX;
            velocityY = y - previousY;

            paint();

            event.preventDefault();

        });


        // Melepaskan kartu

        const release = (event) => {

            if (!down || (event && event.pointerId !== pointerId)) {
                return;
            }

            down = false;
            pointerId = null;

            stage.classList.remove("is-dragging");

            velocityX += clamp(velocityX * .28, -8, 8);
            velocityY += clamp(velocityY * .18, -5, 5);

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(settle);
            }

        };

        card.addEventListener("pointerup", release);
        card.addEventListener("pointercancel", release);
        card.addEventListener("lostpointercapture", release);


        // Interaksi menggunakan keyboard

        card.addEventListener("keydown", (event) => {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                x = x ? 0 : 48;
                y = y ? 0 : 22;
                rotation = rotation ? 0 : 9;

                paint();

                if (!animationFrame) {
                    animationFrame = requestAnimationFrame(settle);
                }

            }

        });

    }


    // =====================================
    // 6. REVEAL ANIMATION
    // =====================================

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: .12
        });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    // =====================================
    // 7. ANIMASI COUNTER
    // =====================================

    const counters = $$("[data-count]");

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const element = entry.target;
                const target = Number(element.dataset.count);

                let current = 0;

                const interval = setInterval(() => {

                    current = Math.min(
                        target,
                        current + Math.max(1, Math.ceil(target / 35))
                    );

                    element.textContent = current;

                    if (current >= target) {
                        clearInterval(interval);
                    }

                }, 35);

                observer.unobserve(element);

            });

        }, {
            threshold: .5
        });

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });

    }


    // =====================================
    // 8. FORM KONTAK WHATSAPP
    // =====================================

    const contactForm = $("#contactForm");

    contactForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = $("#contactName").value.trim();
        const email = $("#contactEmail").value.trim();
        const message = $("#contactMessage").value.trim();

        // Nomor WhatsApp Hasta
        const phone = "6281239911479";

        if (!name || !email || !message) {
            return;
        }

        const body =
            `Halo Hasta, saya ${name} (${email}).\n\n${message}`;

        const whatsappURL =
            `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });


    // =====================================
    // 9. FORM KOMENTAR
    // =====================================

    const commentForm = $("#commentForm");
    const commentList = $("#commentList");
    const commentCount = $("#commentCount");


    // Menghitung jumlah komentar

    const updateCommentCount = () => {

        if (commentCount && commentList) {

            commentCount.textContent =
                `(${String(commentList.children.length).padStart(2, "0")})`;

        }

    };


    // Mengirim komentar

    commentForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = $("#commentName").value.trim();
        const message = $("#commentText").value.trim();

        if (!name || !message || !commentList) {
            return;
        }

        const item = document.createElement("div");
        item.className = "comment-item";

        const avatar = document.createElement("div");
        avatar.className = "comment-avatar";
        avatar.textContent = name.charAt(0).toUpperCase();

        const content = document.createElement("div");

        const author = document.createElement("strong");
        author.textContent = name;

        const text = document.createElement("p");
        text.textContent = message;

        content.append(author, text);
        item.append(avatar, content);

        commentList.append(item);

        commentForm.reset();

        updateCommentCount();

    });


    // =====================================
    // 10. FOOTER TAHUN OTOMATIS
    // =====================================

    const year = $("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    // =====================================
    // 11. JUMLAH KOMENTAR AWAL
    // =====================================

    updateCommentCount();

});
