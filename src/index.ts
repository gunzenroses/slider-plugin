import 'SliderMaker/SliderMaker-init';
import './index.scss';

window.onload = function makeSliderExamples() {
  const $slider = $('#default').sliderMaker(
    {
      min: 0,
      max: 100,
      currentFirst: 10,
      currentSecond: 50,
      step: 10,
      scale: true,
      range: true
    }
  );
  $slider.showPanel();

  $('#vertical').sliderMaker(
    {
      orientation: 'vertical',
      step: 6,
      max: 140,
      scale: {
        stepPerDiv: 2
      },
      range: true,
      tooltip: false
    },
    true
  );

  $('#horizontal').sliderMaker(
    {
      min: -10.3,
      max: 20000,
      step: 12
    },
    true
  );
};
