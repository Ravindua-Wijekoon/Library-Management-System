// Function to calculate the fine based on the borrowing date
function calculateFine(borrowedDate) {
    const today = new Date();
    const borrowedDateObj = new Date(borrowedDate);

    // Calculate the difference in time between today and the borrowed date
    const timeDifference = today - borrowedDateObj;

    // Convert time difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    // If the book is returned later than 14 days, calculate fine
    const fineStartDate = 14; // 14 days grace period
    if (daysDifference > fineStartDate) {
        const extraDays = daysDifference - fineStartDate;
        return extraDays * 10; // 10 LKR per day fine
    }
    return 0; // No fine if returned within 14 days
}

// Function to load borrowing details and render them in the table
function loadBorrowingDetails() {
    const borrowingDetails = JSON.parse(localStorage.getItem("borrowingDetails")) || [];
    const tableBody = document.querySelector("#borrowing-table tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    const today = new Date();

    borrowingDetails.forEach((detail, index) => {
        const row = document.createElement("tr");

        // Calculate return date (2 weeks from borrowed date)
        const borrowedDate = new Date(detail.date);
        const returnDate = new Date(borrowedDate);
        returnDate.setDate(borrowedDate.getDate() + 14);

        // Calculate fines
        const fine = calculateFine(detail.date);

        // Ensure renew count is initialized
        if (typeof detail.renewCount === "undefined") {
            detail.renewCount = 0;
        }

        // Populate the table row
        row.innerHTML = `
            <td>${detail.book}</td>
            <td>${detail.studentName}</td>
            <td>${detail.studentId}</td>
            <td>${detail.date}</td>
            <td>${detail.time}</td>
            <td>${fine > 0 ? fine + " LKR" : "No Fine"}</td>
            <td>
                <button class="received-button" data-index="${index}">Received</button>
                ${
                    today <= returnDate && detail.renewCount < 2
                        ? `<button class="renew-button" data-index="${index}">Renew</button>`
                        : ""
                }
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Save updated borrowing details back to localStorage
    localStorage.setItem("borrowingDetails", JSON.stringify(borrowingDetails));

    // Attach event listeners for buttons
    attachButtonListeners();
}

// Function to attach event listeners to buttons
function attachButtonListeners() {
    // Handle Received button clicks
    document.querySelectorAll(".received-button").forEach((button) => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            removeBorrowingDetail(index);
        });
    });

    // Handle Renew button clicks
    document.querySelectorAll(".renew-button").forEach((button) => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            renewBorrowingDetail(index);
        });
    });
}

// Function to remove a borrowing detail
function removeBorrowingDetail(index) {
    const borrowingDetails = JSON.parse(localStorage.getItem("borrowingDetails")) || [];
    borrowingDetails.splice(index, 1); // Remove the selected detail
    localStorage.setItem("borrowingDetails", JSON.stringify(borrowingDetails)); // Update localStorage
    loadBorrowingDetails(); // Reload the table
}

// Function to renew a borrowing detail
function renewBorrowingDetail(index) {
    const borrowingDetails = JSON.parse(localStorage.getItem("borrowingDetails")) || [];
    const detail = borrowingDetails[index];

    // Reset fines and extend return date
    detail.date = new Date().toLocaleDateString();
    detail.fine = 0;
    detail.renewCount += 1;

    // Save updated data back to localStorage
    localStorage.setItem("borrowingDetails", JSON.stringify(borrowingDetails));

    // Reload the table
    loadBorrowingDetails();
}

// Load details on page load
window.addEventListener("load", loadBorrowingDetails);

