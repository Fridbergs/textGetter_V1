// background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSavedData") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        console.error("Ingen aktiv flik hittades.");
        return;
      }

      let tabId = tabs[0].id;

      // Skicka meddelande till innehållsskriptet för att hämta datan
      chrome.tabs.sendMessage(
        tabId,
        { action: "retrieveData" },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }

          // Skicka det erhållna datat som svar
          sendResponse({ data: response });
        }
      );
    });

    // Återkommer i `true` för att indikera att `sendResponse` kommer att kallas asynkront
    return true;
  }
});
