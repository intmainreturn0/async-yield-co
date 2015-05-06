/*
    Расширяем предыдущий пример. И сделаем снова чтение погоды.
    Этот код работает асинхронно, он не блокирующий, но выглядит как синхронный.
 */

var fs = require( 'fs' )

// что и в прошлый раз
function coroutine( generatorFn ) {
    var gen = generatorFn();

    function next( err, data ) {
        var ret = gen.next( data );
        if( ret.done ) return;
        ret.value( next )
    }

    next();
}

// обёртка над асинхронным readFile, которую можно yield'ить; такой паттерн называется thunk
function read( filename ) {
    return function( callback ) {
        fs.readFile( filename, 'utf-8', callback );
    }
}

// задание: найти 10 отличий от кода "1-sync.js".
// код выглядит синхронным! хотя исполняется асинхронно
coroutine( function *() {
    var data    = JSON.parse( yield read( 'weather/cities.json' ) ),
        city_id = data.cities['London']

    data = JSON.parse( yield read( 'weather/' + city_id + '.json' ) )
    console.log( data.list[0].main.temp )
} )

