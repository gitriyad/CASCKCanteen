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
      let { productsArr, totalExpense, expenseArr } = JSON.parse(html);
      generateProductsReport(productsArr, startDate, endDate);
      generateIncomeExpenseReport(productsArr, totalExpense, expenseArr);
      displayHeaders();
    })
    .catch((queryReportResponseError) => {
      alert(queryReportResponseError.message);
    });
}

function generateProductsReport(productsArr, startDate, endDate) {
  let productDetailsDiv = document.querySelector(".productDetailsDiv");
  let prod = document.createElement("div");
  prod.className = "product";
  productsArr.forEach((product) => {
    prod.setAttribute("prod-id", product._id);
    prod.setAttribute(
      "onclick",
      `window.location.href="/admin/showSingleProductDetails/${product._id}/${startDate}/${endDate}"`
    );
    prod.innerHTML = `
            <div class="image" style="background-image:url('/upload/products/${
              product.productBrand
            }/${product.productName}/${product.productImage}')">
             ${
               product.top
                 ? product.top
                     .map((top) => `<div class="top">${top}</div>`)
                     .join("")
                 : ""
             }
            </div>
            <div class="details">
              <div class="group">
                <div class="lable">নামঃ</div>
                <div class="data">${product.productName}</div>
              </div>
              <div class="group">
                <div class="lable">মোট বিক্রির পরিমানঃ</div>
                <div class="data">${product.totalSellQuantity}</div>
              </div>
              <div class="group">
                <div class="lable">মোট আয়ঃ</div>
                <div class="data">${product.totalIncome}</div>
              </div>
              <div class="group">
                <div class="lable">মোট ক্রয়ের পরিমানঃ</div>
                <div class="data">${product.totalPurchase}</div>
              </div>
              <div class="group">
                <div class="lable">মোট ব্যায়ঃ</div>
                <div class="data">${product.totalProductPurchaseCost}</div>
              </div>
              <div class="group">
                <div class="lable">বর্তমান স্টকঃ</div>
                <div class="data">${product.totalStock}</div>
              </div>
              <div class="group">
                <div class="lable">বর্তমান স্টক ভ্যালুঃ</div>
                <div class="data">${product.stockValue}</div>
              </div>
            </div>
        `;
    productDetailsDiv.append(prod.cloneNode(true));
  });
}
function generateIncomeExpenseReport(productsArr, totalExpense, expenseArr) {
  let incomeExpenseDiv = document.querySelector(".incomeExpenseDiv");
  let statementDiv = document.createElement("div");
  statementDiv.className = "statement";
  let startDate = document.querySelector(".start").value.trim();
  let endDate = document.querySelector(".end").value.trim();
  let day = getDay(startDate, endDate);
  let totalIncome = 0,
    totalProfit = 0;
  productsArr.forEach((pro) => {
    totalIncome += pro.totalIncome;
    totalProfit += pro.totalProfit;
  });
  let nonProductExpenses = expenseArr.filter((ex) => ex.product == null);
  nonProductExpenses.map((ex) => {
    let [m, d, y] = new Date(ex.date).toLocaleDateString().split("/");
    ex.date = `${d.padStart(2, "0")} - ${m.padStart(2, "0")} - ${y}`;
    return ex;
  });
  let totalNonProductExpense = nonProductExpenses.reduce(
    (sum, ex) => sum + ex.expenseCost,
    0
  );
  statementDiv.innerHTML = `
  <div class="totalIncome">
              <div class="lable">সর্বমোট আয়ঃ</div>
              <div class="data expense">${totalIncome}</div>
            </div>
            <div class="productExpense">
              <div class="lable">পণ্য ক্রয় বাবদ খরচঃ</div>
              <div class="data expense">${totalExpense}</div>
            </div>
            <hr />
            <div class="profit">
              <div class="lable">মোট লাভঃ</div>
              <div class="data expense">${totalProfit}</div>
            </div>
            <div class="header">
              <h1 class="headline">অন্যান্য খরচঃ </h1>
            </div>
            ${nonProductExpenses
              .map(
                (ex) =>
                  `<div class="otherExpense">
                <div class="lable">তারিখঃ </div>
                <div class="data expense">${ex.date}</div>
                <div class="lable">ব্যায়ের খাতঃ</div>
                <div class="data expense">${ex.category}</div>
                <div class="lable">খরচঃ </div>
                <div class="data expense">${ex.expenseCost}</div>
              </div>`
              )
              .join("")}
            <hr>
            <div class="totalOtherExpense">
              <div class="lable">মোট খরচঃ </div>
              <div class="data expense">${totalNonProductExpense}</div>
            </div>
            <div class="header">
              <h1 class="headline">নীট আয়ঃ </h1>
            </div>
            <div class="net">
              <div class="lable">মোট লাভঃ </div>
              <div class="data expense">${totalProfit}</div>
            </div>
            <div class="net">
              <div class="lable">মোট অন্যান্য খরচঃ </div>
              <div class="data expense">-${totalNonProductExpense}</div>
            </div>
            <hr>
            <div class="net">
              <div class="lable">মোটঃ </div>
              <div class="data expense">${
                totalProfit - totalNonProductExpense
              }</div>
            </div>
            
  `;
  incomeExpenseDiv.append(statementDiv.cloneNode(true));
}

function getDay(startDate, endDate) {
  let timeDiff = [startDate, endDate]
    .map((date) => {
      let [d, m, y] = date.split("-");
      return new Date(`${y}-${m}-${d}`);
    })
    .reduce((dif, date, i) => {
      if (i == 0) {
        return date;
      } else {
        return date - dif;
      }
    }, 0);
  let day = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return day;
}
function displayHeaders() {
  [...document.querySelectorAll(".header")].forEach(
    (header) => (header.style.display = "flex")
  );
  document.querySelector(".previewPrint").style.display = "flex";
}
function previewPrint() {
  let startDate = document.querySelector(".start").value.trim();
  let endDate = document.querySelector(".end").value.trim();
  let pdfFile = `${startDate}-${endDate}`;
  fetch("/admin/previewPrint/" + pdfFile)
    .then((previewPrintResponse) => {
      if (!previewPrintResponse.ok) {
        alert(previewPrintResponse.text());
      } else {
        return previewPrintResponse.text();
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}
