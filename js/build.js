var Modals = (function () {
    function Modals() {
        this.modals = document.querySelectorAll("[data-modal]");
        this.openButtons = document.querySelectorAll("[data-open]");
    }
    Modals.prototype.addListeners = function () {
        this.openButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var modalToOpen = document.getElementById(button.getAttribute("data-open"));
                if (modalToOpen == null) {
                    throw "That modal doesn't exist";
                }
                modalToOpen.classList.add("shown");
            }, false);
        });
        this.modals.forEach(function (modal) {
            var closeButtons = modal.querySelectorAll("[data-close]");
            closeButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    modal.classList.remove("shown");
                }, false);
            });
            modal.addEventListener("click", function (ev) {
                if (ev.target == modal) {
                    modal.classList.remove("shown");
                }
            }, false);
        });
    };
    return Modals;
}());
var GoogleFontParser = (function () {
    function GoogleFontParser(rawFontString) {
        this.fontString = rawFontString;
    }
    GoogleFontParser.prototype.parse = function () {
        var cleanUrl;
        if (this.fontString.startsWith("<link")) {
            cleanUrl = this.parseLinkTag();
        }
        else {
            cleanUrl = this.parseUrl(this.fontString);
        }
        return this.addParams(cleanUrl);
    };
    GoogleFontParser.prototype.parseUrl = function (rawUrl) {
        var fullUrl;
        try {
            fullUrl = new URL(rawUrl);
        }
        catch (e) {
            throw "Sorry, please provide a valid URL";
        }
        if (fullUrl.host != "fonts.googleapis.com") {
            throw "Sorry, only Google Fonts are available to optimize right now";
        }
        return fullUrl.href;
    };
    GoogleFontParser.prototype.parseLinkTag = function () {
        var rawUrl;
        var indexOfHref = this.fontString.indexOf('href="') + 6;
        if (indexOfHref == -1) {
            throw "Sorry, that isn't a valid Google Fonts link tag";
        }
        var lastIndex = this.fontString.indexOf('"', indexOfHref);
        return this.fontString.substr(indexOfHref, (lastIndex - indexOfHref));
    };
    GoogleFontParser.prototype.addParams = function (cleanUrl) {
        var addedUrl;
        var fullUrl = new URL(cleanUrl);
        var searchParams = new URLSearchParams(fullUrl.search);
        if (searchParams.get("display") == null || searchParams.get("display") != "swap") {
            addedUrl = fullUrl.href += "&display=swap";
        }
        else {
            addedUrl = fullUrl.href;
        }
        return addedUrl;
    };
    return GoogleFontParser;
}());
var optimizeButton = document.getElementById("optimizeFont");
var fontInput = document.getElementById("font");
var errorEle = document.querySelector(".error");
var codeContainer = document.querySelector("#finalCode");
var codeBlockContainer = document.getElementById("codeBlockContainer");
var resetButton = document.getElementById("resetButton");
var copyButton = document.getElementById("copyButton");
var mod = new Modals();
mod.addListeners();
optimizeButton.addEventListener("click", function () {
    optimizeButton.classList.add("loading");
    if (!fontInput.checkValidity()) {
        errorEle.innerText = "Plase fill in the font you want optimized!";
        optimizeButton.classList.remove("loading");
        return;
    }
    var parser;
    var fontUrl = fontInput.value;
    try {
        parser = new GoogleFontParser(fontInput.value);
        fontUrl = parser.parse();
    }
    catch (e) {
        errorEle.innerText = e;
        optimizeButton.classList.remove("loading");
        return;
    }
    var fontCode = "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"preload\" as=\"style\" href=\"" + fontUrl + "\">\n<link rel=\"stylesheet\" href=\"" + fontUrl + "\" media=\"print\" onload=\"this.media='all'\">\n<noscript>\n\t<link rel=\"stylesheet\" href=\"" + fontUrl + "\">\n</noscript>";
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
copyButton.addEventListener("click", function () {
    navigator.permissions.query({ "name": "clipboard-write" }).then(function (result) {
        if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(codeContainer.innerText).then(function () {
                console.log("success!!");
            }, function () {
                console.log("failure");
            });
        }
    });
}, false);
