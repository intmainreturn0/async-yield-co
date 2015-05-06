/*
    В прошлом примере использовался for..of для итерации по генератору.
    Но это же можно делать и вручную.
 */

function *genAllEvens( limit ) {
    for( var i = 2; i <= limit; i += 2 ) {
        yield i
    }
}

var gen = genAllEvens( 10 ), r
r = gen.next()
console.log( r );           // { value: 2, done: false }
r = gen.next()
console.log( r );           // { value: 4, done: false }


// ---
// напишем обёртку, которая принимает функцию-генератор и печатает все значения

function runGeneratorPrint( generatorFn ) {
    var r = generatorFn.next()
    while( !r.done ) {
        console.log( r.value );
        r = generatorFn.next()
    }
}

runGeneratorPrint( genAllEvens( 10 ) )


// или же обёртку, которая не распечатывает, а вызывает callback

function runGeneratorCallback( gen, callback ) {
    var r = gen.next()
    while( !r.done ) {
        callback( r.value );
        r = gen.next()
    }
}

runGeneratorCallback( genAllEvens( 10 ), function( num ) {
    console.log( 'num=' + num );
} )

// фактически, for..of – синтаксический сахар над последним примером