interface IHtmlElement extends Element {
	dataset: { depends };
	style: { display: string };
	disabled: boolean;
	value: any;
	length: number;
}

interface IHtmlElementSelect extends IHtmlElement {
	options: any;
	selectedIndex: number;
}

class DependentList {
	elements: NodeList;
    constructor(elements: NodeList) {
        this.elements = Array.prototype.slice.call(elements, 0).reverse();

        this.render();
    }
    render() {
		[].forEach.call(this.elements, (selectElement, index) => {
			var DependentSelectObject = new DependentSourceSelect(selectElement);
		});
    }
}

class DependentSourceSelect {
	element: IHtmlElementSelect;

	constructor(selectElement: IHtmlElementSelect) {
		this.element = selectElement;

		if (('depends' in this.element.dataset) !== true) {
			throw new Error("Depending not set");
		}

		new DependentTargetSelect(this.element.dataset.depends, this);
	}

	setVisibleOptions(targetValue) {
		var visibleOptions = [];

		[].forEach.call(this.element.options, (option, index) => {
			option.style.display = 'none';
			if (option.dataset.group == targetValue) {
				visibleOptions.push(option);
				option.style.display = 'block';
			}
		});

		this.selectFirstOption(visibleOptions);
	}

	selectFirstOption(options) {

		if (options.length > 0) {
			if (this.element.selectedIndex == -1 && this.element.length > 0) {
	            this.element.selectedIndex = 0;
	        } else {
				var visibleOption = options[0];
				visibleOption.selected = true;
	        }
        } else {
			this.element.selectedIndex = -1;
        }

        this.trigger(this.element);
        
	}

	trigger(element) {
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			element.dispatchEvent(evt);
		}
		else {
			element.fireEvent("onchange");
		}
	}
}

class DependentTargetSelect {
	element: IHtmlElementSelect;
	source;

	constructor(element: string, source) {
		this.element = <IHtmlElementSelect>document.querySelector(element);
		this.source = source;

		this.registerEvents();
		this.selectFirstOption();
	}

	registerEvents() {
		var that = this;

		this.element.addEventListener('change', (event) => {
			that.source.setVisibleOptions(that.element.value);
		});
	}

	selectFirstOption() {
		if (this.element.selectedIndex == -1 && this.element.length > 0) {
			this.element.selectedIndex = 0;
		}
		
		this.source.trigger(this.element);
	}
}