var optimizeButton = document.getElementById("optimizeFont");
var fontInput = document.getElementById("font");
var errorEle = document.querySelector(".error");
var codeContainer = document.querySelector("#finalCode");
var codeBlockContainer = document.getElementById("codeBlockContainer");
var resetButton = document.getElementById("resetButton");
optimizeButton.addEventListener("click", function () {
    optimizeButton.classList.add("loading");
    if (!fontInput.checkValidity()) {
        errorEle.innerText = "Plase fill in the font you want optimized!";
        optimizeButton.classList.remove("loading");
        return;
    }
    var fontUrl = fontInput.value;
    var fontCode = "\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"preload\" as=\"style\" href=\"" + fontUrl + "\">\n<link rel=\"stylesheet\" href=\"" + fontUrl + "\" media=\"print\" onload=\"this.media='all'\">\n<noscript>\n\t<link rel=\"stylesheet\" href=\"" + fontUrl + "\">\n</noscript>\n\t";
    codeContainer.innerText = fontCode;
    codeBlockContainer.style.display = "flex";
    optimizeButton.classList.remove("loading");
}, false);
fontInput.addEventListener("input", function () {
    errorEle.innerHTML = "";
}, false);
resetButton.addEventListener("click", function () {
    fontInput.value = "";
    codeBlockContainer.style.display = "none";
    codeContainer.innerHTML = "";
    fontInput.focus();
}, false);
