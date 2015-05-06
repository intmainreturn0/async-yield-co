/*
    Избитый пример с погодой реализуем уже на промисах.
 */

var co = require( 'co' ),
    fs = require( 'fs' )

function handleError( err ) {
    console.error( 'Error! ', err )
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

// co.wrap для корутины возвращает функцию, генерирующую промис

// опять же, нереально синхронный код
var getWeatherInCity = co.wrap( function *( cityName ) {
    var cities   = yield readJSON( 'weather/cities.json' ),
        cur_city = yield readJSON( 'weather/' + cities.cities[cityName] + '.json' )
    return [ cityName, cur_city.list[0].main.temp ]
} )

// они выполняются параллельно
getWeatherInCity( 'London' ).then( console.log, handleError )
getWeatherInCity( 'Moscow' ).then( console.log, handleError )

// кроме того, как и ранее, yield'ы можно оборачивать в try/catch, и исключения будут ловиться
// а если этого не делать, то исключение прокинется как rejected state и (в данном примере) напечатается handlerError