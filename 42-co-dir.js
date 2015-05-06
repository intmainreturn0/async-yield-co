/*
    Если вспомнить про задачу листинга файлов с их размерами, когда на yield'ах с функциями она при тамошней реализации
  работала последовательно, то на промисах очень легко можно сделать её же параллельную версию.
 */

var fs = require( 'fs' )
var path = require( 'path' )
var co = require( 'co' )

function handleError( err ) {
    console.error( 'Error! ', err )
}

function readdir( dirname ) {
    return function( callback ) {
        fs.readdir( dirname, callback )
    }
}

function getstat( filename ) {
    return new Promise( function( resolve, reject ) {
        setTimeout( function() {
            fs.stat( filename, function( err, data ) {
                err ? reject( err ) : resolve( data )
            } )
        }, 100 + Math.random() * 200 )                          // файл читается рандомно долго
    } )
}

co( function *() {
    var dir   = yield readdir( __dirname ),
        stats = yield dir.map( function( fn ) {
            return getstat( path.join( __dirname, fn ) )
        } )
    return stats        // это исполняется, когда все файлы уже прочитаны
        .map( function( stat, i ) { return stat.isFile() && [dir[i], stat.size] } )
        .filter( function( s ) { return !!s } )
} ).then( console.log, handleError )

// в отличие от прошлого примера, который перебирал файлы последовательно, тут сначала читается директория, а потом
// параллельно читаются все файлы, и когда они уже все готовы, формируется и возвращается результат, который уже в .then() доступен

/*
    Таким образом, корутины + промисы позволяют писать асинхронный код синхронно с логичной обработкой ошибок.
  При этом в нужные места параллелизм вставляется без проблем, не нарушая общей синхронности.
    Это всё позволяет ноде быть однопоточной, но обрабатывая очень много запросов одновременно. При выглядящем как синхронном коде.

    ---
    Следующий шаг в эволюции – это 2 пути:
    1) внедрение в стандарт ECMAScript async/await, как в C#; по сути, все изменения – это yield => await, function* => async function
    2) чтобы все стандартные асинхронные функции типа fs.readFile и пр. (вообще ВСЕ) возвращали промисы
        это позволит не писать вокруг них обёртки, как выше, а говорить напрямую yield fs.readFile, yield stream.write и т.п.
    Будет очень круто.
 */