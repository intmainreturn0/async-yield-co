/*
    Начнём с генераторов.
    Они не только являются полезными штуками, но и впоследствии позволят писать код в синхронном стиле.
    ---
    Представим задачу: нужно распечатать все чётные числа до какого-то предела.
  Эти чётные числа должны генерироваться какой-то функцией.
    (понятно, что чётные числа тут для упрощения; что генерирующая функция может значения доставать по какому-то правилу,
  например трансформируя строки из файла по регуляркам или парся файлы специального формата и т.п.)
 */

// вариант с массивом - функция заполяет массив и возвращает его, а внешний код распечатывает
// он плох тем, что нужно все числа сначала записать в память; а если limit под миллион?..

function getAllEvens( limit ) {
    var r = []
    for( var i = 2; i <= limit; i += 2 )
        r.push( i )
    return r
}

var arr = getAllEvens( 10 )
for( var num in arr )
    console.log( arr[num] )


// вариант с callback'ом; нет массива, числа печатаются по одному

function cbAllEvens( limit, callback ) {
    for( var i = 2; i <= limit; i += 2 ) {
        callback( i )
    }
}

cbAllEvens( 10, function( num ) {
    console.log( num )
} )


// и вариант с генератором
// после каждого yield функция останавливает работу, передавая i наверх, внешнему коду
// а for..of возвращает управление назад, пока yield'ится

function *genAllEvens( limit ) {
    for( var i = 2; i <= limit; i += 2 ) {
        yield i
    }
}

for( num of genAllEvens( 10 ) )
    console.log( num );

