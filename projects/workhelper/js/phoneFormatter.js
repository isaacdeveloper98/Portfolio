// js/phoneFormatter.js
document.addEventListener("DOMContentLoaded", () => {
  function copyFormattedPhone() {
    const phoneInput = document.querySelector("#phoneInput");
    const rawInput = phoneInput.value.trim();

    // 1. Get only the digits from the input string.
    const allDigits = rawInput.replace(/\D/g, "");

    // 2. Get the last 10 digits.
    const last10Digits = allDigits.slice(-10);

    // 3. Validate the extracted number.
    if (last10Digits.length === 10) {
      // Area codes (the first 3 digits of the 10) cannot start with 0 or 1.
      const areaCode = last10Digits.substring(0, 3);
      if (areaCode.startsWith('0') || areaCode.startsWith('1')) {
        alert("Invalid US phone number. The area code (first three digits) cannot start with 0 or 1.");
        return; // Stop execution
      }

      // 4. Format the number.
      const formattedNumber = `${areaCode}-${last10Digits.slice(3, 6)}-${last10Digits.slice(6)}`;
      
      // 5. Copy to clipboard.
      navigator.clipboard.writeText(formattedNumber)
        .then(() => {
          const copyBtn = document.querySelector("#copyPhoneBtn");
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
          }
        })
        .catch(err => {
          console.error("Failed to copy phone number: ", err);
          alert("Failed to copy phone number. See console for details.");
        });
    } else {
      alert("Please enter a valid phone number with at least 10 digits.");
    }
  }

  document.querySelector("#copyPhoneBtn").addEventListener("click", copyFormattedPhone);
});
