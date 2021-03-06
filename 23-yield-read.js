/*
    Наверное, это самый важный пример.
    Потому что является той тонкой переходной гранью между "ну подумаешь, корутины" и возможностью синхронного программирования.
    Этот и следующий пример важно полностью понять и прочувствовать, чтобы иметь ощущение полного контроля над тем, что происходит.
  Иначе потом будет очень сложно.
    ---
    Раньше мы писали yield i, и это i было как результат gen.next().value.
    А что, если вместо i вернуть функцию? Т.е. уже можно вызвать gen.next().value( params ).
    И условиться, что params – это единственный параметр, callback, т.е. тоже функция. И возвращаемая функция должна вызывать
  этот callback при наступлении чего-то. И предоставить в качестве этого callback механизм возврата обратно в корутину через
  ждущий yield!
    Код маленький, но он основополагающий.
 */

var fs = require( 'fs' )

// уже более сложная, модифицированная обёртка
function coroutine( generatorFn ) {
    var gen = generatorFn();

    function next( err, data ) {
        var ret = gen.next( data );
        if( ret.done ) return;
        ret.value( next )
    }

    next();
}

coroutine( function *() {
    var this_file = yield function( callback ) {
        fs.readFile( __filename, 'utf-8', callback );
    }
    console.log( this_file );       // это вызывается ПОСЛЕ чтения файла! и выводится содержимое
} )

// самое важное то, что console.log вызывается после того как файл прочитается
// т.е. несмотря на фактическую асинхронность исполнения, код выглядит как синхронный