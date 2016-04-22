interface IHtmlElement extends Element {
    dataset: any;
    style: any;
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

        this.prepareOptions();
        new DependentTargetSelect(this.element.dataset.depends, this);
    }

    prepareOptions() {
        var options = this.element.options;

        if(options.length > 0) {
            [].forEach.call(options, (option, index) => {
                option.addEventListener('click', this.setSelectedOption.bind(this));
            });
        }
    }

    setVisibleOptions(targetValue) {
        [].forEach.call(this.element.options, (option, index) => {
            if ('group' in option.dataset) {
                option.style.display = 'none';
                option.classList.remove('option-visible');

                if (option.selected && !('selected' in option.dataset)) {
                    option.dataset.selected = true;
                }

                if (option.dataset.group == targetValue) {
                    option.style.display = 'block';
                    option.classList.add('option-visible');
                }

                option.removeAttribute('selected');
            }
        });

        this.selectFirstOption();
    }

    setSelectedOption(event) {
        var visibleOptions = this.getVisibleOptions();

        [].forEach.call(visibleOptions, (option, index) => {
            option.removeAttribute('selected');
            option.selected = false;
            option.dataset.selected = false;

            if (event.srcElement == option) {
                option.selected = true;
                option.dataset.selected = true;
            }
        });
    }

    getSelectedOption() {
        var selectedOption = false,
            visibleOptions = this.getVisibleOptions();

        [].forEach.call(visibleOptions, (option, index) => {
            if (this.isOptionSelected(option)) {
                selectedOption = option;
            }
        });

        return selectedOption;
    }

    getVisibleOptions() {
        return this.element.querySelectorAll('.option-visible');
    }

    getAllVisibleOptions() {
        return [].slice.call(this.element.options).filter(function(option) {
            return option.style.display != 'none';
        });
    }

    isOptionSelected(option) {
        if (option.selected == true || ('selected' in option.dataset && option.dataset.selected == 'true')) {
            return true;
        }

        return false;
    }

    haveSelected(options) {
        var haveSelected = false;

        [].forEach.call(options, (option, index) => {
            if (this.isOptionSelected(option)) {
                haveSelected = true;
            }
        });

        return haveSelected;
    }

    selectFirstOption() {
        var options = <any> this.getVisibleOptions(),
            selectedOption = <any>this.getSelectedOption();

        if (options.length > 0) {
            if (selectedOption) {
                selectedOption.selected = true;
            } else if (this.element.selectedIndex == -1 && this.element.length > 0) {
                this.element.selectedIndex = 0;
            } else {
                options[0].selected = true;
            }
        } else {
            var allVisibleOptions = this.getAllVisibleOptions();

            if (allVisibleOptions.length > 0) {
                this.element.selectedIndex = 0;
                allVisibleOptions[0].selected = true;
            } else {
                this.element.selectedIndex = -1;
            }
        }

        this.trigger('change', this.element);
    }

    trigger(eventName, element) {
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, false, true);
            element.dispatchEvent(evt);
        }
        else {
            element.fireEvent("on" + eventName);
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
        
        this.source.trigger('change', this.element);
    }
}