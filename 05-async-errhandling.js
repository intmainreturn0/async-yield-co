/*
    Поскольку мы выяснили, что throw использовать нельзя, то как обрабатывать ошибки, если они возникнут?
    Нужно использовать стандартный паттерн function( err, data ).
    Код всё возрастает и возрастает, причём за обработкой ошибок и разными вложенными callback'ами теряется суть происходящего.
  (это называется callback hell).
    Здесь только 2 простых действия, а уже код очень неприятный. А ведь часто бывает, что нужно выполнять один за другим
  много действий (открыть файл, достать url, подключиться к серваку, распарсить html, выкачать картинку и только потом отдать).
  В таких случаях цепочки вложенных callback'ов становятся невыносимыми.
    Но это – дань асинхронности и однопоточности. По крайней мере, если не применять разные крутые штуки, описываемые далее.
 */

var fs = require( 'fs' )

function getTempInCity( cityName, callback ) {
    fs.readFile( 'weather/cities.json', 'utf-8', function( err, content ) {
        if( err )
            return callback( err )
        try {
            var data    = JSON.parse( content ),
                city_id = data.cities[cityName];
            fs.readFile( 'weather/' + city_id + '.json', 'utf-8', function( err, content ) {
                if( err )
                    return callback( err )
                try {
                    var data        = JSON.parse( content ),
                        temperature = data.list[0].main.temp
                }
                catch( ex ) {
                    return callback( ex )
                }
                callback( null, temperature );
            } )
        }
        catch( ex ) {
            callback( ex )
        }
    } )
}

var city_name = 'London' // + 'k'           // также можно допустить ошибку в json-файле, ругнётся
getTempInCity( city_name, function( err, temp ) {
    if( err ) console.error( "Error = ", err )
    else console.log( temp )
} )
