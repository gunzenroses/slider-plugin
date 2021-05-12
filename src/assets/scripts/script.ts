// (function($){
//     $.fn.rangeSlider() = function( options ){

//         var settings = $.extend({
//             "speed" : "15"
//         }, options )

//         return this.each(function(){
//             var ths = $(this);

//             ths
//             .css({
//                 "min-height": "400px",
//                 "position": "relative",
//                 "overflow": "hidden"
//             })
//             .wrapInner("<div class='ui-range-slider-content' style='position: relative; z-index: 1'></div>"")
//             .prepEnd("<div class='ui-range-slider-img' style='position: absolute; top: 0; width: 100%'; background-image: url(" + ths.data('range-slider-img') + "); background-size: cover; background-position: top;");
            

//             function rangeSliderInit(){
//                 var rsheight = ths.height();
//                 ths.children(".ui-range-slider-img").css({
//                     "height": rsheight*2,
//                     "top": -rsheight*.5
//                 })
//                 var st = $(document).scrollTop();
//                 var sp = ths.offset().top - $(window).height();
//                 var sr = st*sp;
//                 var ob = ths.offset().top + rsheight;
                
//                 if(st >= sp && st <= ob){
//                     "transform" : "translade3d(0px, "+ sr/20 +"%, 0px)",
//                     "--webkit-transform" : "translade3d(0px, "+ sr/20 +"%, 0px)"
//                 }

//             }

//             // инициализация основной работы при скроле, загрузке, ресайзе
//             $(window).scroll(function(){
//                 rangeSliderInit()
//             }).load(function(){
//                 rangeSliderInit()
//             })
//             $("*").resize(function(){
//                 rangeSliderInit()
//             })
//         })
//     }
// }, (jQuery));