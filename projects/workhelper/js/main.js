document.addEventListener("DOMContentLoaded", () => {
  function copyText(selector) {
    const input = document.querySelector(selector);
    navigator.clipboard.writeText(input.value.trim());
  }

  function cleanCenterName(raw) {
    return raw.toLowerCase().replace(/center/g, "").trim().toUpperCase();
  }

  function copyCenterName() {
    const input = document.querySelector("#centerName");
    const cleaned = cleanCenterName(input.value);
    navigator.clipboard.writeText(cleaned);
  }

  function copy106S() {
    navigator.clipboard.writeText("106S");
  }

  function resetAll() {
    document.querySelectorAll("input").forEach(input => input.value = "");
    document.querySelectorAll("select").forEach(select => {
      select.selectedIndex = -1;
    });
  }

  document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.closest(".toggle-block").querySelector(".toggle-content");
      content.classList.toggle("hidden");
      button.textContent = content.classList.contains("hidden") ? "+" : "−";
    });
  });

  document.querySelector("#copyNameBtn").addEventListener("click", () => copyText("#name"));
  document.querySelector("#copyCenterBtn").addEventListener("click", copyCenterName);
  document.querySelector("#copy106SBtn").addEventListener("click", copy106S);
  document.querySelector("#resetBtn").addEventListener("click", resetAll);

  window.cleanCenterName = cleanCenterName;
});
