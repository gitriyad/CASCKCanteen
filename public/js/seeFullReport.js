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
      let productsArr = JSON.parse(html);
      let productDetailsDiv = document.querySelector(".productDetailsDiv");
      console.log(productsArr);
      let prod = document.createElement("div");
      prod.className = "product";
      productsArr.forEach((product) => {
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
        document.querySelector(".header").style.display = "flex";
      });
    })
    .catch((queryReportResponseError) => {
      alert(queryReportResponseError.message);
    });
}
