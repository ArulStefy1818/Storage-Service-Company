        document.addEventListener("DOMContentLoaded", function () {

            "use strict";


            /* =====================================
               01. MOBILE SIDEBAR ELEMENTS
            ====================================== */

            const sidebar = document.getElementById(
                "stacklyStorageClientSidebar"
            );

            const overlay = document.getElementById(
                "stacklyStorageClientOverlay"
            );

            const menuToggle = document.getElementById(
                "stacklyStorageClientMenuToggle"
            );

            const closeButton = document.getElementById(
                "stacklyStorageClientClose"
            );


            function openClientSidebar() {

                sidebar.classList.add("active");
                overlay.classList.add("active");

                menuToggle.setAttribute("aria-expanded", "true");

                document.body.classList.add("client-sidebar-open");

            }


            function closeClientSidebar() {

                sidebar.classList.remove("active");
                overlay.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("client-sidebar-open");

            }


            if (menuToggle) {
                menuToggle.addEventListener("click", openClientSidebar);
            }

            if (closeButton) {
                closeButton.addEventListener("click", closeClientSidebar);
            }

            if (overlay) {
                overlay.addEventListener("click", closeClientSidebar);
            }


            /* CLOSE SIDEBAR WITH ESCAPE KEY */

            document.addEventListener("keydown", function (event) {

                if (event.key === "Escape") {
                    closeClientSidebar();
                }

            });


            /* CLOSE SIDEBAR AFTER CLICKING A NAV LINK ON MOBILE */

            document.querySelectorAll(
                ".stackly-storage-client-nav-link"
            ).forEach(function (link) {

                link.addEventListener("click", function () {

                    if (window.innerWidth <= 991) {
                        closeClientSidebar();
                    }

                });

            });


            /* RESET MOBILE SIDEBAR ON DESKTOP */

            window.addEventListener("resize", function () {

                if (window.innerWidth > 991) {
                    closeClientSidebar();
                }

            });


            /* =====================================
               02. CLIENT EMAIL & NAME DISPLAY
            ====================================== */

            const clientEmail =
                localStorage.getItem("loginEmail") ||
                localStorage.getItem("stacklyStorageLoginEmail") ||
                "";


            const emailDisplay = document.getElementById(
                "storageClientTopbarEmail"
            );

            const welcomeName = document.getElementById(
                "storageClientWelcomeName"
            );

            const sidebarName = document.getElementById(
                "storageClientSidebarName"
            );


            function getClientNameFromEmail(email) {

                if (!email || !email.includes("@")) {
                    return "Client";
                }

                const emailName = email.split("@")[0];

                const firstWord = emailName.split(/[._-]/)[0];

                if (!firstWord) {
                    return "Client";
                }

                return firstWord.charAt(0).toUpperCase() +
                    firstWord.slice(1).toLowerCase();

            }


            const clientName = getClientNameFromEmail(clientEmail);


            if (emailDisplay) {

                emailDisplay.textContent = clientEmail ||
                    "client@stacklystorage.com";

            }

            if (welcomeName) {
                welcomeName.textContent = clientName;
            }

            if (sidebarName) {
                sidebarName.textContent = clientName;
            }


            /* =====================================
               03. ACTIVE NAVIGATION
            ====================================== */

            const currentPage = window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

            document.querySelectorAll(
                ".stackly-storage-client-nav-link"
            ).forEach(function (link) {

                const linkPage = link.getAttribute("href")
                    .split("/")
                    .pop()
                    .toLowerCase();

                link.classList.toggle(
                    "active",
                    linkPage === currentPage
                );

            });


            /* =====================================
               04. AOS ANIMATION
            ====================================== */

            if (typeof AOS !== "undefined") {

                AOS.init({

                    duration: 900,
                    once: true,
                    offset: 70,
                    easing: "ease-out-cubic"

                });

            }

        });



/* =========================================
   STACKLY CLIENT INVOICES
   SEARCH + STATUS + YEAR FILTERS
========================================== */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        const searchInput = document.getElementById("clientInvoiceSearch");
        const statusFilter = document.getElementById("clientInvoiceStatusFilter");
        const yearFilter = document.getElementById("clientInvoiceYearFilter");
        const tableBody = document.getElementById("clientInvoiceTableBody");
        const emptyMessage = document.getElementById("clientInvoiceEmpty");

        if (!tableBody) return;

        const rows = Array.from(tableBody.querySelectorAll("tr"));

        function filterInvoices() {

            const searchValue = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            const selectedStatus = statusFilter
                ? statusFilter.value
                : "all";

            const selectedYear = yearFilter
                ? yearFilter.value
                : "all";

            let visibleCount = 0;

            rows.forEach(row => {

                const invoiceText = row.textContent.toLowerCase();
                const rowStatus = row.dataset.status;
                const rowYear = row.dataset.year;

                const matchesSearch = invoiceText.includes(searchValue);

                const matchesStatus =
                    selectedStatus === "all" ||
                    rowStatus === selectedStatus;

                const matchesYear =
                    selectedYear === "all" ||
                    rowYear === selectedYear;

                const shouldShow =
                    matchesSearch && matchesStatus && matchesYear;

                row.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount++;
                }

            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount !== 0;
            }

        }

        searchInput?.addEventListener("input", filterInvoices);
        statusFilter?.addEventListener("change", filterInvoices);
        yearFilter?.addEventListener("change", filterInvoices);

    });

})();


/* ==========================================================
   STACKLY SMART STORAGE SOLUTIONS
   CLIENT PROFILE PAGE - COMPLETE JAVASCRIPT
   Profile Management + Email Integration + Notifications
========================================================== */

(() => {

    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ==================================================
           01. ELEMENTS
        ================================================== */

        const profileForm = document.getElementById(
            "clientProfileForm"
        );

        const editButton = document.getElementById(
            "clientProfileEditBtn"
        );

        const cancelButton = document.getElementById(
            "clientProfileCancelBtn"
        );

        const formActions = document.getElementById(
            "clientProfileFormActions"
        );

        const profileName = document.getElementById(
            "clientProfileName"
        );

        const fullNameInput = document.getElementById(
            "clientProfileFullName"
        );

        const emailInput = document.getElementById(
            "clientProfileEmail"
        );

        const phoneInput = document.getElementById(
            "clientProfilePhone"
        );

        const companyInput = document.getElementById(
            "clientProfileCompany"
        );

        const addressInput = document.getElementById(
            "clientProfileAddress"
        );

        const cityInput = document.getElementById(
            "clientProfileCity"
        );

        const postalInput = document.getElementById(
            "clientProfilePostal"
        );

        const emailNotifications = document.getElementById(
            "clientEmailNotifications"
        );

        const shipmentNotifications = document.getElementById(
            "clientShipmentNotifications"
        );

        const paymentNotifications = document.getElementById(
            "clientPaymentNotifications"
        );

        /* ==================================================
           02. STORAGE KEYS
        ================================================== */

        const PROFILE_STORAGE_KEY =
            "stacklyStorageClientProfile";

        const NOTIFICATION_STORAGE_KEY =
            "stacklyStorageClientNotifications";

        /* ==================================================
           03. GET LOGGED-IN EMAIL
        ================================================== */

        const loggedInEmail =
            localStorage.getItem("loginEmail") ||
            localStorage.getItem("stacklyStorageLoginEmail") ||
            localStorage.getItem("stacklyGiftLoginEmail") ||
            "";

        const defaultEmail =
            loggedInEmail || "client@stacklystorage.com";

        /* ==================================================
           04. GET NAME FROM EMAIL
           Example:
           john.anderson@gmail.com = John
           arulstefy@gmail.com = Arulstefy
           david_smith@gmail.com = David
        ================================================== */

        function getNameFromEmail(email) {

            if (!email || !email.includes("@")) {
                return "Client";
            }

            const emailPrefix = email
                .split("@")[0]
                .trim();

            const firstWord = emailPrefix
                .split(/[._\-+\s]+/)
                .filter(Boolean)[0];

            if (!firstWord) {
                return "Client";
            }

            return firstWord.charAt(0).toUpperCase() +
                firstWord.slice(1).toLowerCase();

        }

        const clientName = getNameFromEmail(defaultEmail);

        /* ==================================================
           05. PROFILE ELEMENTS
           UPDATE NAME AND EMAIL
        ================================================== */

        function updateProfileIdentity() {

            /* PROFILE SUMMARY NAME */

            if (profileName) {
                profileName.textContent = clientName;
            }

            /* PROFILE FORM NAME */

            if (fullNameInput) {
                fullNameInput.value = clientName;
            }

            /* PROFILE FORM EMAIL */

            if (emailInput) {
                emailInput.value = defaultEmail;
            }

            /* SUMMARY EMAIL */

            const summaryEmail = document.getElementById(
                "clientProfileSummaryEmail"
            );

            if (summaryEmail) {
                summaryEmail.textContent = defaultEmail;
            }

            /* PROFILE HERO ACCESSIBLE LABEL */

            const avatar = document.querySelector(
                ".stackly-storage-client-profile-avatar-large"
            );

            if (avatar) {
                avatar.setAttribute(
                    "aria-label",
                    clientName + " profile avatar"
                );
            }

        }

        /* ==================================================
           06. LOAD SAVED PROFILE INFORMATION
        ================================================== */

        function loadProfileData() {

            let savedProfile = {};

            try {

                savedProfile = JSON.parse(
                    localStorage.getItem(PROFILE_STORAGE_KEY)
                ) || {};

            } catch (error) {

                console.warn(
                    "Unable to load saved profile information.",
                    error
                );

            }

            /*
             * Name is intentionally taken from the logged-in
             * email's first word.
             */

            if (fullNameInput) {
                fullNameInput.value = clientName;
            }

            if (emailInput) {
                emailInput.value = defaultEmail;
            }

            if (phoneInput) {
                phoneInput.value =
                    savedProfile.phone || "+91 98765 43210";
            }

            if (companyInput) {
                companyInput.value =
                    savedProfile.company || "Anderson Trading Company";
            }

            if (addressInput) {
                addressInput.value =
                    savedProfile.address || "Chennai, Tamil Nadu, India";
            }

            if (cityInput) {
                cityInput.value =
                    savedProfile.city || "Chennai";
            }

            if (postalInput) {
                postalInput.value =
                    savedProfile.postal || "600001";
            }

            updateProfileIdentity();

        }

        /* ==================================================
           07. SAVE PROFILE INFORMATION
        ================================================== */

        function saveProfileData() {

            const profileData = {

                fullName: clientName,

                email: defaultEmail,

                phone: phoneInput
                    ? phoneInput.value.trim()
                    : "",

                company: companyInput
                    ? companyInput.value.trim()
                    : "",

                address: addressInput
                    ? addressInput.value.trim()
                    : "",

                city: cityInput
                    ? cityInput.value.trim()
                    : "",

                postal: postalInput
                    ? postalInput.value.trim()
                    : "",

                updatedAt: new Date().toISOString()

            };

            try {

                localStorage.setItem(
                    PROFILE_STORAGE_KEY,
                    JSON.stringify(profileData)
                );

                return true;

            } catch (error) {

                console.error(
                    "Unable to save profile information.",
                    error
                );

                showProfileToast(
                    "Unable to save your changes. Please try again.",
                    "error"
                );

                return false;

            }

        }

        /* ==================================================
           08. PROFILE EDIT MODE
        ================================================== */

        function setProfileEditMode(enabled) {

            if (!profileForm) return;

            const inputs = profileForm.querySelectorAll(
                "input"
            );

            inputs.forEach(input => {

                /*
                 * Email and name are connected to the
                 * logged-in email identity.
                 */

                if (
                    input.id === "clientProfileFullName" ||
                    input.id === "clientProfileEmail"
                ) {

                    input.disabled = true;

                } else {

                    input.disabled = !enabled;

                }

            });

            if (formActions) {
                formActions.hidden = !enabled;
            }

            if (editButton) {

                editButton.hidden = enabled;

                editButton.innerHTML = enabled
                    ? '<i class="fa-solid fa-pen"></i> Edit Details'
                    : '<i class="fa-solid fa-pen"></i> Edit Details';

            }

        }

        /* ==================================================
           09. STORE ORIGINAL FORM VALUES
        ================================================== */

        let originalProfileValues = {};

        function captureProfileValues() {

            originalProfileValues = {

                phone: phoneInput?.value || "",

                company: companyInput?.value || "",

                address: addressInput?.value || "",

                city: cityInput?.value || "",

                postal: postalInput?.value || ""

            };

        }

        /* ==================================================
           10. EDIT BUTTON
        ================================================== */

        if (editButton && profileForm) {

            editButton.addEventListener("click", () => {

                captureProfileValues();

                setProfileEditMode(true);

                if (phoneInput) {
                    phoneInput.focus();
                }

            });

        }

        /* ==================================================
           11. CANCEL BUTTON
        ================================================== */

        if (cancelButton) {

            cancelButton.addEventListener("click", () => {

                if (phoneInput) {
                    phoneInput.value =
                        originalProfileValues.phone;
                }

                if (companyInput) {
                    companyInput.value =
                        originalProfileValues.company;
                }

                if (addressInput) {
                    addressInput.value =
                        originalProfileValues.address;
                }

                if (cityInput) {
                    cityInput.value =
                        originalProfileValues.city;
                }

                if (postalInput) {
                    postalInput.value =
                        originalProfileValues.postal;
                }

                setProfileEditMode(false);

                showProfileToast(
                    "Your changes have been discarded.",
                    "info"
                );

            });

        }

        /* ==================================================
           12. SAVE PROFILE FORM
        ================================================== */

        if (profileForm) {

            profileForm.addEventListener("submit", event => {

                event.preventDefault();

                if (!profileForm.checkValidity()) {

                    profileForm.reportValidity();

                    return;

                }

                if (saveProfileData()) {

                    setProfileEditMode(false);

                    captureProfileValues();

                    showProfileToast(
                        "Your profile has been updated successfully!",
                        "success"
                    );

                }

            });

        }

        /* ==================================================
           13. NOTIFICATION PREFERENCES
        ================================================== */

        const notificationControls = {

            email: emailNotifications,

            shipment: shipmentNotifications,

            payment: paymentNotifications

        };

        function loadNotificationPreferences() {

            let savedPreferences = {};

            try {

                savedPreferences = JSON.parse(
                    localStorage.getItem(
                        NOTIFICATION_STORAGE_KEY
                    )
                ) || {};

            } catch (error) {

                console.warn(
                    "Unable to load notification preferences.",
                    error
                );

            }

            Object.entries(notificationControls).forEach(
                ([key, control]) => {

                    if (!control) return;

                    if (
                        typeof savedPreferences[key] === "boolean"
                    ) {

                        control.checked =
                            savedPreferences[key];

                    }

                }
            );

        }

        function saveNotificationPreferences() {

            const preferences = {

                email: emailNotifications
                    ? emailNotifications.checked
                    : false,

                shipment: shipmentNotifications
                    ? shipmentNotifications.checked
                    : false,

                payment: paymentNotifications
                    ? paymentNotifications.checked
                    : false

            };

            try {

                localStorage.setItem(
                    NOTIFICATION_STORAGE_KEY,
                    JSON.stringify(preferences)
                );

                showProfileToast(
                    "Notification preferences saved.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Unable to save notification preferences.",
                    error
                );

                showProfileToast(
                    "Could not save notification preferences.",
                    "error"
                );

            }

        }

        Object.values(notificationControls).forEach(
            control => {

                if (!control) return;

                control.addEventListener(
                    "change",
                    saveNotificationPreferences
                );

            }
        );

        /* ==================================================
           14. PROFESSIONAL TOAST NOTIFICATION
        ================================================== */

        function showProfileToast(message, type = "success") {

            let toast = document.getElementById(
                "stacklyStorageProfileToast"
            );

            if (!toast) {

                toast = document.createElement("div");

                toast.id = "stacklyStorageProfileToast";

                toast.className =
                    "stackly-storage-profile-toast";

                toast.setAttribute("role", "status");
                toast.setAttribute("aria-live", "polite");

                document.body.appendChild(toast);

            }

            const icon = type === "error"
                ? "fa-circle-exclamation"
                : type === "info"
                    ? "fa-circle-info"
                    : "fa-circle-check";

            toast.className =
                "stackly-storage-profile-toast " + type;

            toast.innerHTML = `
                <span class="stackly-storage-profile-toast-icon">
                    <i class="fa-solid ${icon}"></i>
                </span>

                <span class="stackly-storage-profile-toast-message">
                    ${message}
                </span>

                <button type="button"
                    class="stackly-storage-profile-toast-close"
                    aria-label="Close notification">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            requestAnimationFrame(() => {
                toast.classList.add("show");
            });

            const closeButton = toast.querySelector(
                ".stackly-storage-profile-toast-close"
            );

            if (closeButton) {
                closeButton.addEventListener("click", () => {
                    toast.classList.remove("show");
                });
            }

            clearTimeout(toast.hideTimer);

            toast.hideTimer = setTimeout(() => {
                toast.classList.remove("show");
            }, 3500);

        }

        /* ==================================================
           15. INITIALIZE PROFILE PAGE
        ================================================== */

        updateProfileIdentity();

        loadProfileData();

        loadNotificationPreferences();

        captureProfileValues();

        setProfileEditMode(false);

    });

})();
