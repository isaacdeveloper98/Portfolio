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

    // Get selected days and check for the M-F case
    const dayCheckboxes = document.querySelectorAll("#day-selector .day-checkbox:checked");
    const selectedDaysString = Array.from(dayCheckboxes).map(cb => cb.value).join('');
    
    let dayPrefix = '';
    if (selectedDaysString === 'MTWRF') {
      dayPrefix = 'M-F ';
    } else if (selectedDaysString) {
      dayPrefix = selectedDaysString + ' ';
    }

    // Ensure elements exist before trying to get their values
    const fromHour = fromHourElement ? fromHourElement.value : "12";
    const fromMinute = fromMinuteElement ? fromMinuteElement.value : "00";
    const toHour = toHourElement ? toHourElement.value : "12";
    const toMinute = toMinuteElement ? toMinuteElement.value : "00";
    
    let schedule = `${dayPrefix}${getTimeString(fromHour, fromMinute)}-${getTimeString(toHour, toMinute)}`;

    // Check if the Center Name section is visible AND has text before adding it
    const centerRaw = centerNameElement ? centerNameElement.value : "";
    const centerContentDiv = centerNameElement.closest('.toggle-content');
    
    if (centerContentDiv && !centerContentDiv.classList.contains('hidden') && centerRaw.trim() !== "") {
      if (window.cleanCenterNameForTimeFormat) {
        const cleanedCenter = window.cleanCenterNameForTimeFormat(centerRaw);
        if (cleanedCenter) {
            schedule += ` (${cleanedCenter})`;
        }
      } else {
        console.warn("cleanCenterNameForTimeFormat function not found. Using basic cleaning.");
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

  function setTime(fromH, fromM, toH, toM) {
    document.querySelector("#fromHour").value = fromH;
    document.querySelector("#fromMinute").value = fromM;
    document.querySelector("#toHour").value = toH;
    document.querySelector("#toMinute").value = toM;
  }

  // Event Listeners
  document.querySelector("#copyTimeBtn").addEventListener("click", copySchedule);
  document.querySelector("#preset8to5Btn").addEventListener("click", () => setTime("8", "00", "5", "00"));
  document.querySelector("#preset3to7Btn").addEventListener("click", () => setTime("3", "00", "7", "00"));
});