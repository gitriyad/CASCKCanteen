let divs = document.querySelectorAll(".registerTable div");
let prev = [];
let colorsArr = [
  "rgb(230, 230, 250,0.5)",
  "rgb(216, 191, 216,0.5)",
  "rgb(147, 112, 219,0.5)",
  "rgb(240, 128, 128,0.5)",
  "rgb(255, 192, 203,0.5)",
  "rgb(219, 112, 147,0.5)",
  "rgb(255, 160, 122,0.5)",
  "rgb(238, 232, 170,0.5)",
  "rgb(189, 183, 107,0.5)",
  "rgb(152, 251, 152,0.5)",
];
window.addEventListener("load", (e) => {
  [...divs].forEach((div) => {
    if (!div.classList.contains("btn")) {
      let ind = Math.floor(Math.random() * colorsArr.length);
      if (prev.length > 0) {
        let isGiven = checkGiven(prev, ind);
        if (isGiven) {
          while (prev.includes(ind)) {
            ind = Math.floor(Math.random() * colorsArr.length);
          }
          prev.push(ind);
          div.style.backgroundColor = colorsArr[ind];
        } else {
          prev.push(ind);
          div.style.backgroundColor = colorsArr[ind];
        }
      } else {
        prev.push(ind);
        div.style.backgroundColor = colorsArr[ind];
      }
    }
  });
});
function checkGiven(arr, ind) {
  if (arr.includes(ind)) {
    return true;
  } else {
    return false;
  }
}

// user Profile Pic Handler
let userProfileIcon = document.querySelector(".userProfileIcon");
let fileInput = document.querySelector(".userProPic");
userProfileIcon.addEventListener("click", (e) => {
  fileInput.click();
});

let previewDiv = document.querySelector(".userImage");
fileInput.addEventListener("change", (e) => {
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = (url) => {
      let imageUrl = url.target.result;
      previewDiv.style.backgroundImage = `url(${imageUrl})`;
    };
    reader.readAsDataURL(file);
    userProfileIcon.innerHTML = "";
  } else {
    userProfileIcon.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
  }
});

// registering to the server

let userSubmitBtn = document.querySelector(".userSubmit");
userSubmitBtn.addEventListener("click", (e) => {
  let name = document.querySelector(".name");
  let shortName = document.querySelector(".shortName");
  let email = document.querySelector(".email");
  let password = document.querySelector(".pass");
  let mobile = document.querySelector(".mobile");
  let userProPic = fileInput.files[0];
  let isValid = checkValidity(
    name,
    shortName,
    email,
    password,
    mobile,
    userProPic
  );
  if (isValid) {
    let formData = new FormData();
    formData.append("userName", name.value.trim());
    formData.append("shortName", shortName.value.toUpperCase().trim());
    formData.append("email", email.value.trim());
    formData.append("password", password.value.trim());
    formData.append("mobile", mobile.value.trim());
    formData.append("userProPic", userProPic);
    fetch(`/register/${shortName.value.toUpperCase().trim()}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response) {
          throw new Error(`User Registration Error: ${response}`);
        } else {
          return response.text();
        }
      })
      .then((data) => {
        if (data == "Registration Successfull") {
          let notification = document.querySelector(".notification");
          notification.style.display = "flex";
          let registerPanel = document.querySelector(".registerPanel");
          let text = `রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে।<br>
          <div class="btn" style="width:12rem" onclick="window.location.href='/'">লগইন করুণ</div>`;
          notification.innerHTML = text;
        } else {
          throw new Error(data);
        }
      })
      .then(() => {
        let registerPanel = document.querySelector(".registerPanel");
        let userImage = document.querySelector(".userImage");
        registerPanel.scrollTop = registerPanel.scrollHeight;
        registerPanel.addEventListener("scroll", () => {
          userImage.style.top = `calc(${registerPanel.scrollTop}px + 1rem)`;
        });
      })
      .catch((userRegError) => {
        alert(`${userRegError.message}`);
      });
  }
});

// input validation check
function checkValidity(name, shortName, email, password, mobile, userProPic) {
  name.style.color = "Black";
  name.placeholder = "";
  shortName.style.color = "Black";
  shortName.placeholder = "";
  email.style.color = "Black";
  email.placeholder = "";
  password.style.color = "Black";
  password.placeholder = "";
  mobile.style.color = "Black";
  mobile.placeholder = "";
  previewDiv.style.backgroundColor = "white";
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let mobileNumberRegex = /^\d{11}$/;
  try {
    if (
      name.value.trim() == null ||
      name.value.trim() == "" ||
      name.value.trim() == " " ||
      name.value.trim().length == 0
    ) {
      name.style.color = "red";
      name.placeholder = "Name is Required";
      throw new Error("Name is Required");
    } else if (
      shortName.value.trim() == null ||
      shortName.value.trim() == "" ||
      shortName.value.trim() == " " ||
      shortName.value.trim().length == 0
    ) {
      shortName.style.color = "red";
      shortName.placeholder = "Short Name is Required";
      throw new Error("Short Name is Required");
    } else if (
      email.value.trim() == null ||
      email.value.trim() == "" ||
      email.value.trim() == " " ||
      email.value.trim().length == 0
    ) {
      email.style.color = "red";
      email.placeholder = "Email Name is Required";
      throw new Error("Email is Required");
    } else if (!emailRegex.test(email.value.trim())) {
      email.style.color = "red";
      email.placeholder = "Email Must be valid";
      throw new Error("Email Must be valid");
    } else if (
      password.value.trim() == null ||
      password.value.trim() == "" ||
      password.value.trim() == " " ||
      password.value.trim().length == 0
    ) {
      password.style.color = "red";
      password.placeholder = "Password is Required";
      throw new Error("Password is Required");
    } else if (
      mobile.value.trim() == null ||
      mobile.value.trim() == "" ||
      mobile.value.trim() == " " ||
      mobile.value.trim().length == 0
    ) {
      mobile.style.color = "red";
      mobile.placeholder = "Mobile Number is Required";
      throw new Error("Mobile Number is Required");
    } else if (!mobileNumberRegex.test(mobile.value.trim())) {
      mobile.style.color = "red";
      mobile.placeholder = "Mobile Number Must Be 11 Digits";
      throw new Error("Mobile Number Must Be 11 Digits");
    } else if (!userProPic) {
      previewDiv.style.backgroundColor = "red";
      throw new Error("Profile Picture is Required");
    }
    return true;
  } catch (inputError) {
    alert(inputError.message);
    return false;
  }
}
