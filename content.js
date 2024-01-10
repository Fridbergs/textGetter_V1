// content.js

// Retrieve the savedTextCounter and keyOrderArray from sessionStorage
let savedTextCounter =
  parseInt(sessionStorage.getItem("savedTextCounter")) || 0;
let keyOrderArray = JSON.parse(sessionStorage.getItem("keyOrderArray")) || [];

// Sort the keyOrderArray based on the counter value
keyOrderArray.sort((a, b) => {
  const indexA = parseInt(a.replace("savedText", ""));
  const indexB = parseInt(b.replace("savedText", ""));
  return indexA - indexB;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "retrieveData") {
    // Use the sorted keyOrderArray to maintain the order of keys
    let data = keyOrderArray.map((key) => ({
      key,
      value: sessionStorage.getItem(key),
    }));

    sendResponse(data);
  }
});

let isCKeyPressed = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "c") {
    isCKeyPressed = true;
    document.body.style.cursor = "grab";
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "c") {
    isCKeyPressed = false;
    document.body.style.cursor = "default";
  }
});

document.addEventListener("click", function (event) {
  let clickedElement = event.target;
  if (clickedElement && isCKeyPressed) {
    let elementContent = clickedElement.innerText;
    let key = "savedText" + ++savedTextCounter;

    // Update keyOrderArray and store it in sessionStorage
    keyOrderArray.push(key);
    keyOrderArray.sort((a, b) => {
      const indexA = parseInt(a.replace("savedText", ""));
      const indexB = parseInt(b.replace("savedText", ""));
      return indexA - indexB;
    });

    sessionStorage.setItem("keyOrderArray", JSON.stringify(keyOrderArray));
    sessionStorage.setItem("savedTextCounter", savedTextCounter.toString());
    sessionStorage.setItem(key, elementContent);

    if (clickedElement.tagName === "A") {
      event.preventDefault();
    }
  }
});

// Debugging code to log sessionStorage content
document.addEventListener("keydown", function (event) {
  if (event.key === "d") {
    console.log("sessionStorage content:", sessionStorage);
  }
});
