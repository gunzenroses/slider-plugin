# slider-plugin

The aim of this project is to get known with:
- developmental patterns: mvp/c, dependency inversion, observer;
- low coupling and high cohesion attitude in code;
- unit-testing and bdd approach;
- work with webpack.

### Plugin architecture
Plugin has MVP-architecture with Passive View.

Model:
- implements IModel interface;
- contains and updates data;
- notifies via instances based on ISender interface (EventDispatcher class) - - when data is updated.

View:
- imprements IView interface;
- visualizes data;
- applies instances of subviews via ISubview interface;
- interacts with Model using IModel interface methods;
- handles events;
- calls methods of IPresenter interface using instances based on ISender interface.

Presenter:
- serves as mediator between data and UI;
- carries presentation logic;
- use IModel and IView interfaces to initiate instances of SliderModel and SliderView classes;
- receives user input through methods defined by IView interface;
- update settings of Model and View via methods of its interfaces.

Contract:
Interactions between Presenter, its View and Model are based on Contract (IPresenter, IView and IModel interfaces).

According interfaces we have following flows:

- change data (Model) -> notify method that process data (Presenter) -> change UI (View);
- event in UI (View) -> notify method that process data (Presenter) -> change data(Model);
- change data outside MVP (Panel) -> notify method that process data (Presenter) -> change data(Model) -> notify method that process data (Presenter) -> change UI (View).

### [UML diagram](https://github.com/gunzenroses/slider-plugin/blob/master/src/UML%20diagram.png)

### Used technologies and libraries
- webpack (path aliases, plugins, rules, development and production modes differences);
- scss;
- TypeScript;
- jest (unit-testing);
- babel.

### How to
Clone repository
>```git clone https://github.com/gunzenroses/slider-plugin.git```

Install dependancies
>```npm i```

Run development mode (on localhost:8081)
>```npm run dev```

Run tests
>```npm test```

Run production mode
>```npm run build```

Run debug mode
>```npm run debug```

### Link to page
[Example of Slider](https://gunzenroses.github.io/slider-plugin/)

### How to use plugin
Install jQuery 3.6.0 npm install jquery@3.6.0 or link to it directly at the end of tag
```html
<body>
    <script src=httpscode.jquery.comjquery-3.6.0.min.jsscript></script>
</body>
```

Copy and add styles from folder distslider-plugin
```html
<head>
    <link rel=stylesheet href=slider-plugin.min.css>
<head>
```

Copy and add after jQuery plugin from folder distslider-plugin
```html
<body>
    <script src=slider-plugin.min.jsscript></script>
</body>
```

Initiate slider in js-file with your parameters
>`$(selector).slider-plugin({` *your parameters* `})`

JS API  
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
|scale|{stepPerDiv 10}|boolean / object|enable grid of values: *true* - sets automatic numbering of grid sections; *false* - hides grid; *{stepPerDiv number}* - put number at every Nth division of grid|