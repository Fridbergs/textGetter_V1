// popup.js

document.addEventListener("DOMContentLoaded", function () {
  displaySavedData();
  document.getElementById("getDataButton").addEventListener("click", getData);
  document.getElementById("savedTable").addEventListener("click", copyData); // Attach copyData to the click event of the table
  document.getElementById("downloadData").addEventListener("click", createCsv); // Add event listener for "Download Data" button
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

function createCsv() {
  var table = document.getElementById("savedTable");
  var rows = table.getElementsByTagName("tr");
  var csvContent = [];

  // Add header row
  var headerRow = [];
  var headerCells = rows[0].getElementsByTagName("td");
  for (var k = 0; k < headerCells.length; k++) {
    headerRow.push("extracted text");
  }
  csvContent.push(headerRow.join(","));

  // Add data rows
  for (var i = 0; i < rows.length; i++) {
    var rowData = [];
    var cells = rows[i].getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) {
      rowData.push(cells[j].innerText);
    }

    csvContent.push(rowData.join(","));
  }

  var csvString = csvContent.join("\n");

  var blob = new Blob([csvString], { type: "text/csv" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
