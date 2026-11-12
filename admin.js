
/* ==========================================================
   STACKLY SMART STORAGE SOLUTIONS
   ADMIN DASHBOARD - COMPLETE JAVASCRIPT
   Dynamic User Name + Email + Mobile Sidebar
========================================================== */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ==================================================
           01. DOM ELEMENTS
        ================================================== */

        const body = document.body;

        const sidebar = document.getElementById(
            "stacklyGiftAdminSidebar"
        );

        const overlay = document.getElementById(
            "stacklyGiftAdminOverlay"
        );

        const menuToggle = document.getElementById(
            "stacklyGiftAdminMenuToggle"
        );

        const closeButton = document.getElementById(
            "stacklyGiftAdminClose"
        );

        const emailBox = document.querySelector(
            ".stackly-storage-admin-email-box"
        );

        const emailInfo = document.querySelector(
            ".stackly-storage-admin-email-info"
        );

        const profileInfo = document.querySelector(
            ".stackly-storage-admin-profile-info"
        );

        const logoutLink = document.querySelector(
            ".stackly-storage-admin-logout"
        );


        /* ==================================================
           02. GET LOGGED-IN USER EMAIL
        ================================================== */

        const getLoggedInEmail = () => {

            const possibleKeys = [
                "stacklyStorageLoginEmail",
                "loginEmail"
            ];

            for (const key of possibleKeys) {

                const email = localStorage.getItem(key);

                if (email && email.includes("@")) {
                    return email.trim().toLowerCase();
                }

            }

            return "";

        };


        /* ==================================================
           03. GENERATE NAME FROM EMAIL
        ================================================== */

        const generateUserName = (email) => {

            if (!email || !email.includes("@")) {
                return "Administrator";
            }

            // Get the part before @
            const emailName = email.split("@")[0];

            // Replace dots, underscores, and hyphens with spaces
            const formattedName = emailName
                .replace(/[._-]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            // Capitalize each word
            return formattedName
                .split(" ")
                .filter(Boolean)
                .map(word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
                )
                .join(" ");

        };


        /* ==================================================
           04. DISPLAY USER NAME AND EMAIL
        ================================================== */

        const displayUserDetails = () => {

            const userEmail = getLoggedInEmail();

            const userName = generateUserName(userEmail);


            // TOPBAR EMAIL SECTION

            if (emailInfo) {

                const accountLabel = emailInfo.querySelector("span");
                const emailElement = emailInfo.querySelector("strong");

                if (accountLabel) {
                    accountLabel.textContent = userName;
                }

                if (emailElement) {

                    emailElement.textContent = userEmail || "No email available";

                    emailElement.title = userEmail || "No email available";

                }

            }


            // SIDEBAR PROFILE NAME

            if (profileInfo) {

                const profileName = profileInfo.querySelector("h3");

                if (profileName) {
                    profileName.textContent = userName;
                }

            }


            // ACCESSIBLE EMAIL BOX LABEL

            if (emailBox) {

                emailBox.setAttribute(
                    "aria-label",
                    userEmail
                        ? `${userName}, ${userEmail}`
                        : "Administrator account"
                );

            }


            // ADD EMAIL CLASS FOR RESPONSIVE DISPLAY

            if (emailInfo) {

                const emailElement = emailInfo.querySelector("strong");

                if (emailElement) {
                    emailElement.classList.add(
                        "stackly-storage-admin-email"
                    );
                }

            }

        };


        /* ==================================================
           05. MOBILE SIDEBAR OPEN
        ================================================== */

        const openSidebar = () => {

            if (!sidebar || !overlay) return;

            sidebar.classList.add("active");

            overlay.classList.add("active");

            body.classList.add("admin-sidebar-open");

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Close navigation menu"
                );

            }

        };


        /* ==================================================
           06. MOBILE SIDEBAR CLOSE
        ================================================== */

        const closeSidebar = () => {

            if (!sidebar || !overlay) return;

            sidebar.classList.remove("active");

            overlay.classList.remove("active");

            body.classList.remove("admin-sidebar-open");

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }

        };


        /* ==================================================
           07. SIDEBAR EVENT LISTENERS
        ================================================== */

        if (menuToggle) {

            menuToggle.addEventListener("click", () => {

                const isOpen = sidebar?.classList.contains("active");

                if (isOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }

            });

        }


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSidebar
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        // Close sidebar using Escape key

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeSidebar();
            }

        });


        // Close sidebar after clicking a navigation link on mobile

        if (sidebar) {

            const sidebarLinks = sidebar.querySelectorAll(
                ".stackly-storage-admin-nav-link"
            );

            sidebarLinks.forEach(link => {

                link.addEventListener("click", () => {

                    if (window.innerWidth <= 991) {
                        closeSidebar();
                    }

                });

            });

        }


        // Close sidebar when resizing to desktop

        window.addEventListener("resize", () => {

            if (window.innerWidth > 991) {
                closeSidebar();
            }

        });


        /* ==================================================
           08. LOGOUT FUNCTIONALITY
        ================================================== */

        if (logoutLink) {

            logoutLink.addEventListener("click", () => {

                localStorage.removeItem(
                    "stacklyStorageLoggedIn"
                );

                localStorage.removeItem(
                    "stacklyStorageUserRole"
                );

                localStorage.removeItem(
                    "stacklyStorageLoginEmail"
                );

                localStorage.removeItem(
                    "loginEmail"
                );

                localStorage.removeItem(
                    "stacklyStorageRememberEmail"
                );

            });

        }


        /* ==================================================
           09. ACTIVE SIDEBAR NAVIGATION
        ================================================== */

        const currentPage = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        const navLinks = document.querySelectorAll(
            ".stackly-storage-admin-nav-link"
        );

        navLinks.forEach(link => {

            const linkPage = link.getAttribute("href")
                ?.split("/")
                .pop()
                .toLowerCase();

            link.classList.toggle(
                "active",
                linkPage === currentPage
            );

        });


        /* ==================================================
           10. AOS ANIMATIONS
        ================================================== */

        if (typeof AOS !== "undefined") {

            AOS.init({

                duration: 900,
                once: true,
                offset: 70,
                easing: "ease-out-cubic",
                mirror: false

            });

        }


        /* ==================================================
           11. PREVENT MOBILE BACKGROUND SCROLL
        ================================================== */

        const updateBodyScroll = () => {

            if (
                window.innerWidth <= 991 &&
                sidebar?.classList.contains("active")
            ) {

                body.style.overflow = "hidden";

            } else {

                body.style.overflow = "";

            }

        };


        if (menuToggle) {
            menuToggle.addEventListener(
                "click",
                updateBodyScroll
            );
        }

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                updateBodyScroll
            );
        }

        if (overlay) {
            overlay.addEventListener(
                "click",
                updateBodyScroll
            );
        }

        window.addEventListener(
            "resize",
            updateBodyScroll
        );


        /* ==================================================
           12. INITIALIZE DASHBOARD
        ================================================== */

        displayUserDetails();

        closeSidebar();

    });

})();



/* ==========================================================
   STACKLY STORAGE ADMIN DASHBOARD
   REVENUE ANALYTICS & WAREHOUSE CAPACITY
========================================================== */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ==================================================
           01. REVENUE ANALYTICS ELEMENTS
        ================================================== */

        const revenueDropdown = document.getElementById(
            "revenuePeriodDropdown"
        );

        const revenueAmount = document.querySelector(
            ".stackly-storage-admin-revenue-summary h2"
        );

        const revenueGrowth = document.querySelector(
            ".stackly-storage-admin-revenue-summary .positive"
        );

        const revenueDescription = document.querySelector(
            ".stackly-storage-admin-revenue-summary p"
        );

        const chartContainer = document.querySelector(
            ".stackly-storage-admin-chart-bars"
        );

        /* ==================================================
           02. REVENUE PERIOD DATA
        ================================================== */

        const revenueData = {

            "Last 7 Days": {
                amount: 845620,
                growth: 18.4,
                description: "Total revenue this week",
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                values: [45, 65, 55, 85, 70, 95, 78]
            },

            "Last 30 Days": {
                amount: 3245800,
                growth: 15.8,
                description: "Total revenue in the last 30 days",
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                values: [55, 75, 65, 95]
            },

            "Last 6 Months": {
                amount: 18765000,
                growth: 22.6,
                description: "Total revenue in the last 6 months",
                labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
                values: [45, 60, 55, 75, 68, 95]
            },

            "This Year": {
                amount: 42685000,
                growth: 26.3,
                description: "Total revenue this year",
                labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
                values: [40, 55, 48, 70, 82, 95]
            }

        };

        /* ==================================================
           03. FORMAT REVENUE
        ================================================== */

        const formatRevenue = amount => {

            return "₹" + amount.toLocaleString("en-IN");

        };

        /* ==================================================
           04. UPDATE REVENUE CHART
        ================================================== */

        function updateRevenueChart(period) {

            const data = revenueData[period];

            if (!data || !chartContainer) return;

            // Update total revenue
            if (revenueAmount) {

                revenueAmount.textContent = formatRevenue(
                    data.amount
                );

            }

            // Update growth
            if (revenueGrowth) {

                revenueGrowth.innerHTML = `
                    <i class="fa-solid fa-arrow-up"></i>
                    ${data.growth}%
                `;

            }

            // Update description
            if (revenueDescription) {

                revenueDescription.textContent = data.description;

            }

            // Clear previous chart
            chartContainer.innerHTML = "";

            // Create chart columns
            data.labels.forEach((label, index) => {

                const column = document.createElement("div");

                column.className =
                    "stackly-storage-admin-chart-column";

                const bar = document.createElement("span");

                bar.style.height = "0%";

                const small = document.createElement("small");

                small.textContent = label;

                column.appendChild(bar);
                column.appendChild(small);

                chartContainer.appendChild(column);

                // Animate bars
                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        bar.style.height = data.values[index] + "%";

                    });

                });

            });

        }

        /* ==================================================
           05. CUSTOM REVENUE DROPDOWN
        ================================================== */

        if (revenueDropdown) {

            const trigger = revenueDropdown.querySelector(
                ".stackly-storage-period-trigger"
            );

            const selectedText = revenueDropdown.querySelector(
                ".stackly-storage-period-selected"
            );

            const options = revenueDropdown.querySelectorAll(
                ".stackly-storage-period-option"
            );

            function closeRevenueDropdown() {

                revenueDropdown.classList.remove("open");

                trigger.setAttribute("aria-expanded", "false");

            }

            // Open and close dropdown
            trigger.addEventListener("click", () => {

                const isOpen = revenueDropdown.classList.toggle(
                    "open"
                );

                trigger.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            });

            // Select period
            options.forEach(option => {

                option.addEventListener("click", () => {

                    const selectedPeriod = option.dataset.value;

                    if (!revenueData[selectedPeriod]) return;

                    selectedText.textContent = selectedPeriod;

                    options.forEach(item => {

                        item.classList.remove("active");

                    });

                    option.classList.add("active");

                    closeRevenueDropdown();

                    updateRevenueChart(selectedPeriod);

                });

            });

            // Close when clicking outside
            document.addEventListener("click", event => {

                if (!revenueDropdown.contains(event.target)) {

                    closeRevenueDropdown();

                }

            });

            // Close with Escape
            document.addEventListener("keydown", event => {

                if (event.key === "Escape") {

                    closeRevenueDropdown();

                    trigger.focus();

                }

            });

            // Initial chart
            updateRevenueChart("Last 7 Days");

        }

        /* ==================================================
           06. WAREHOUSE CAPACITY
        ================================================== */

        const capacityRing = document.querySelector(
            ".stackly-storage-admin-capacity-ring"
        );

        const capacityStrong = document.querySelector(
            ".stackly-storage-admin-capacity-ring strong"
        );

        const capacityInfo = document.querySelector(
            ".stackly-storage-admin-capacity-info"
        );

        const capacityFooter = document.querySelector(
            ".stackly-storage-admin-capacity-footer strong"
        );

        const warehouseData = {
            occupied: 78,
            available: 22,
            locations: 12
        };

        function updateWarehouseCapacity() {

            const occupied = warehouseData.occupied;

            const available = warehouseData.available;

            // Update circular progress
            if (capacityRing) {

                capacityRing.style.setProperty(
                    "--capacity-progress",
                    occupied + "%"
                );

                capacityRing.style.background = `
                    conic-gradient(
                        #b9ed62 0% ${occupied}%,
                        #e8eee2 ${occupied}% 100%
                    )
                `;

            }

            // Update center percentage
            if (capacityStrong) {

                capacityStrong.textContent = occupied + "%";

            }

            // Update capacity information
            if (capacityInfo) {

                const values = capacityInfo.querySelectorAll(
                    "div strong"
                );

                if (values[0]) {
                    values[0].textContent = occupied + "%";
                }

                if (values[1]) {
                    values[1].textContent = available + "%";
                }

            }

            // Update warehouse count
            if (capacityFooter) {

                capacityFooter.textContent =
                    warehouseData.locations + " Locations";

            }

        }

        updateWarehouseCapacity();

    });

})();



/* ==========================================================
   STACKLY STORAGE ADMIN
   DYNAMIC PROFILE NAME AND EMAIL
========================================================== */

(() => {

    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ==========================================
           GET PROFILE ELEMENTS
        ========================================== */

        const displayName = document.getElementById(
            "storageAdminDisplayName"
        );

        const nameInput = document.getElementById(
            "storageAdminName"
        );

        const emailInput = document.getElementById(
            "storageAdminEmail"
        );

        const phoneInput = document.getElementById(
            "storageAdminPhone"
        );


        /* ==========================================
           GET LOGGED-IN USER EMAIL
        ========================================== */

        const userEmail =
            localStorage.getItem("loginEmail") ||
            localStorage.getItem("stacklyStorageLoginEmail") ||
            "";


        /* ==========================================
           GENERATE USER NAME FROM EMAIL
        ========================================== */

        function getUserNameFromEmail(email) {

            if (!email || !email.includes("@")) {
                return "Administrator";
            }

            // Get the first part before @
            const emailName = email.split("@")[0];

            // Get the first word separated by dots,
            // underscores, or hyphens
            const firstWord = emailName.split(/[._-]/)[0];

            // Capitalize the first letter
            return firstWord.charAt(0).toUpperCase() +
                firstWord.slice(1).toLowerCase();

        }


        /* ==========================================
           DISPLAY USER DETAILS
        ========================================== */

        if (userEmail) {

            const userName = getUserNameFromEmail(userEmail);

            // Display profile name
            if (displayName) {
                displayName.textContent = userName;
            }

            // Display name in input
            if (nameInput) {
                nameInput.value = userName;
            }

            // Display email in input
            if (emailInput) {
                emailInput.value = userEmail;
            }

        }


        /* ==========================================
           SAVE PROFILE DETAILS
        ========================================== */

        const saveProfileBtn = document.querySelector(
            ".stackly-storage-settings-save-btn"
        );

        if (saveProfileBtn) {

            saveProfileBtn.addEventListener("click", () => {

                const updatedName = nameInput?.value.trim();
                const updatedEmail = emailInput?.value.trim();
                const updatedPhone = phoneInput?.value.trim();

                if (!updatedName || !updatedEmail) {
                    alert("Please enter your name and email address.");
                    return;
                }

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(updatedEmail)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                // Save profile details
                localStorage.setItem(
                    "stacklyStorageAdminName",
                    updatedName
                );

                localStorage.setItem(
                    "stacklyStorageLoginEmail",
                    updatedEmail
                );

                localStorage.setItem(
                    "loginEmail",
                    updatedEmail
                );

                localStorage.setItem(
                    "stacklyStorageAdminPhone",
                    updatedPhone
                );

                // Update profile heading
                if (displayName) {
                    displayName.textContent = updatedName;
                }

                // Update topbar email if available
                const topbarEmail = document.querySelector(
                    ".stackly-storage-admin-email-info strong"
                );

                if (topbarEmail) {
                    topbarEmail.textContent = updatedEmail;
                }

                alert("Profile updated successfully!");

            });

        }

    });

})();
