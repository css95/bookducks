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
        
        renderBook(book);

    } catch (error) {
        console.error("Failed to load book:", error);
    }
}


function renderBook(book) {
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
    const formattedDate = new Date(book.publishedDate).toLocaleDateString("en-UK", {
        year: "numeric", month: "long", day: "numeric"
    });
    date.textContent = `Published: ${formattedDate}`;

    meta.appendChild(pages);
    meta.appendChild(date);

    titleSection.appendChild(title);
    titleSection.appendChild(author);
    titleSection.appendChild(meta);


    // INFO - Save section (placeholder)
    const saveSection = document.createElement("div");
    saveSection.className = "book-detail__save-section";
    const savePlaceholder = document.createElement("p");
    savePlaceholder.textContent = "Log in to save this book";
    savePlaceholder.style.fontStyle = "italic";
    savePlaceholder.style.color = "var(--color-text-muted)";
    saveSection.appendChild(savePlaceholder);

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

}

loadBook();