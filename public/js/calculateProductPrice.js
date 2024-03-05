// product type changer
var typeChanger = 0;
function productTypeTableChanger(element) {
  typeChanger++;
  if (typeChanger > 1) {
    let userConfirm = confirm(
      "All the inputed values will be gone. Are you sure?"
    );
    if (userConfirm) {
      let singleProduct = document.querySelector(".singleProductSection");
      let multipleProduct = document.querySelector(
        ".singleProductWithMultipleItemSection"
      );
      if (element.classList.contains("singleProduct")) {
        let tr = document.querySelectorAll(
          ".singleProductWithMultipleItemDataTable tr"
        );
        tr.forEach((tr, i) => {
          if (i > 1) {
            tr.remove();
          } else {
            [...tr.querySelectorAll("input")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
            [...tr.querySelectorAll("select")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
          }
        });
        [...document.querySelectorAll(".singleProductDataTable tr")].forEach(
          (tr) => {
            [...tr.querySelectorAll("input")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
            [...tr.querySelectorAll("select")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
          }
        );
        multipleProduct.style.display = "none";
        singleProduct.style.display = "block";
      } else {
        let tr = document.querySelectorAll(".singleProductDataTable tr");
        tr.forEach((tr, i) => {
          if (i > 1) {
            tr.remove();
          } else {
            [...tr.querySelectorAll("input")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
            [...tr.querySelectorAll("select")].forEach(
              (input) => (input.style.backgroundColor = "white")
            );
          }
        });
        [
          ...document.querySelectorAll(
            ".singleProductWithMultipleItemDataTable tr"
          ),
        ].forEach((tr) => {
          [...tr.querySelectorAll("input")].forEach(
            (input) => (input.style.backgroundColor = "white")
          );
          [...tr.querySelectorAll("select")].forEach(
            (input) => (input.style.backgroundColor = "white")
          );
        });
        multipleProduct.style.display = "block";
        singleProduct.style.display = "none";
      }
    }
  } else {
    let singleProduct = document.querySelector(".singleProductSection");
    let multipleProduct = document.querySelector(
      ".singleProductWithMultipleItemSection"
    );
    if (element.classList.contains("singleProduct")) {
      multipleProduct.style.display = "none";
      singleProduct.style.display = "block";
    } else {
      multipleProduct.style.display = "block";
      singleProduct.style.display = "none";
    }
  }
}

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
    (transportCost / totalBuyAmount).toFixed(15)
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
    (productBuyPriceInput / productBuyAmountInput).toFixed(15)
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
        tempParentTr.querySelector(".perProductTransportCostInput").value.trim()
      );
      let perProductBuyPriceInput = parseFloat(
        tempParentTr.querySelector(".perProductBuyPriceInput").value.trim()
      );
      let perProductTotalBuyPriceInput = tempParentTr.querySelector(
        ".perProductTotalBuyPriceInput"
      );
      perProductTotalBuyPriceInput.value = parseFloat(
        (perProductTransportCostInput + perProductBuyPriceInput).toFixed(15)
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
        tempParentTr.querySelector(".ProductSellPriceInput").value.trim()
      );
      let perProductTotalBuyPriceInput = parseFloat(
        tempParentTr.querySelector(".perProductTotalBuyPriceInput").value.trim()
      );
      let ProductProfitInput = tempParentTr.querySelector(
        ".ProductProfitInput"
      );
      ProductProfitInput.value = parseFloat(
        (ProductSellPriceInput - perProductTotalBuyPriceInput).toFixed(15)
      );
      tempParentTr = tempParentTr.nextElementSibling;
    });
}

// submit button handler
function submitProducts() {
  let table = document.querySelector(".singleProductDataTable");
  let isValid = checkValidity(table);
  if (isValid) {
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
          currentTr.querySelector(".ProductProfitInput").value.trim()
        );
        let productBuyPrice = parseFloat(
          currentTr.querySelector(".productBuyPriceInput").value.trim()
        );
        let perProductBuyPrice = parseFloat(
          currentTr.querySelector(".perProductBuyPriceInput").value.trim()
        );
        let productTransportCost = parseFloat(
          realParentTr.querySelector(".productTransportCostInput").value.trim()
        );
        let perProductTransportCost = parseFloat(
          currentTr.querySelector(".perProductTransportCostInput").value.trim()
        );
        let productPurchasePrice = parseFloat(
          currentTr.querySelector(".perProductTotalBuyPriceInput").value.trim()
        );
        let productSellingPrice = parseFloat(
          currentTr.querySelector(".ProductSellPriceInput").value.trim()
        );
        let productStatus = "Active";
        let hasTag = tags.length > 0 ? true : false;
        let referenceAmount = parseFloat(
          currentTr.querySelector(".productBuyAmountInput").value.trim()
        );
        let sendObj = {
          prodId: prodId,
          productProfit: productProfit,
          productBuyPrice: productBuyPrice,
          perProductBuyPrice: perProductBuyPrice,
          productTransportCost: productTransportCost,
          perProductTransportCost: perProductTransportCost,
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
}
function checkValidity(table) {
  let allInputs = [...table.querySelectorAll("input")];
  let allSelectElements = [...table.querySelectorAll("select")];
  [...allInputs, ...allSelectElements].forEach(
    (input) => (input.style.backgroundColor = "white")
  );
  if (
    allInputs.every((input) => input.value.trim() != "") &&
    allSelectElements.every((select) => select.value != "")
  ) {
    return true;
  } else {
    let invalidInputs = allInputs.filter((input) => input.value.trim() == "");
    let invalidSelectElements = allSelectElements.filter(
      (select) => select.value == ""
    );
    [...invalidInputs, ...invalidSelectElements].forEach((input) => {
      input.style.backgroundColor = "red";
    });
    alert("Please provide required values");
    return false;
  }
}

//*************************************************************************************************************** */
// Multiple Product Table Handler
// ****************************************************************************************************************/

function selectMultipleEventHandler(element) {
  showIngredients(element);
  detectNullSelect(element);
  changeOptions(element);
}

// show ingredients
function showIngredients(element) {
  let parentTr = element.parentNode.parentNode.parentNode;
  let tempProductsArr = [...productsArr];
  let selectedProduct = element.value;
  console.log("value", selectedProduct);
  if (selectedProduct != "") {
    let selectedProductArr = tempProductsArr
      .filter((product) => product.productIsCombined)
      .filter((pro) => pro.productName == selectedProduct);
    console.log("aa", selectedProductArr);
    let rowspan = selectedProductArr[0].ingredients.length;
    let productNameTd = parentTr.querySelector(".multipleProductNameTd");
    let productTotalAmountTd = parentTr.querySelector(
      ".multipleProductTotalAmountTd"
    );
    let productMakingTotalCost = parentTr.querySelector(
      ".multipleProductPriceTd"
    );
    let productSellPriceTd = parentTr.querySelector(
      ".multipleProductSellinPriceTd"
    );
    let productProfit = parentTr.querySelector(".multipleProductProfitTd");
    giveRowspan(
      productNameTd,
      productTotalAmountTd,
      productMakingTotalCost,
      productSellPriceTd,
      productProfit,
      rowspan
    );
    createRow(parentTr, rowspan);
    fillValues(selectedProductArr, parentTr, rowspan);
  }
}

// give rowspan to selected tr
function giveRowspan(...trs) {
  let rowspan = trs.pop();
  trs.forEach((tr) => {
    tr.setAttribute("rowspan", rowspan);
  });
}

// create rows for selected product according to ingredients
function createRow(parentTr, rowspan) {
  let tempParentTr = parentTr;

  while (
    tempParentTr.nextElementSibling &&
    !tempParentTr.nextElementSibling.classList.contains("firstTr")
  ) {
    tempParentTr.nextElementSibling.remove();
  }

  Array(rowspan - 1)
    .fill(0)
    .forEach((v) => {
      let newTr = document.createElement("tr");

      let ingredientTd = document.createElement("td");
      ingredientTd.className = "multipleProductIngredientTd";
      let ingredientDiv = document.createElement("div");
      ingredientDiv.className = "multipleProductIngredientDiv";
      ingredientTd.append(ingredientDiv);
      newTr.append(ingredientTd);

      let ingredientAmountTd = document.createElement("td");
      ingredientAmountTd.className = "multipleProductIngredientAmountTd";
      let ingredientAmountDiv = document.createElement("div");
      ingredientAmountDiv.className = "multipleProductIngredientAmountDiv";
      let ingredientAmountInput = document.createElement("input");
      ingredientAmountInput.type = "text";
      ingredientAmountInput.className = "multipleProductIngredientAmountInput";
      ingredientAmountInput.oninput = function () {
        multipleInputHandler(this);
      };
      ingredientAmountDiv.append(ingredientAmountInput);
      ingredientAmountTd.append(ingredientAmountDiv);
      newTr.append(ingredientAmountTd);

      let ingredientAmountForSingleProductTd = document.createElement("td");
      ingredientAmountForSingleProductTd.className =
        "multipleProductIngredientTotalAmountTd";
      let ingredientAmountForSingleProductDiv = document.createElement("div");
      ingredientAmountForSingleProductDiv.className =
        "multipleProductIngredientTotalAmountDiv";
      let ingredientAmountForSingleProductInput =
        document.createElement("input");
      ingredientAmountForSingleProductInput.type = "text";
      ingredientAmountForSingleProductInput.className =
        "multipleProductIngredientTotalAmountInput";
      ingredientAmountForSingleProductDiv.append(
        ingredientAmountForSingleProductInput
      );
      ingredientAmountForSingleProductTd.append(
        ingredientAmountForSingleProductDiv
      );
      newTr.append(ingredientAmountForSingleProductTd);

      let perIngredientPriceTd = document.createElement("td");
      ingredientAmountTd.className = "perMultipleProductIngredientAmountTd";
      let perIngredientPriceDiv = document.createElement("div");
      perIngredientPriceDiv.className = "perMultipleProductIngredientAmountDiv";
      let perIngredientPriceInput = document.createElement("input");
      perIngredientPriceInput.type = "text";
      perIngredientPriceInput.className =
        "perMultipleProductIngredientAmountInput";
      perIngredientPriceDiv.append(perIngredientPriceInput);
      perIngredientPriceTd.append(perIngredientPriceDiv);
      newTr.append(perIngredientPriceTd);

      let perIngredientPriceForProductMakeTd = document.createElement("td");
      perIngredientPriceForProductMakeTd.className =
        "perMultipleProductIngredientPriceTd";
      let perIngredientPriceForProductMakeDiv = document.createElement("div");
      perIngredientPriceForProductMakeDiv.className =
        "perMultipleProductIngredientPriceDiv";
      let perIngredientPriceForProductMakeInput =
        document.createElement("input");
      perIngredientPriceForProductMakeInput.type = "text";
      perIngredientPriceForProductMakeInput.className =
        "perMultipleProductIngredientPriceInput";
      perIngredientPriceForProductMakeDiv.append(
        perIngredientPriceForProductMakeInput
      );
      perIngredientPriceForProductMakeTd.append(
        perIngredientPriceForProductMakeDiv
      );
      newTr.append(perIngredientPriceForProductMakeTd);
      parentTr.insertAdjacentElement("afterend", newTr);
    });
}

// filling table with values
function fillValues([selectedProductArr], parentTr, rowspan) {
  let tempParentTr = parentTr;
  Array(rowspan)
    .fill(0)
    .forEach((v, i) => {
      let ingredients = tempParentTr.querySelector(
        ".multipleProductIngredientDiv"
      );
      let perPrice = tempParentTr.querySelector(
        ".perMultipleProductIngredientAmountInput"
      );
      console.log("ppp", selectedProductArr);
      ingredients.innerHTML = `${selectedProductArr.ingredients[i].productId.productName}`;
      ingredients.setAttribute(
        "data-ingId",
        selectedProductArr.ingredients[i].productId._id
      );
      perPrice.value = `${selectedProductArr.ingredients[i].productId.productPurchasePrice} ${selectedProductArr.ingredients[i].productId.productQuantityUnit}`;
      tempParentTr = tempParentTr.nextElementSibling;
    });
}

function detectNullSelect(element) {
  if (element.value == "") {
    let parentTr = element.parentNode.parentNode.parentNode;
    let tempParentTr = parentTr;
    while (
      tempParentTr.nextElementSibling &&
      !tempParentTr.nextElementSibling.classList.contains("firstTr")
    ) {
      tempParentTr.nextElementSibling.remove();
    }
    let allInputs = [...parentTr.querySelectorAll("input")].forEach(
      (input) => (input.value = "")
    );
    parentTr.querySelector(".multipleProductIngredientDiv").innerHTML = "";
    parentTr.querySelector(".multipleProductNameTd").setAttribute("rowspan", 1);
    parentTr
      .querySelector(".multipleProductTotalAmountTd")
      .setAttribute("rowspan", 1);
    parentTr
      .querySelector(".multipleProductPriceTd")
      .setAttribute("rowspan", 1);
    parentTr
      .querySelector(".multipleProductSellinPriceTd")
      .setAttribute("rowspan", 1);
    parentTr
      .querySelector(".multipleProductProfitTd")
      .setAttribute("rowspan", 1);
  }
}

function addNewMultipleProduct() {
  createNewProductRow();
}
function createNewProductRow() {
  let table = document.querySelector(
    ".singleProductWithMultipleItemDataTable>tbody"
  );
  let allMulSelElem = [
    ...document.querySelectorAll(".multipleProductNameSelectElement"),
  ];
  let lastMulSelElem = allMulSelElem[allMulSelElem.length - 1];
  let lastMulSelElemSelectedValue = lastMulSelElem.value;
  let newSelectOptions = [...lastMulSelElem.children].filter(
    (option) =>
      option.value != lastMulSelElemSelectedValue && option.value != ""
  );
  let newTr = document.createElement("tr");
  newTr.className = "firstTr";
  newTr.innerHTML = `<td class="multipleProductNameTd">
                <div class="multipleProductNameDiv">
                  <select
                    class="multipleProductNameSelectElement"
                    onchange="selectMultipleEventHandler(this)"
                  >
                    <option value="">নির্বাচন করুন</option>
                    ${newSelectOptions.map(
                      (product) => `
                    <option
                      value="${product.value}"
                      data-productId="${product.getAttribute("data-productId")}"
                    >
                      ${product.textContent}
                    </option>`
                    )}
                    
                  </select>
                </div>
              </td>
              <td class="multipleProductTotalAmountTd">
                <div class="multipleProductTotalAmountDiv">
                  <input type="text" class="multipleProductTotalAmountInput" 
                  oninput="multipleInputHandler(this)"/>
                </div>
              </td>
              <td class="multipleProductIngredientTd">
                <div class="multipleProductIngredientDiv"></div>
              </td>
              <td class="multipleProductIngredientAmountTd">
                <div class="multipleProductIngredientAmountDiv">
                  <input
                    type="text"
                    class="multipleProductIngredientAmountInput"
                    oninput="multipleInputHandler(this)"
                  />
                </div>
              </td>
              <td class="multipleProductIngredientTotalAmountTd">
                <div class="multipleProductIngredientTotalAmountDiv">
                  <input
                    type="text"
                    class="multipleProductIngredientTotalAmountInput"
                  />
                </div>
              </td>
              <td class="perMultipleProductIngredientAmountTd">
                <div class="perMultipleProductIngredientAmountDiv">
                  <input
                    type="text"
                    class="perMultipleProductIngredientAmountInput"
                  />
                </div>
              </td>
              <td class="perMultipleProductIngredientPriceTd">
                <div class="perMultipleProductIngredientPriceDiv">
                  <input
                    type="text"
                    class="perMultipleProductIngredientPriceInput"
                  />
                </div>
              </td>
              <td class="multipleProductPriceTd">
                <div class="multipleProductPriceDiv">
                  <input type="text" class="multipleProductPriceInput" />
                </div>
              </td>
              <td class="multipleProductSellinPriceTd">
                <div class="multipleProductSellinPriceDiv">
                  <input type="text" class="multipleProductSellinPriceInput"
                  oninput="multipleInputHandler(this)" />
                </div>
              </td>
              <td class="multipleProductProfitTd">
                <div class="multipleProductProfitDiv">
                  <input type="text" class="multipleProductProfitInput" />
                </div>
              </td>`;
  table.append(newTr);
}

function changeOptions(element) {
  let allMulSelElem = [
    ...document.querySelectorAll(".multipleProductNameSelectElement"),
  ];
  let selectedOptions = allMulSelElem
    .filter((selElem) => selElem.value != "")
    .map((selElem) => selElem.value);
  let defaultOptions = [
    ...document.querySelector(".mainMultipleProductSelectElement").children,
  ];
  let freeOptions = defaultOptions.filter(
    (option) => !selectedOptions.includes(option.value)
  );
  let targetedSelElemIndex = allMulSelElem.indexOf(element);
  let targeteSelElem = allMulSelElem.filter(
    (selElem, i, arr) => i > targetedSelElemIndex && selElem.value == ""
  );
  targeteSelElem.forEach((selElem) => {
    selElem.innerHTML = "";
    freeOptions.forEach((option) => {
      selElem.add(option.cloneNode(true));
    });
    selElem.selectedIndex = 0;
  });
}

function multipleInputHandler(element) {
  let parentTr = getParent(element);
  let totalProductAmount = parseFloat(
    parentTr.querySelector(".multipleProductTotalAmountInput").value.trim()
  );
  let rowspan = getRowspan(parentTr);
  let ingredientsNeedForTotalProductArr = getIngredientsInputs(
    parentTr,
    rowspan,
    ".multipleProductIngredientAmountInput"
  );
  let ingredientsNeedForPerProductArr = getIngredientsInputs(
    parentTr,
    rowspan,
    ".multipleProductIngredientTotalAmountInput"
  );
  let perUnitIngredientPrice = getIngredientsInputs(
    parentTr,
    rowspan,
    ".perMultipleProductIngredientAmountInput"
  );
  let ingredientsPriceForAProduct = getIngredientsInputs(
    parentTr,
    rowspan,
    ".perMultipleProductIngredientPriceInput"
  );
  let totalCostInput = parentTr.querySelector(".multipleProductPriceInput");
  let productSellPrice = parentTr.querySelector(
    ".multipleProductSellinPriceInput"
  );
  let profit = parentTr.querySelector(".multipleProductProfitInput");
  calculateIngredientsAmountForAProduct(
    ingredientsNeedForTotalProductArr,
    ingredientsNeedForPerProductArr,
    totalProductAmount
  );
  calculateIngredientsPriceForAProduct(
    ingredientsNeedForPerProductArr,
    perUnitIngredientPrice,
    ingredientsPriceForAProduct
  );
  calculateTotalPriceOfAProduct(ingredientsPriceForAProduct, totalCostInput);
  calculateMultipleProductProfit(productSellPrice, totalCostInput, profit);
  removeText(element);
}
function getParent(element) {
  let tempParent = element.parentNode.parentNode.parentNode;
  while (!tempParent.classList.contains("firstTr")) {
    tempParent = tempParent.previousElementSibling;
  }
  return tempParent;
}
function getRowspan(parentTr) {
  return Number(
    parentTr.querySelector(".multipleProductNameTd").getAttribute("rowspan")
  );
}
function getIngredientsInputs(parentTr, rowspan, inpClass) {
  let selectedTr = [];
  let tempParentTr = parentTr;
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      let input = tempParentTr.querySelector(inpClass);
      selectedTr.push(input);
      tempParentTr = tempParentTr.nextElementSibling;
    });
  return selectedTr;
}
function calculateIngredientsAmountForAProduct(
  ingredientAmountForTotalProductArr,
  ingredientAmountForAProductArr,
  totalAmountOfProduct
) {
  let ingNeedForAProduct = ingredientAmountForTotalProductArr
    .map((ingInp) => parseFloat(ingInp.value.trim()))
    .map((value) => parseFloat(value / totalAmountOfProduct));
  ingNeedForAProduct.forEach((v, i) => {
    ingredientAmountForAProductArr[i].value = v;
  });
}
function calculateIngredientsPriceForAProduct(
  ingAmount,
  ingPerUnitPrice,
  ingPrice
) {
  let ingAmountForAProduct = ingAmount.map((amountInp) =>
    parseFloat(amountInp.value.trim())
  );
  let ingPerAmountPrice = ingPerUnitPrice
    .map((inp) => inp.value)
    .map((value) => parseFloat(value.split(" ").shift().trim()));
  ingPerAmountPrice.forEach((price, i) => {
    ingPrice[i].value = parseFloat(price * ingAmountForAProduct[i]);
  });
}
function calculateTotalPriceOfAProduct(ingPriceOfAProduct, totalCost) {
  totalCost.value = parseFloat(
    ingPriceOfAProduct.reduce((sum, v) => sum + parseFloat(v.value.trim()), 0)
  );
}
function calculateMultipleProductProfit(sellPrice, totalCost, profit) {
  profit.value = parseFloat(
    parseFloat(sellPrice.value.trim()) - parseFloat(totalCost.value.trim())
  );
}

function submitMultipleProducts() {
  let table = document.querySelector(".singleProductWithMultipleItemDataTable");
  let isValid = checkValidity(table);
  if (isValid) {
    let sendArr = [];
    let allProductsParentTr = [...document.querySelectorAll(".firstTr")];

    let rowspan = allProductsParentTr.map((tr) => getRowspan(tr));
    allProductsParentTr.forEach((productParentTr, i, arr) => {
      let ingArr = [];
      let tempParent = productParentTr;
      Array(rowspan[i])
        .fill(0)
        .forEach((v) => {
          let ingObj = {};
          let ingId = tempParent
            .querySelector(".multipleProductIngredientDiv")
            .getAttribute("data-ingid");
          let totalQuantity = parseFloat(
            tempParent
              .querySelector(".multipleProductIngredientAmountInput")
              .value.trim()
          );
          let perProductQuantity = parseFloat(
            tempParent
              .querySelector(".multipleProductIngredientTotalAmountInput")
              .value.trim()
          );
          let quantityWisePrice = parseFloat(
            tempParent
              .querySelector(".perMultipleProductIngredientPriceInput")
              .value.trim()
          );
          ingObj["productId"] = ingId;
          ingObj["totalQuantity"] = totalQuantity;
          ingObj["perProductQuantity"] = perProductQuantity;
          ingObj["quantityWisePrice"] = quantityWisePrice;
          ingArr.push(ingObj);
          tempParent = tempParent.nextElementSibling;
        });
      let id = productParentTr.querySelector(
        ".multipleProductNameSelectElement"
      );
      let prodId = id.options[id.selectedIndex].getAttribute("data-productId");
      let profit = parseFloat(
        productParentTr
          .querySelector(".multipleProductProfitInput")
          .value.trim()
      );
      let parchasePrice = parseFloat(
        productParentTr.querySelector(".multipleProductPriceInput").value.trim()
      );
      let sellPrice = parseFloat(
        productParentTr
          .querySelector(".multipleProductSellinPriceInput")
          .value.trim()
      );
      let referenceAmount = parseFloat(
        productParentTr
          .querySelector(".multipleProductTotalAmountInput")
          .value.trim()
      );
      let uploadedBy = document
        .querySelector(".user")
        .getAttribute("data-user");
      let sendObj = {
        prodId: prodId,
        productProfit: profit,
        productPurchasePrice: parchasePrice,
        productSellingPrice: sellPrice,
        productStatus: "Active",
        ingredients: ingArr,
        uploadedBy: uploadedBy,
        referenceAmount: referenceAmount,
      };
      sendArr.push(sendObj);
    });
    let header = new Headers({ "content-type": "application/json" });
    fetch("/admin/calculateMultipleProductPrice", {
      method: "POST",
      headers: header,
      body: JSON.stringify(sendArr),
    })
      .then((mulProRes) => {
        if (!mulProRes.ok) {
          throw new Error("Products Not Saved");
        }
        return mulProRes.text();
      })
      .then((data) => {
        alert(data);
      })
      .catch((mulProSavingError) => {
        alert(`Error Saving Products: ${mulProSavingError.message}`);
      });
  }
}
