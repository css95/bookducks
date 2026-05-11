async function loadBook() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    const bookDetail = document.getElementById("book-detail");

    if (!bookId) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "No book found.";
        bookDetail.appendChild(errorMessage);
        return;
    }

    try {
        const response = await axios.get(`${API_BASE}/books?populate=*`);
        const books = response.data.data;
        const book = books.find(b => b.id == bookId);


        if (!book) {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "No book found.";
            bookDetail.appendChild(errorMessage);
            return;
        }
        
        await renderBook(book);

    } catch (error) {
        console.error("Failed to load book:", error);
    }
}

async function renderBook(book) {
    const bookDetail = document.getElementById("book-detail");

    // LEFT COLUMN - COVER
    const cover = document.createElement("img");
    cover.className = "book-detail__cover";
    cover.src = `${API_URL}${book.cover.url}`;
    cover.alt = book.title;
    cover.loading = "lazy";

    // RIGHT COLUMN - INFO
    const info = document.createElement("div");
    info.className = "book-detail__info";

    // INFO - Title section 
    const titleSection = document.createElement("div");
    titleSection.className = "book-detail__title-section";

    const title = document.createElement("h2");
    title.className = "book-detail__title";
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-detail__author";
    author.textContent = book.author;

    // INFO - Meta section 
    const meta = document.createElement("div");
    meta.className = "book-detail__meta";

    const pages = document.createElement("p");
    pages.className = "book-detail__pages";
    pages.textContent = `${book.pages} pages`;

    const date = document.createElement("p");
    date.className = "book-detail__date";
    const formattedDate = new Date(book.publishedDate).toLocaleDateString("en-GB", {
        year: "numeric", month: "long", day: "numeric"
    });
    date.textContent = `Published: ${formattedDate}`;

    const averageRating = document.createElement("p");
    averageRating.className = "book-detail__average-rating";

    const ratings = await getBookRatings(book.id);
    const average = calculateAverage(ratings);

    if (average === null) {
        averageRating.textContent = "No ratings yet!";
    } else {
        const rounded = average.toFixed(1);
        averageRating.textContent = `⭐ ${rounded} / 10 (${ratings.length} ratings)`;
    }

    meta.appendChild(pages);
    meta.appendChild(date);

    titleSection.appendChild(title);
    titleSection.appendChild(author);
    titleSection.appendChild(meta);
    titleSection.appendChild(averageRating);


    // INFO - Save section (placeholder)
    const saveSection = document.createElement("div");
    saveSection.className = "book-detail__save-section";


    // INFO - Rate section (placeholder)
    const rateSection = document.createElement("div");
    rateSection.className = "book-detail__rate-section";
    const ratePlaceholder = document.createElement("p");
    ratePlaceholder.textContent = "Log in to rate this book";
    ratePlaceholder.style.fontStyle = "italic";
    ratePlaceholder.style.color = "var(--color-text-muted)";
    rateSection.appendChild(ratePlaceholder);

    info.appendChild(titleSection);
    info.appendChild(saveSection);
    info.appendChild(rateSection);

    bookDetail.appendChild(cover);
    bookDetail.appendChild(info);
    renderSaveSection(book, saveSection);

}

async function renderSaveSection(book, saveSection) {
    saveSection.innerHTML = "";

    const token = localStorage.getItem("token");

    if (!token) {
        const placeholder = document.createElement("p");
        placeholder.textContent = "Log in to save this book";
        placeholder.style.fontStyle = "italic";
        placeholder.style.color = "var(--color-text-muted)";
        saveSection.appendChild(placeholder);
        return;
    }

    try {
        const response = await axios.get(`${API_BASE}/users/me?populate=*`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data;
        const savedBooks = user.savedBooks || [];

        const isSaved = savedBooks.some(b => b.id === book.id);

        const button = document.createElement("button");
        button.className = "btn btn--primary";

        if (isSaved) {
            button.textContent = "Remove from list";

            button.addEventListener("click", () => unsaveBook(book, user.id, savedBooks, saveSection));
        } else {
            button.textContent = "Save to list";
            button.addEventListener("click", () => saveBook(book, user.id, savedBooks, saveSection));
        }

        saveSection.appendChild(button);
    } catch (error) {
        console.error("Failed to load saved status:", error);
    }
}

async function saveBook(book, userId, currentSavedBooks, saveSection) {
    const token = localStorage.getItem("token");
    const updatedIds = [...currentSavedBooks.map(b => b.id), book.id];

    try {
        await axios.put(`${API_BASE}/users/${userId}`, {
            savedBooks: updatedIds
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        renderSaveSection(book, saveSection);

    } catch (error) {
        console.error("Failed to save book:", error);
    }
}

async function unsaveBook(book, userId, currentSavedBooks, saveSection) {
    const token = localStorage.getItem("token");

    const updatedIds = currentSavedBooks
        .filter(b => b.id !== book.id)
        .map(b => b.id);

    try {
        await axios.put(`${API_BASE}/users/${userId}`, {
            savedBooks: updatedIds 
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        renderSaveSection(book, saveSection);

    } catch (error) {
        console.error("Failed to remove book:", error);
    }
}

async function getBookRatings(bookId) {
    try {
        const response = await axios.get(`${API_BASE}/ratings?populate=*&filters[book][id][$eq]=${bookId}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch ratings:", error);
        return [];
    }
}

function calculateAverage(ratings) {
    if (ratings.length === 0) {
        return null;
    }

    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return sum / ratings.length;
}

loadBook();