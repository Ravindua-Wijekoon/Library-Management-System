let books = JSON.parse(localStorage.getItem("books")) || [];

function loadBooks() {
    const bookTable = document.getElementById("bookTable");
    bookTable.innerHTML = "";

    books.forEach((book, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.copies}</td>
            <td>${book.description}</td>
            <td>
                <button class="delete" onclick="deleteBook(${index})">Remove</button>
            </td>
        `;
        bookTable.appendChild(row);
    });
}

function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const isbn = document.getElementById("bookISBN").value;
    const copies = document.getElementById("bookCopies").value;
    const description = document.getElementById("bookDescription").value;

    books.push({ title, author, isbn, copies,description });
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

function deleteBook(index) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

document.getElementById("addBookForm").addEventListener("submit", addBook);
window.addEventListener("load", loadBooks);
