async function getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await axios.get(
        `${API_BASE}/users/me?populate[savedBooks][populate]=cover&populate[ratings][populate][book][populate]=cover`, 
        { headers: { Authorization: `Bearer ${token}`}
    });

    return response.data;
}

async function loadProfile() {
    const user = await getCurrentUser();
    
    const capitalizedName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
    document.getElementById("profile-greeting").textContent = `You're logged in as ${capitalizedName}`;

    const savedBooks = (user.savedBooks || []).sort((a, b) => a.title.localeCompare(b.title));

    const uniqueRatings = [];
    const collectedRatingIds = [];

    for (const rating of (user.ratings || [])) {
        const alreadyAdded = collectedRatingIds.includes(rating.documentId);

        if (!alreadyAdded) {
            collectedRatingIds.push(rating.documentId);
            uniqueRatings.push(rating);
        }
    }

    const ratings = uniqueRatings.sort((a, b) => 
        a.book.title.localeCompare(b.book.title)
    );

    renderSavedBooks(savedBooks);
    setupSort(savedBooks);  
    renderRatedBooks(ratings);
    setupRatingSort(ratings);

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

function setupRatingSort(ratings) {
    const dropdown = document.getElementById("sort-rated-books");

    dropdown.addEventListener("change", () => {
        const sortBy = dropdown.value;

        ratings.sort((a, b) => {
            if (sortBy === "score") {
                return b.score - a.score;
            } else {
                return a.book[sortBy].localeCompare(b.book[sortBy]);
            }
        }); 

        const list = document.getElementById("rated-books-list");
        list.innerHTML = "";
        renderRatedBooks(ratings);
    })

}

function renderSavedBooks(books) {
    const savedBooksList = document.getElementById("saved-books-list");

    if (books.length === 0) {
        const emptySavedList = document.createElement("p");
        emptySavedList.className = "profile__empty-saved-list";
        emptySavedList.textContent = "Your book list is empty";
        savedBooksList.appendChild(emptySavedList);
        return;
    }

    books.forEach((book) => {
        const bookCard = createProfileBookCard(book);
        savedBooksList.appendChild(bookCard);
    });

}

function renderRatedBooks(ratings) {
    const ratedBooksList = document.getElementById("rated-books-list");

    if (ratings.length === 0) {
        const emptyRatedList = document.createElement("p");
        emptyRatedList.className = "profile__empty-rated-list";
        emptyRatedList.textContent = "You have no rated books.";
        ratedBooksList.appendChild(emptyRatedList);
        return;
    }

    ratings.forEach((rating) => {
        const ratingCard = createRatedBookCard(rating);
        ratedBooksList.appendChild(ratingCard);
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

function createRatedBookCard(rating) {

    const ratedBookCard = document.createElement("div");
    ratedBookCard.className = "rated-book-card";
    ratedBookCard.style.cursor = "pointer";

    const ratedBookCover = document.createElement("img");
    ratedBookCover.className = "rated-book-card__cover";
    ratedBookCover.src = `${API_URL}${rating.book.cover.url}`;
    ratedBookCover.alt = rating.book.title;
    ratedBookCover.loading = "lazy";

    const ratedBookInfo = document.createElement("div");
    ratedBookInfo.className = "rated-book-card__info";

    const ratedBookTitle = document.createElement("h4");
    ratedBookTitle.className = "rated-book-card__title";
    ratedBookTitle.textContent = rating.book.title;

    const ratedBookAuthor = document.createElement("p");
    ratedBookAuthor.className = "rated-book-card__author";
    ratedBookAuthor.textContent = rating.book.author;

    const ratedBookScore = document.createElement("p");
    ratedBookScore.className = "rated-book-card__score";
    ratedBookScore.textContent = `⭐ ${rating.score} / 10`;

    ratedBookInfo.appendChild(ratedBookTitle);
    ratedBookInfo.appendChild(ratedBookAuthor);

    ratedBookCard.appendChild(ratedBookCover);
    ratedBookCard.appendChild(ratedBookInfo);
    ratedBookCard.appendChild(ratedBookScore);

    ratedBookCard.addEventListener("click", () => {
        window.location.href = `book.html?id=${rating.book.id}`;
    });

    return ratedBookCard;
}

loadProfile();