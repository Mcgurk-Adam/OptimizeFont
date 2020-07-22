class Modals {

	private modals:NodeListOf<HTMLElement>;
	private openButtons:NodeListOf<HTMLElement>;

	constructor() {
		this.modals = document.querySelectorAll("[data-modal]");
		this.openButtons = document.querySelectorAll("[data-open]");
	}

	addListeners(): void {

		this.openButtons.forEach((button:HTMLElement) => {

			button.addEventListener("click", () => {

				const modalToOpen:HTMLElement = document.getElementById(button.getAttribute("data-open"));

				if (modalToOpen == null) {
					throw "That modal doesn't exist";
				}

				modalToOpen.classList.add("shown");

			}, false);

		});

		this.modals.forEach((modal:HTMLElement) => {

			const closeButtons:NodeListOf<HTMLElement> = modal.querySelectorAll("[data-close]");
			closeButtons.forEach((button:HTMLElement) => {

				button.addEventListener("click", () => {

					modal.classList.remove("shown");

				}, false);

			});

			modal.addEventListener("click", (ev:MouseEvent) => {

				if (ev.target == modal) {
					modal.classList.remove("shown");
				}

			}, false);

		});

	}

}
