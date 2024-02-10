// input oninput event handler
function removeText(input) {
  input.value = input.value.replace(/[^0-9.]/g, "");
}

// add new product handler
function addNewProduct() {
  let allSelectElement = [
    ...document.querySelectorAll(".productNameSelecElement"),
  ];
  let lastSelElem = allSelectElement[allSelectElement.length - 1];
  let lastSelElemValue = lastSelElem.value;
  let lastSelElemOpts = [...lastSelElem.children];
  let newSelElemOpts = lastSelElemOpts.filter(
    (opt) => opt.value != lastSelElemValue && opt.value != ""
  );

  let table = document.querySelector(".singleProductDataTable>tbody");
  let tr = document.createElement("tr");
  tr.innerHTML = `<td class="productName">
                <div class="productNameSelectDiv">
                  <select class="productNameSelecElement" onchange="productSelectionChanged(this)">
                    <option value="">নির্বাচন করুন</option>
                    ${newSelElemOpts
                      .map(
                        (product) => `
      <option value="${product.value}" data-productId="${product.getAttribute(
                          "data-productId"
                        )}">
        ${product.textContent}
      </option>
    `
                      )
                      .join("")}
                  </select>
                </div>
              </td>
              <td class="productBuyAmountTd">
                <div class="productBuyAmountDiv">
                  <input
                    type="text"
                    class="productBuyAmountInput"
                    oninput="onInputHandler(this)"
                  />
                </div>
              </td>
              <td class="productBuyPriceTd">
                <div class="productBuyPriceDiv">
                  <input
                    type="text"
                    oninput="onInputHandler(this)"
                    class="productBuyPriceInput"
                  />
                </div>
              </td>
              <td class="productTransportCostTd" rowspan="1">
                <div class="productTransportCostDiv">
                  <input
                    type="text"
                    oninput="onInputHandler(this)"
                    class="productTransportCostInput"
                  />
                </div>
              </td>
              <td class="perProductTransportCostTd">
                <div class="perProductTransportCostDiv">
                  <input
                    type="text"
                    oninput="removeText(this)"
                    class="perProductTransportCostInput"
                  />
                </div>
              </td>
              <td class="perProductBuyPriceTd">
                <div class="perProductBuyPriceDiv">
                  <input
                    type="text"
                    oninput="removeText(this)"
                    class="perProductBuyPriceInput"
                  />
                </div>
              </td>
              <td class="perProductTotalBuyPriceTd">
                <div class="perProductTotalBuyPriceDiv">
                  <input
                    type="text"
                    oninput="removeText(this)"
                    class="perProductTotalBuyPriceInput"
                  />
                </div>
              </td>
              <td class="ProductSellPriceTd">
                <div class="ProductSellPriceDiv">
                  <input
                    type="text"
                    oninput="onInputHandler(this)"
                    class="ProductSellPriceInput"
                  />
                </div>
              </td>
              <td class="ProductProfitTd">
                <div class="ProductProfitDiv">
                  <input
                    type="text"
                    oninput="removeText(this)"
                    class="ProductProfitInput"
                  />
                </div>
              </td>
              <td class="actionBtnTd">
                <div class="actionBtnDiv">
                  <div class="addActionBtn btn" onclick="addSameTransportProduct(this)">Add</div>
                  <div class="delActionBtn btn" style="display: none" onclick="deleteSameTransportProduct(this)">
                    Delete
                  </div>
                </div>
              </td>`;
  table.appendChild(tr);
}

// adding same transport products onlick handler
function addSameTransportProduct(btn) {
  let parentTr = btn.parentNode.parentNode.parentNode;
  let rowspan = Number(
    parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
  );
  let nextAvailableTr = checkForRequiredTr(parentTr, rowspan);
  if (nextAvailableTr) {
    let delBtn = btn.nextElementSibling;
    delBtn.style.display = "flex";
    nextAvailableTr.querySelector(".productTransportCostTd").remove();
    nextAvailableTr.querySelector(".actionBtnTd").remove();
    parentTr.querySelector(".actionBtnTd").setAttribute("rowspan", rowspan + 1);
    parentTr
      .querySelector(".productTransportCostTd")
      .setAttribute("rowspan", rowspan + 1);
  } else {
    return alert("নতুন পন্য যোগ করুন");
  }
}

// deleteSameTransportProduct onclick handler

function deleteSameTransportProduct(btn) {
  let parentTr = btn.parentNode.parentNode.parentNode;
  let rowspan = Number(
    parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
  );
  let allTr = [...document.querySelectorAll(".singleProductDataTable tr")];
  let parentTrIndex = allTr.indexOf(parentTr);
  let trArrAfterParentTr = allTr.filter((tr, i) => i >= parentTrIndex);

  if (rowspan - 1 > 0) {
    let targetedTr = trArrAfterParentTr[rowspan - 1];
    let productTransportCostTd = parentTr.querySelector(
      ".productTransportCostTd"
    );
    productTransportCostTd.setAttribute("rowspan", rowspan - 1);
    let actionBtnTd = parentTr.querySelector(".actionBtnTd");
    actionBtnTd.setAttribute("rowspan", rowspan - 1);
    targetedTr.remove();
  }

  if (rowspan - 1 == 1) {
    btn.style.display = "none";
  }
}

// product Selection change handler
let previousSelectedElements = [];

function productSelectionChanged(selectElement) {
  let optionsList = [
    ...document.querySelector(".mainProductSelectElement").children,
  ];
  let allProductSelectElements = [
    ...document.querySelectorAll(".productNameSelecElement"),
  ];
  let selectedOptions = allProductSelectElements
    .map((productSelectElement) => productSelectElement.value)
    .filter((option) => option != "");
  let filteredOptions = optionsList.filter(
    (option) => !selectedOptions.includes(option.value)
  );
  let selectElementIndex = allProductSelectElements.indexOf(selectElement);
  let filteredProductElements = allProductSelectElements.filter(
    (selElem, i) => i > selectElementIndex && selElem.value == ""
  );
  if (filteredProductElements.length > 0) {
    filteredProductElements.forEach((selElem) => {
      selElem.innerHTML = "";
      filteredOptions.forEach((option) => {
        selElem.add(option.cloneNode(true));
      });
      selElem.selectedIndex = 0;
    });
  }

  if (previousSelectedElements.length > 0) {
    allProductSelectElements.some((selElem, i, arr) => {
      if (previousSelectedElements[i]) {
        let selectedValue = selElem.value;
        let selectedOption = previousSelectedElements[i].option;
        let currentSelOpt = selElem.options[selElem.selectedIndex];

        let matchElement = arr.filter(
          (ele, index) =>
            index != i && ele.value == selectedValue && ele.value != ""
        );
        if (matchElement.length > 0) {
          matchElement[0].add(selectedOption);
          let selOpt = [...matchElement[0].children].filter(
            (opt) => opt.value == currentSelOpt.value && opt.value != ""
          );

          selOpt[selOpt.length - 1].remove();
          matchElement[0].selectedIndex = 0;

          return true;
        }
      }
    });
  }
  previousSelectedElements = [];
  allProductSelectElements.forEach((selElem) => {
    let storeObj = {};
    storeObj.value = selElem.value;
    storeObj.option = selElem.options[selElem.selectedIndex].cloneNode(true);
    previousSelectedElements.push(storeObj);
  });
}

// checkForRequiredTr handler
function checkForRequiredTr(tr, rowspan) {
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let newTr = tr.nextElementSibling;
      tr = newTr;
    });
  return tr;
}
// onInput handler
function onInputHandler(element) {
  removeText(element);
  calculateTransportCost(element);
  calculatePerProductPrice(element);
  calculatePerProductTotalBuyPrice(element);
  calculateProfit(element);
}

function calculateTransportCost(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  let realParentTr;
  let transportCost = 0;
  let rowspan = 0;
  if (parentTr.querySelector(".productTransportCostTd")) {
    rowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
    transportCost = Number(
      parentTr.querySelector(".productTransportCostInput").value
    );
    realParentTr = parentTr;
  } else {
    let tmpParentTr = parentTr;
    while (!tmpParentTr.querySelector(".productTransportCostTd")) {
      tmpParentTr = tmpParentTr.previousElementSibling;
    }
    rowspan = Number(
      tmpParentTr
        .querySelector(".productTransportCostTd")
        .getAttribute("rowspan")
    );
    transportCost = Number(
      tmpParentTr.querySelector(".productTransportCostInput").value
    );
    realParentTr = tmpParentTr;
  }
  let tempParentTr = realParentTr;
  let totalBuyAmount = 0;
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let amount = Number(
        tempParentTr.querySelector(".productBuyAmountInput").value
      );
      totalBuyAmount += amount;
      tempParentTr = tempParentTr.nextElementSibling;
    });
  let perProductTransportCost = parseFloat(
    (transportCost / totalBuyAmount).toFixed(2)
  );
  tempParentTr = realParentTr;
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let perProductTransportCostInput = tempParentTr.querySelector(
        ".perProductTransportCostInput"
      );
      perProductTransportCostInput.value = perProductTransportCost;
      tempParentTr = tempParentTr.nextElementSibling;
    });
}
function calculatePerProductPrice(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  let productBuyPriceInput = Number(
    parentTr.querySelector(".productBuyPriceInput").value
  );
  let productBuyAmountInput = Number(
    parentTr.querySelector(".productBuyAmountInput").value
  );
  let perProductBuyPriceInput = parentTr.querySelector(
    ".perProductBuyPriceInput"
  );
  let perProductBuyPrice = parseFloat(
    (productBuyPriceInput / productBuyAmountInput).toFixed(2)
  );
  perProductBuyPriceInput.value = perProductBuyPrice;
}
function calculatePerProductTotalBuyPrice(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  let rowspan = 0;
  let realParentTr;
  if (parentTr.querySelector(".productTransportCostTd")) {
    rowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
    realParentTr = parentTr;
  } else {
    let tmpParentTr = parentTr;
    while (!tmpParentTr.querySelector(".productTransportCostTd")) {
      tmpParentTr = tmpParentTr.previousElementSibling;
    }
    rowspan = Number(
      tmpParentTr
        .querySelector(".productTransportCostTd")
        .getAttribute("rowspan")
    );
    realParentTr = tmpParentTr;
  }
  let tempParentTr = realParentTr;
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let perProductTransportCostInput = parseFloat(
        tempParentTr.querySelector(".perProductTransportCostInput").value
      );
      let perProductBuyPriceInput = parseFloat(
        tempParentTr.querySelector(".perProductBuyPriceInput").value
      );
      let perProductTotalBuyPriceInput = tempParentTr.querySelector(
        ".perProductTotalBuyPriceInput"
      );
      perProductTotalBuyPriceInput.value = parseFloat(
        (perProductTransportCostInput + perProductBuyPriceInput).toFixed(2)
      );
      tempParentTr = tempParentTr.nextElementSibling;
    });
}
function calculateProfit(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  let rowspan = 0;
  let realParentTr;
  if (parentTr.querySelector(".productTransportCostTd")) {
    rowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
    realParentTr = parentTr;
  } else {
    let tmpParentTr = parentTr;
    while (!tmpParentTr.querySelector(".productTransportCostTd")) {
      tmpParentTr = tmpParentTr.previousElementSibling;
    }
    rowspan = Number(
      tmpParentTr
        .querySelector(".productTransportCostTd")
        .getAttribute("rowspan")
    );
    realParentTr = tmpParentTr;
  }
  let tempParentTr = realParentTr;

  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let ProductSellPriceInput = parseFloat(
        tempParentTr.querySelector(".ProductSellPriceInput").value
      );
      let perProductTotalBuyPriceInput = parseFloat(
        tempParentTr.querySelector(".perProductTotalBuyPriceInput").value
      );
      let ProductProfitInput = tempParentTr.querySelector(
        ".ProductProfitInput"
      );
      ProductProfitInput.value = parseFloat(
        (ProductSellPriceInput - perProductTotalBuyPriceInput).toFixed(2)
      );
      tempParentTr = tempParentTr.nextElementSibling;
    });
}

// submit button handler
function submitProducts() {
  let userId = document.querySelector(".user").getAttribute("data-user");
  let productsArray = [];
  let allTr = [...document.querySelectorAll(".singleProductDataTable tr")];
  allTr.forEach((currentTr, i, arr) => {
    if (i > 0) {
      let parentTr = currentTr;
      let rowspan = 0;
      let realParentTr;
      if (parentTr.querySelector(".productTransportCostTd")) {
        rowspan = Number(
          parentTr
            .querySelector(".productTransportCostTd")
            .getAttribute("rowspan")
        );
        realParentTr = parentTr;
      } else {
        let tempParentTr = parentTr;
        while (!tempParentTr.querySelector(".productTransportCostTd")) {
          tempParentTr = tempParentTr.previousElementSibling;
        }
        rowspan = Number(
          tempParentTr
            .querySelector(".productTransportCostTd")
            .getAttribute("rowspan")
        );
        realParentTr = tempParentTr;
      }
      let tmpParentTr = realParentTr;
      let tempSelectedTr = [];
      Array(rowspan)
        .fill(0)
        .forEach((v) => {
          tempSelectedTr.push(tmpParentTr);
          tmpParentTr = tmpParentTr.nextElementSibling;
        });
      let tags = [];
      tempSelectedTr.forEach((tmpParentTr, tempI, tempArr) => {
        if (tmpParentTr == currentTr) {
          let tempTags = tempArr
            .filter((tr, index) => tr != tmpParentTr)
            .map((tr) => {
              let productNameSelectElement = tr.querySelector(
                ".productNameSelecElement"
              );
              let prodId =
                productNameSelectElement.options[
                  productNameSelectElement.selectedIndex
                ].getAttribute("data-productId");
              return prodId;
            });
          tags.push(...tempTags);
        }
      });
      let productNameSelectElement = currentTr.querySelector(
        ".productNameSelecElement"
      );
      let prodId =
        productNameSelectElement.options[
          productNameSelectElement.selectedIndex
        ].getAttribute("data-productId");
      let productProfit = parseFloat(
        currentTr.querySelector(".ProductProfitInput").value
      );
      let productBuyPrice = parseFloat(
        currentTr.querySelector(".perProductBuyPriceInput").value
      );
      let productTransportCost = parseFloat(
        currentTr.querySelector(".perProductTransportCostInput").value
      );
      let productPurchasePrice = parseFloat(
        currentTr.querySelector(".perProductTotalBuyPriceInput").value
      );
      let productSellingPrice = parseFloat(
        currentTr.querySelector(".ProductSellPriceInput").value
      );
      let productStatus = "Active";
      let hasTag = tags.length > 0 ? true : false;
      let referenceAmount = parseFloat(
        currentTr.querySelector(".productBuyAmountInput").value
      );
      let sendObj = {
        prodId: prodId,
        productProfit: productProfit,
        productBuyPrice: productBuyPrice,
        productTransportCost: productTransportCost,
        productPurchasePrice: productPurchasePrice,
        productSellingPrice: productSellingPrice,
        productStatus: productStatus,
        referenceAmount: referenceAmount,
        uploadedBy: userId,
        tags: tags,
        hasTag: hasTag,
      };
      productsArray.push(sendObj);
    }
  });
  let headers = new Headers({ "Content-Type": "application/json" });
  fetch("/admin/calculateProductPrice", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(productsArray),
  })
    .then((proPricCalcResponse) => {
      if (!proPricCalcResponse.ok) {
        throw new Error("Failed to submit");
      }
      return proPricCalcResponse.text();
    })
    .then((data) => {
      alert(data);
    })
    .catch((proPricCalcError) => {
      alert(proPricCalcError.message);
    });
}
