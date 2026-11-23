// Завдання 1: Іменована функція calculateSum(n)
function calculateSum(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
console.log("Завдання 1 — Сума від 1 до 5:", calculateSum(5)); // 15

// Завдання 2: Функціональний вираз multiply(a, b)
const multiply = function(a, b) {
    return a * b;
};
console.log("Завдання 2 — Множення 4 * 6:", multiply(4, 6)); // 24

// Завдання 3: Стрілкова функція power(a, b)
const power = (a, b) => a ** b;
console.log("Завдання 3 — 2 у степені 3:", power(2, 3)); // 8

// Завдання 4: Рекурсивна функція harmonicSeries(n) (1 + 1/2 + 1/3 + ... + 1/n)
function harmonicSeries(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return (1 / n) + harmonicSeries(n - 1);
}
console.log("Завдання 4 — Гармонічний ряд (n = 4):", harmonicSeries(4)); // 2.083333333333333

// Завдання 5: Функція-замикання createMultiplier(multiplier)
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}
const multiplyBy3 = createMultiplier(3);
console.log("Завдання 5 — Множник на 3 для числа 7:", multiplyBy3(7)); // 21

// Завдання 6: Функція вищого порядку applyFunction(value, func)
function applyFunction(value, func) {
    return func(value);
}
const double = (x) => x * 2;
const square = (x) => x ** 2;

console.log("Завдання 6 — Подвоєння числа 5:", applyFunction(5, double)); // 10
console.log("Завдання 6 — Піднесення 5 до квадрату:", applyFunction(5, square)); // 25

// Завдання 7*: Функція processSet(set, callback)
function processSet(set, callback) {
    for (const item of set) {
        callback(item);
    }
}
const mySet = new Set([10, 20, 30]);
console.log("Завдання 7* — Обробка множини Set (множення на 10):");
processSet(mySet, (num) => console.log(num * 10));