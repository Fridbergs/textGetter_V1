// popup.js

document.addEventListener("DOMContentLoaded", function () {
  displaySavedData();
  document.getElementById("getDataButton").addEventListener("click", getData);
  document.getElementById("savedTable").addEventListener("click", copyData); // Attach copyData to the click event of the table
});

function displaySavedData() {
  let savedTable = document.getElementById("savedTable");

  // Retrieve the counter value from sessionStorage
  let counter = parseInt(sessionStorage.getItem("savedTextCounter")) || 0;

  // Iterate over sessionStorage keys for the specific site
  for (let i = 1; i <= counter; i++) {
    let key = "savedText" + i;
    let value = sessionStorage.getItem(key);

    if (value !== null) {
      let row = savedTable.insertRow(-1);
      let cell1 = row.insertCell(0);

      // Set the content of the cell directly to the value
      cell1.textContent = value;
    }
  }
}

function getData() {
  chrome.runtime.sendMessage({ action: "getSavedData" }, function (response) {
    let savedTable = document.getElementById("savedTable");
    savedTable.innerHTML = ""; // Clear the table before populating with new data

    for (let i = 0; i < response.data.length; i++) {
      let value = response.data[i].value;

      let row = savedTable.insertRow(-1);
      let cell1 = row.insertCell(0);

      // Set the content of the cell directly to the value
      cell1.textContent = value;
    }
  });
}

// popup.js

function copyData() {
  let savedData = "";

  // Iterate over the displayed cells in the table
  let cells = document.querySelectorAll("#savedTable td");
  cells.forEach((cell) => {
    savedData += cell.textContent.trim() + "\n";
  });

  // Copy the concatenated data to the clipboard
  navigator.clipboard.writeText(savedData);
}
