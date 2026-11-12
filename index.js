
/* ==========================================================
   STACKLY SMART STORAGE SOLUTIONS
   COMPLETE PROFESSIONAL JAVASCRIPT
   Navigation + Video Slider + Contact Form
========================================================== */

(() => {

    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ======================================================
           01. GLOBAL ELEMENTS
        ====================================================== */

        const body = document.body;

        const storageLoader = document.getElementById("storageLoader");
        const storageHeader = document.getElementById("storageHeader");

        const storageMenuToggle = document.getElementById("storageMenuToggle");
        const storageMenuClose = document.getElementById("storageMenuClose");
        const storageNavigation = document.getElementById("storageNavigation");
        const storageOverlay = document.getElementById("storageOverlay");

        const storageNavLinks = storageNavigation
            ? storageNavigation.querySelectorAll(
                ".stackly-storage-nav-link, .stackly-storage-mobile-login"
            )
            : [];

        const storageHero = document.getElementById("storageHero");

        const storageSlides = Array.from(
            document.querySelectorAll(".stackly-storage-slide")
        );

        const storageVideos = Array.from(
            document.querySelectorAll(".stackly-storage-video")
        );

        const storageIndicators = Array.from(
            document.querySelectorAll(".stackly-storage-indicator")
        );

        const storageCurrentSlide = document.getElementById(
            "storageCurrentSlide"
        );

        const storagePrev = document.getElementById("storagePrev");
        const storageNext = document.getElementById("storageNext");


        /* ======================================================
           02. CONFIGURATION
        ====================================================== */

        const CONFIG = {
            mobileBreakpoint: 850,
            slideDuration: 7000,
            headerScrollPoint: 50,
            swipeThreshold: 55
        };

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


        /* ======================================================
           03. GLOBAL STATES
        ====================================================== */

        let currentSlide = 0;
        let slideTimer = null;

        let isMenuOpen = false;
        let isPageVisible = !document.hidden;
        let isHoveringHero = false;

        let touchStartX = 0;
        let loaderHidden = false;


        /* ======================================================
           04. PAGE LOADER
        ====================================================== */

        function hideStorageLoader() {

            if (loaderHidden || !storageLoader) return;

            loaderHidden = true;

            storageLoader.classList.add("hidden");

            window.setTimeout(() => {
                storageLoader.style.display = "none";
            }, 700);

        }

        window.addEventListener("load", hideStorageLoader);

        window.setTimeout(hideStorageLoader, 2500);


        /* ======================================================
           05. AOS INITIALIZATION
        ====================================================== */

        if (typeof AOS !== "undefined") {

            AOS.init({
                duration: 900,
                once: true,
                offset: 70,
                easing: "ease-out-cubic",
                disable: prefersReducedMotion
            });

            window.addEventListener("load", () => {
                AOS.refresh();
            });

        }


        /* ======================================================
           06. NAVIGATION LETTER ANIMATION
        ====================================================== */

        storageNavLinks.forEach(link => {

            if (
                link.classList.contains(
                    "stackly-storage-mobile-login"
                )
            ) {
                return;
            }

            // Prevent wrapping the same link more than once.
            if (link.dataset.lettersAnimated === "true") {
                return;
            }

            const originalText = link.textContent.trim();

            link.innerHTML = "";

            [...originalText].forEach((letter, index) => {

                const span = document.createElement("span");

                span.className = "storage-nav-letter";

                span.textContent = letter === " "
                    ? "\u00A0"
                    : letter;

                span.style.setProperty(
                    "--letter-index",
                    index
                );

                link.appendChild(span);

            });

            link.dataset.lettersAnimated = "true";

        });


        /* ======================================================
           07. MOBILE MENU ACCESSIBILITY
        ====================================================== */

        function updateMenuAccessibility(open) {

            if (storageMenuToggle) {

                storageMenuToggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );

                storageMenuToggle.setAttribute(
                    "aria-label",
                    open
                        ? "Close navigation menu"
                        : "Open navigation menu"
                );

            }

            if (storageNavigation) {

                storageNavigation.setAttribute(
                    "aria-hidden",
                    window.innerWidth <= CONFIG.mobileBreakpoint
                        ? String(!open)
                        : "false"
                );

            }

            if (storageOverlay) {

                storageOverlay.setAttribute(
                    "aria-hidden",
                    String(!open)
                );

            }

            if (storageMenuClose) {

                storageMenuClose.setAttribute(
                    "aria-hidden",
                    String(!open)
                );

                storageMenuClose.setAttribute(
                    "tabindex",
                    open ? "0" : "-1"
                );

            }

        }


        /* ======================================================
           08. SLIDER TIMER HELPERS
        ====================================================== */

        function stopStorageSlider() {

            if (slideTimer !== null) {

                window.clearTimeout(slideTimer);

                slideTimer = null;

            }

        }


        function startFallbackTimer() {

            stopStorageSlider();

            if (prefersReducedMotion) return;
            if (!isPageVisible) return;
            if (isMenuOpen) return;
            if (isHoveringHero) return;
            if (storageSlides.length < 2) return;

            slideTimer = window.setTimeout(() => {

                nextStorageSlide();

            }, CONFIG.slideDuration);

        }


        function pauseStorageSlider() {

            stopStorageSlider();

            const activeVideo = storageVideos[currentSlide];

            if (activeVideo) {
                activeVideo.pause();
            }

        }


        /* ======================================================
           09. OPEN MOBILE MENU
        ====================================================== */

        function openStorageMenu() {

            if (!storageNavigation) return;

            if (window.innerWidth > CONFIG.mobileBreakpoint) {
                return;
            }

            if (isMenuOpen) return;

            isMenuOpen = true;

            storageNavigation.classList.add("active");

            if (storageOverlay) {
                storageOverlay.classList.add("active");
            }

            if (storageMenuClose) {
                storageMenuClose.classList.add("active");
            }

            if (storageMenuToggle) {
                storageMenuToggle.classList.add("active");
            }

            body.classList.add("storage-menu-open");

            updateMenuAccessibility(true);

            pauseStorageSlider();

            window.setTimeout(() => {

                const firstLink = storageNavigation.querySelector(
                    ".stackly-storage-nav-link"
                );

                if (firstLink) {
                    firstLink.focus();
                }

            }, 150);

        }


        /* ======================================================
           10. CLOSE MOBILE MENU
        ====================================================== */

        function closeStorageMenu(returnFocus = false) {

            if (!storageNavigation) return;

            isMenuOpen = false;

            storageNavigation.classList.remove("active");

            if (storageOverlay) {
                storageOverlay.classList.remove("active");
            }

            if (storageMenuClose) {
                storageMenuClose.classList.remove("active");
            }

            if (storageMenuToggle) {
                storageMenuToggle.classList.remove("active");
            }

            body.classList.remove("storage-menu-open");

            updateMenuAccessibility(false);

            if (
                returnFocus &&
                storageMenuToggle &&
                window.innerWidth <= CONFIG.mobileBreakpoint
            ) {
                storageMenuToggle.focus();
            }

            resumeStorageSlider();

        }


        /* ======================================================
           11. MOBILE MENU EVENTS
        ====================================================== */

        if (storageMenuToggle) {

            storageMenuToggle.addEventListener("click", () => {

                if (isMenuOpen) {
                    closeStorageMenu();
                } else {
                    openStorageMenu();
                }

            });

        }

        if (storageMenuClose) {

            storageMenuClose.addEventListener("click", () => {
                closeStorageMenu(true);
            });

        }

        if (storageOverlay) {

            storageOverlay.addEventListener("click", () => {
                closeStorageMenu(true);
            });

        }

        storageNavLinks.forEach(link => {

            link.addEventListener("click", () => {

                if (window.innerWidth <= CONFIG.mobileBreakpoint) {
                    closeStorageMenu();
                }

            });

        });


        /* ======================================================
           12. KEYBOARD MENU ACCESSIBILITY
        ====================================================== */

        document.addEventListener("keydown", event => {

            if (event.key === "Escape" && isMenuOpen) {
                closeStorageMenu(true);
            }

            if (!isMenuOpen || event.key !== "Tab") {
                return;
            }

            if (!storageNavigation) return;

            const focusableElements = Array.from(
                storageNavigation.querySelectorAll(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(element => element.offsetParent !== null);

            if (!focusableElements.length) return;

            const firstElement = focusableElements[0];

            const lastElement =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                (
                    document.activeElement === firstElement ||
                    document.activeElement === storageMenuClose
                )
            ) {

                event.preventDefault();

                if (storageMenuClose) {
                    storageMenuClose.focus();
                } else {
                    lastElement.focus();
                }

            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {

                event.preventDefault();

                firstElement.focus();

            }

        });


        /* ======================================================
           13. WINDOW RESIZE
        ====================================================== */

        window.addEventListener("resize", () => {

            if (window.innerWidth > CONFIG.mobileBreakpoint) {

                closeStorageMenu();

            } else {

                updateMenuAccessibility(isMenuOpen);

            }

        });


        /* ======================================================
           14. ACTIVE NAVIGATION LINK
        ====================================================== */

        const currentPage = (
            window.location.pathname.split("/").pop() || "index.html"
        ).toLowerCase();

        storageNavLinks.forEach(link => {

            if (
                link.classList.contains(
                    "stackly-storage-mobile-login"
                )
            ) {
                return;
            }

            const linkPage = (
                link.getAttribute("href") || ""
            ).split("/").pop().toLowerCase();

            const isCurrentPage = linkPage === currentPage;

            link.classList.toggle("active", isCurrentPage);

            if (isCurrentPage) {

                link.setAttribute("aria-current", "page");

            } else {

                link.removeAttribute("aria-current");

            }

        });


        /* ======================================================
           15. STICKY HEADER
        ====================================================== */

        function updateStorageHeader() {

            if (!storageHeader) return;

            storageHeader.classList.toggle(
                "scrolled",
                window.scrollY > CONFIG.headerScrollPoint
            );

        }

        window.addEventListener(
            "scroll",
            updateStorageHeader,
            { passive: true }
        );

        updateStorageHeader();


        /* ======================================================
           16. VIDEO PLAYBACK
        ====================================================== */

        function playStorageVideo(index) {

            if (!storageVideos.length) {
                startFallbackTimer();
                return;
            }

            const activeVideo = storageVideos[index];

            // Stop all other videos.
            storageVideos.forEach((video, videoIndex) => {

                video.loop = false;
                video.autoplay = false;

                if (videoIndex !== index) {

                    video.pause();
                    video.classList.remove("active");

                }

            });

            if (!activeVideo) {
                startFallbackTimer();
                return;
            }

            activeVideo.classList.add("active");

            activeVideo.muted = true;
            activeVideo.playsInline = true;
            activeVideo.loop = false;

            stopStorageSlider();

            if (prefersReducedMotion) {

                activeVideo.pause();
                return;

            }

            if (!isPageVisible || isMenuOpen || isHoveringHero) {

                activeVideo.pause();
                return;

            }

            // Start the selected video from the beginning.
            try {

                activeVideo.currentTime = 0;

            } catch (error) {

                // Wait for video metadata if necessary.

            }

            const playPromise = activeVideo.play();

            if (
                playPromise &&
                typeof playPromise.then === "function"
            ) {

                playPromise
                    .then(() => {
                        stopStorageSlider();
                    })
                    .catch(() => {
                        startFallbackTimer();
                    });

            }

        }


        /* ======================================================
           17. VIDEO EVENTS
        ====================================================== */

        storageVideos.forEach((video, index) => {

            video.loop = false;

            video.addEventListener("ended", () => {

                if (index !== currentSlide) return;
                if (!isPageVisible || isMenuOpen) return;

                nextStorageSlide();

            });

            video.addEventListener("error", () => {

                if (index !== currentSlide) return;

                startFallbackTimer();

            });

            video.addEventListener("stalled", () => {

                if (
                    index === currentSlide &&
                    video.paused
                ) {
                    startFallbackTimer();
                }

            });

        });


        /* ======================================================
           18. SLIDE COUNTER
        ====================================================== */

        function updateStorageCounter(index) {

            if (!storageCurrentSlide) return;

            storageCurrentSlide.textContent = String(index + 1)
                .padStart(2, "0");

        }


        /* ======================================================
           19. SLIDE INDICATORS
        ====================================================== */

        function updateStorageIndicators(index) {

            storageIndicators.forEach((indicator, indicatorIndex) => {

                indicator.classList.toggle(
                    "active",
                    indicatorIndex === index
                );

                const progress = indicator.querySelector("span");

                if (progress) {

                    progress.style.animation = "none";

                    void progress.offsetWidth;

                    progress.style.animation = "";

                }

            });

        }


        /* ======================================================
           20. SHOW HERO SLIDE
        ====================================================== */

        function showStorageSlide(index) {

            if (!storageSlides.length) return;

            if (index < 0) {
                index = storageSlides.length - 1;
            }

            if (index >= storageSlides.length) {
                index = 0;
            }

            currentSlide = index;

            storageSlides.forEach((slide, slideIndex) => {

                slide.classList.toggle(
                    "active",
                    slideIndex === currentSlide
                );

            });

            updateStorageCounter(currentSlide);

            updateStorageIndicators(currentSlide);

            if (storageVideos.length) {

                playStorageVideo(currentSlide);

            } else {

                startFallbackTimer();

            }

        }


        /* ======================================================
           21. NEXT AND PREVIOUS SLIDES
        ====================================================== */

        function nextStorageSlide() {

            showStorageSlide(currentSlide + 1);

        }

        function previousStorageSlide() {

            showStorageSlide(currentSlide - 1);

        }


        /* ======================================================
           22. SLIDER ARROW EVENTS
        ====================================================== */

        if (storageNext) {

            storageNext.addEventListener("click", () => {
                nextStorageSlide();
            });

        }

        if (storagePrev) {

            storagePrev.addEventListener("click", () => {
                previousStorageSlide();
            });

        }


        /* ======================================================
           23. SLIDER INDICATOR EVENTS
        ====================================================== */

        storageIndicators.forEach(indicator => {

            indicator.addEventListener("click", () => {

                const index = Number(indicator.dataset.index);

                if (
                    Number.isInteger(index) &&
                    index >= 0 &&
                    index < storageSlides.length
                ) {

                    showStorageSlide(index);

                }

            });

        });


        /* ======================================================
           24. PAUSE SLIDER ON HERO HOVER
        ====================================================== */

        if (storageHero) {

            storageHero.addEventListener("mouseenter", () => {

                isHoveringHero = true;

                pauseStorageSlider();

            });

            storageHero.addEventListener("mouseleave", () => {

                isHoveringHero = false;

                resumeStorageSlider();

            });

        }


        /* ======================================================
           25. RESUME SLIDER
        ====================================================== */

        function resumeStorageSlider() {

            if (isMenuOpen) return;
            if (!isPageVisible) return;
            if (isHoveringHero) return;

            const activeVideo = storageVideos[currentSlide];

            if (!activeVideo) {

                startFallbackTimer();
                return;

            }

            if (activeVideo.ended || activeVideo.error) {

                startFallbackTimer();
                return;

            }

            if (activeVideo.paused) {

                const playPromise = activeVideo.play();

                if (
                    playPromise &&
                    typeof playPromise.catch === "function"
                ) {

                    playPromise.catch(() => {
                        startFallbackTimer();
                    });

                }

            }

        }


        /* ======================================================
           26. KEYBOARD SLIDE NAVIGATION
        ====================================================== */

        document.addEventListener("keydown", event => {

            if (isMenuOpen) return;

            const target = event.target;

            if (
                target &&
                target.matches &&
                target.matches(
                    "input, textarea, select, button, a, [contenteditable='true']"
                )
            ) {
                return;
            }

            if (event.key === "ArrowRight") {
                nextStorageSlide();
            }

            if (event.key === "ArrowLeft") {
                previousStorageSlide();
            }

        });


        /* ======================================================
           27. TOUCH SWIPE SUPPORT
        ====================================================== */

        if (storageHero) {

            storageHero.addEventListener(
                "touchstart",
                event => {

                    touchStartX = event.changedTouches[0].screenX;

                },
                { passive: true }
            );

            storageHero.addEventListener(
                "touchend",
                event => {

                    const touchEndX =
                        event.changedTouches[0].screenX;

                    const difference = touchStartX - touchEndX;

                    if (
                        Math.abs(difference) <
                        CONFIG.swipeThreshold
                    ) {
                        return;
                    }

                    if (isMenuOpen) return;

                    if (difference > 0) {
                        nextStorageSlide();
                    } else {
                        previousStorageSlide();
                    }

                },
                { passive: true }
            );

        }


        /* ======================================================
           28. BROWSER TAB VISIBILITY
        ====================================================== */

        document.addEventListener("visibilitychange", () => {

            isPageVisible = !document.hidden;

            if (!isPageVisible) {

                stopStorageSlider();

                storageVideos.forEach(video => {
                    video.pause();
                });

            } else if (!isMenuOpen && !isHoveringHero) {

                resumeStorageSlider();

            }

        });


        /* ======================================================
           29. SMOOTH SCROLL
        ====================================================== */

        document.querySelectorAll('a[href^="#"]').forEach(link => {

            link.addEventListener("click", event => {

                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                let target;

                try {

                    target = document.querySelector(targetId);

                } catch (error) {

                    return;

                }

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({

                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",

                    block: "start"

                });

            });

        });


        /* ======================================================
           30. INITIALIZE HERO SLIDER
        ====================================================== */

        storageVideos.forEach(video => {

            video.muted = true;
            video.loop = false;
            video.playsInline = true;

            video.removeAttribute("autoplay");

        });

        if (storageSlides.length) {

            showStorageSlide(0);

        } else if (storageVideos.length) {

            playStorageVideo(0);

        }


        /* ======================================================
           31. INITIALIZE MOBILE MENU
        ====================================================== */

        closeStorageMenu();

        updateMenuAccessibility(false);


        /* ======================================================
           32. CONTACT FORM ELEMENTS
        ====================================================== */

        const contactForm = document.getElementById(
            "stacklyStorageContactForm"
        );

        const formStatus = document.getElementById(
            "storageContactFormStatus"
        );

        if (contactForm && formStatus) {

            initializeStorageContactForm(
                contactForm,
                formStatus
            );

        }


        /* ======================================================
           33. CONTACT FORM INITIALIZATION FUNCTION
        ====================================================== */

        function initializeStorageContactForm(
            contactForm,
            formStatus
        ) {

            const nameInput = document.getElementById(
                "storageContactName"
            );

            const emailInput = document.getElementById(
                "storageContactEmail"
            );

            const phoneInput = document.getElementById(
                "storageContactPhone"
            );

            const messageInput = document.getElementById(
                "storageContactMessage"
            );

            const serviceInput = contactForm.querySelector(
                '[name="service"]'
            );

            const inquiryInput = contactForm.querySelector(
                '[name="inquiry"]'
            );

            const dropdowns = Array.from(
                contactForm.querySelectorAll(
                    "[data-custom-select]"
                )
            );

            let messageTimer = null;


            /* ==============================================
               33.1 FORM STATUS MESSAGE
            ============================================== */

            function showFormMessage(message, type) {

                clearTimeout(messageTimer);

                formStatus.textContent = message;

                formStatus.classList.remove(
                    "success",
                    "error"
                );

                formStatus.classList.add(type);

                messageTimer = window.setTimeout(() => {

                    formStatus.textContent = "";

                    formStatus.classList.remove(
                        "success",
                        "error"
                    );

                }, 5000);

            }


            function clearFormMessage() {

                clearTimeout(messageTimer);

                formStatus.textContent = "";

                formStatus.classList.remove(
                    "success",
                    "error"
                );

            }


            /* ==============================================
               33.2 GET DROPDOWN ELEMENTS
            ============================================== */

            function getDropdownElements(dropdown) {

                return {

                    trigger: dropdown.querySelector(
                        ".stackly-storage-select-trigger"
                    ),

                    value: dropdown.querySelector(
                        ".stackly-storage-select-value"
                    ),

                    hiddenInput: dropdown.querySelector(
                        'input[type="hidden"]'
                    ),

                    menu: dropdown.querySelector(
                        ".stackly-storage-select-menu"
                    ),

                    options: Array.from(
                        dropdown.querySelectorAll(
                            ".stackly-storage-select-menu button[data-value]"
                        )
                    )

                };

            }


            /* ==============================================
               33.3 CLOSE ALL DROPDOWNS
            ============================================== */

            function closeAllDropdowns() {

                dropdowns.forEach(dropdown => {

                    const elements =
                        getDropdownElements(dropdown);

                    dropdown.classList.remove("active");

                    if (elements.trigger) {

                        elements.trigger.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

            }


            /* ==============================================
               33.4 OPEN AND CLOSE CUSTOM DROPDOWNS
            ============================================== */

            dropdowns.forEach(dropdown => {

                const elements =
                    getDropdownElements(dropdown);

                const trigger = elements.trigger;
                const value = elements.value;
                const hiddenInput = elements.hiddenInput;
                const options = elements.options;
                const menu = elements.menu;

                if (
                    !trigger ||
                    !value ||
                    !hiddenInput ||
                    !menu
                ) {
                    console.warn(
                        "Storage dropdown is missing required elements:",
                        dropdown
                    );
                    return;
                }

                // Set initial accessibility attributes.
                trigger.setAttribute("aria-expanded", "false");

                if (!menu.id) {

                    menu.id = "storage-dropdown-" +
                        Math.random().toString(36).slice(2, 9);

                }

                trigger.setAttribute("aria-controls", menu.id);


                // Toggle dropdown.
                trigger.addEventListener("click", event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const wasOpen =
                        dropdown.classList.contains("active");

                    closeAllDropdowns();

                    if (!wasOpen) {

                        dropdown.classList.add("active");

                        trigger.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                });


                // Select dropdown option.
                options.forEach(option => {

                    option.setAttribute(
                        "aria-selected",
                        "false"
                    );

                    option.addEventListener("click", event => {

                        event.preventDefault();
                        event.stopPropagation();

                        const selectedValue =
                            option.dataset.value;

                        if (!selectedValue) return;

                        // Store selected value.
                        hiddenInput.value = selectedValue;

                        // Display selected option.
                        value.textContent =
                            option.textContent.trim();

                        value.classList.remove("placeholder");

                        // Update selected state.
                        options.forEach(item => {

                            item.classList.remove("selected");

                            item.setAttribute(
                                "aria-selected",
                                "false"
                            );

                        });

                        option.classList.add("selected");

                        option.setAttribute(
                            "aria-selected",
                            "true"
                        );

                        closeAllDropdowns();

                        clearFormMessage();

                    });

                });

            });


            /* ==============================================
               33.5 CLICK OUTSIDE TO CLOSE
            ============================================== */

            document.addEventListener("click", event => {

                if (
                    !event.target.closest(
                        "#stacklyStorageContactForm [data-custom-select]"
                    )
                ) {

                    closeAllDropdowns();

                }

            });


            /* ==============================================
               33.6 ESCAPE KEY
            ============================================== */

            contactForm.addEventListener("keydown", event => {

                if (event.key === "Escape") {

                    closeAllDropdowns();

                }

            });


            /* ==============================================
               33.7 PHONE NUMBER INPUT
            ============================================== */

            if (phoneInput) {

                phoneInput.addEventListener("input", function () {

                    this.value = this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    clearFormMessage();

                });

            }


            /* ==============================================
               33.8 NAME VALIDATION
            ============================================== */

            function validateName(name) {

                const namePattern =
                    /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;

                return namePattern.test(name.trim());

            }


            /* ==============================================
               33.9 EMAIL VALIDATION
            ============================================== */

            function validateEmail(email) {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

                return emailPattern.test(email.trim());

            }


            /* ==============================================
               33.10 PHONE VALIDATION
            ============================================== */

            function validatePhone(phone) {

                return /^[0-9]{10}$/.test(phone);

            }


            /* ==============================================
               33.11 RESET CUSTOM DROPDOWNS
            ============================================== */

            function resetDropdowns() {

                dropdowns.forEach(dropdown => {

                    const elements =
                        getDropdownElements(dropdown);

                    const trigger = elements.trigger;
                    const value = elements.value;
                    const hiddenInput = elements.hiddenInput;
                    const options = elements.options;

                    if (!value || !hiddenInput) return;

                    hiddenInput.value = "";

                    value.classList.add("placeholder");

                    if (hiddenInput.name === "service") {

                        value.textContent = "Choose a service";

                    } else if (hiddenInput.name === "inquiry") {

                        value.textContent =
                            "Select inquiry type";

                    }

                    dropdown.classList.remove("active");

                    if (trigger) {

                        trigger.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                    options.forEach(option => {

                        option.classList.remove("selected");

                        option.setAttribute(
                            "aria-selected",
                            "false"
                        );

                    });

                });

            }


            /* ==============================================
               33.12 CLEAR STATUS WHILE EDITING
            ============================================== */

            contactForm.addEventListener("input", () => {

                clearFormMessage();

            });


            contactForm.addEventListener("change", () => {

                clearFormMessage();

            });


            /* ==============================================
               33.13 FORM SUBMISSION
            ============================================== */

            contactForm.addEventListener("submit", event => {

                event.preventDefault();

                clearFormMessage();

                closeAllDropdowns();


                // Check required elements.
                if (
                    !nameInput ||
                    !emailInput ||
                    !phoneInput ||
                    !messageInput ||
                    !serviceInput ||
                    !inquiryInput
                ) {

                    showFormMessage(
                        "Some form fields are missing. Please check the form HTML.",
                        "error"
                    );

                    return;

                }


                // Name required.
                if (!nameInput.value.trim()) {

                    showFormMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    nameInput.focus();
                    return;

                }


                // Email required.
                if (!emailInput.value.trim()) {

                    showFormMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    emailInput.focus();
                    return;

                }


                // Phone required.
                if (!phoneInput.value.trim()) {

                    showFormMessage(
                        "Please enter your phone number.",
                        "error"
                    );

                    phoneInput.focus();
                    return;

                }


                // Service required.
                if (!serviceInput.value.trim()) {

                    showFormMessage(
                        "Please choose a service.",
                        "error"
                    );

                    const serviceDropdown =
                        serviceInput.closest(
                            "[data-custom-select]"
                        );

                    const serviceTrigger =
                        serviceDropdown?.querySelector(
                            ".stackly-storage-select-trigger"
                        );

                    serviceTrigger?.focus();

                    return;

                }


                // Inquiry required.
                if (!inquiryInput.value.trim()) {

                    showFormMessage(
                        "Please select your inquiry type.",
                        "error"
                    );

                    const inquiryDropdown =
                        inquiryInput.closest(
                            "[data-custom-select]"
                        );

                    const inquiryTrigger =
                        inquiryDropdown?.querySelector(
                            ".stackly-storage-select-trigger"
                        );

                    inquiryTrigger?.focus();

                    return;

                }


                // Message required.
                if (!messageInput.value.trim()) {

                    showFormMessage(
                        "Please enter your message.",
                        "error"
                    );

                    messageInput.focus();
                    return;

                }


                // Validate name.
                if (!validateName(nameInput.value)) {

                    showFormMessage(
                        "Please enter a valid name using letters only.",
                        "error"
                    );

                    nameInput.focus();
                    return;

                }


                // Validate email.
                if (!validateEmail(emailInput.value)) {

                    showFormMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();
                    return;

                }


                // Validate phone.
                if (!validatePhone(phoneInput.value)) {

                    showFormMessage(
                        "Phone number must contain exactly 10 digits.",
                        "error"
                    );

                    phoneInput.focus();
                    return;

                }


                // Check native HTML validation.
                if (!contactForm.checkValidity()) {

                    contactForm.reportValidity();

                    return;

                }


                /* ======================================
                   33.14 SUCCESSFUL FRONT-END VALIDATION
                ====================================== */

                contactForm.reset();

                resetDropdowns();

                showFormMessage(
                    "Thank you! Your form details have been validated successfully.",
                    "success"
                );

            });


            /* ==============================================
               33.15 INITIALIZE DROPDOWNS
            ============================================== */

            closeAllDropdowns();

            resetDropdowns();

        }

    });

})();
