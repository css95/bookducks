async function getBooks() {

    try {
        const response = await axios.get(`${API_BASE}/books?populate=*`);
        console.log(response.data.data);
        return response.data.data;

    } catch (error) {
        console.error("API error:", error);
        return [];
    }
}

function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.style.cursor = "pointer";

    const coverSection = document.createElement("div");
    coverSection.className = "book-card__cover-wrapper";

    const bookCover = document.createElement("img");
    bookCover.className = "book-card__cover";
    bookCover.src = `${API_URL}${book.cover.url}`;
    bookCover.alt = book.title;
    bookCover.loading = "lazy";
    
    const bookCardBody = document.createElement("div");
    bookCardBody.className = "book-card__body";

    const bookName = document.createElement("h2");
    bookName.className = "book-card__name";
    bookName.textContent = book.title;

    const bookAuthor = document.createElement("h3");
    bookAuthor.className = "book-card__author";
    bookAuthor.textContent = book.author;

    const bookRating = document.createElement("p");
    bookRating.className = "book-card__rating";
    bookRating.textContent = "★ –/10";
    
    coverSection.appendChild(bookCover);

    bookCardBody.appendChild(bookName);
    bookCardBody.appendChild(bookAuthor);
    bookCardBody.appendChild(bookRating);

    bookCard.appendChild(coverSection);
    bookCard.appendChild(bookCardBody);

    bookCard.addEventListener("click", () => {
        window.location.href = `book.html?id=${book.id}`;
    });

    return bookCard;
}

async function renderBooks() {

    const books = await getBooks();
    const bookList = document.getElementById("bookList");

    books.forEach((book) => {
        const bookCard = createBookCard(book);
        bookList.appendChild(bookCard);
    })

}

renderBooks();