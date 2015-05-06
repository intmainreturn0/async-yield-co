/*
    Чтобы код мог реально использоваться внутри обрабатывающего запросы сервака, он не должен блокировать.
    Код должен быть асинхронным. Нельзя использовать readFileSync и т.п.
    Вместо этого нужны readFile и иже с ними. Однако, readFile ничего не возвращает, ведь возвращать нечего:
  файл прочитается только когда-нибудь потом.
    Поэтому readFile принимает callback, который вызывается, когда файл прочитан или возвратилась ошибка.
    Чтобы лучше понять это, тут нужно поизучать node nonblocking i/o handling, как устроена нода, libuv и пр.
 */

var fs = require( 'fs' )

function getTempInCity( cityName, callback ) {
    fs.readFile( 'weather/cities.json', 'utf-8', function( err, content ) {
        var data    = JSON.parse( content ),
            city_id = data.cities[cityName];
        fs.readFile( 'weather/' + city_id + '.json', 'utf-8', function( err, content ) {
            var data = JSON.parse( content )
            callback( data.list[0].main.temp );
        } )
    } )
    console.log( 'after read file' );       // это выполнится до чтения какого-то файла!
}

// 2 чтения файлов пойдут параллельно; нет гарантии, какой из них закончится раньше
getTempInCity( 'London', function( temp ) {
    console.log( 'Temperature in London = ', temp )
} )
getTempInCity( 'Krasnoyarsk', function( temp ) {
    console.log( 'Temperature in Krasnoyarsk = ', temp )
} )

console.log( 'end of file' );       // это выполнится до чтения какого-то файла!
