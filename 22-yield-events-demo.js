/*
    Продолжим развивать идею "корутины – конечные автоматы с пошаговым исполнением".
    См. в браузере yield-events-demo.js.html.
    В нём можно выбирать true/!true – вызывать разные реализации таскания квадратика. При внешней идентичности
  подход совершенно различен. Подробности см. далее в коде.
 */

// та же обёртка, что и ранее
function coroutine( generatorFn ) {
    var gen = generatorFn();
    gen.next(); // выполнить до первого yield
    return function( x ) {
        gen.next( x );
    }
}

// ---

// реализация стандартного простейшего паттерна таскания обычным способом
function makeDragStardard( box ) {
    var moving = false

    function mousedown() {
        moving = true
    }

    function mousemove( e ) {
        if( moving )
            move( e )
    }

    function mouseup() {
        moving = false
    }

    box.addEventListener( 'mousedown', mousedown )
    window.addEventListener( 'mousemove', mousemove )
    window.addEventListener( 'mouseup', mouseup )
}

// реализация того же через корутины
// мало того, что там нет переменных состояния, так ещё и на все обработчики up/move/down подвешена одна и та же функция!
// причём внешне это работает точно так же, но внутренность отличается кардинально
function makeDragCoroutine( box ) {

    var loop = coroutine( function * ( _, e ) {
        while( e = yield _ )
            if( e.type == 'mousedown' )
                while( e = yield _ )
                    if( e.type == 'mousemove' )
                        move( e );
                    else if( e.type == 'mouseup' )
                        break;
    } )

    box.addEventListener( 'mousedown', loop )       // во все события посылается loop!
    window.addEventListener( 'mousemove', loop )
    window.addEventListener( 'mouseup', loop )
}
