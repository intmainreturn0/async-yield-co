/*
    Теперь будем объединять yield и промисы.
    Последнее, что мы делали с yield'ами, это thunk'и, т.е. yield'или функции, принимающие callback'и после асинхронных действий.
    А теперь будем говорить, что мы yield'им промисы.
    И управление будет возвращаться в корутину после resolve, либо же кидаться исключение при reject.
    Именно этим занимается небольшая библиотека co, написанная небезызвестным TJ Holowaychuk'ом.
 */

var fs = require( 'fs' )
var co = require( 'co' )

function handleError( err ) {
    console.error( 'Error! ', err )
}

// возьмём уже ранее нами писавшиеся генераторы промисов

function delay( ms ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( resolve, ms )
    } )
}

function readFile( filename, enc ) {
    return new Promise( function( fulfill, reject ) {
        fs.readFile( filename, enc || 'utf8', function( err, res ) {
            err ? reject( err ) : fulfill( res );
        } );
    } );
}

function readJSON( filename ) {
    return readFile( filename ).then( JSON.parse )
}

// но описывать логику будем так же yield'ами, теперь уже любых промисов

function* justDelay() {
    console.log( 'start' );
    yield delay( 100 )                          // кто говорил, что в js невозможен delay?
    console.log( 'waited 100 ms' );
    yield delay( 500 )
    console.log( 'waited again 500 ms' );
}

function* parseAndDelay() {
    var r = yield [             // yield'им массив промисов (равносильно Promise.all) – параллельное выполнение
        readJSON( 'weather/cities.json' ),
        delay( 700 )
    ]
    console.log( 'json parsed AND 700ms have passed' );
    console.log( 'cities data =', r[0] );       // r[1] результат delay, это undefined
}

// заставим их выполняться

co( justDelay ).catch( handleError )

co( parseAndDelay ).catch( handleError )

// причём корутины тоже можно yield'ить, делегируя исполнение другим корутинам, тем самым описывая произвольную последовательную (!) логику

// поставить if(1), чтоб наблюдать результат
if( 0 )
    co( function* () {
        console.log( '... delays' );
        yield justDelay
        console.log( '... parsings' );
        yield parseAndDelay
        console.log( 'finished sequence' );
    } ).catch( handleError )