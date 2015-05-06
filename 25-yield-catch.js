/*
    Но самое приятное – что у корутины помимо next(...) есть throw(...), которое вместо возвращения ждущим yield'ом
  какого-то значения вбрасывает туда исключение.
    И мало того, что код синхронный на yield'ах. Ещё и try/catch работают как ожидается! В отличие от, как мы помним,
  асинхронного кода, когда точка исполнения уже далеко ускакала, и throw ничем не ловится.
 */

var fs = require( 'fs' )

function coroutine( generatorFn ) {
    var gen = generatorFn();

    function next( err, data ) {
        if( err )                   // дополнение
            gen.throw( err )
        var ret = gen.next( data );
        if( ret.done ) return;
        ret.value( next )
    }

    next();
}

// если неправильно написать имя файла или json, то catch поймает исключение
coroutine( function *() {
    try {
        var data    = JSON.parse( yield read( 'weather/cities.json' ) ),
            city_id = data.cities['London']
        data = JSON.parse( yield read( 'weadther/' + city_id + '.json' ) )
        console.log( data.list[0].main.temp )
    }
    catch( ex ) {
        console.error( "Exception caught: " + ex )
    }
} )

function read( filename ) {
    return function( callback ) {
        fs.readFile( filename, 'utf-8', callback );
    }
}

// получается, что на yield'ах не только можно писать асинхронный неблокирующий код синхронно, но и получать
// грамотную обработку исключений
// если вспомнить "5-async-errhandling"...