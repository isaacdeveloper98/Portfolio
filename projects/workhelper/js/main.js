// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  function copyText(selector) {
    const input = document.querySelector(selector);
    if (input) { 
      navigator.clipboard.writeText(input.value.trim())
        .catch(err => console.error('Failed to copy text: ', err));
    }
  }

  function cleanCenterNameForTimeFormat(rawName) {
    if (!rawName) return "";
    const withoutPrefix = rawName.replace(/^[a-zA-Z]{2}_/, ""); 
    return withoutPrefix.replace(/center/gi, "").trim().toUpperCase();
  }

  function copyFullCenterName() {
    const inputElement = document.querySelector("#centerName");
    if (inputElement) {
      navigator.clipboard.writeText(inputElement.value)
        .catch(err => console.error('Failed to copy center name: ', err));
    }
  }

  function copy106S() {
    navigator.clipboard.writeText("106S")
      .catch(err => console.error('Failed to copy 106S: ', err));
  }

  function resetAll() {
    // Clear text inputs and textareas
    document.querySelectorAll("input[type='text'], input[type='tel'], textarea").forEach(input => {
        if(input) input.value = "";
    });

    // Reset select elements
    document.querySelectorAll("select").forEach(select => {
      if (select) {
        if (select.multiple) {
          Array.from(select.options).forEach(option => option.selected = false);
        } else {
          select.selectedIndex = 0; 
        }
      }
    });

    // Reset day checkboxes to new default (M-F checked, SA/SU unchecked)
    document.querySelectorAll("#day-selector .day-checkbox").forEach(checkbox => {
      const isWeekend = checkbox.value === 'SA' || checkbox.value === 'SU';
      checkbox.checked = !isWeekend;

      const label = checkbox.closest('label');
      if (label) {
        if (isWeekend) {
          label.classList.remove('active');
        } else {
          label.classList.add('active');
        }
      }
    });
  }

  // Toggle button functionality
  document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.closest(".toggle-block").querySelector(".toggle-content");
      if (content) {
        content.classList.toggle("hidden");
        button.textContent = content.classList.contains("hidden") ? "+" : "−";
      }
    });
  });

  // Event Listeners
  const copyNameBtn = document.querySelector("#copyNameBtn");
  if (copyNameBtn) {
    copyNameBtn.addEventListener("click", () => copyText("#name"));
  }

  const copyCenterBtn = document.querySelector("#copyCenterBtn");
  if (copyCenterBtn) {
    copyCenterBtn.addEventListener("click", copyFullCenterName); 
  }

  const copy106SBtn = document.querySelector("#copy106SBtn");
  if (copy106SBtn) {
    copy106SBtn.addEventListener("click", copy106S);
  }

  const resetBtn = document.querySelector("#resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAll);
  }

  // Expose the cleaning function for timeFormatter.js to use
  window.cleanCenterNameForTimeFormat = cleanCenterNameForTimeFormat;
});