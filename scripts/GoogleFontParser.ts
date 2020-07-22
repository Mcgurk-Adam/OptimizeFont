class GoogleFontParser {

	private fontString:string;

	constructor(rawFontString:string) {
		this.fontString = rawFontString;
	}

	parse(): string {

		let cleanUrl:string;

		if (this.fontString.startsWith("<link")) {
			cleanUrl = this.parseLinkTag();
		} else {
			cleanUrl = this.parseUrl(this.fontString);
		}

		return this.addParams(cleanUrl);

	}

	parseUrl(rawUrl:string): string {

		let fullUrl:URL;

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

	parseLinkTag(): string {
		
		let rawUrl:string;
		const indexOfHref:number = this.fontString.indexOf('href="') + 6;

		if (indexOfHref == -1) {
			throw "Sorry, that isn't a valid Google Fonts link tag";
		}

		const lastIndex:number = this.fontString.indexOf('"', indexOfHref);

		return this.fontString.substr(indexOfHref, (lastIndex - indexOfHref));

	}

	addParams(cleanUrl:string): string {
		let addedUrl:string;
		const fullUrl:URL = new URL(cleanUrl);
		const searchParams:URLSearchParams = new URLSearchParams(fullUrl.search);

		if (searchParams.get("display") == null || searchParams.get("display") != "swap") {
			addedUrl = fullUrl.href += "&display=swap";
		} else {
			addedUrl = fullUrl.href;
		}

		return addedUrl;
	}

}
