/*
    Фактически, корутина за счёт своих yield-остановов и обратных входов хранит состояние без переменных.
    См. ниже пример с clock().
 */

// та же обёртка, что и ранее
function coroutine( generatorFn ) {
    var gen = generatorFn();
    gen.next(); // выполнить до первого yield
    return function( x ) {
        gen.next( x );
    }
}

var clock = coroutine( function*( _ ) {
    while( true ) {
        yield _;
        console.log( 'Tick!' );
        yield _;
        console.log( 'Tock!' );
    }
} );

clock(); // 'Tick!'
clock(); // 'Tock!'
clock(); // 'Tick!'

// setTimeout( clock, 1000 )


// ---
// как это выглядело бы без корутин? Как-нибудь так:

var ticking = true;
var clock_normal = function() {
    if( ticking )
        console.log( 'Tick!' );
    else
        console.log( 'Tock!' );
    ticking = !ticking;
}

//clock_normal()
//clock_normal()
//clock_normal()

// то есть без корутин присутствует явное запоминание состояния, а корутины несут это состояние в себе, без переменных
// фактически, корутина – это конечный автомат, работающий по шагам, логику которого можно описывать отдельно, yield'ами, а
// извне управлять состоянием и точками входа
// см. следующий пример