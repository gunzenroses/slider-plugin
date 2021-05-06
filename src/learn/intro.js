const sum = (a,b) => a+b
const nativeNull = ()=> null

function expect(value) {
    return {
        toBe: exp => {
            if (value === exp){
                console.log("success")
            } else {
                console.log("value is ${value}, but expected ${exp}")
            }
        }
    }
}

expect(sum(7,8)).toBe(15);

module.exports = { sum };