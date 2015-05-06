/*
    Немного утихомирим воспевание корутин и yield'ов и глянем на пример, с которым он плохо справляется.
    Задача: вывести список файлов с их размерами из текущей директории.
    Выполняется в 2 этапа: сначала нужно получить список всех файлов (fs.readdir), потом – для каждого файла его размер
  (через fs.stat). Обе этих функции асинхронные. Что ж, сделаем над ними обёртки в виде thunk'ов и заюзаем yield:
 */

var fs = require( 'fs' )
var path = require( 'path' )

function coroutine( generatorFn ) {
    var gen = generatorFn();

    function next( err, data ) {
        if( err )
            gen.throw( err )
        var ret = gen.next( data );
        if( ret.done ) return;
        ret.value( next )
    }

    next();
}

function readdir( dirname ) {
    return function( callback ) {
        fs.readdir( dirname, callback )
    }
}

function getstat( filename ) {
    return function( callback ) {
        // если нужно эмулировать, будто получение инфы о файле долгое, раскомментить
        setTimeout( function() {
            fs.stat( filename, callback )
        }, 100 + Math.random() * 200 )
    }
}

coroutine( function*() {
    var dir = yield readdir( __dirname )
    for( var i in dir ) {
        var stat = yield getstat( path.join( __dirname, dir[i] ) )      // синхронно?!....
        if( stat.isFile() )
            console.log( dir[i], stat.size );
    }
} )

/*
    Код выглядит действительно чистым. Ещё бы: просто читаем файлы по очереди и выводим размеры.
    Но в том-то и дело. Что по очереди. А по идее, нужно прочитать директорию, а потом запустить сбор о файлах палаллельно.
  И когда параллельно stat() у всех файлов получится, агрегировать и вывести результат.
    Получается, что yield при таком простом подходе даёт "чересчур синхронный" код, куда проблематично впихнуть
  реальную асинхронность, когда это нужно.
    Да, можно написать более умную обёртку - типа, yield'ить массив thunk'ов. Но рассмотрим альтернативный вариант: промисы.
 */

