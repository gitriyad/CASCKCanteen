function previewImage(fileInput) {
  let imageContainer = document.querySelector(".image");
  let file = fileInput.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = (url) => {
      let imgUrl = url.target.result;
      imageContainer.style.backgroundImage = `url("${imgUrl}")`;
    };
    reader.readAsDataURL(file);
  }
}
// setting date
window.addEventListener("load", () => {
  flatpickr(".assetDate", {
    dateFormat: "d-m-Y", // Date format
    minDate: new Date().fp_incr(-30 * 365), // Minimum selectable date is today
    maxDate: new Date().fp_incr(30), // Maximum selectable date is 30 days from today
    disableMobile: true, // Disable mobile-friendly mode
    defaultDate: "today", // Set the default selected date to today
  });
});

// ******************************************************************************************************************
function multipleInputHandler(element) {
  removeText(element);
  calculateAssetPurchasePrice();
}

function removeText(input) {
  input.value = input.value.replace(/[^0-9.]/g, "");
}
function calculateAssetPurchasePrice() {
  let price = parseFloat(document.querySelector(".assetPrice").value.trim());
  let qty = parseFloat(document.querySelector(".assetQuantity").value.trim());
  let transportCost = parseFloat(
    document.querySelector(".assetTransportCost").value.trim()
  );
  let purchasePrice = parseFloat((price * qty + transportCost).toFixed(15));
  let purchasePriceDiv = document.querySelector(".purchasePrice");
  purchasePriceDiv.innerHTML = purchasePrice;
}
// ********************************************************************************************************
function submitAsset() {
  let isValid = checkValidity();
  if (isValid) {
    let date = document.querySelector(".assetDate ").value.trim();
    let [day, month, year] = date.split("-");
    date = new Date(`${year}-${month}-${day}`);
    let assetName = document.querySelector(".assetName").value.trim();
    let memoNo = document.querySelector(".memoNo").value.trim();
    let assetPrice = Number(
      parseFloat(document.querySelector(".assetPrice").value.trim()).toFixed(15)
    );
    let assetTransportCost = Number(
      parseFloat(
        document.querySelector(".assetTransportCost").value.trim()
      ).toFixed(15)
    );
    let purchasePrice = Number(
      parseFloat(
        document.querySelector(".purchasePrice").innerHTML.trim()
      ).toFixed(15)
    );
    let assetQuantity = Number(
      parseFloat(document.querySelector(".assetQuantity").value.trim()).toFixed(
        15
      )
    );
    let userId = document.querySelector(".user").getAttribute("user-id").trim();
    let assetImage = document.querySelector(".imageFileInput").files[0];
    let formData = new FormData();
    formData.append("date", date);
    formData.append("assetName", assetName);
    formData.append("memoNo", memoNo);
    formData.append("assetPrice", assetPrice);
    formData.append("assetTransportCost", assetTransportCost);
    formData.append("purchasePrice", purchasePrice);
    formData.append("assetImage", assetImage);
    formData.append("uploadedBy", userId);
    formData.append("assetQuantity", assetQuantity);
    uploadAsset(formData);
  }
}
function uploadAsset(data) {
  fetch("/admin/addAsset", {
    method: "POST",
    body: data,
  })
    .then((addAssetRes) => {
      if (!addAssetRes.ok) {
        throw new Error(addAssetRes.text());
      } else {
        return addAssetRes.text();
      }
    })
    .then((addAssetResData) => {
      alert(addAssetResData);
      window.location.reload();
    })
    .catch((addAssetError) => {
      alert(addAssetError);
    });
}
function checkValidity() {
  let allInputs = [...document.querySelectorAll("input")];
  let file = document.querySelector(".imageFileInput").files[0];
  let image = document.querySelector(".image");
  image.style.backgroundColor = "rgba(0,0,0,0.1)";
  [...allInputs].forEach((input) => (input.style.backgroundColor = "white"));
  if (allInputs.every((input) => input.value.trim() != "") && file) {
    return true;
  } else {
    let invalidInputs = allInputs.filter((input) => input.value.trim() == "");
    [...invalidInputs].forEach((input) => {
      input.style.backgroundColor = "red";
    });
    if (!file) {
      image.style.backgroundColor = "rgba(255,0,0,0.1)";
    }
    alert("Please provide required values");
    return false;
  }
}
