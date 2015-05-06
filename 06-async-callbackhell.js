/*
    Вот наглядная демонстрация того, о чём говорилось.
    Представим, что мы хотим получить температуру в нескольких городах одновременно.
    Т.е. нужно прочитать и распарсить несколько json-файлов асинхронно и получить погоду из каждого их них.
  И когда все они распарсятся, вернуть результат.
    При этом учитывая, что какие-то файлы могут отсутствовать, или же json некорретный – в таком случае вызвать callback
  с ошибкой.
    На обычной асинхронной реализации это выглядит так. Хотя задача довольно простая. Страшно, правда?
 */

var fs = require( 'fs' )

function handleError( err ) {
    console.error( 'Error!' + err )
}

function readJSON_cb( filename, callback ) {
    fs.readFile( filename, 'utf8', function( err, res ) {
        if( err )
            return callback( err );
        try {
            res = JSON.parse( res );
        }
        catch( ex ) {
            return callback( ex );
        }
        callback( null, res );
    } );
}

function readJsonFiles_cb( filenames, callback ) {
    var pending = filenames.length,
        called  = false,
        results = [];

    if( pending === 0 ) {
        return setTimeout( function() { callback( null, [] ); }, 0 );
    }
    filenames.forEach( function( filename, index ) {
        readJSON_cb( filename, function( err, res ) {
            if( err ) {
                if( !called )
                    callback( err );
                called = true
                return;
            }
            results[index] = res;
            if( 0 === --pending ) {
                callback( null, results );
            }
        } );
    } );
}

readJsonFiles_cb( ['weather/1.json', 'weather/2.json', 'weather/3.json'], function( err, res ) {
    if( err )
        handleError( err )
    else
        console.log( res.map( function( r ) { return r.list[0].main.temp } ) );
} )
