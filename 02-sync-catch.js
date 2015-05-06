/*
    Большое достоинство синхронного кода – что работают try/catch.
    Ведь если возникает исключение при чтении файла или парсинге, то оно просто кидается вверх по стеку, а
  поток исполнения находится внутри try.
 */

var fs = require( 'fs' )

function getTempInCity( cityName ) {
    var data    = JSON.parse( fs.readFileSync( 'weather/cities.json', 'utf-8' ) ),
        city_id = data.cities[cityName]

    data = JSON.parse( fs.readFileSync( 'weather/' + city_id + '.json', 'utf-8' ) )
    return data.list[0].main.temp;
}

try {
    console.log( getTempInCity( 'Moscow' ) );
}
catch( ex ) {
    console.error( 'Cant fetch weather, because', ex )
}
