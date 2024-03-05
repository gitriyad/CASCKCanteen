// preview image
function previewImage() {
  let container = document.querySelector(".productImageContainer");
  let file = document.querySelector(".productImage").files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = (url) => {
      let imageUrl = url.target.result;
      container.style.backgroundImage = `url(${imageUrl})`;
    };
    reader.readAsDataURL(file);
  }
}

// adding product controller
let saveProductBtn = document.querySelector(".saveProductBtn");
saveProductBtn.addEventListener("click", () => {
  let productName = document.querySelector(".productName");
  let productBrand = document.querySelector(".productBrand");
  let productKitchenStock = document.querySelector(".productKitchenStock");
  let productCanteenStock = document.querySelector(".productCanteenStock");
  let productQuantityUnit = document.querySelector(".productQuantityUnit");
  let productImage = document.querySelector(".productImage");
  let categorySelcetElement = document.querySelector(".categorySelcetElement");
  let productIsCombined = document.querySelector(".combineProduct");
  let userId = saveProductBtn.getAttribute("data-user");
  let isValid = checkValidity(
    productName,
    productBrand,
    productKitchenStock,
    productCanteenStock,
    productQuantityUnit,
    productImage,
    productIsCombined,
    categorySelcetElement
  );
  if (isValid) {
    let productNameValue = productName.value.trim();
    let productBrandValue = productBrand.value.trim();
    let productKitchenStockValue = parseFloat(productKitchenStock.value.trim());
    let productCanteenStockValue = parseFloat(productCanteenStock.value.trim());
    let productQuantityUnitValue = productQuantityUnit.value.trim();
    let productImageFile = productImage.files[0];
    let productCategory = categorySelcetElement.value;

    let formdata = new FormData();
    formdata.append("productName", productNameValue);
    formdata.append("productBrand", productBrandValue);
    formdata.append("productStoreStock", productKitchenStockValue);
    formdata.append("productCanteenStock", productCanteenStockValue);
    formdata.append("productQuantityUnit", productQuantityUnitValue);
    formdata.append("productImage", productImageFile);
    formdata.append("uploadedBy", userId);
    formdata.append("productIsCombined", productIsCombined.checked);
    formdata.append("productCategory", productCategory);
    if (productIsCombined.checked) {
      let ingredients = document.querySelectorAll(".ingredient");
      let ingArr = [];
      [...ingredients].forEach((ingredient) => {
        let selectedDataId =
          ingredient.options[ingredient.selectedIndex].getAttribute("data-id");
        let obj = {
          productId: selectedDataId,
          quantity: 0,
          quantityWisePrice: 0,
        };
        ingArr.push(obj);
      });
      formdata.append("ingredients", JSON.stringify(ingArr));
    } else {
      formdata.append("ingredients", []);
    }
    if (productCategory == "অবিক্রিত") {
      formdata.append("productIsNonSelling", true);
    } else {
      formdata.append("productIsNonSelling", false);
    }

    fetch("/admin/addProduct", {
      method: "POST",
      body: formdata,
    })
      .then((addDataResponse) => {
        if (!addDataResponse.ok) {
          throw new Error("Can Not Connect To The Server ");
        } else {
          return addDataResponse.text();
        }
      })
      .then((data) => {
        alert(data);
      })
      .catch((addProductError) => {
        alert(`${addProductError.message}`);
      });
  }
});

// check validity
function checkValidity(
  productName,
  productBrand,
  productKitchenStock,
  productCanteenStock,
  productQuantityUnit,
  productImage,
  productIsCombined,
  categorySelcetElement
) {
  let productNameValue = productName.value.trim();
  let productBrandValue = productBrand.value.trim();
  let productKitchenStockValue = parseFloat(productKitchenStock.value.trim());
  let productCanteenStockValue = parseFloat(productCanteenStock.value.trim());
  let productQuantityUnitValue = productQuantityUnit.value.trim();
  let productImageContainer = document.querySelector(".productImageContainer");

  productName.style.setProperty("--placeholder-color", "black");
  productBrand.style.setProperty("--placeholder-color", "black");
  productKitchenStock.style.setProperty("--placeholder-color", "black");
  productQuantityUnit.style.backgroundColor = "white";
  productCanteenStock.style.setProperty("--placeholder-color", "black");
  productImageContainer.style.backgroundColor = "white";
  productImage.style.backgroundColor = "white";
  let ingredients = document.querySelectorAll(".ingredient");
  [...ingredients].forEach(
    (ingredient) => (ingredient.style.backgroundColor = "white")
  );
  categorySelcetElement.style.backgroundColor = "white";

  if (productNameValue == "") {
    productName.style.setProperty("--placeholder-color", "red");
    productName.placeholder = "Please Input Product Name";
    alert("Please Input Product Name");
    return false;
  } else if (productBrandValue == "") {
    productBrand.style.setProperty("--placeholder-color", "red");
    productBrand.placeholder = "Please Input Product Brand Value";
    alert("Please Input Product Brand Value");
    return false;
  } else if (isNaN(productKitchenStockValue)) {
    productKitchenStock.style.setProperty("--placeholder-color", "red");
    productKitchenStock.placeholder =
      "Please Input Product Kitchen Stock Value";
    alert("Please Input Product Kitchen Stock Value");
    return false;
  } else if (isNaN(productCanteenStockValue)) {
    productCanteenStock.style.setProperty("--placeholder-color", "red");
    productCanteenStock.placeholder =
      "Please Input Product Canteen Stock Value";
    alert("Please Input Product Canteen Stock Value");
    return false;
  } else if (productQuantityUnitValue == "") {
    productQuantityUnit.style.backgroundColor = "red";
    productQuantityUnit.placeholder =
      "Please Input Product Quantity Unit Value";
    alert("Please Input Product Quantity Unit Value");
    return false;
  } else if (productImage.files.length <= 0) {
    alert("Upload Product Photo");
    productImage.style.backgroundColor = "red";
    productImageContainer.style.backgroundColor = "red";
    return false;
  } else if (productIsCombined.checked) {
    console.log("check");
    let ingredients = document.querySelectorAll(".ingredient");
    [...ingredients].forEach((ingredient) => {
      if (ingredient.value == "") {
        ingredient.style.backgroundColor = "red";
        alert("Please Fill up the ingredient or remove it");
        return false;
      }
    });
    return true;
  } else if (categorySelcetElement.value == "") {
    categorySelcetElement.style.backgroundColor = "red";
    alert("Please Fill up the ingredient or remove it");
    return false;
  } else {
    return true;
  }
}

// ingredientAddBtn controller

//ingredientDelBtn controller
function addIngredient(element) {
  let delBtn = document.querySelector(".ingredientDelBtn");
  delBtn.style.display = "flex";
  let productSelectList = document.querySelector(".ingredient").children;
  let ingredientList = document.querySelectorAll(".ingredient");
  let updateSelectList = document.querySelector(".updateSelect");
  let inputDiv = element.parentElement.previousElementSibling;
  if (inputDiv.querySelector(".last") != null) {
    let lastSelectElement = inputDiv.querySelector(".last");
    lastSelectElement.classList.remove("last");
  }
  let select = document.createElement("select");
  select.classList.add("ingredient");
  select.classList.add("last");
  select.setAttribute("onchange", "selectionChange(this)");
  Array.from(updateSelectList.options).forEach((option) => {
    select.add(option.cloneNode(true));
  });

  inputDiv.appendChild(select);
}

// onchange handler for selec element
function selectionChange(element) {
  let originalList = document.querySelector(".originalList").children;
  let ingredientList = document.querySelectorAll(".ingredient");
  let updateSelectList = document.querySelector(".updateSelect");

  let selectedOptions = [];
  ingredientList.forEach((ingredient) => {
    selectedOptions.push(ingredient.options[ingredient.selectedIndex].value);
  });

  let filterOptions = [...originalList].filter((option) => {
    return !selectedOptions.includes(option.value);
  });

  updateSelectList.innerHTML = "";
  filterOptions.forEach((option) => {
    updateSelectList.add(option.cloneNode(true));
  });

  [...ingredientList].some((ingredient, i, arr) => {
    let selectedValue = ingredient.options[ingredient.selectedIndex].value;
    let matchedIngredient = arr.filter(
      (item, index) => index !== i && item.value === selectedValue
    );
    if (matchedIngredient.length > 0) {
      matchedIngredient[0].innerHTML = "";
      [...updateSelectList.children].forEach((option) => {
        matchedIngredient[0].add(option.cloneNode(true));
      });
      matchedIngredient[0].selectedIndex = 0;
    }
  });
}

function deleteIngredient(element) {
  let inputDiv = document.querySelector(".inputDiv");
  let lastChildren = inputDiv.querySelector(".last");
  if (lastChildren.previousElementSibling.previousElementSibling) {
    let previousElement = lastChildren.previousElementSibling;
    previousElement.classList.add("last");
    lastChildren.remove();
  } else {
    lastChildren.remove();
    element.style.display = "none";
  }
}

// combineProduct checkbox handller
let combineProductCheckbox = document.querySelector(".combineProduct");
let ingredientContainer = document.querySelector(".ingredientContainer");
combineProductCheckbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    ingredientContainer.style.display = "flex";
  } else {
    let remove = confirm("আপনি কি সকল উপকরণ মুছে দিতে চান?");
    if (remove) {
      ingredientContainer.innerHTML = ` <div class="inputDiv">
                      <select class="ingredient">
                        <option value="">firts</option>
                        <option value="sd">dfs</option>
                      </select>
                    </div>
                    <div class="actionBtns">
                      <div class="ingredientAddBtn btn" onclick="addIngredient(this)">Add</div>
                      <div class="ingredientDelBtn btn" style="display: none" onclick="deleteIngredient(this)">
                        Delete
                      </div>
                    </div>`;
      ingredientContainer.style.display = "none";
    } else {
      e.target.checked = true;
    }
  }
});
function removeText(input) {
  input.value = input.value.replace(/[^0-9.]/g, "");
}
