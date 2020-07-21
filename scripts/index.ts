const optimizeButton = document.getElementById("optimizeFont") as HTMLButtonElement;
const fontInput = document.getElementById("font") as HTMLInputElement;
const errorEle = document.querySelector(".error") as HTMLParagraphElement;
const codeContainer = document.querySelector("#finalCode") as HTMLPreElement;
const codeBlockContainer = document.getElementById("codeBlockContainer") as HTMLDivElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
optimizeButton.addEventListener("click", () => {

	optimizeButton.classList.add("loading");

	if (!fontInput.checkValidity()) {
		errorEle.innerText = "Plase fill in the font you want optimized!";
		optimizeButton.classList.remove("loading");
		return;
	}

	// if not google, STOP

	let fontUrl:string = fontInput.value;

	// add display swap if not on it

	// fill in the string
	const fontCode:string = `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${fontUrl}">
<link rel="stylesheet" href="${fontUrl}" media="print" onload="this.media='all'">
<noscript>
	<link rel="stylesheet" href="${fontUrl}">
</noscript>
	`;

	codeContainer.innerText = fontCode;
	codeBlockContainer.style.display = "flex";

	optimizeButton.classList.remove("loading");

}, false);

fontInput.addEventListener("input", () => {

	errorEle.innerHTML = "";

}, false);

resetButton.addEventListener("click", () => {

	fontInput.value = "";
	codeBlockContainer.style.display = "none";
	codeContainer.innerHTML = "";
	fontInput.focus();

}, false);
