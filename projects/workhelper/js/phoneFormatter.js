document.addEventListener("DOMContentLoaded", () => {
  function formatPhoneNumber(raw) {
    let digits = raw.replace(/\D/g, ""); // Remove all non-digits

    // If less than 10 digits, pad with leading zeros
    if (digits.length < 10) {
      digits = digits.padStart(10, "0");
    } else {
      digits = digits.slice(-10); // Only keep the last 10 digits
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function copyFormattedPhone() {
    const input = document.querySelector("#phoneInput");
    const formatted = formatPhoneNumber(input.value);
    navigator.clipboard.writeText(formatted);
  }

  document.querySelector("#copyPhoneBtn").addEventListener("click", copyFormattedPhone);
});
