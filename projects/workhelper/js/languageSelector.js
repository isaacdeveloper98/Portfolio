document.addEventListener("DOMContentLoaded", () => {
  function copySelectedLanguages() {
    const select = document.querySelector("#languageSelect");
    const selected = Array.from(select.selectedOptions).map(option => option.value);
    const languageList = selected.join(", ");
    navigator.clipboard.writeText(languageList);
  }

  document.querySelector("#copyLanguagesBtn").addEventListener("click", copySelectedLanguages);
});
