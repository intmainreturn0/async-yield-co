/*
    Promise – результат асинхронной операции. Это "отложенное" значение, которого пока нет, но которое потом появится.
    Он может быть pending, resolved с результатом или rejected с причиной.
    Про концепцию промисов лучше рассказывать или почитать где-то ещё.
 */

// пример: результат будет через какое-то время
function delay( ms ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( resolve, ms )
    } )
}

delay( 500 ).then( function() {
    console.log( '500 ms have passed' )
} )


// ---
// промисы могут мутировать друг в друга
// то, что возвращается из then() – идёт как следующий результат

function longCalcSquareNumber( number ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( function() {
            if( number > 100 )
                reject( 'Calc calculate: ' + number + ' is too big' )
            else
                resolve( number * number )
        }, 600 )
    } )
}

longCalcSquareNumber( 10 ).then( console.log )          // 100

longCalcSquareNumber( 10 ).then( function( result ) {   // 100*100 = 10000
    return longCalcSquareNumber( result )
} ).then( console.log )

longCalcSquareNumber( 20 ).then( function( result ) {
    return longCalcSquareNumber( result )               // а тут будет error number too big
} ).then( console.log, console.error )


// ---
// также их можно комбинировать – например, сделать что-то, когда пройдёт 1000 ms и посчитается число

Promise.all( [
    longCalcSquareNumber( 80 ),
    delay( 1000 )
] ).then( function( results ) {
    console.log( 'After 1000ms, number^2 = ', results[0] )       // [0] - от числа; [1] - от delay (undefined)
}, console.error )

// при этом resolved возникает, когда все зарезолвятся, а catch – когда хотя бы один закрашится
Promise.all( [
    longCalcSquareNumber( 5000 ),
    delay( 1000 )
] ).then( function( results ) {
    console.log( 'After 1000ms, number^2 = ', results[0] )       // это не выведется, т.к. 5000 слишком много
}, console.error )
