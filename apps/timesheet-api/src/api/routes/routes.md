# Routes 
Routes files contain all the routes that the API provides.
## Route Layout
Most routes are made up of a validation middleware and a controller. The [validation middleware](src/api/services/validate.js) ensures the received data is valid and acceptable. The [controllers](src/api/controllers/controllers.md) contains all the logic for the route. Some routes also have a authorization middleware between the validation middleware and the controller. This authorization middleware checks the routes admin/manager/payroll clerk permissions. 

```js

router.get('<ROUTE_NAME>',
    /* validation middleware */,
    /* authorization middleware */,
    /* controller */ 
    )

```