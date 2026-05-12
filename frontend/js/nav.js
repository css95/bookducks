async function checkIfAdmin(token) {
    try {
        const meResponse = await axios.get(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const userId = meResponse.data.id;

        const userResponse = await axios.get(`${API_BASE}/users/${userId}?populate[role]=*`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return userResponse.data.role?.name === "Admin";
    } catch (error) {
        console.error("Failed to check admin status:", error);
        return false;
    }
}

async function renderNav() {
    const navAuth = document.getElementById("nav-auth");
    if(!navAuth) return;

    const token = localStorage.getItem("token");

    if (token) {
        // LOGGED IN

        const isAdmin = await checkIfAdmin(token);

        if (isAdmin) {
            const adminLink = document.createElement("a");
            adminLink.href = "admin.html";
            adminLink.textContent = "Admin";
            navAuth.appendChild(adminLink);
        } else {
            const profileLink = document.createElement("a");
            profileLink.href = "profile.html";
            profileLink.textContent = "Profile";
            navAuth.appendChild(profileLink);
        }

        const logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.textContent = "Logout";
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
        
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