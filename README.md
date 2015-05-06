# async-yield-co

Подробные примеры, зачем нужен [co](https://github.com/tj/co) (на node.js).

Кратко: ES6-конструкции и обёртка над ними (co) позволяют избавиться от callback'ов и привнести удобную обработку ошибок.


# Настройка окружения

Для запуска нужен установленный node.js / io.js. 

Поскольку используются генераторы и нативные Promise-объекты, то node нужно запускать с --harmony флагом. io же этот флаг не требует.
  
Удобно всё делать в IDE (я использую WebStorm).
  

# План: демонстрации для понимания yield

Начиная от обычных асинхронных функций, и заканчивая yield'ами, promise'ами и co.

Для понимания нужно знать JavaScript, что такое node.js, как в ней устроен event loop (однопоточность), иметь опыт асинхронного программирования.
 
Все материалы отсортированы по номерам (рекомендуемый порядок освоения) и сами содержат все нужные комментарии.

## Порядок демонстраций

* 0x – отличие sync от async, возникающий callback hell, трудности обработки ошибок
* 1x – что такое генераторы, возврат значения через yield
* 2x – что такое корутины, приём обратного значения через yield
* 3x – что такое промисы
* 4x – объединение всего вместе: co


# Полезные ссылки

* [callbacks vs coroutines](https://medium.com/code-adventures/callbacks-vs-coroutines-174f1fe66127)
* [настройка автокомплита io.js в WebStorm](http://blog.jetbrains.com/webstorm/2015/01/io-js-already-in-webstorm/)
* [что такое асинхронная событийная модель](http://habrahabr.ru/post/128772/)
* [как устроен event loop в node.js](http://frontender.info/understanding-the-node-js-event-loop/)
* [co](https://github.com/tj/co)
* [koa – веб-framework, основанный на co](https://github.com/koajs/koa)
