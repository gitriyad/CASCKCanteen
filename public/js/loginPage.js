window.addEventListener("load", () => {
  setTimeout(() => {
    let body = document.querySelector("body");
    body.style.height = "auto";
    body.style.overflow = "auto";
  }, 5200);
});
// login button click handler
let loginBtn = document.querySelector(".loginbtn");
loginBtn.addEventListener("click", (e) => {
  let shortName = document.querySelector(".shortName");
  let password = document.querySelector(".password");
  let isValid = checkValidity(shortName, password);
  if (isValid) {
    let sendObj = JSON.stringify({
      userShortName: shortName.value.toUpperCase().trim(),
      password: password.value.trim(),
    });
    let headers = new Headers({ "Content-Type": "application/json" });
    fetch("/login", {
      method: "POST",
      headers: headers,
      body: sendObj,
    })
      .then((loginResponse) => {
        if (!loginResponse.ok) {
          throw new Error(`Login Error: ${loginResponse.message}`);
        }
        return loginResponse.text();
      })
      .then((loginData) => {
        window.location.href = "/admin/dashboard";
      })
      .catch((loginFetchError) => {
        alert(loginFetchError);
      });
  }
});

// input validation
function checkValidity(shortName, password) {
  let shortNameValue = shortName.value.toUpperCase().trim();
  let passwordValue = password.value.trim();
  shortName.style.setProperty("--placeholder-color", "black");
  password.style.setProperty("--placeholder-color", "black");
  try {
    if (
      shortNameValue == "" ||
      shortNameValue == "  " ||
      !shortName ||
      !shortNameValue ||
      shortNameValue == null
    ) {
      shortName.style.setProperty("--placeholder-color", "red");
      shortName.placeholder = "Short name is required";
      throw new Error("Short name is required");
    } else if (
      passwordValue == "" ||
      passwordValue == "  " ||
      !password ||
      !passwordValue ||
      passwordValue == null
    ) {
      password.style.setProperty("--placeholder-color", "red");
      password.placeholder = "Password is required";
      throw new Error("Password is required");
    }
    return true;
  } catch (loginError) {
    alert(loginError.message);
    return false;
  }
}
