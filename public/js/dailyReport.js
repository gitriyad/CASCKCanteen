function multipleInputHandler(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  calculateBuyCost(parentTr);
  calculateTotalStock(parentTr);
  calculateNewStock(parentTr, element);
  calculateSellAmount(parentTr);
  calculateProfit(parentTr);
  calculateRemainingStock(parentTr);
  calculateNetStock(parentTr, element);
  calculateStockValue(parentTr);
}
function calculateBuyCost(parentTr) {
  let buyQuantityInput = parentTr.querySelector(".buyQuantityInput");
  let buyCostDiv = parentTr.querySelector(".buyCostDiv");
  let perProductPurchasePriceDiv = parentTr.querySelector(
    ".perProductPurchasePriceDiv"
  );
  let cost = parseFloat(
    (
      parseFloat(buyQuantityInput.value.trim()) *
      parseFloat(perProductPurchasePriceDiv.innerHTML.trim())
    ).toFixed(15)
  );
  buyCostDiv.innerHTML = cost;
}
function calculateTotalStock(parentTr) {
  let prevTotalStockDiv = parentTr.querySelector(".prevTotalStockDiv");
  let buyQuantityInput = parentTr.querySelector(".buyQuantityInput");
  let totalStockDiv = parentTr.querySelector(".totalStockDiv");
  let total = parseFloat(
    (
      parseFloat(prevTotalStockDiv.innerHTML.trim()) +
      parseFloat(buyQuantityInput.value.trim())
    ).toFixed(15)
  );
  totalStockDiv.innerHTML = total;
}
function calculateNewStock(parentTr, element) {
  let totalStockDiv = parentTr.querySelector(".totalStockDiv");
  let takenKitchenStockInput = parentTr.querySelector(
    ".takenKitchenStockInput"
  );
  let takenCanteenStockInput = parentTr.querySelector(
    ".takenCanteenStockInput"
  );
  let newKitchenStockDiv = parentTr.querySelector(".newKitchenStockDiv");
  let newCanteenStockDiv = parentTr.querySelector(".newCanteenStockDiv");
  let newTotalStockDiv = parentTr.querySelector(".newTotalStockDiv");
  let takenKitchen = parseFloat(takenKitchenStockInput.value.trim());
  let takenCanteen = parseFloat(takenCanteenStockInput.value.trim());
  let totalStockValue = parseFloat(totalStockDiv.innerHTML.trim());
  if (element.classList.contains("takenCanteenStockInput")) {
    newKitchenStockDiv.innerHTML = parseFloat(
      (totalStockValue - takenCanteen).toFixed(15)
    );
    takenKitchenStockInput.value = newKitchenStockDiv.innerHTML;
    newCanteenStockDiv.innerHTML = takenCanteen;
  } else {
    newCanteenStockDiv.innerHTML = parseFloat(
      (totalStockValue - takenKitchen).toFixed(15)
    );
    takenCanteenStockInput.value = newCanteenStockDiv.innerHTML;
    newKitchenStockDiv.innerHTML = takenKitchen;
  }
  newTotalStockDiv.innerHTML = parseFloat(
    (
      parseFloat(newKitchenStockDiv.innerHTML.trim()) +
      parseFloat(newCanteenStockDiv.innerHTML.trim())
    ).toFixed(15)
  );
}
function calculateSellAmount(parentTr) {
  let perProductSellPriceDiv = parentTr.querySelector(
    ".perProductSellPriceDiv"
  );
  let sellQuantityInput = parentTr.querySelector(".sellQuantityInput");
  let sellCostDiv = parentTr.querySelector(".sellCostDiv");
  sellCostDiv.innerHTML = parseFloat(
    (
      parseFloat(perProductSellPriceDiv.innerHTML.trim()) *
      parseFloat(sellQuantityInput.value.trim())
    ).toFixed(15)
  );
}
function calculateProfit(parentTr) {
  let sellQuantityInput = parentTr.querySelector(".sellQuantityInput");
  let perProductProfitDiv = parentTr.querySelector(".perProductProfitDiv");
  let totalProductProfitDiv = parentTr.querySelector(".totalProductProfitDiv");
  totalProductProfitDiv.innerHTML = parseFloat(
    (
      parseFloat(sellQuantityInput.value.trim()) *
      parseFloat(perProductProfitDiv.innerHTML.trim())
    ).toFixed(15)
  );
}
function calculateRemainingStock(parentTr) {
  let totalStockDiv = parentTr.querySelector(".totalStockDiv");
  let sellQuantityInput = parentTr.querySelector(".sellQuantityInput");
  let remainingStockDiv = parentTr.querySelector(".remainingStockDiv");
  remainingStockDiv.innerHTML = parseFloat(
    (
      parseFloat(totalStockDiv.innerHTML.trim()) -
      parseFloat(sellQuantityInput.value.trim())
    ).toFixed(15)
  );
}
function calculateNetStock(parentTr, element) {
  let remainingStockDiv = parentTr.querySelector(".remainingStockDiv");
  let returnKitchenStockInput = parentTr.querySelector(
    ".returnKitchenStockInput"
  );
  let returnCanteenStockInput = parentTr.querySelector(
    ".returnCanteenStockInput"
  );
  let nitKitchenStockDiv = parentTr.querySelector(".nitKitchenStockDiv");
  let nitCanteenStockDiv = parentTr.querySelector(".nitCanteenStockDiv");
  let nitTotalStockDiv = parentTr.querySelector(".nitTotalStockDiv");
  if (element.classList.contains("returnKitchenStockInput")) {
    returnCanteenStockInput.value = parseFloat(
      (
        parseFloat(remainingStockDiv.innerHTML.trim()) -
        parseFloat(returnKitchenStockInput.value.trim())
      ).toFixed(15)
    );
    nitKitchenStockDiv.innerHTML = returnKitchenStockInput.value;
    nitCanteenStockDiv.innerHTML = returnCanteenStockInput.value;
  } else {
    returnKitchenStockInput.value = parseFloat(
      (
        parseFloat(remainingStockDiv.innerHTML.trim()) -
        parseFloat(returnCanteenStockInput.value.trim())
      ).toFixed(15)
    );
    nitCanteenStockDiv.innerHTML = returnCanteenStockInput.value;
    nitKitchenStockDiv.innerHTML = returnKitchenStockInput.value;
  }
  nitTotalStockDiv.innerHTML = parseFloat(
    (
      parseFloat(nitCanteenStockDiv.innerHTML.trim()) +
      parseFloat(nitKitchenStockDiv.innerHTML.trim())
    ).toFixed(15)
  );
}
function calculateStockValue(parentTr) {
  let nitTotalStockDiv = parentTr.querySelector(".nitTotalStockDiv");
  let perProductPurchasePriceDiv = parentTr.querySelector(
    ".perProductPurchasePriceDiv"
  );
  let stockValueDiv = parentTr.querySelector(".stockValueDiv");
  stockValueDiv.innerHTML = parseFloat(
    (
      parseFloat(nitTotalStockDiv.innerHTML.trim()) *
      parseFloat(perProductPurchasePriceDiv.innerHTML.trim())
    ).toFixed(15)
  );
}

function deleteRow(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  parentTr.remove();
  changeSequence();
}
function changeSequence() {
  let firstTr = document.querySelector(".firstTr");
  let row = 1;
  while (firstTr.nextElementSibling) {
    firstTr.nextElementSibling.querySelector(".serialDiv").innerHTML = row;
    firstTr = firstTr.nextElementSibling;
    row++;
  }
}

// Cursor down
let table = document.querySelector(".reportDataTable");
table.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    let element = e.target;
    let elementClass = element.getAttribute("class");
    let parentTr = element.parentNode.parentNode.parentNode;
    if (parentTr.nextElementSibling) {
      let nextElement = parentTr.nextElementSibling.querySelector(
        `.${elementClass}`
      );
      nextElement.focus();
    }
  }
});

// storing data
function storeData() {
  let dailyReportArr = [];
  let sellArr = [];
  let profitArr = [];
  let stockArr = [];
  let expenseArr = [];
  let productStockUpdateArr = [];
  let allDataRow = [...document.querySelectorAll(".dataRow")];
  let userId = document.querySelector(".user").getAttribute("user-id");
  let isValid = checkValidity();
  if (isValid) {
    allDataRow.forEach((row) => {
      let productName = row.querySelector(".productNameDiv").innerHTML.trim();
      let productId = row
        .querySelector(".productNameDiv")
        .getAttribute("prod-id")
        .trim();
      let preStoreStock = parseFloat(
        parseFloat(row.querySelector(".prevKitchenStockDiv").innerHTML.trim())
      );
      let preCanteenStock = parseFloat(
        parseFloat(
          row.querySelector(".prevCanteenStockDiv").innerHTML.trim()
        ).toFixed(15)
      );
      let previousStock = {
        storeStock: preStoreStock,
        canteenStock: preCanteenStock,
      };
      let perUnitBuyCost = parseFloat(
        parseFloat(
          row.querySelector(".perProductPurchasePriceDiv").innerHTML.trim()
        )
      );
      let buyQuantity = parseFloat(
        row.querySelector(".buyQuantityInput").value.trim()
      );
      let buy = {
        perUnitPrice: perUnitBuyCost,
        quantity: buyQuantity,
      };
      let totalStock = parseFloat(
        parseFloat(row.querySelector(".totalStockDiv").innerHTML.trim())
      );
      let takenStoreStock = parseFloat(
        row.querySelector(".takenKitchenStockInput").value.trim()
      );
      let takenCanteenStock = parseFloat(
        row.querySelector(".takenCanteenStockInput").value.trim()
      );
      let taken = {
        store: takenStoreStock,
        canteen: takenCanteenStock,
      };
      let newStoreStock = parseFloat(
        parseFloat(row.querySelector(".newKitchenStockDiv").innerHTML.trim())
      );
      let newCanteenStock = parseFloat(
        parseFloat(row.querySelector(".newCanteenStockDiv").innerHTML.trim())
      );
      let newStock = {
        storeStock: newStoreStock,
        canteenStock: newCanteenStock,
      };
      let perUnitSellPrice = parseFloat(
        parseFloat(
          row.querySelector(".perProductSellPriceDiv").innerHTML.trim()
        )
      );
      let sellQuantity = parseFloat(
        row.querySelector(".sellQuantityInput").value.trim()
      );
      let sell = {
        perUnitPrice: perUnitSellPrice,
        quantity: sellQuantity,
      };
      let perUnitProfit = parseFloat(
        parseFloat(row.querySelector(".perProductProfitDiv").innerHTML.trim())
      );
      let totalProfit = parseFloat(
        parseFloat(row.querySelector(".totalProductProfitDiv").innerHTML.trim())
      );
      let remainingStock = parseFloat(
        parseFloat(row.querySelector(".remainingStockDiv").innerHTML.trim())
      );
      let returnStoreStock = parseFloat(
        row.querySelector(".returnKitchenStockInput").value.trim()
      );
      let returnCanteenStock = parseFloat(
        row.querySelector(".returnCanteenStockInput").value.trim()
      );
      let returnStock = {
        store: returnStoreStock,
        canteen: returnCanteenStock,
      };
      let netStoreStock = parseFloat(
        parseFloat(row.querySelector(".nitKitchenStockDiv").innerHTML.trim())
      );
      let netCanteenStock = parseFloat(
        parseFloat(row.querySelector(".nitCanteenStockDiv").innerHTML.trim())
      );
      let netStock = {
        storeStock: netStoreStock,
        canteenStock: netCanteenStock,
      };
      let stockValue = parseFloat(
        parseFloat(row.querySelector(".stockValueDiv").innerHTML.trim())
      );
      let date = document.querySelector(".dateInput").value.trim();
      let [d, m, y] = date.split("-");
      date = new Date(`${y}-${m}-${d}`);
      let dailyReportObj = {
        date: date,
        productName: productName,
        previousStock: previousStock,
        buy: buy,
        totalStock: totalStock,
        taken: taken,
        newStock: newStock,
        sell: sell,
        perUnitProfit: perUnitProfit,
        totalProfit: totalProfit,
        remainingStock: remainingStock,
        returnStock: returnStock,
        netStock: netStock,
        stockValue: stockValue,
        uploadedBy: userId,
        productId: productId,
      };
      let sellObj = {
        date: date,
        product: productId,
        quantity: sellQuantity,
        perQuantityParchasePrice: perUnitSellPrice,
        uploadedBy: userId,
      };
      let profitObj = {
        date: date,
        product: productId,
        quantity: sellQuantity,
        perQuantityProfit: perUnitProfit,
        uploadedBy: userId,
      };
      let stockObj = {
        date: date,
        product: productId,
        prevStoreStock: preStoreStock,
        prevCanteenStock: preCanteenStock,
        netStoreStock: netStoreStock,
        netCanteenStock: netCanteenStock,
        uploadedBy: userId,
      };
      let expenseObj = {
        date: date,
        product: productId,
        quantity: buyQuantity,
        perQuantityPurchasePrice: perUnitBuyCost,
        uploadedBy: userId,
      };
      let prodStockUpdateObj = {
        productId: productId,
        updateObj: {
          productStoreStock: netStoreStock,
          productCanteenStock: netCanteenStock,
        },
      };
      dailyReportArr.push(dailyReportObj);
      sellArr.push(sellObj);
      profitArr.push(profitObj);
      stockArr.push(stockObj);
      expenseArr.push(expenseObj);
      productStockUpdateArr.push(prodStockUpdateObj);
    });
    let sendObj = {
      dailyReport: dailyReportArr,
      sell: sellArr,
      profit: profitArr,
      stock: stockArr,
      expense: expenseArr,
      productStockUpdate: productStockUpdateArr,
    };
    uploadData(JSON.stringify(sendObj));
  }
}
function uploadData(dataObj) {
  let headers = new Headers({ "Content-Type": "application/json" });
  fetch("/admin/dailyReport", {
    method: "POST",
    headers: headers,
    body: dataObj,
  })
    .then(async (dailyReportResponse) => {
      if (!dailyReportResponse.ok) {
        throw new Error(`${await dailyReportResponse.text()}`);
      }
      return dailyReportResponse.text();
    })
    .then((data) => {
      alert("success");
      window.location.reload();
    })
    .catch((dailyReportUploadError) => {
      alert(`Error uploading Daily Report: ${dailyReportUploadError.message}`);
    });
}
function checkValidity() {
  let allInputs = [...document.querySelectorAll("input")];

  [...allInputs].forEach((input) => (input.style.backgroundColor = "white"));
  if (allInputs.every((input) => input.value.trim() != "")) {
    return true;
  } else {
    let invalidInputs = allInputs.filter((input) => input.value.trim() == "");
    [...invalidInputs].forEach((input) => {
      input.style.backgroundColor = "red";
    });
    alert("Please provide required values");
    return false;
  }
}

// **************************************************************************************************************
// setting date
window.addEventListener("load", () => {
  flatpickr(".dateInput", {
    dateFormat: "d-m-Y", // Date format
    minDate: new Date().fp_incr(-30 * 365), // Minimum selectable date is today
    maxDate: new Date().fp_incr(30), // Maximum selectable date is 30 days from today
    disableMobile: true, // Disable mobile-friendly mode
    defaultDate: "today", // Set the default selected date to today
  });
});
