exports.handler = async (ev, context) => {

	const objectReturn = {
		statusCode: 200,
		body: ""
	};

	if (ev.httpMethod !== "PUT") {
		objectReturn.statusCode = 405;
		objectReturn.body = JSON.stringify({
			"success": false,
			"message": "Only PUT requests are accepted"
		});
		return objectReturn;
	}

	if (ev.headers["content-type"] !== "application/json" || ev.headers["accept"] !== "application/json") {
		objectReturn.statusCode = 400;
		objectReturn.body = JSON.stringify({
			"success": false,
			"message": "All requests must include the headers of Accept and Content-Type with the value of 'application/json' for both"
		});
		return objectReturn;
	}

	let jsonBody;

	try {
		jsonBody = JSON.parse(ev.body);
	} catch (e) {
		objectReturn.statusCode = 400;
		objectReturn.body = JSON.stringify({
			"success": false,
			"message": "Something went wrong while trying to parse the JSON body"
		});
		return objectReturn;
	}

	if (jsonBody.font == undefined) {
		objectReturn.statusCode = 400;
		objectReturn.body = JSON.stringify({
			"success": false,
			"message": "The body is missing the 'font' parameter"
		});
		return objectReturn;
	}

	let newCode;

	try {
		const Parser = new GoogleFontParser(jsonBody.font);
		newCode = Parser.parse();
	} catch (e) {
		objectReturn.statusCode = 400;
		objectReturn.body = JSON.stringify({
			"success": false,
			"message": e
		});
		return objectReturn;
	}

	const fontCode = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${newCode}">
<link rel="stylesheet" href="${newCode}" media="print" onload="this.media='all'">
<noscript>
	<link rel="stylesheet" href="${newCode}">
</noscript>`;

	objectReturn.body = JSON.stringify({
		"success": true,
		"message": "Successfully parsed font!",
		"font": fontCode
	});

	return objectReturn;
}

class GoogleFontParser {

	constructor(rawFontString) {
		this.fontString = rawFontString;
	}

	parse() {

		let cleanUrl;

		if (this.fontString.startsWith("<link")) {
			cleanUrl = this.parseLinkTag();
		} else {
			cleanUrl = this.parseUrl(this.fontString);
		}

		return this.addParams(cleanUrl);

	}

	parseUrl(rawUrl) {

		let fullUrl;

		try {
			fullUrl = new URL(rawUrl);
		} catch (e) {
			throw "Sorry, please provide a valid URL";
		}

		if (fullUrl.host != "fonts.googleapis.com") {
			throw "Sorry, only Google Fonts are available to optimize right now";
		}

		return fullUrl.href;

	}

	parseLinkTag() {
		
		let rawUrl;
		const indexOfHref = this.fontString.indexOf('href="') + 6;

		if (indexOfHref == -1) {
			throw "Sorry, that isn't a valid Google Fonts link tag";
		}

		const lastIndex = this.fontString.indexOf('"', indexOfHref);

		return this.fontString.substr(indexOfHref, (lastIndex - indexOfHref));

	}

	addParams(cleanUrl) {
		let addedUrl;
		const fullUrl = new URL(cleanUrl);
		const searchParams = new URLSearchParams(fullUrl.search);

		if (searchParams.get("display") == null || searchParams.get("display") != "swap") {
			addedUrl = fullUrl.href += "&display=swap";
		} else {
			addedUrl = fullUrl.href;
		}

		return addedUrl;
	}

}

