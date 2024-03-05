let infoChilds = [...document.querySelectorAll(".infoChild")];
infoChilds.forEach((child) => {
  child.innerHTML =
    child.innerHTML.charAt(0).toUpperCase() +
    child.innerHTML.replace(/([A-Z])/g, " $1").slice(1);
});

// fetching data
function fetchSingleDateData(containerDiv) {
  let date = containerDiv.querySelector(".date").innerHTML.trim();
  let database = containerDiv.getAttribute("dtb");
  let [d, m, y] = date.split("-");
  date = `${y}-${m}-${d}`;
  date = new Date(date);
  window.location.href = encodeURI(`/admin/singleDateData/${date}/${database}`);
}
