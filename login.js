
/* ==========================================================
   STACKLY SMART STORAGE SOLUTIONS
   LOGIN & SIGNUP - COMPLETE JAVASCRIPT
   DIRECT LOGIN + SIGNUP RETURN TO LOGIN
========================================================== */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* ==================================================
           01. ELEMENTS
        ================================================== */

        const loginForm = document.getElementById("stacklyStorageLoginForm");
        const signupForm = document.getElementById("stacklyStorageSignupForm");

        const authTitle = document.getElementById("stacklyStorageAuthTitle");
        const authDescription = document.getElementById("stacklyStorageAuthDescription");

        const showSignupBtn = document.getElementById("storageShowSignup");
        const showLoginBtn = document.getElementById("storageShowLogin");

        const loginStatus = document.getElementById("storageLoginStatus");
        const signupStatus = document.getElementById("storageSignupStatus");

        if (!loginForm || !signupForm) {
            console.error("Stackly authentication forms were not found.");
            return;
        }

        const USERS_KEY = "stacklyStorageUsers";

        loginForm.noValidate = true;
        signupForm.noValidate = true;


        /* ==================================================
           02. STORAGE HELPERS
        ================================================== */

        function getUsers() {
            try {
                const users = JSON.parse(
                    localStorage.getItem(USERS_KEY) || "[]"
                );

                return Array.isArray(users) ? users : [];

            } catch (error) {
                console.error("Unable to read registered accounts:", error);
                return [];
            }
        }

        function saveUsers(users) {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }

        function showMessage(element, message, type = "error") {
            if (!element) return;

            element.textContent = message;
            element.style.color = type === "success"
                ? "#16845b"
                : "#c34b4b";
        }

        function clearMessage(element) {
            if (element) {
                element.textContent = "";
            }
        }

        function normalizeEmail(email) {
            return email.trim().toLowerCase();
        }


        /* ==================================================
           03. FORM SWITCHING
        ================================================== */

        function showLoginForm(prefillEmail = "") {

            signupForm.hidden = true;
            loginForm.hidden = false;

            authTitle.textContent = "Welcome Back!";
            authDescription.textContent =
                "Sign in to continue to your account.";

            clearMessage(loginStatus);
            clearMessage(signupStatus);

            loginForm.reset();
            signupForm.reset();

            closeAllDropdowns();

            /* Restore signup email in login field */

            const loginEmailInput = document.getElementById(
                "storageLoginEmail"
            );

            if (loginEmailInput && prefillEmail) {
                loginEmailInput.value = prefillEmail;
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        function showSignupForm() {

            loginForm.hidden = true;
            signupForm.hidden = false;

            authTitle.textContent = "Create Your Account";
            authDescription.textContent =
                "Join Stackly and manage your storage needs.";

            clearMessage(loginStatus);
            clearMessage(signupStatus);

            loginForm.reset();
            signupForm.reset();

            closeAllDropdowns();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        showSignupBtn?.addEventListener("click", showSignupForm);
        showLoginBtn?.addEventListener("click", () => showLoginForm());


        /* ==================================================
           04. CUSTOM ROLE DROPDOWN
        ================================================== */

        const roleDropdowns = document.querySelectorAll(
            ".stackly-storage-role-dropdown"
        );

        function closeAllDropdowns(except = null) {

            roleDropdowns.forEach(dropdown => {

                if (dropdown === except) return;

                dropdown.classList.remove("active");

                const trigger = dropdown.querySelector(
                    ".stackly-storage-role-trigger"
                );

                const options = dropdown.querySelector(
                    ".stackly-storage-role-options"
                );

                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false");
                }

                if (options) {
                    options.hidden = true;
                }

            });

        }

        roleDropdowns.forEach(dropdown => {

            const trigger = dropdown.querySelector(
                ".stackly-storage-role-trigger"
            );

            const options = dropdown.querySelector(
                ".stackly-storage-role-options"
            );

            const selectedText = dropdown.querySelector(
                ".stackly-storage-role-selected"
            );

            const hiddenInput = dropdown.querySelector(
                'input[type="hidden"][name="role"]'
            );

            const optionButtons = dropdown.querySelectorAll(
                ".stackly-storage-role-option"
            );

            if (!trigger || !options || !hiddenInput || !selectedText) {
                return;
            }

            trigger.addEventListener("click", () => {

                const isOpen = dropdown.classList.contains("active");

                closeAllDropdowns(dropdown);

                dropdown.classList.toggle("active", !isOpen);
                options.hidden = isOpen;

                trigger.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

            });

            optionButtons.forEach(option => {

                option.addEventListener("click", () => {

                    const value = option.dataset.value;
                    const icon = option.querySelector("i");

                    const roleName = value === "admin"
                        ? "Admin"
                        : "Client";

                    hiddenInput.value = value;

                    selectedText.innerHTML = "";

                    const selectedIcon = document.createElement("i");

                    selectedIcon.className = icon
                        ? icon.className
                        : "fa-solid fa-user";

                    selectedText.appendChild(selectedIcon);

                    selectedText.appendChild(
                        document.createTextNode(" " + roleName)
                    );

                    optionButtons.forEach(button => {
                        button.setAttribute(
                            "aria-selected",
                            String(button === option)
                        );
                    });

                    dropdown.classList.remove("active");
                    options.hidden = true;

                    trigger.setAttribute("aria-expanded", "false");

                });

            });

        });


        /* Close dropdown outside */

        document.addEventListener("click", event => {

            if (!event.target.closest(
                ".stackly-storage-role-dropdown"
            )) {
                closeAllDropdowns();
            }

        });


        /* Close dropdown using Escape */

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeAllDropdowns();
            }

        });


        /* ==================================================
           05. PASSWORD SHOW / HIDE
        ================================================== */

        const passwordToggles = document.querySelectorAll(
            "[data-password-toggle]"
        );

        passwordToggles.forEach(toggle => {

            toggle.addEventListener("click", () => {

                const inputId = toggle.dataset.passwordToggle;
                const passwordInput = document.getElementById(inputId);
                const icon = toggle.querySelector("i");

                if (!passwordInput || !icon) return;

                const isPassword = passwordInput.type === "password";

                passwordInput.type = isPassword ? "text" : "password";

                icon.classList.toggle("fa-eye", !isPassword);
                icon.classList.toggle("fa-eye-slash", isPassword);

                toggle.setAttribute(
                    "aria-label",
                    isPassword ? "Hide password" : "Show password"
                );

                toggle.setAttribute(
                    "aria-pressed",
                    String(isPassword)
                );

            });

        });


        /* ==================================================
           06. VALIDATION HELPERS
        ================================================== */

        function isValidEmail(email) {

            const emailPattern =
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

            return emailPattern.test(email);
        }

        function isValidName(name) {

            return /^[\p{L}][\p{L}\s.'-]*$/u.test(name.trim());
        }

        function isValidPhone(phone) {

            const digits = phone.replace(/\D/g, "");

            return digits.length >= 7 && digits.length <= 15;
        }

        function isValidPassword(password) {

            return password.length >= 6;
        }

        function getSelectedRole(form) {

            const role = form.querySelector(
                'input[name="role"]'
            )?.value;

            return role === "admin" ? "admin" : "client";
        }

        function getFormInput(form, name) {

            return form.querySelector(`[name="${name}"]`);
        }

        function focusField(form, name) {

            const field = getFormInput(form, name);

            if (field && field.type !== "hidden") {
                field.focus();
            }
        }


        /* ==================================================
           07. LOGIN SESSION
        ================================================== */

        function createLoginSession(email, role, remember = false) {

            localStorage.setItem("loginEmail", email);

            localStorage.setItem(
                "stacklyStorageLoginEmail",
                email
            );

            localStorage.setItem(
                "stacklyStorageUserRole",
                role
            );

            localStorage.setItem(
                "stacklyStorageLoggedIn",
                "true"
            );

            if (remember) {

                localStorage.setItem(
                    "stacklyStorageRememberEmail",
                    email
                );

            } else {

                localStorage.removeItem(
                    "stacklyStorageRememberEmail"
                );

            }

        }

        function redirectUser(role) {

            const destination = role === "admin"
                ? "admin.html"
                : "client.html";

            window.location.href = destination;
        }


        /* ==================================================
           08. DIRECT LOGIN
           NO REGISTRATION REQUIRED
        ================================================== */

        loginForm.addEventListener("submit", event => {

            event.preventDefault();

            clearMessage(loginStatus);

            const emailInput = document.getElementById(
                "storageLoginEmail"
            );

            const passwordInput = document.getElementById(
                "storageLoginPassword"
            );

            if (!emailInput || !passwordInput) return;

            const email = normalizeEmail(emailInput.value);
            const password = passwordInput.value;
            const role = getSelectedRole(loginForm);

            /* Email required */

            if (!email) {

                showMessage(
                    loginStatus,
                    "Please enter your email address."
                );

                focusField(loginForm, "email");
                return;
            }

            /* Password required */

            if (!password) {

                showMessage(
                    loginStatus,
                    "Please enter your password."
                );

                focusField(loginForm, "password");
                return;
            }

            /* Email validation */

            if (!isValidEmail(email)) {

                showMessage(
                    loginStatus,
                    "Please enter a valid email address."
                );

                focusField(loginForm, "email");
                return;
            }

            /* Password minimum 6 characters */

            if (!isValidPassword(password)) {

                showMessage(
                    loginStatus,
                    "Password must contain at least 6 characters."
                );

                focusField(loginForm, "password");
                return;
            }

            const rememberCheckbox = loginForm.querySelector(
                'input[name="remember"]'
            );

            /* Direct login without account verification */

            createLoginSession(
                email,
                role,
                Boolean(rememberCheckbox?.checked)
            );

            showMessage(
                loginStatus,
                "Login successful! Redirecting to your dashboard...",
                "success"
            );

            const loginSubmitButton = loginForm.querySelector(
                'button[type="submit"]'
            );

            if (loginSubmitButton) {
                loginSubmitButton.disabled = true;
            }

            setTimeout(() => {
                redirectUser(role);
            }, 800);

        });


        /* ==================================================
           09. SIGNUP FORM
           AFTER ACCOUNT CREATION RETURN TO LOGIN
        ================================================== */

        signupForm.addEventListener("submit", event => {

            event.preventDefault();

            clearMessage(signupStatus);

            const nameInput = document.getElementById(
                "storageSignupName"
            );

            const emailInput = document.getElementById(
                "storageSignupEmail"
            );

            const phoneInput = document.getElementById(
                "storageSignupPhone"
            );

            const passwordInput = document.getElementById(
                "storageSignupPassword"
            );

            const confirmPasswordInput = document.getElementById(
                "storageSignupConfirmPassword"
            );

            const name = nameInput.value.trim();
            const email = normalizeEmail(emailInput.value);
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const role = getSelectedRole(signupForm);

            const termsCheckbox = signupForm.querySelector(
                'input[name="terms"]'
            );


            /* Required fields */

            if (!name) {

                showMessage(
                    signupStatus,
                    "Please enter your full name."
                );

                focusField(signupForm, "name");
                return;
            }

            if (!email) {

                showMessage(
                    signupStatus,
                    "Please enter your email address."
                );

                focusField(signupForm, "email");
                return;
            }

            if (!phone) {

                showMessage(
                    signupStatus,
                    "Please enter your phone number."
                );

                focusField(signupForm, "phone");
                return;
            }

            if (!password) {

                showMessage(
                    signupStatus,
                    "Please create a password."
                );

                focusField(signupForm, "password");
                return;
            }

            if (!confirmPassword) {

                showMessage(
                    signupStatus,
                    "Please confirm your password."
                );

                focusField(signupForm, "confirmPassword");
                return;
            }


            /* Name validation */

            if (!isValidName(name)) {

                showMessage(
                    signupStatus,
                    "Please enter a valid name."
                );

                focusField(signupForm, "name");
                return;
            }


            /* Email validation */

            if (!isValidEmail(email)) {

                showMessage(
                    signupStatus,
                    "Please enter a valid email address."
                );

                focusField(signupForm, "email");
                return;
            }


            /* Phone validation */

            if (!isValidPhone(phone)) {

                showMessage(
                    signupStatus,
                    "Please enter a valid phone number."
                );

                focusField(signupForm, "phone");
                return;
            }


            /* Password minimum 6 characters */

            if (!isValidPassword(password)) {

                showMessage(
                    signupStatus,
                    "Password must contain at least 6 characters."
                );

                focusField(signupForm, "password");
                return;
            }


            /* Confirm password */

            if (password !== confirmPassword) {

                showMessage(
                    signupStatus,
                    "Passwords do not match."
                );

                focusField(signupForm, "confirmPassword");
                return;
            }


            /* Terms validation */

            if (!termsCheckbox?.checked) {

                showMessage(
                    signupStatus,
                    "Please accept the Terms & Conditions to continue."
                );

                termsCheckbox?.focus();
                return;
            }


            /* Existing email check */

            const users = getUsers();

            const existingUser = users.some(user =>
                user &&
                normalizeEmail(user.email || "") === email
            );

            if (existingUser) {

                showMessage(
                    signupStatus,
                    "An account with this email already exists. Please sign in."
                );

                focusField(signupForm, "email");
                return;
            }


            /* Create new account */

            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                phone: phone,
                password: password,
                role: role,
                createdAt: new Date().toISOString()
            };


            /* Save account */

            try {

                users.push(newUser);
                saveUsers(users);

            } catch (error) {

                console.error("Account registration failed:", error);

                showMessage(
                    signupStatus,
                    "Unable to create your account. Please try again."
                );

                return;
            }


            /* Successful signup message */

            showMessage(
                signupStatus,
                "Account created successfully! Please log in.",
                "success"
            );


            /* Return to login after a short delay */

            setTimeout(() => {

                showLoginForm(email);

                showMessage(
                    loginStatus,
                    "Your account is ready! Please enter your password to log in.",
                    "success"
                );

                const loginPasswordInput = document.getElementById(
                    "storageLoginPassword"
                );

                loginPasswordInput?.focus();

            }, 1000);

        });


        /* ==================================================
           10. REMEMBERED EMAIL
        ================================================== */

        const rememberedEmail = localStorage.getItem(
            "stacklyStorageRememberEmail"
        );

        if (rememberedEmail) {

            const emailInput = document.getElementById(
                "storageLoginEmail"
            );

            const rememberCheckbox = loginForm.querySelector(
                'input[name="remember"]'
            );

            if (emailInput) {
                emailInput.value = rememberedEmail;
            }

            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }

        }


        /* ==================================================
           11. CLEAR STATUS WHEN USER TYPES
        ================================================== */

        loginForm.querySelectorAll("input").forEach(input => {

            input.addEventListener("input", () => {
                clearMessage(loginStatus);
            });

        });

        signupForm.querySelectorAll("input").forEach(input => {

            input.addEventListener("input", () => {
                clearMessage(signupStatus);
            });

        });


        /* ==================================================
           12. INITIAL DROPDOWN STATE
        ================================================== */

        closeAllDropdowns();

    });

})();
