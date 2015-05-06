/*
    Вспомним демку "6-async-callbackhell".
    Сравним её реализацию через асинхронные функции (как раньше) и на промисах.
 */

var fs = require( 'fs' )

function handleError( err ) {
    console.error( 'Error! ', err )
}

// копия 6-async-callbackhell.js

function readJSON_cb( filename, callback ) {
    fs.readFile( filename, 'utf8', function( err, res ) {
        if( err )
            return callback( err );
        try {
            res = JSON.parse( res );
        } catch( ex ) {
            return callback( ex );
        }
        callback( null, res );
    } );
}

function readJsonFiles_cb( filenames, callback ) {
    var pending = filenames.length;
    var called = false;
    var results = [];
    if( pending === 0 ) {
        return setTimeout( function() { callback( null, [] ); }, 0 );
    }
    filenames.forEach( function( filename, index ) {
        readJSON_cb( filename, function( err, res ) {
            if( err ) {
                if( !called ) callback( err );
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

// ----
// а вот то же самое на промисах

function readFile( filename, enc ) {
    return new Promise( function( fulfill, reject ) {
        fs.readFile( filename, enc, function( err, res ) {
            err ? reject( err ) : fulfill( res );
        } );
    } );
}

function readJSON( filename ) {
    return readFile( filename, 'utf8' ).then( JSON.parse )
}

function readJSONFiles( filenames ) {
    return Promise.all( filenames.map( readJSON ) );
}

readJSONFiles( ['weather/1.json', 'weather/2.json', 'weather/3.json'] ).then( function( res ) {
    console.log( res.map( function( r ) { return r.list[0].main.temp } ) );
}, handleError )


// при этом при какой-то ошибке это пойдёт в handleError из-за механизма Promise.all, мутации промисов и т.п.
// в общем, код на промисах очень, очень достоин

