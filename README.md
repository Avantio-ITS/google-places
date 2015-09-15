# Librería NodeJS para Google Places

Esta librería es capaz de realizar peticiones a Google Places y cachear las respuestas para así, mejorar el rendimiento del servicio de sugerencias de lugares.

## Modo de uso:

Si se realiza un `require` de la librería, se devuelve un objeto que hay que instanciar con una configuración y usar dicha instancia para obtener los datos necesarios. Por ejemplo:
```
var googlePlaces = require('google-places');

...

var places = new googlePlaces({
  key: '<key>',
  cacheClient: 'redis',
  redisURL: 'redis://:@redis:6379',
  cacheDuration: 60 * 60 * 1000 // 1 día
});
```

Si se quiere utilizar una misma instancia en todo el proyecto, hay que crear un módulo dónde la instancia se guarde en el `module.exports`. Por ejemplo:

```
// places.js

// Código del ejemplo anterior
...

module.exports = places;
```

... y así, basta con hacer un `require` en otra parte del proyecto y siempre se usará la misma instancia del módulo Google Places.
