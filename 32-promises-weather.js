/*
    Вернёмся к примеру с запросом погоды по имени города и реализуем его на промисах.
    Так, getTempInCity будет возвращать промис, который будет резолвиться с температурой или режектиться при ошибке файла/парсинга.
 */

var fs = require( 'fs' )

function handleError( err ) {
    console.error( 'Error! ', err )
}

function readFile( filename, enc ) {
    return new Promise( function( resolve, reject ) {
        fs.readFile( filename, enc || 'utf-8', function( err, res ) {
            err ? reject( err ) : resolve( res );
        } );
    } );
}

function readJSON( filename ) {
    return readFile( filename ).then( JSON.parse )
}

function getTempInCity( cityName ) {
    return readJSON( 'weather/cities.json' )
        .then( function( data ) {
            return readJSON( 'weather/' + data.cities[cityName] + '.json' )
        } )
        .then( function( data ) {
            return data.list[0].main.temp || Promise.reject( 'No temp in file' )
        } )
}

getTempInCity( 'London' ).then( console.log, handleError )

// вообще говоря, получается тоже довольно-таки последовательный, почти синхронный код, безо всяких корутин