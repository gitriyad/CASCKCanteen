function printDocument() {
  let iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  let html = document.documentElement.cloneNode(true);
  html.querySelector(".btnController").innerHTML = "";
  iframe.contentDocument.open();
  iframe.contentDocument.write(html.outerHTML);
  iframe.contentDocument.close();
  iframe.onload = function () {
    iframe.contentWindow.print();
    document.body.removeChild(iframe); // Remove the iframe after printing
  };
}
