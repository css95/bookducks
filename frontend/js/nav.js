function renderNav() {
    const navAuth = document.getElementById("nav-auth");
    if(!navAuth) return;

    const token = localStorage.getItem("token");

    if (token) {
        // LOGGED IN
        const profileLink = document.createElement("a");
        profileLink.href = "profile.html";
        profileLink.textContent = "Profile";

        const logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.textContent = "Logout";
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });

        navAuth.appendChild(profileLink);
        navAuth.appendChild(logoutLink);

    } else {
        // LOGGED OUT
        const loginLink = document.createElement("a");
        loginLink.href = "login.html";
        loginLink.textContent = "Login";

        const registerLink = document.createElement("a");
        registerLink.href = "register.html";
        registerLink.textContent = "Register";

        navAuth.appendChild(loginLink);
        navAuth.appendChild(registerLink);

    }
}

renderNav();