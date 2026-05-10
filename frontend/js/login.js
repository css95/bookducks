const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("form-error").textContent = "";
    
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;

    try {

        const response = await axios.post(`${API_BASE}/auth/local`, {
            identifier: identifier,
            password: password
        });

        const token = response.data.jwt;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "index.html";

    } catch (error) {
        const formError = document.getElementById("form-error");
        formError.textContent = "Wrong email or password.";
        console.error(error);
    }
});