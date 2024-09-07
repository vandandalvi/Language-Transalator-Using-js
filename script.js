const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

// select menu
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected;
    // If id is 0 set selected to "selected", otherwise set it to an empty string.
    if (id === 0) {
      selected = country_code === "en-GB" ? "selected" : "";
      // If the id is not 0, check if the country code is "de-DE".
      // If it is, set selected to "selected", otherwise set it to an empty string.
    } else if (country_code === "de-DE") {
      selected = "selected";
      // If neither of the above conditions are true, set selected to an empty string.
    } else {
      selected = "";
    }

    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});
// Add a click event listener to the exchangeIcon element.
exchageIcon.addEventListener("click", () => {
  // Swap the values of the fromText and toText elements.
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;

  // Swap the values of the selectTag elements.
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// Add a keyup event listener to the fromText element.
fromText.addEventListener("keyup", () => {
  // If the fromText element is empty, clear the toText element.
  if (!fromText.value) {
    toText.value = "";
  }
});

// Add a click event listener to the translateBtn element.
translateBtn.addEventListener("click", () => {
  // Get the text to translate, and the languages to translate from and to.
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;

  // If the text to translate is empty, return.
  if (!text) return;

  // Set the placeholder of the toText element to "Translating...".
  toText.setAttribute("placeholder", "Translating...");

  // Construct the URL for the translation API.
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  // Fetch data from the API.
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      // Set the translated text in the toText element.
      toText.value = data.responseData.translatedText;

      // Check if there are any alternate translations.
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });

      // Reset the placeholder of the toText element.
      toText.setAttribute("placeholder", "Translation");
    });
});

// Add click event listeners to the icons elements.
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    // If either fromText or toText is empty, return.
    if (!fromText.value || !toText.value) return;
    // If the clicked icon is a copy icon, copy the appropriate text to the clipboard.
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
      // If the clicked icon is a volume icon, speak the appropriate text using the browser's text-to-speech API.
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
