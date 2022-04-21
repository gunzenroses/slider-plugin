# slider-plugin

The aim of this project is to get known with:

- development patterns;
- low coupling and high cohesion principle;
- unit-testing and bdd approach;
- webpack.

### [Example of slider-plugin usage](https://gunzenroses.github.io/slider-plugin/)

### 1. Plugin info

The project works with node@14.16.1, npm@8.1.0, git@2.34 and jquery@3.6.0.

### 2. Plugin architecture

The plugin has an MVP-architecture with a Passive View. Model and View do not interact with any other part directly, they are mediated by Presenter. Methods of Presenter are notified about updates in Model and changes in View with the help of Observer. Then Presenter calls public methods of View or Model.

This way, the interaction between Presenter, View and Model is based on a contract: Presenter use only methods and parameters which are declared by IView and IModel interfaces. With such approach UI and data parts can be easily replaced by other classes, that use the same contract.

Summing up:

Model:

- implements IModel interface;
- contains and updates data;
- notifies presenter when data is updated (using instance of IObservable interface).

View:

- implements IView interface;
- visualizes data;
- manipulates (renders and updates) subViews;
- notifies presenter when it's changed (using instance of IObservable interface).

Presenter:

- serves as mediator between data and UI;
- manipulates instances of Model and View classes using methods of IModel and IView interfaces;
- handles user input;
- updates Model and rerenders View (using methods of their interfaces).

According these interfaces we have the following streams:

- change data (Model) -> notify method that process data (Presenter) -> change UI (View);
- UI event (View) -> notify method that process data (Presenter) -> change data (Model);
- change data outside MVP (Panel) -> notify method that process data (Presenter) -> change data (Model) -> notify method that process data (Presenter) -> change UI (View).

### [UML diagram](https://github.com/gunzenroses/slider-plugin/blob/master/src/UML.jpg)

### 3. Used technologies and libraries

- webpack (path aliases, plugins, rules, development and production modes);
- scss;
- TypeScript;
- jest (unit-testing);
- eslint;
- babel.

### 4. How to work with the project

##### 4.1. Clone repository
```sh
git clone https://github.com/gunzenroses/slider-plugin.git
```

##### 4.2. Install dependencies
```sh
npm i
```

##### 4.3. Then you can use following scripts in terminal to:

1). Test code in terminal with coverage report:

```sh
npm run test
```

2). Assemble the project (without producing files) and run it on `localhost:8081`:

```sh
npm run dev
```

3). Assemble slider-plugin files in `/dist` folder:
In order to learn how to work with them check the section `"How to use plugin"`.

```sh
npm run prod
```

4). Find particular actions that reproduce a bug in tests (with the help of `chrome://inspect` devtools):

```sh
npm run debug
```

5). Analyze code style:

```sh
npm run eslint
```

### 5. How to use plugin

##### 5.1. Copy css-file from `dist/` to your project folder, add link in the `<head>`.

```html
<head>
    <link rel="stylesheet" href="slider-plugin.min.css">
<head>
```

##### 5.2.Install jQuery 3.6.0 `npm install jquery@3.6.0` or add following script at the end of `<body>`.

```html
<body>
    ...
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
```

##### 5.3.Copy js file from `dist/` to your project folder, add after jQuery.

```html
<body>
    ...
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./slider-plugin.min.js"></script>
</body>
```
##### 5.4. Add your js-file after `jQuery` and `slider-plugin.min.js`.

```html
<body>
    ...
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./slider-plugin.min.js"></script>
    <script src="./index.js"></script>
</body>
```

##### 5.5.You can initialize slider:

##### 5.5.1. In js-file with your options.

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

##### 5.5.2. By adding a class 'js-slider-init' to your div element.

```html
 <div class='js-slider-init'></div>
```

This way plugin will add slider to every element with 'js-slider-init' class.

> Note that your <div class='js-slider-init'> should not contain any nested elements! Otherwise it won't work:-(

If you want to configure slider, just add options as *data-* attributes. For example:

```html
<div class='js-slider-init' data-max='80' data-current-first='30'>
```

### 6. Slider API

After initialization of slider you can use following methods in your `js-file`:

|Method|Parameters|Description|
|-|-|-|
|getOptions()| | Return current slider parameters |
|setOptions(name, data)|**name** should match option name | Set new parameters |
||**data** should match option type||
|showPanel()| | Show configurational panel |
|hidePanel()| | Hide configurational panel |
|subscribe(name, method)| **name** equals one of the following: /  'updateThumb'  /  'updateThumbSecond'  /  'updateAllData'  /| Add method to the list of event subscribers |
|| **method** matches function name that should be called ||
|unsubscribe(name, method)| **name**: 'updateThumb' / 'updateThumbSecond' / 'updateAllData' | Removes **method** from event subscribers |
||**method** matches function name that should be removed from event subscribers||

All methods except **getOptions()** can be used in a chain. For example:

```js
let $slider = $( selector ).sliderMaker({ max: 2000, min: -12.12 });
const currentData = $slider.getOptions();
$slider.showPanel().subscribe('updateThumb', updateInput);

function updateInput(value: number | TSettings): void {
    $('#input').val(value.toString());
}
```