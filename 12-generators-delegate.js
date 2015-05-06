/*
    Генераторы можно вкладывать друг в друга через yield*.
 */

function* g1() {
    yield 2;
    yield 3;
    yield 4;
}

function* g2() {
    yield 1;
    yield *g1();
    yield 5;
}

var iterator = g2();

console.log( iterator.next() ); // { value: 1, done: false }
console.log( iterator.next() ); // { value: 2, done: false }
console.log( iterator.next() ); // { value: 3, done: false }
console.log( iterator.next() ); // { value: 4, done: false }
console.log( iterator.next() ); // { value: 5, done: false }
console.log( iterator.next() ); // { value: undefined, done: true }

// ---

function* g3() {
    yield* [1, 2];
    yield* "34";
    yield* arguments;
}

iterator = g3( 5, 6 );

console.log( iterator.next() ); // { value: 1, done: false }
console.log( iterator.next() ); // { value: 2, done: false }
console.log( iterator.next() ); // { value: "3", done: false }
console.log( iterator.next() ); // { value: "4", done: false }
console.log( iterator.next() ); // { value: 5, done: false }
console.log( iterator.next() ); // { value: 6, done: false }
console.log( iterator.next() ); // { value: undefined, done: true }