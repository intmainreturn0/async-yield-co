/*
    Ранее был просто генератор – который наружу yield'ил некоторые значения.
    И был метод next(), который запускал управление внутри генератора дальше.
    Но оказывается, next()'у можно передать параметр: next(smth), и это smth будет как возвращаемое значение yield'а!
    Это называется корутинами (corountines).
 */

function* test() {
    console.log( 'Hello!' );

    var x = yield undefined;
    console.log( 'First I got: ' + x );

    var y = yield undefined;
    console.log( 'Then I got: ' + y );
}

var printer1 = test();
printer1.next();              //  'Hello!'  – до первого yield
printer1.next( 'a cat' );     //  'First I got: a cat'
printer1.next( 'a dog' );     //  'Then I got: a dog'


// ---
// допустим, нам лень вызывать next(...) каждый раз; как и в случае с генератором, напишем обёртку
// только эта обёртка уже будет возвращать функцию, которую нужно вызывать, чтобы впихнуть в очередной yield значение.

function coroutine( generatorFn ) {
    var gen = generatorFn();
    gen.next(); // выполнить до первого yield
    return function( x ) {
        gen.next( x );
    }
}

var printer2 = coroutine( test );       // 'Hello!'
printer2( 'a cat' )
printer2( 'a dog' )