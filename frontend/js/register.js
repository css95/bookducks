const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("form-error").textContent = "";

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        const formError = document.getElementById("form-error");
        formError.textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await axios.post(`${API_BASE}/auth/local/register`, {
            username: username,
            email: email,
            password: password
        });

        const token = response.data.jwt;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "index.html";

    } catch (error) {
        const formError = document.getElementById("form-error");
        formError.textContent = "Registration failed.";
        console.error(error);
    }

});