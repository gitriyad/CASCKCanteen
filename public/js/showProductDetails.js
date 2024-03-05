//  unlinking the rows
function unlinkRows(element) {
  let parentTr = element.parentNode.parentNode;
  parentTr.querySelector(".productTransportCostTd").setAttribute("rowspan", 1);
  parentTr.querySelector(".buttonTd").setAttribute("rowspan", 1);
  let table = document.querySelector("table.tagsTable");
  let allTagsTr = [...table.querySelectorAll(".tagsTr")];
  allTagsTr.forEach((tr, i, arr) => {
    let transportTd = document.createElement("td");
    transportTd.className = "productTransportCostTd";
    transportTd.setAttribute("rowspan", 1);
    transportTd.innerHTML = `
        <div class="productTransportCostDiv">
                      <input
                        class="productTransportCostInput"
                        oninput="multipleInputEventHandler(this)"
                      />
                    </div>
        `;
    let buttonTd = document.createElement("td");
    buttonTd.className = "buttonTd";
    buttonTd.innerHTML = `
        <div class="actionBtnsContainer">
            <div class="actionBtns">
                <div class="btn addBtn" onclick="rowCollapse(this)">Add</div>
                <div class="btn deleteBtn" style="display:none;" onclick="deleteRow(this)">Delete</div>
            </div>
        </div>
        `;
    let previousTransportTd = tr.querySelector(".previousTransportCostTd");
    let previousButtonTd = tr.querySelector(".previousUnlinkBtn");
    previousTransportTd.insertAdjacentElement(
      "afterend",
      transportTd.cloneNode(true)
    );
    previousButtonTd.insertAdjacentElement(
      "afterend",
      buttonTd.cloneNode(true)
    );
  });
  let parentBtnTd = parentTr.querySelector(".buttonTd");
  parentBtnTd.innerHTML = `<div class="actionBtnsContainer">
            <div class="actionBtns">
                <div class="btn addBtn" onclick="rowCollapse(this)">Add</div>
                <div class="btn deleteBtn" style="display:none;" onclick="deleteRow(this)">Delete</div>
            </div>
        </div>`;
}
function rowCollapse(btnElement) {
  let parentTr = btnElement.parentNode.parentNode.parentNode.parentNode;
  let transportCostTd = parentTr.querySelector(".productTransportCostTd");
  let rowspan = Number(transportCostTd.getAttribute("rowspan"));
  let [nextAvailableTr, newRowspan] = checkForRequiredTr(parentTr, rowspan);
  if (nextAvailableTr) {
    let delBtn = btnElement.nextElementSibling;
    delBtn.style.display = "block";
    let buttonTd = parentTr.querySelector(".buttonTd");
    transportCostTd.setAttribute("rowspan", rowspan + newRowspan);
    buttonTd.setAttribute("rowspan", rowspan + newRowspan);
    nextAvailableTr.querySelector(".productTransportCostTd").remove();
    nextAvailableTr.querySelector(".buttonTd").remove();
  } else {
    alert("Add Product First");
  }
}
function createNewRow() {
  let table = document.querySelector(".tagsTable>tbody");
  let dataTr = document.createElement("tr");
  dataTr.className = "dataTr";
  dataTr.innerHTML = `
                  <td class="productNameTd">
                    <div class="productNameDiv">
                    <select class="productNameSelecElement" onchange="selectionChangeHandler(this)">
                    <option value="">নির্বাচন করুন</option>
                      ${productsArr
                        .filter((product) => product.hasTag)
                        .map(
                          (product) =>
                            `
                        <option value="${product.productName}" prod-id="${product._id}">${product.productName}</option>
                        `
                        )}
                    </div>
                  </td>
                  <td class="productBuyQuantityTd">
                    <div class="productBuyQuantityDiv">
                      <input class="productBuyQuantityInput" oninput="multipleInputEventHandler(this)"/>
                    </div>
                  </td>
                  <td class="productBuyCostTd">
                    <div class="productBuyCostDiv">
                      <input class="productBuyCostInput" oninput="multipleInputEventHandler(this)"/>
                    </div>
                  </td>
                  <td
                    class="productTransportCostTd"
                    rowspan="1"
                  >
                    <div class="productTransportCostDiv">
                      <input class="productTransportCostInput" oninput="multipleInputEventHandler(this)"/>
                    </div>
                  </td>
                  <td class="perProductTransportCostTd">
                    <div class="perProductTransportCostDiv">
                      
                    </div>
                  </td>
                  <td class="perProductBuyCostTd">
                    <div class="perProductBuyCostDiv">
                      
                    </div>
                  </td>
                  <td class="perProductPurchaseCostTd">
                    <div class="perProductPurchaseCostDiv">
                      
                    </div>
                  </td>
                  <td class="productSellPriceTd">
                    <div class="productSellPriceDiv">
                      <input class="productSellPriceInput" oninput="multipleInputEventHandler(this)"/>
                    </div>
                  </td>
                  <td class="productProfitTd">
                    <div class="productProfitDiv">
                      
                    </div>
                  </td>
                  <td class="buttonTd" rowspan="1">
                    <div class="actionBtnsContainer">
                      <div class="actionBtns">
                        <div class="btn addBtn" onclick="rowCollapse(this)">Add</div>
                        <div class="btn deleteBtn" style="display:none;" onclick="deleteRow(this)">Delete</div>
                      </div>
                    </div>
                  </td>
  `;
  table.append(dataTr.cloneNode(true));
}
function checkForRequiredTr(parentTr, rowspan) {
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      parentTr = parentTr.nextElementSibling;
    });
  let newRowspan = 0;
  if (parentTr) {
    newRowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
  }
  return [parentTr, newRowspan];
}
function deleteRow(btnElement) {
  let parentTr = btnElement.parentNode.parentNode.parentNode.parentNode;
  let rowspan = Number(
    parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
  );
  let tmParentTr = parentTr;
  Array(rowspan - 1)
    .fill(0)
    .forEach((v) => {
      tmParentTr = tmParentTr.nextElementSibling;
    });
  parentTr
    .querySelector(".productTransportCostTd")
    .setAttribute("rowspan", rowspan - 1);
  parentTr.querySelector(".buttonTd").setAttribute("rowspan", rowspan - 1);
  if (rowspan - 1 <= 1 && parentTr.classList.contains("mainTr")) {
    btnElement.style.display = "none";
  }
  tmParentTr.remove();
}
function multipleInputEventHandler(element) {
  if (element) {
    calculateTransportCost(element);
    calculatePerProductPrice(element);
    calculatePerProductPurchasePrice(element);
    calculateTaggedProductProfit(element);
    productNameChanger();
    calculateStockAndPrice();
  } else {
    productNameChanger();
    calculateStockAndPrice();
  }
}
function productNameChanger() {
  let productDetailsTable = document.querySelector(".productDetailsTable");
  let tagsTable = document.querySelector(".tagsTable");
  let combineTable = document.querySelector(".combineTable");
  let nameInputField = productDetailsTable.querySelector(
    ".mainProductNameInput"
  ).value;
  if (tagsTable) {
    tagsTable.querySelector(".productNameDiv").innerHTML = nameInputField;
  }
  if (combineTable) {
    combineTable.querySelector(".combineProductNameDiv").innerHTML =
      nameInputField;
  }
}
function calculateStockAndPrice() {
  let stockTable = document.querySelector(".stockTable");
  let perProductPriceDiv = stockTable.querySelector(
    ".mainProductPurchasePriceDiv"
  );
  let storeStock = parseFloat(
    stockTable.querySelector(".mainProductStoreStockInput").value.trim()
  );
  let mainProductStoreStockValueDiv = stockTable.querySelector(
    ".mainProductStoreStockValueDiv"
  );
  let canteenStock = parseFloat(
    stockTable.querySelector(".mainProductCanteenStockInput").value.trim()
  );
  let mainProductCanteenStockValueDiv = stockTable.querySelector(
    ".mainProductCanteenStockValueDiv"
  );
  let mainProductTotalStockDiv = stockTable.querySelector(
    ".mainProductTotalStockDiv"
  );
  let mainProductTotalStockValueDiv = stockTable.querySelector(
    ".mainProductTotalStockValueDiv"
  );
  mainProductStoreStockValueDiv.innerHTML = parseFloat(
    (parseFloat(perProductPriceDiv.innerHTML) * storeStock).toFixed(15)
  );
  mainProductCanteenStockValueDiv.innerHTML = parseFloat(
    (parseFloat(perProductPriceDiv.innerHTML) * canteenStock).toFixed(15)
  );
  mainProductTotalStockDiv.innerHTML = parseFloat(
    (storeStock + canteenStock).toFixed(15)
  );
  mainProductTotalStockValueDiv.innerHTML = parseFloat(
    (
      parseFloat(mainProductTotalStockDiv.innerHTML) *
      parseFloat(perProductPriceDiv.innerHTML)
    ).toFixed(15)
  );
}
function calculateTransportCost(element) {
  if (element.parentNode.parentNode.parentNode) {
    let elementParentTr = element.parentNode.parentNode.parentNode;
    let [parentTr, rowspan] = findParentAndRowspan(elementParentTr);
    let tempParentTr = parentTr;
    let totalQty = Array(rowspan)
      .fill(0)
      .map((v) => {
        let qty = parseFloat(
          tempParentTr.querySelector(".productBuyQuantityInput").value.trim()
        );
        tempParentTr = tempParentTr.nextElementSibling;
        return qty;
      })
      .reduce((sum, qty) => sum + qty, 0);
    let totalTransportCost = parseFloat(
      parentTr.querySelector(".productTransportCostInput").value.trim()
    );
    let perProductTransportCost = parseFloat(
      (totalTransportCost / parseFloat(totalQty)).toFixed(15)
    );
    setTransportCost(perProductTransportCost, parentTr, rowspan);
  }
}
function findParentAndRowspan(parentTr) {
  if (parentTr.querySelector(".productTransportCostTd")) {
    let rowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
    return [parentTr, rowspan];
  } else {
    while (!parentTr.querySelector(".productTransportCostTd")) {
      parentTr = parentTr.previousElementSibling;
    }
    let rowspan = Number(
      parentTr.querySelector(".productTransportCostTd").getAttribute("rowspan")
    );
    return [parentTr, rowspan];
  }
}
function setTransportCost(cost, parentTr, rowspan) {
  Array(rowspan)
    .fill(0)
    .forEach((v) => {
      parentTr.querySelector(".perProductTransportCostDiv").innerHTML = cost;
      parentTr.querySelector(".perProductPurchaseCostDiv").innerHTML =
        cost +
        parseFloat(
          parentTr.querySelector(".perProductBuyCostDiv").innerHTML.trim()
        );
      parentTr.querySelector(".productProfitDiv").innerHTML = parseFloat(
        (
          parseFloat(
            parentTr.querySelector(".productSellPriceInput").value.trim()
          ) -
          parseFloat(
            parentTr
              .querySelector(".perProductPurchaseCostDiv")
              .innerHTML.trim()
          )
        ).toFixed(15)
      );
      parentTr = parentTr.nextElementSibling;
    });
}
function calculatePerProductPrice(element) {
  if (element.parentNode.parentNode.parentNode) {
    let parentTr = element.parentNode.parentNode.parentNode;
    let buyPrice = parseFloat(
      parentTr.querySelector(".productBuyCostInput").value.trim()
    );
    let buyQty = parseFloat(
      parentTr.querySelector(".productBuyQuantityInput").value.trim()
    );
    let perProductPrice = parseFloat((buyPrice / buyQty).toFixed(15));
    parentTr.querySelector(".perProductBuyCostDiv").innerHTML = perProductPrice;
  }
}
function calculatePerProductPurchasePrice(element) {
  if (element.parentNode.parentNode.parentNode) {
    let parentTr = element.parentNode.parentNode.parentNode;
    let stockTable = document.querySelector(".stockTable");
    let perProductTransportCost = parseFloat(
      parentTr.querySelector(".perProductTransportCostDiv").innerHTML.trim()
    );
    let perProductBuyPrice = parseFloat(
      parentTr.querySelector(".perProductBuyCostDiv").innerHTML.trim()
    );
    parentTr.querySelector(".perProductPurchaseCostDiv").innerHTML = parseFloat(
      (perProductTransportCost + perProductBuyPrice).toFixed(15)
    );
    stockTable.querySelector(".mainProductPurchasePriceDiv").innerHTML =
      parseFloat(
        (
          parseFloat(
            parseFloat(
              document
                .querySelector(".mainTr .perProductTransportCostDiv")
                .innerHTML.trim()
            )
          ) +
          parseFloat(
            parseFloat(
              document
                .querySelector(".mainTr .perProductBuyCostDiv")
                .innerHTML.trim()
            )
          )
        ).toFixed(15)
      );
  }
}
function calculateTaggedProductProfit(element) {
  if (element.parentNode.parentNode.parentNode) {
    let parentTr = element.parentNode.parentNode.parentNode;
    let sellPrice = parseFloat(
      parentTr.querySelector(".productSellPriceInput").value.trim()
    );
    let purchasePrice = parseFloat(
      parentTr.querySelector(".perProductPurchaseCostDiv").innerHTML.trim()
    );
    parentTr.querySelector(".productProfitDiv").innerHTML = parseFloat(
      (sellPrice - purchasePrice).toFixed(15)
    );
  }
}
function selectionChangeHandler(element) {
  let tagsTable = document.querySelector(".tagsTable");
  let combineTable = document.querySelector(".combineTable");
  let parentTr = element.parentNode.parentNode.parentNode;
  let selectedProduct =
    element.options[element.selectedIndex].getAttribute("prod-id");
  let [product] = productsArr.filter(
    (product) => product._id == selectedProduct
  );
  if (tagsTable) {
    parentTr.querySelector(".productBuyQuantityInput").value =
      product.referenceAmount;
    parentTr.querySelector(".productBuyCostInput").value =
      product.productBuyPrice;
    if (parentTr.querySelector(".productTransportCostInput")) {
      parentTr.querySelector(".productTransportCostInput").value =
        product.productTransportCost;
    }
    parentTr.querySelector(".productSellPriceInput").value =
      product.productSellingPrice;
    multipleInputEventHandler(element);
  } else if (combineTable) {
    parentTr.querySelector(
      ".combineProductIngredientsPerUnitPriceDiv"
    ).innerHTML = product.productPurchasePrice;
  }
}
function update() {
  let isValid = checkValidity();
  if (isValid) {
    let sendData = collectData();
    let headers = new Headers({ "content-type": "application/json" });
    fetch("/admin/updateProduct", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(sendData),
    })
      .then((updateResponse) => {
        if (!updateResponse.ok) {
          throw new Error("Can not update product");
        } else {
          return updateResponse.text();
        }
      })
      .then((updateData) => {
        alert("Product updated " + updateData);
      })
      .catch((updateError) => {
        alert(`Update failed: ${updateError.message}`);
      });
  }
}
function collectData() {
  let productDetailsTable = document.querySelector(".productDetailsTable");
  let stockTable = document.querySelector(".stockTable");
  let tagsTable = document.querySelector(".tagsTable");
  // product details and stock
  let productName = productDetailsTable
    .querySelector(".mainProductNameInput")
    .value.trim();
  let productBrand = productDetailsTable
    .querySelector(".mainProductBrandInput")
    .value.trim();
  let productQuantityUnit = productDetailsTable
    .querySelector(".mainProductQuantityUnitSelectElement")
    .value.trim();
  let productCategory = productDetailsTable
    .querySelector(".mainProductCategorySelectElement")
    .value.trim();
  let productPurchasePrice = parseFloat(
    parseFloat(
      stockTable.querySelector(".mainProductPurchasePriceDiv").innerHTML.trim()
    )
  );
  let productStoreStock = parseFloat(
    stockTable.querySelector(".mainProductStoreStockInput").value.trim()
  );
  let productCanteenStock = parseFloat(
    stockTable.querySelector(".mainProductCanteenStockInput").value.trim()
  );
  let productId = document
    .querySelector(".productHiddenInfo")
    .getAttribute("prod-id")
    .trim();
  let uploadedBy = document
    .querySelector(".productHiddenInfo")
    .getAttribute("prod-user-id")
    .trim();
  let productDetailsAndStockSendObj = {
    prodId: productId,
    updateObj: {
      productName: productName,
      productBrand: productBrand,
      productQuantityUnit: productQuantityUnit,
      productCategory: productCategory,
      productPurchasePrice: productPurchasePrice,
      productStoreStock: productStoreStock,
      productCanteenStock: productCanteenStock,
      uploadedBy: uploadedBy,
      productIsNonSelling: productCategory == "অবিক্রিত" ? true : false,
    },
  };

  // product Sell part
  let allDataTr = [...document.querySelectorAll(".dataTr")];
  let productPurchaseUpdateArr = [];
  allDataTr.forEach((currTr, i, trArr) => {
    let [parentTr, rowspan] = findParentAndRowspan(currTr);
    let tempParent = parentTr;
    let tags = Array(rowspan)
      .fill(0)
      .map((v) => {
        let tr = tempParent;
        tempParent = tempParent.nextElementSibling;
        return tr;
      })
      .filter((tr) => tr != currTr)
      .map((tr) => {
        if (tr.querySelector(".productNameSelecElement")) {
          let selectElement = tr.querySelector(".productNameSelecElement");
          return selectElement.options[
            selectElement.selectedIndex
          ].getAttribute("prod-id");
        } else {
          return tr.querySelector(".productNameDiv").getAttribute("prod-id");
        }
      });
    let prodId;
    if (i == 0) {
      prodId = document
        .querySelector(".productHiddenInfo")
        .getAttribute("prod-id")
        .trim();
    } else {
      let selectElement = currTr.querySelector(".productNameSelecElement");
      prodId =
        selectElement.options[selectElement.selectedIndex].getAttribute(
          "prod-id"
        );
    }
    let referenceAmount = parseFloat(
      currTr.querySelector(".productBuyQuantityInput").value.trim()
    );
    let productBuyPrice = parseFloat(
      currTr.querySelector(".productBuyCostInput").value.trim()
    );
    let productTransportCost = parseFloat(
      parentTr.querySelector(".productTransportCostInput").value.trim()
    );
    let perProductTransportCost = parseFloat(
      parseFloat(
        currTr.querySelector(".perProductTransportCostDiv").innerHTML.trim()
      )
    );
    let perProductBuyPrice = parseFloat(
      parseFloat(currTr.querySelector(".perProductBuyCostDiv").innerHTML.trim())
    );
    let productPurchasePrice = parseFloat(
      parseFloat(
        currTr.querySelector(".perProductPurchaseCostDiv").innerHTML.trim()
      )
    );
    let productSellingPrice = parseFloat(
      currTr.querySelector(".productSellPriceInput").value.trim()
    );
    let productProfit = parseFloat(
      parseFloat(currTr.querySelector(".productProfitDiv").innerHTML.trim())
    );
    let productPurchaseUpdateObj = {
      prodId: prodId,
      updateObj: {
        tags: tags,
        referenceAmount: referenceAmount,
        productBuyPrice: productBuyPrice,
        productTransportCost: productTransportCost,
        perProductTransportCost: perProductTransportCost,
        perProductBuyPrice: perProductBuyPrice,
        productPurchasePrice: productPurchasePrice,
        productSellingPrice: productSellingPrice,
        productProfit: productProfit,
      },
    };
    productPurchaseUpdateArr.push(productPurchaseUpdateObj);
  });
  return {
    stockUpdate: productDetailsAndStockSendObj,
    priceUpdate: productPurchaseUpdateArr,
  };
}
function checkValidity() {
  let allInputs = [...document.querySelectorAll("input")];
  let allSelectElements = [...document.querySelectorAll("select")];
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

// ******************************************************
function combineProductMultipleInputHandler(element) {
  calculateCombineProductIngredientQty(element);
  calculatePerProductPerIngredientPrice(element);
  calculateTotalPurchasePrice(element);
  calculateCombineProductProfit(element);
}
function calculateCombineProductIngredientQty(element) {
  let combineTable = document.querySelector(".combineTable");
  if (combineTable) {
    let combineProductPerProductQtyDivArr = [
      ...combineTable.querySelectorAll(".combineProductPerProductQtyDiv"),
    ];
    let totalProductQty = parseFloat(
      combineTable.querySelector(".combineProductQtyInput").value.trim()
    );
    [...combineTable.querySelectorAll(".combineProductTotalQtyInput")]
      .map((input) => parseFloat(input.value.trim()))
      .map((value) => parseFloat(value / totalProductQty))
      .forEach(
        (value, i) => (combineProductPerProductQtyDivArr[i].innerHTML = value)
      );
  }
}
function calculatePerProductPerIngredientPrice(element) {
  let combineTable = document.querySelector(".combineTable");
  if (combineTable) {
    let ingredientPriceArr = [
      ...combineTable.querySelectorAll(
        ".combineProductIngredientsPerUnitPriceDiv"
      ),
    ].map((div) => parseFloat(parseFloat(div.innerHTML.trim())));
    let combineProductPerProductIngredientPriceDivArr = [
      ...combineTable.querySelectorAll(
        ".combineProductPerProductIngredientPriceDiv"
      ),
    ];
    [...combineTable.querySelectorAll(".combineProductPerProductQtyDiv")]
      .map((div) => parseFloat(parseFloat(div.innerHTML.trim())))
      .map((value, i) => parseFloat(value * ingredientPriceArr[i]))
      .forEach(
        (value, i) =>
          (combineProductPerProductIngredientPriceDivArr[i].innerHTML = value)
      );
  }
}
function calculateTotalPurchasePrice(element) {
  let combineTable = document.querySelector(".combineTable");
  let stockTable = document.querySelector(".stockTable");
  if (combineTable) {
    let combineProductTotalCostDiv = combineTable.querySelector(
      ".combineProductTotalCostDiv"
    );
    var ingredientsPrice = [
      ...combineTable.querySelectorAll(
        ".combineProductPerProductIngredientPriceDiv"
      ),
    ]
      .map((div) => parseFloat(parseFloat(div.innerHTML.trim())))
      .reduce((sum, value) => sum + value, 0);
    combineProductTotalCostDiv.innerHTML = ingredientsPrice;
  }
  stockTable.querySelector(".mainProductPurchasePriceDiv").innerHTML =
    ingredientsPrice;
}
function calculateCombineProductProfit(element) {
  let combineTable = document.querySelector(".combineTable");
  if (combineTable) {
    combineTable.querySelector(".combineProductProfitDiv").innerHTML =
      parseFloat(
        (
          parseFloat(
            combineTable
              .querySelector(".combineProductSellPriceInput")
              .value.trim()
          ) -
          parseFloat(
            parseFloat(
              combineTable
                .querySelector(".combineProductTotalCostDiv")
                .innerHTML.trim()
            )
          )
        ).toFixed(15)
      );
  }
}
function addIngredient() {
  let combineTable = document.querySelector(".combineTable>tbody");
  if (combineTable) {
    let combineProductNameTd = combineTable.querySelector(
      ".combineProductNameTd"
    );
    let combineProductTotalQtyTd = combineTable.querySelector(
      ".combineProductTotalQtyTd"
    );
    let combineProductTotalCostTd = combineTable.querySelector(
      ".combineProductTotalCostTd"
    );
    let combineProductSellPriceTd = combineTable.querySelector(
      ".combineProductSellPriceTd"
    );
    let combineProductProfitTd = combineTable.querySelector(
      ".combineProductProfitTd"
    );
    let newTr = document.createElement("tr");
    newTr.innerHTML = `
    <td class="combineProductIngredientsNameTd">
                <div class="combineProductIngredientsNameDiv">
                     <select class="combineProductIngredientsNameSelectElement" onchange="selectionChangeHandler(this)">
                      <option value="">নির্বাচন করুন</option>
                      ${productsArr
                        .filter(
                          (prod) =>
                            prod.productName != decodedProduct.productName
                        )
                        .map(
                          (prod) => `
                      <option value="${prod.productName}" prod-id="${prod._id}"  
                        >
                          ${prod.productName}
                        </option>
                      `
                        )}
                     </select>
                </div>
              </td>
              <td class="combineProductTotalQtyTd">
                <div class="combineProductTotalQtyDiv">
                    <input type="text" class="combineProductTotalQtyInput"
                    value="0"
                    oninput="combineProductMultipleInputHandler(this)"
                    >
                </div>
              </td>
              <td class="combineProductPerProductQtyTd">
                <div class="combineProductPerProductQtyDiv">
                    0
                </div>
              </td>
              <td class="combineProductIngredientsPerUnitPriceTd">
                <div class="combineProductIngredientsPerUnitPriceDiv">
                    0
                </div>
              </td>
              <td class="combineProductPerProductIngredientPriceTd">
                <div class="combineProductPerProductIngredientPriceDiv">
                    0
                </div>
              </td>
    `;
    let rowspan = Number(combineProductProfitTd.getAttribute("rowspan"));
    [
      combineProductNameTd,
      combineProductTotalQtyTd,
      combineProductTotalCostTd,
      combineProductSellPriceTd,
      combineProductProfitTd,
    ].forEach((td) => td.setAttribute("rowspan", rowspan + 1));
    combineTable.append(newTr.cloneNode(true));
  }
}
function removeIngredient() {
  let combineTable = document.querySelector(".combineTable>tbody");
  let allTr = [...combineTable.querySelectorAll("tr")];
  if (allTr.length > 2) {
    allTr[allTr.length - 1].remove();
    combineProductMultipleInputHandler(this);
  } else {
    return alert("Can not remove the first Ingredients");
  }
}
function updateCombinedProduct() {
  let isValid = checkValidity();
  if (isValid) {
    let productDetailsTable = document.querySelector(".productDetailsTable");
    let stockTable = document.querySelector(".stockTable");
    let combineTable = document.querySelector(".combineTable");
    let productId = document
      .querySelector(".productHiddenInfo")
      .getAttribute("prod-id")
      .trim();
    let uploadedBy = document
      .querySelector(".productHiddenInfo")
      .getAttribute("prod-user-id")
      .trim();
    let productName = productDetailsTable
      .querySelector(".mainProductNameInput")
      .value.trim();
    let productBrand = productDetailsTable
      .querySelector(".mainProductBrandInput")
      .value.trim();
    let productQuantityUnit = productDetailsTable
      .querySelector(".mainProductQuantityUnitSelectElement")
      .value.trim();
    let productCategory = productDetailsTable
      .querySelector(".mainProductCategorySelectElement")
      .value.trim();
    let productStoreStock = parseFloat(
      stockTable.querySelector(".mainProductStoreStockInput").value.trim()
    );
    let productCanteenStock = parseFloat(
      stockTable.querySelector(".mainProductCanteenStockInput").value.trim()
    );
    let referenceAmount = parseFloat(
      combineTable.querySelector(".combineProductQtyInput").value.trim()
    );
    let ingredients = [
      ...combineTable.querySelectorAll(
        ".combineProductIngredientsNameSelectElement"
      ),
    ].map((selectElement) => {
      let parentTr = selectElement.parentNode.parentNode.parentNode;
      let prodId =
        selectElement.options[selectElement.selectedIndex].getAttribute(
          "prod-id"
        );
      let totalQuantity = parseFloat(
        parentTr.querySelector(".combineProductTotalQtyInput").value.trim()
      );
      let perProductQuantity = parseFloat(
        parseFloat(
          parentTr
            .querySelector(".combineProductPerProductQtyDiv")
            .innerHTML.trim()
        )
      );
      let quantityWisePrice = parseFloat(
        parseFloat(
          parentTr
            .querySelector(".combineProductPerProductIngredientPriceDiv")
            .innerHTML.trim()
        )
      );
      return {
        productId: prodId,
        totalQuantity: totalQuantity,
        perProductQuantity: perProductQuantity,
        quantityWisePrice: quantityWisePrice,
      };
    });
    let productPurchasePrice = parseFloat(
      parseFloat(
        combineTable
          .querySelector(".combineProductTotalCostDiv")
          .innerHTML.trim()
      ).toFixed(15)
    );
    let productSellingPrice = parseFloat(
      combineTable.querySelector(".combineProductSellPriceInput").value.trim()
    );
    let productProfit = parseFloat(
      parseFloat(
        combineTable.querySelector(".combineProductProfitDiv").innerHTML.trim()
      )
    );
    let sendObj = {
      prodId: productId,
      updateObj: {
        productName: productName,
        productBrand: productBrand,
        productQuantityUnit: productQuantityUnit,
        productCategory: productCategory,
        productStoreStock: productStoreStock,
        productCanteenStock: productCanteenStock,
        referenceAmount: referenceAmount,
        ingredients: ingredients,
        productPurchasePrice: productPurchasePrice,
        productSellingPrice: productSellingPrice,
        productProfit: productProfit,
        uploadedBy: uploadedBy,
        productIsNonSelling: productCategory == "অবিক্রিত" ? true : false,
      },
    };
    let headers = new Headers({ "content-type": "application/json" });
    fetch("/admin/updateCombinedProduct", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(sendObj),
    })
      .then((updateResponse) => {
        if (!updateResponse.ok) {
          throw new Error("Can not update product");
        } else {
          return updateResponse.text();
        }
      })
      .then((updateData) => {
        alert("Product updated " + updateData);
      })
      .catch((updateError) => {
        alert(`Update failed: ${updateError.message}`);
      });
  }
}
