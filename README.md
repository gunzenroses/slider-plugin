# slider-plugin

The aim of this project is to get known with:

- development patterns;
- low coupling and high cohesion principle;
- unit-testing and bdd approach;
- webpack.

### [Example of slider-plugin usage](https://gunzenroses.github.io/slider-plugin/)

### Plugins info

The project works with node@14.16.1, npm@8.1.0, git@2.34 and jquery@3.6.0.

### Plugin architecture

Plugin has MVP-architecture with Passive View.

Model:

- implements IModel interface;
- contains and updates data;
- notifies methods of presenter when data is updated (using instance of IObservable interface).

View:

- implements IView interface;
- visualizes data;
- manipulates (renders and updates) subViews;
- handles events;
- notifies methods of IPresenter interface (using instance of IObservable interface).

Presenter:

- serves as mediator between data and UI;
- manipulates instances of Model and View classes using methods of IModel and IView interfaces;
- handles user input using methods defined by the IView interface;
- updates Model and View settings (using methods of their interfaces).

Contract:
The interaction between Presenter, its View and Model is based on Contract (IPresenter, IView and IModel interfaces).

According interfaces we have the following streams:

- change data (Model) -> notify method that process data (Presenter) -> change UI (View);
- UI event (View) -> notify method that process data (Presenter) -> change data (Model);
- change data outside MVP (Panel) -> notify method that process data (Presenter) -> change data (Model) -> notify method that process data (Presenter) -> change UI (View).

### [UML diagram](https://github.com/gunzenroses/slider-plugin/blob/master/src/UML.png)

### Used technologies and libraries

- webpack (path aliases, plugins, rules, development and production modes);
- scss;
- TypeScript;
- jest (unit-testing);
- eslint;
- babel.

### How to work with the project

Clone repository
```sh
git clone https://github.com/gunzenroses/slider-plugin.git
```

Install dependencies
```sh
npm i
```

Run tests
```sh
npm run test
```

Run development mode (on localhost:8081)
```sh
npm run dev
```

Run production mode(to assemble slider-plugin files)
```sh
npm run prod
```

Run debug mode
```sh
npm run debug
```

Run statical analyzer for code
```sh
npm run eslint
```

### How to use plugin

##### 1. Copy css-file from `dist/` to your project folder, add link in the `<head>`.

    ```html
    <head>
        <link rel="stylesheet" href="slider-plugin.min.css">
    <head>
    ```

##### 2.Install jQuery 3.6.0 `npm install jquery@3.6.0` or link to it directly at the end of `<body>`.
##### 3.Copy js file from `dist/` to your project folder, add after jQuery.

    ```html
    <body>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="slider-plugin.min.js"></script>
    </body>
    ```

##### 5.Initialize slider:

##### 5.1. In js-file with your options.

```js
`$( selector ).sliderMaker({ your options })`
```

|Options|Defaults|Type|Description|
|-|-|-|-|
|min|0|number|set min value|
|max|100|number|set max value|
|range|true|boolean|*true* - slider has two handles; *false* - slider has one handle|
|currentFirst|33|number|starting position for left handle (horizontal slider) or lowest handle (vertical slider) or for single handle|
|currentSecond|65|number|starting position for second handle|
|step|1|number|should be integer number > 0|
|orientation|horizontal|string|*horizontal* or *vertical* orientation|
|tooltip|true|boolean|*true* - enable tooltips with value of handle; *false* - hide tooltips|
|scale|true|boolean| *true* - sets automatic numbering of grid sections; *false* - hides grid.|


If you want to see configuration panel next to your slider add 'true' after object with your options.

```js
`$( selector ).sliderMaker({ your options }, true )`
```

##### 5.2. By adding a class 'js-slider-plugin' to your div element.

```html
<div class='js-slider-plugin'></div>
```

Then call a sliderMaker() in js-file without any selector

```js
`$().sliderMaker()`
```

This way plugin will add slider to every element with 'js-slider-plugin' class.

If you want to configure slider, just add options as *data-* attributes. For example:

```html
<div class='js-slider-plugin' data-max='80' data-current-first='30'>
```

Feel free to combine different approaches of setting options and initiating slider.

### Slider API

After initiating a slider you can use following methods:

|Method|Parameters|Description|
|-|-|-|
|getOptions()| | Return current slider parameters |
|setOptions(name, data)|**name** should match option name | Set new parameters |
||**data** should match option type||
|showPanel()| | Show configurational panel |
|hidePanel()| | Hide configurational panel |
|subscribe(name, method)| **name** equals one of the following: /  'updateThumb'  /  'updateThumbSecond'  /  'updateAll'  /| Call method with new value every time when it's changed |
|| **method** matches function name that should be called ||
|unsubscribe(name, method?)| **name**: 'updateThumb' / 'updateThumbSecond' / 'updateAll' | When only **name** is used, all subscriptions to the event are removed. |
||**method**: optional parameter|When used with **method** it removes this method from event subscribers|

All methods except **getOptions()** can be used in a chain. For example:

```js
let $slider = $( selector ).sliderMaker({ max: 2000, min: -12.12 });
$slider.getOptions();
$slider.showPanel().subscribe('updateThumb', updateInput);

function updateInput(value: number | TSettings): void {
    $('#input').val(value.toString());
}
```