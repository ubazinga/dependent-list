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
        new DependentTargetSelect(this.element.dataset.depends, this);
    }
    DependentSourceSelect.prototype.setVisibleOptions = function (targetValue) {
        var visibleOptions = [];
        [].forEach.call(this.element.options, function (option, index) {
            option.style.display = 'none';
            if (option.dataset.group == targetValue) {
                visibleOptions.push(option);
                option.style.display = 'block';
            }
        });
        this.selectFirstOption(visibleOptions);
    };
    DependentSourceSelect.prototype.selectFirstOption = function (options) {
        if (options.length > 0) {
            if (this.element.selectedIndex == -1 && this.element.length > 0) {
                this.element.selectedIndex = 0;
            }
            else {
                var visibleOption = options[0];
                visibleOption.selected = true;
            }
        }
        else {
            this.element.selectedIndex = -1;
        }
        this.trigger(this.element);
    };
    DependentSourceSelect.prototype.trigger = function (element) {
        console.info('change', element);
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
        }
        else {
            element.fireEvent("onchange");
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
        console.info(this.element.selectedIndex, this.element);
        if (this.element.selectedIndex == -1 && this.element.length > 0) {
            this.element.selectedIndex = 0;
        }
        this.source.trigger(this.element);
    };
    return DependentTargetSelect;
}());
// Invoking
// Сause 
