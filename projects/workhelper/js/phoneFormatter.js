// js/phoneFormatter.js
document.addEventListener("DOMContentLoaded", () => {
  function copyFormattedPhone() {
    const phoneInput = document.querySelector("#phoneInput");
    const rawInput = phoneInput.value.trim(); // Remove leading/trailing whitespace

    let numberPart = rawInput; // This will hold the part of the string we expect to be the 10-digit number

    // Regular expression to check for a prefix like (1), (22), etc.
    // It looks for digits inside parentheses, followed by optional spaces, then the rest of the number.
    const bracketPrefixMatch = rawInput.match(/^(\(\s*\d+\s*\))\s*(.*)/);

    if (rawInput.startsWith("+1")) {
      // Handles "+1 XXX XXX XXXX" or "+1XXXXXXXXXX"
      numberPart = rawInput.substring(2).trim(); // Remove "+1" and any space after it
    } else if (bracketPrefixMatch) {
      // Handles "(1) XXX XXX XXXX"
      // const potentialPrefix = bracketPrefixMatch[1]; // e.g., "(1)" - not strictly needed for logic
      numberPart = bracketPrefixMatch[2].trim(); // The rest of the number after "(X) "
    } else if (rawInput.startsWith("1") && rawInput.replace(/\D/g, "").length === 11) {
      // Handles "1 XXX XXX XXXX" or "1XXXXXXXXXX" (where '1' is a prefix to 10 other digits)
      // This ensures we only strip '1' if it's part of an 11-digit sequence (country code + 10 digits)
      numberPart = rawInput.substring(1).trim(); // Remove the leading "1"
    }
    // If none of the above, numberPart remains the rawInput (trimmed),
    // and we'll check if it's a 10-digit number on its own.

    // Now, get only the digits from the identified numberPart
    const digitsInNumberPart = numberPart.replace(/\D/g, "");

    if (digitsInNumberPart.length === 10) {
      // ADDITIONAL VALIDATION: US area codes (first digit of the 10) cannot start with 0 or 1.
      if (digitsInNumberPart.startsWith('0') || digitsInNumberPart.startsWith('1')) {
        alert("Invalid US phone number. The 10-digit number (area code) cannot start with 0 or 1.");
      } else {
        const formattedNumber = `${digitsInNumberPart.slice(0, 3)}-${digitsInNumberPart.slice(3, 6)}-${digitsInNumberPart.slice(6)}`;
        navigator.clipboard.writeText(formattedNumber)
          .then(() => {
            // Optional: Add a success message or visual feedback
            // e.g., change button text temporarily
            const copyBtn = document.querySelector("#copyPhoneBtn");
            if (copyBtn) { // Check if button exists
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied!";
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            }
          })
          .catch(err => {
            console.error("Failed to copy phone number: ", err);
            alert("Failed to copy phone number. See console for details.");
          });
      }
    } else {
      alert("The phone number is incorrect.");
    }
  }

  document.querySelector("#copyPhoneBtn").addEventListener("click", copyFormattedPhone);
});