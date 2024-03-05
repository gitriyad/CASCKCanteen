// date input
window.addEventListener("load", () => {
  flatpickr(".dateInput", {
    dateFormat: "d-m-Y", // Date format
    minDate: new Date().fp_incr(-30 * 365), // Minimum selectable date is today
    maxDate: new Date().fp_incr(30), // Maximum selectable date is 30 days from today
    disableMobile: true, // Disable mobile-friendly mode
    defaultDate: "today", // Set the default selected date to today
  });
});
function submitExpense() {
  let userId = document.querySelector(".user").getAttribute("user-id");
  let category = document.querySelector(".expenseCategory").value.trim();
  let cost = Number(document.querySelector(".expenseCost").value.trim());
  let date = document.querySelector(".dateInput").value.trim();
  let [d, m, y] = date.split("-");
  date = new Date(`${y}-${m}-${d}`);
  let sendObj = {
    category: category,
    cost: cost,
    user: userId,
    date: date,
  };
  let headers = new Headers({ "Content-Type": "application/json" });
  fetch("/admin/addExpense", {
    method: "POST",
    body: JSON.stringify(sendObj),
    headers: headers,
  })
    .then((addExpenseResponse) => {
      if (!addExpenseResponse.ok) {
        throw new Error(addExpenseResponse.text());
      } else {
        return addExpenseResponse.text();
      }
    })
    .then((addExpenseData) => {
      alert(addExpenseData);
      window.location.reload();
    })
    .catch((addExpenseError) => {
      alert(addExpenseError.message);
    });
}
