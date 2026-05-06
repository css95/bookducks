async function getBooks() {

    try {
        const response = await axios.get("http://localhost:1337/api/books?populate=*");
        console.log(response.data.data);
        return response.data.data;

    } catch (error) {
        console.error("API error:", error);
        return [];
    }
}
getBooks();