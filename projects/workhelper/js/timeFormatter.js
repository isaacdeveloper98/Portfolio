document.addEventListener("DOMContentLoaded", () => {
  function stripAMPM(hourString) {
    return hourString.replace(/\s?(AM|PM)/gi, "").trim();
  }

  function getTimeString(hour, minute) {
    return `${stripAMPM(hour)}:${minute || "00"}`;
  }

  function formatSchedule() {
    const fromHour = document.querySelector("#fromHour").value;
    const fromMinute = document.querySelector("#fromMinute").value || "00";
    const toHour = document.querySelector("#toHour").value;
    const toMinute = document.querySelector("#toMinute").value || "00";
    const centerRaw = document.querySelector("#centerName").value;

    let schedule = `M-F ${getTimeString(fromHour, fromMinute)}-${getTimeString(toHour, toMinute)}`;

    if (centerRaw.trim() !== "") {
      const cleanedCenter = centerRaw.replace(/center/gi, "").trim().toUpperCase();
      schedule += ` (${cleanedCenter})`;
    }

    return schedule;
  }

  function copySchedule() {
    const schedule = formatSchedule();
    navigator.clipboard.writeText(schedule);
  }

  document.querySelector("#copyTimeBtn").addEventListener("click", copySchedule);
});
