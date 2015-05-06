/*
    Применим полученные знания.
    Будем реализовывать чтение json-файла через промисы.
    Итак, задача: реализовать чтение и парсинг json-файла. Т.к. это асинхронная операция (чтение файла), то нужно возвратить Promise.
  Он должен стать resolved, когда файл прочитан и распарсен, и должен стать rejected, если файл не смог прочитаться или ошибочен.
 */

var fs = require( 'fs' )

// попытка номер 1
function readJSON_v1( filename ) {
    return new Promise( function( resolve, reject ) {
        fs.readFile( filename, 'utf8', function( err, res ) {
            if( err )
                reject( err )
            else
                try {
                    resolve( JSON.parse( res ) );
                } catch( ex ) {
                    reject( ex );
                }
        } )
    } )
}

// работает
readJSON_v1( 'weather/simple.json' ).then( console.log, console.error )
//readJSON_v1( 'weather/unexisting.json' ).then( console.log, console.error )

// ---
// но код какой-то некрасивый, не видно смыслов промисов
// по идее, задача "прочитать файл" независима от задачи "распарсить данные из json"
// так что давайте сделаем просто чтение файла

function readFile( filename, enc ) {
    return new Promise( function( resolve, reject ) {
        fs.readFile( filename, enc || 'utf8', function( err, res ) {
            err ? reject( err ) : resolve( res );
        } );
    } );
}

// а чтение json – это чтение файла + парсинг json
function readJSON_v2( filename ) {
    return readFile( filename ).then( function( contents ) {
        return JSON.parse( contents )
    } )
}

// работает
readJSON_v2( 'weather/simple.json' ).then( console.log, console.error )
//readJSON_v2( 'weather/unexisting.json' ).then( console.log, console.error )
//readJSON_v2( 'weather/incorrect.json' ).then( console.log, console.error )


// ---
// уже стало лучше; последний шаг - function(c) { return JSON.parse(c) } можно заменить и сделать красиво:

function readJSON_v3( filename ) {
    return readFile( filename ).then( JSON.parse )
}

readJSON_v3( 'weather/simple.json' ).then( console.log, console.error )
//readJSON_v3( 'weather/unexisting.json' ).then( console.log, console.error )
//readJSON_v3( 'weather/incorrect.json' ).then( console.log, console.error )

// код мало того что короткий и красивый, ещё и логичный
// он даже читается: что такое прочитать json? Это прочитать файл, а потом (then) его распарсить


// ---
// и, как и раньше, промисы можно комбинировать
// например, попытаться прочитать/распарсить файл, но сделать таймаут, и смотреть, что раньше произойдёт

function delay( ms ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( resolve, ms )
    } )
}

Promise.race( [
    readJSON_v3( 'weather/simple.json' ),       // если файл ошибочен, будет исключение, оно пойдёт в console.error (т.к. это написано ниже)
    delay( 10 )                                 // если поставить 0, будет таймаут
] ).then( function( result ) {
    if( result === undefined )
        console.log( 'timed out' );
    else
        console.log( 'read data', result );
}, console.error )


// или прочитать несколько файлов параллельно и исполнить что-то, когда они все прочитаны:
Promise.all( [
    readFile( __filename ),
    readJSON_v3( 'weather/1.json' )
] ).then( function() {
    console.log( 'All filed were read' );
}, console.error )