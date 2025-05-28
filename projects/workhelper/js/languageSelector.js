// js/languageSelector.js
document.addEventListener("DOMContentLoaded", () => {
  const languageSelectElement = document.querySelector("#languageSelect");

  if (languageSelectElement && languageSelectElement.multiple) {
    // Convert HTMLCollection to Array to use forEach, or use a standard for loop
    const options = Array.from(languageSelectElement.options);

    options.forEach(option => {
      option.addEventListener("mousedown", function(event) {
        // Prevent the default browser selection behavior.
        // This is key to implementing the custom toggle.
        event.preventDefault();

        // Toggle the 'selected' state of the clicked option.
        this.selected = !this.selected;

        // Manually dispatch a 'change' event on the select element.
        // This is good practice if other parts of your application might be
        // listening for changes on this select element.
        languageSelectElement.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  function copySelectedLanguages() {
    // Ensure the select element is an HTMLSelectElement
    if (languageSelectElement instanceof HTMLSelectElement) {
      const selected = Array.from(languageSelectElement.selectedOptions) // Directly use selectedOptions
                       .map(opt => opt.value); // Get the value of each selected option
      
      const languageList = selected.join(", ");
      
      navigator.clipboard.writeText(languageList)
        .then(() => {
          // Optional: Provide user feedback on successful copy
          const copyBtn = document.querySelector("#copyLanguagesBtn");
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
          }
        })
        .catch(err => {
          console.error("Failed to copy languages: ", err);
          alert("Failed to copy languages. See console for details.");
        });
    } else {
      console.error("#languageSelect element not found or is not a select element.");
      alert("Language select element not found. Cannot copy languages.");
    }
  }

  const copyLanguagesBtn = document.querySelector("#copyLanguagesBtn");
  if (copyLanguagesBtn) {
    copyLanguagesBtn.addEventListener("click", copySelectedLanguages);
  }
});