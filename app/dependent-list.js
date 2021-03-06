var DependentList = (function () {
    function DependentList(elements) {
        this.elements = Array.prototype.slice.call(elements, 0).reverse();
        this.render();
    }
    DependentList.prototype.render = function () {
        [].forEach.call(this.elements, function (selectElement, index) {
            var DependentSelectObject = new DependentSourceSelect(selectElement);
        });
    };
    return DependentList;
}());
var DependentSourceSelect = (function () {
    function DependentSourceSelect(selectElement) {
        this.element = selectElement;
        if (('depends' in this.element.dataset) !== true) {
            throw new Error("Depending not set");
        }
        this.prepareOptions();
        new DependentTargetSelect(this.element.dataset.depends, this);
    }
    DependentSourceSelect.prototype.prepareOptions = function () {
        var _this = this;
        var options = this.element.options;
        if (options.length > 0) {
            [].forEach.call(options, function (option, index) {
                option.addEventListener('click', _this.setSelectedOption.bind(_this));
            });
        }
    };
    DependentSourceSelect.prototype.setVisibleOptions = function (targetValue) {
        [].forEach.call(this.element.options, function (option, index) {
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
    };
    DependentSourceSelect.prototype.setSelectedOption = function (event) {
        var visibleOptions = this.getVisibleOptions();
        [].forEach.call(visibleOptions, function (option, index) {
            option.removeAttribute('selected');
            option.selected = false;
            option.dataset.selected = false;
            if (event.srcElement == option) {
                option.selected = true;
                option.dataset.selected = true;
            }
        });
    };
    DependentSourceSelect.prototype.getSelectedOption = function () {
        var _this = this;
        var selectedOption = false, visibleOptions = this.getVisibleOptions();
        [].forEach.call(visibleOptions, function (option, index) {
            if (_this.isOptionSelected(option)) {
                selectedOption = option;
            }
        });
        return selectedOption;
    };
    DependentSourceSelect.prototype.getVisibleOptions = function () {
        return this.element.querySelectorAll('.option-visible');
    };
    DependentSourceSelect.prototype.getAllVisibleOptions = function () {
        return [].slice.call(this.element.options).filter(function (option) {
            return option.style.display != 'none';
        });
    };
    DependentSourceSelect.prototype.isOptionSelected = function (option) {
        if (option.selected == true || ('selected' in option.dataset && option.dataset.selected == 'true')) {
            return true;
        }
        return false;
    };
    DependentSourceSelect.prototype.haveSelected = function (options) {
        var _this = this;
        var haveSelected = false;
        [].forEach.call(options, function (option, index) {
            if (_this.isOptionSelected(option)) {
                haveSelected = true;
            }
        });
        return haveSelected;
    };
    DependentSourceSelect.prototype.selectFirstOption = function () {
        var options = this.getVisibleOptions(), selectedOption = this.getSelectedOption();
        if (options.length > 0) {
            if (selectedOption) {
                selectedOption.selected = true;
            }
            else if (this.element.selectedIndex == -1 && this.element.length > 0) {
                this.element.selectedIndex = 0;
            }
            else {
                options[0].selected = true;
            }
        }
        else {
            var allVisibleOptions = this.getAllVisibleOptions();
            if (allVisibleOptions.length > 0) {
                this.element.selectedIndex = 0;
                allVisibleOptions[0].selected = true;
            }
            else {
                this.element.selectedIndex = -1;
            }
        }
        this.trigger('change', this.element);
    };
    DependentSourceSelect.prototype.trigger = function (eventName, element) {
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, false, true);
            element.dispatchEvent(evt);
        }
        else {
            element.fireEvent("on" + eventName);
        }
    };
    return DependentSourceSelect;
}());
var DependentTargetSelect = (function () {
    function DependentTargetSelect(element, source) {
        this.element = document.querySelector(element);
        this.source = source;
        this.registerEvents();
        this.selectFirstOption();
    }
    DependentTargetSelect.prototype.registerEvents = function () {
        var that = this;
        this.element.addEventListener('change', function (event) {
            that.source.setVisibleOptions(that.element.value);
        });
    };
    DependentTargetSelect.prototype.selectFirstOption = function () {
        if (this.element.selectedIndex == -1 && this.element.length > 0) {
            this.element.selectedIndex = 0;
        }
        this.source.trigger('change', this.element);
    };
    return DependentTargetSelect;
}());
