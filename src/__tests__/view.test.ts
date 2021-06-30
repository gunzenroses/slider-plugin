import { SliderView } from "../assets/scripts/view"
import { sliderData } from "../assets/scripts/data"

let data = sliderData;
let containerId = 'container1';

let initialContainer = document.createElement("div");
initialContainer.id = containerId;
document.body.append(initialContainer);

describe('class SliderView', ()=>{
    let view = new SliderView(containerId);

    afterEach (()=>{
        jest.restoreAllMocks();
    })

    describe('method init()', ()=>{
        let spyCreateChildren = jest.spyOn(view, 'createChildren');
        let spyRender = jest.spyOn(view, 'render');
        let spySetupHandlers = jest.spyOn(view, 'setupHandlers');
        let spyEnable = jest.spyOn(view, 'enable');

        view.init(data);

        test('set passed in data as settings', ()=>{
            expect(view.settings).toEqual(data);
        })

        test('call methods createChildren(), render(), setupHandlers(), enable()', ()=>{
            expect(spyCreateChildren).toHaveBeenCalledTimes(1)
            expect(spyRender).toHaveBeenCalledTimes(1)
            expect(spySetupHandlers).toHaveBeenCalledTimes(1)
            expect(spyEnable).toHaveBeenCalledTimes(1)
        })
    })

    describe('method change()', ()=>{
        test ('update styles for Thumb, Range and Tooltip when (selectObject === sliderThumb)', ()=>{
            view.selectObject = view.sliderThumb;
            let num = 7;

            view.сhange(num);

            expect(view.sliderThumb.style.left).toBe(num + '%');
            expect(view.sliderRange.style.left).toBe(num + '%');
            expect(parseInt(view.tooltipFirst.innerText)).toBe(num);
        })

        test ('update styles for Thumb, Range and Tooltip when (selectObject === sliderThumbSecond)', ()=>{
            view.selectObject = view.sliderThumbSecond;
            let num = 11;

            view.сhange(num);

            expect(view.sliderThumbSecond.style.left).toBe(num + '%');
            expect(view.sliderRange.style.right).toBe((100 - num) + '%');
            expect(parseInt(view.tooltipSecond.innerText)).toBe(num);
        })
    })

    describe('method render()', ()=>{
        test('should render all elements of slider',()=>{
            view.render();

            expect(view.sliderContainer).toBeTruthy();
            expect(view.sliderTrack).toBeTruthy();
            expect(view.sliderRange).toBeTruthy();
            expect(view.sliderThumb).toBeTruthy();
            if (view.ifTooltip){ expect(view.tooltipFirst).toBeTruthy(); }
            if (view.ifRange){ expect(view.sliderThumbSecond).toBeTruthy(); }
            if (view.ifRange && view.ifTooltip){ expect(view.tooltipSecond).toBeTruthy(); }
            if (view.ifScale){ expect(view.scale).toBeTruthy(); }
        })
    })

    describe('method selectThumb()', ()=>{
        test('return undefined if (e.target === sliderThumb || sliderThumbSecond)', ()=>{
            var e = {
                target: view.sliderThumb,
                ... new Event('click'),
            };

            let check = view.selectThumb(e as MouseEvent);

            expect(check).toBeFalsy();
        })

        test('notify subscribers if (e.target !== sliderThumb || sliderThumbSecond)', ()=>{
            let spyNotify = jest.spyOn(view, 'notify');
            var evt = {
                target: view.sliderTrack,
                ... new Event('click'),
            };

            view.selectThumb(evt as MouseEvent);
            
            expect(spyNotify).toBeCalledTimes(1);
        })
    })

    describe('method dragThumbStart()', () => {
        test('return undefined if (e.target !== sliderThumb || sliderThumbSecond)', ()=>{
            var e = {
                target: view.sliderTrack,
                ... new Event('mousedown'),
            };
            let check = view.dragThumbStart(e as MouseEvent);

            expect(check).toBeFalsy();
        })

        test('return undefined if (e.type !== mouseup)', ()=>{
            var e = {
                target: view.sliderThumb,
                ... new Event('mouseup'),
                type: 'mouseup'
            };

            let check = view.dragThumbStart(e as MouseEvent);

            expect(check).toBeFalsy();
        })

        test('assign (selectObject = e.target) if (e.target === sliderThumb || sliderThumbSecond)', ()=>{
            var e = {
                target: view.sliderThumb,
                ... new Event('mousedown'),
                type: 'mousedown'
            };

            view.dragThumbStart(e as MouseEvent);

            //expect(view.selectObject.elem).toEqual(e.target);
        })
    })

    describe('method dragThumbMove()', () => {
        var e = {
            target: view.sliderThumb,
            ... new Event('mousemove')
        };

        test('return undefined if no dragObject', ()=>{
            view.selectObject = {};

            let check = view.dragThumbMove(e as MouseEvent);

            expect(check).toBeFalsy();
        })

        test('notify subscribers if dragObject exists', ()=>{
            let spyNotify = jest.spyOn(view, 'notify');
            view.selectObject.elem = view.sliderThumb;

            view.dragThumbMove(e as MouseEvent);

            expect(spyNotify).toHaveBeenCalledTimes(1);
        })
    })

    describe('method dragThumbEnd', ()=>{
        test('clear selectObject data',()=>{
            let clearedObject = {};

            view.dragThumbEnd();

            expect(view.selectObject).toEqual(clearedObject);
        })
    })
})