async function loadAdminPage() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const isAdmin = await checkIfAdmin(token);

    if (!isAdmin) {
        window.location.href = "index.html";
        return;
    }

    setupForm();
}

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

function setupForm() {
    const form = document.getElementById("admin-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Submitted!");
        const token = localStorage.getItem("token");
        
        document.getElementById("form-error").textContent = "";
        document.getElementById("form-success").textContent = "";

        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const pages = parseInt(document.getElementById("book-pages").value);
        const publishedDate = document.getElementById("book-date").value;
        const cover = document.getElementById("book-cover");
        const file = cover.files[0];

        if (!file) {
            document.getElementById("form-error").textContent = "Please select a cover image.";
            return;
        }

        try {
            const formData = new FormData();
            formData.append("files", file);

            const uploadResponse = await axios.post(`${API_BASE}/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const imageId = uploadResponse.data[0].id;

            await axios.post(`${API_BASE}/books`, {
                data: {
                    title: title,
                    author: author,
                    pages: pages,
                    publishedDate: publishedDate,
                    cover: imageId
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            form.reset();
            window.location.href = "index.html";

        } catch (error) {
            document.getElementById("form-error").textContent = "Failed to add book.";
            console.error(error);
        }

    })

}

loadAdminPage();