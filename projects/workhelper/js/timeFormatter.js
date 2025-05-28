// js/timeFormatter.js
document.addEventListener("DOMContentLoaded", () => {
  function stripAMPM(hourString) {
    return hourString.replace(/\s?(AM|PM)/gi, "").trim();
  }

  function getTimeString(hour, minute) {
    return `${stripAMPM(hour)}:${minute || "00"}`;
  }

  function formatSchedule() {
    const fromHourElement = document.querySelector("#fromHour");
    const fromMinuteElement = document.querySelector("#fromMinute");
    const toHourElement = document.querySelector("#toHour");
    const toMinuteElement = document.querySelector("#toMinute");
    const centerNameElement = document.querySelector("#centerName");

    // Ensure elements exist before trying to get their values
    const fromHour = fromHourElement ? fromHourElement.value : "12";
    const fromMinute = fromMinuteElement ? fromMinuteElement.value : "00";
    const toHour = toHourElement ? toHourElement.value : "12";
    const toMinute = toMinuteElement ? toMinuteElement.value : "00";
    const centerRaw = centerNameElement ? centerNameElement.value : "";

    let schedule = `M-F ${getTimeString(fromHour, fromMinute)}-${getTimeString(toHour, toMinute)}`;

    if (centerRaw.trim() !== "") {
      // Use the cleaning function from main.js
      if (window.cleanCenterNameForTimeFormat) {
        const cleanedCenter = window.cleanCenterNameForTimeFormat(centerRaw);
        if (cleanedCenter) { // Add parenthesis only if cleanedCenter is not empty
            schedule += ` (${cleanedCenter})`;
        }
      } else {
        // Fallback or error if the function isn't available (shouldn't happen if main.js loads first)
        console.warn("cleanCenterNameForTimeFormat function not found. Using basic cleaning for center name.");
        const basicCleaned = centerRaw.replace(/center/gi, "").trim().toUpperCase();
        if (basicCleaned) {
            schedule += ` (${basicCleaned})`;
        }
      }
    }
    return schedule;
  }

  function copySchedule() {
    const schedule = formatSchedule();
    navigator.clipboard.writeText(schedule);
  }

  const copyTimeBtn = document.querySelector("#copyTimeBtn");
  if (copyTimeBtn) {
    copyTimeBtn.addEventListener("click", copySchedule);
  }
});