window.addEventListener("load", () => {
  flatpickr(".dateInput", {
    dateFormat: "d-m-Y", // Date format
    minDate: new Date().fp_incr(-30 * 365), // Minimum selectable date is today
    maxDate: new Date().fp_incr(30), // Maximum selectable date is 30 days from today
    disableMobile: true, // Disable mobile-friendly mode
    defaultDate: "today", // Set the default selected date to today
  });
});

function queryReport() {
  let startDate = document.querySelector(".start").value.trim();
  let endDate = document.querySelector(".end").value.trim();
  let sendObj = {
    startDate: startDate,
    endDate: endDate,
  };
  let headers = new Headers({ "Content-Type": "application/json" });
  fetch("/admin/seeFullReport", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(sendObj),
  })
    .then((queryReportResponse) => {
      if (!queryReportResponse.ok) {
        throw new Error(queryReportResponse.text());
      } else {
        return queryReportResponse.text();
      }
    })
    .then((html) => {
      console.log(html);
    })
    .catch((queryReportResponseError) => {
      alert(queryReportResponseError.message);
    });
}
