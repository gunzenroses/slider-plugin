# slider-plugin

The aim of this project is to get known with:

- development patterns;
- low coupling and high cohesion principle;
- unit-testing and bdd approach;
- webpack.

### Plugin architecture

Plugin has MVP-architecture with Passive View.

Model:

- implements IModel interface;
- contains and updates data;
- calls methods of presenter when data is updated (using instances based on the IObservable interface).

View:

- implements IView interface;
- visualizes data;
- manipulates (renders and updates) subviews using the ISubview interface;
- handles events;
- calls methods of IPresenter interface (using instances based on the IObservable interface).

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

### UML diagram

[Link to uml diagram](https://github.com/gunzenroses/slider-plugin/blob/master/src/UML%20diagram.png)

### Used technologies and libraries

- webpack (path aliases, plugins, rules, development and production modes);
- scss;
- TypeScript;
- jest (unit-testing);
- eslint, prettier;
- babel.

### How to work with project

Clone repository
>`git clone https://github.com/gunzenroses/slider-plugin.git`

Install dependencies
>`npm i`

Run tests
>`npm test`

Run development mode (on localhost:8081)
>`npm run dev`

Run production mode(to assemble slider-plugin files)
>`npm run prod`

Run debug mode
>`npm run debug`

Run statical analyzer for code
>`npm run eslint`

### How to use plugin

Copy css-file from `dist/` to your project folder, add link in the `<head>`.

```html
<head>
    <link rel="stylesheet" href="slider-plugin.min.css">
<head>
```

Install jQuery 3.6.0 `npm install jquery@3.6.0` or link to it directly at the end of `<body>`.
Copy js file from `dist/` to your project folder, add after jQuery.

```html
<body>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="slider-plugin.min.js"></script>
</body>
```

Initiate slider in js-file with your parameters.
>`$(`selector`).sliderMaker({` *your parameters* `})`

|Option|Defaults|Type|Description|
|-----|----|----|----------|
|min|0|number|set min value|
|max|100|number|set max value|
|range|true|boolean|*true* - slider has two handles; *false* - slider has one handle|
|currentFirst|33|number|starting position for left handle (horizontal slider)lowest handle (vertical slider) or for single handle|
|currentSecond|65|number|starting position for second handle|
|step|1|number|should be integer number > 0|
|orientation|horizontal|string|*horizontal* or *vertical* orientation|
|tooptip|true|boolean|*true* - enable tooltips with value of handle; *false* - hide tooltips;|
|scale|{stepPerDiv: 10}|boolean / object|enable grid of values: *true* - sets automatic numbering of grid sections; *false* - hides grid; *{stepPerDiv: number}* - put number at every Nth division of grid|

Extended API. If you want to see configuration panel next to your slider
>`$(`selector`).sliderMaker({` *your parameters* `},`true`)`

### Example of slider-plugin usage

[Link to example](https://gunzenroses.github.io/slider-plugin/)
