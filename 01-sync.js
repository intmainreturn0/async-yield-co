/*
    Здесь и далее во многих демках будет обыгрываться одна и та же задача.
    Есть "база данных" cities.json, где хранится соответствие имён городов их IDшникам.
    И для каждого города есть файл ID.json с погодой.
    Задача — получить погоду по названию города.
    То есть нужно сначала считать cities.json, распарсить и получить ID города, потом считать нужный файл, распарсить и достать температуру.
    ------
    Приводимый ниже код – синхронный.
    Он работает, но его не поместишь как обработчик серверной части — из-за блокировок. Ведь нода однопоточная.
 */

var fs = require( 'fs' )

function getTempInCity( cityName ) {
    var data    = JSON.parse( fs.readFileSync( 'weather/cities.json', 'utf-8' ) ),
        city_id = data.cities[cityName]

    data = JSON.parse( fs.readFileSync( 'weather/' + city_id + '.json', 'utf-8' ) )
    return data.list[0].main.temp;
}

console.log( getTempInCity( 'London' ) );
