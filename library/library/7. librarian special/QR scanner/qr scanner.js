function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return { date, time };
}

// Function triggered when a QR code is successfully scanned
function onScanSuccess(decodedText) {
  document.getElementById("result").innerText = `Scanned Result: ${decodedText}`;

  // Get the current date and time
  const { date, time } = getCurrentDateTime();

  // Display the borrowing date and time on the page
  document.getElementById("date-time").innerText = `Borrowed Date: ${date}, Time: ${time}`;

  // Show the student form
  document.getElementById("student-form").style.display = "block";

  // Store scanned data globally for form submission
  window.scannedData = { decodedText, date, time };
}

function onScanFailure(error) {
  console.warn(`QR Code scanning failed: ${error}`);
}

function initQrScanner() {
  const qrReader = new Html5Qrcode("qr-reader");
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScanSuccess,
    onScanFailure
  );
}

// Handle form submission
const borrowForm = document.getElementById("borrow-form");
borrowForm.onsubmit = function (event) {
  event.preventDefault();

  const studentName = document.getElementById("student-name").value;
  const studentId = document.getElementById("student-id").value;

  if (window.scannedData) {
    const { decodedText, date, time } = window.scannedData;

    // Save borrowing details to localStorage
    storeBorrowingDetails(decodedText, studentName, studentId, date, time);

    // Notify the user
    alert(
      `Book borrowed successfully!\n\nDetails:\nBook: ${decodedText}\nStudent: ${studentName} (${studentId})\nDate: ${date}, Time: ${time}`
    );

    // Hide the form after submission
    document.getElementById("student-form").style.display = "none";

    // Reset form inputs
    borrowForm.reset();
  } else {
    alert("No book data available. Please scan a QR code first.");
  }
};

// Function to refresh the page
function refreshPage() {
  location.reload(); // Reload the current webpage
}

// Attach an event listener to the refresh button
const refreshButton = document.getElementById("refresh-page");
if (refreshButton) {
  refreshButton.addEventListener("click", refreshPage);
}

// Function to store book borrowing details
function storeBorrowingDetails(bookData, studentName, studentId, date, time) {
  const borrowingDetails = {
    book: bookData,
    studentName: studentName,
    studentId: studentId,
    date: date,
    time: time,
  };

  // Get existing data from localStorage
  const existingDetails = JSON.parse(localStorage.getItem("borrowingDetails")) || [];
  existingDetails.push(borrowingDetails);

  // Update localStorage
  localStorage.setItem("borrowingDetails", JSON.stringify(existingDetails));
}

window.addEventListener("load", initQrScanner);
