/*
    В прошлом примере не было обработки ошибок. Попробуем сделать.
    Все callback-функции вызываются с 2 параметрами. Если ошибка, то она содержится в первом; если успех, то первый=null.
    В отличие от синронного варианта, тут нельзя делать throw, потому что поток исполнения уже давно ушёл за try.
 */

var fs = require( 'fs' )

function getTempInCity( cityName, callback ) {
    fs.readFile( 'weather/cities.json', 'utf-8', function( err, content ) {
        if( err )
            throw err
        var data    = JSON.parse( content ),
            city_id = data.cities[cityName];
        fs.readFile( 'weather/' + city_id + '.json', 'utf-8', function( err, content ) {
            if( err )
                throw err
            var data = JSON.parse( content )
            callback( data.list[0].main.temp );
        } )
    } )
}

try {
    getTempInCity( 'Lonfdon', function( temp ) {
        console.log( temp )
    } )
    console.log( 'after getTempInCity call' );
}
catch( ex ) {
    console.error( 'Caught exception' )
}

console.log( 'after try' )      // выполнится до чтения из файла => до throw