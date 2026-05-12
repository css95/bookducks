function updateHeroGreeting() {
     const heading = document.getElementById("hero-heading");
    if (!heading) return;
    
    const userJson = localStorage.getItem("user");
    if(!userJson) return;

    const user = JSON.parse(userJson);
    const capitalizedName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
    document.getElementById("hero-heading").textContent = `Welcome to Book Ducks, ${capitalizedName}!`;
}

async function getBooks() {

    try {
        const response = await axios.get(`${API_BASE}/books?populate=*`);
        return response.data.data;

    } catch (error) {
        console.error("API error:", error);
        return [];
    }
}

async function getAllRatings() {
    try {
        const response = await axios.get(`${API_BASE}/ratings?populate=*&pagination[pageSize]=100`);
        console.log("Total ratings fetched:", response.data.data.length);
        console.log("Pagination info:", response.data.meta);
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

function createBookCard(book, bookRatings) {
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

    const average = calculateAverage(bookRatings);

    if (average === null) {
        bookRating.textContent = "No ratings yet!";
    } else {
        const rounded = average.toFixed(1);
        bookRating.textContent = `⭐ ${rounded} / 10 (${bookRatings.length} ratings)`;
    }

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
    const allRatings = await getAllRatings();
    const bookList = document.getElementById("bookList");

    books.forEach((book) => {
        const bookRatings = allRatings.filter(r => r.book.id === book.id);

        const bookCard = createBookCard(book, bookRatings);
        bookList.appendChild(bookCard);
    });
}

updateHeroGreeting();
renderBooks();