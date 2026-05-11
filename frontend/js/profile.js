async function getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await axios.get(`${API_BASE}/users/me?populate[savedBooks][populate]=cover`, {
        headers: { Authorization: `Bearer ${token}`}
    });

    return response.data;
}

async function loadProfile() {
    const user = await getCurrentUser();
    document.getElementById("profile-greeting").textContent = `Welcome, ${user.username}`;

    renderSavedBooks(user.savedBooks);

    setupSort(user.savedBooks);

}

function setupSort(savedBooks) {
    const dropdown = document.getElementById("sort-saved-books");

    dropdown.addEventListener("change", () => {
        const sortBy = dropdown.value;

        savedBooks.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

        const list = document.getElementById("saved-books-list");
        list.innerHTML = "";
        renderSavedBooks(savedBooks);
    });
}

function renderSavedBooks(books) {
    const savedBooksList = document.getElementById("saved-books-list");

    if (books.length === 0) {
        const emptyList = document.createElement("p");
        emptyList.className = "profile__emptyList";
        emptyList.textContent = "Your book list is empty";
        savedBooksList.appendChild(emptyList);
        return;
    }

    books.forEach((book) => {
        const bookCard = createProfileBookCard(book);
        savedBooksList.appendChild(bookCard);
    });

}

function createProfileBookCard(book) {
    
    const profileBookCard = document.createElement("div");
    profileBookCard.className = "profile-book-card";
    profileBookCard.style.cursor = "pointer";

    const profileBookCover = document.createElement("img");
    profileBookCover.className = "profile-book-card__cover";
    profileBookCover.src = `${API_URL}${book.cover.url}`;
    profileBookCover.alt = book.title;
    profileBookCover.loading = "lazy";

    const profileBookCardInfo = document.createElement("div");
    profileBookCardInfo.className = "profile-book-card__info";

    const bookCardTitle = document.createElement("h4");
    bookCardTitle.className = "profile-book-card__title";
    bookCardTitle.textContent = book.title;

    const bookCardAuthor = document.createElement("p");
    bookCardAuthor.className = "profile-book-card__author";
    bookCardAuthor.textContent = book.author;

    const removeBtn = document.createElement("button");
    removeBtn.className = "profile-book-card__remove-btn";
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        
        const token = localStorage.getItem("token");
        const currentUser = await getCurrentUser();

        const remainingBooks = currentUser.savedBooks.filter(savedBook => savedBook.id !== book.id);
        const updatedIds = remainingBooks.map(savedBook => savedBook.id);

        try {
            await axios.put(`${API_BASE}/users/${currentUser.id}`, {
                savedBooks: updatedIds
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to remove book:", error);
        }
    });

    profileBookCardInfo.appendChild(bookCardTitle);
    profileBookCardInfo.appendChild(bookCardAuthor);

    profileBookCard.appendChild(profileBookCover);
    profileBookCard.appendChild(profileBookCardInfo);
    profileBookCard.appendChild(removeBtn);

    profileBookCard.addEventListener("click", () => {
        window.location.href = `book.html?id=${book.id}`;
    });

    return profileBookCard;

}

loadProfile();