## Dependent list / Зависимый список ##

![](https://habrastorage.org/files/020/890/188/0208901887e7470d9d468cfef80c94f9.gif)

## How to use

Parent list `id="select1"` or `class="select1"`

``` html
<select id="select1" size="5">
  <option value="group-1">select 1</option>
  <option value="group-2">select 2</option>
  <option value="group-3">select 3</option>
</select>
```

To the dependent list add `class="dependent-list"` and `data-depends="#select1"` or `data-depends=".select1"`
``` html
<select size="5" class="dependent-list" data-depends="#select1" id="select2">
  <option value="1" data-group="group-1">select 1 -> 1</option>
  <option value="2" data-group="group-2">select 1 -> 2</option>
</select>
```

Ok, and init

``` javascript
var dependentSelects = document.querySelectorAll('.dependent-list');
new DependentList(dependentSelects);
```

