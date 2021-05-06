const { expect } = require("@jest/globals")
const { sum } = require("./intro")

describe("sum function", ()=>{
    test("should return sum of two values", 
        function() {
            expect(sum(1,3)).toBe(4)
    })

    test("should return value correctly comparing to other", 
        function() {
            expect(sum(2,3)).toBeGreaterThan(4)
            expect(sum(2,3)).toBeGreaterThanOrEqual(5)
            expect(sum(2,3)).toBeLessThan(10)
            expect(sum(1,2)).toBeLessThanOrEqual(3)
    })

    test(" should sum 2 float values correctly",
        function(){
            expect(sum(0.3, 0.4)).toBeCloseTo(0.7)
        }
    )
})