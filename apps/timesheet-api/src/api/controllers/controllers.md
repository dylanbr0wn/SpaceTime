# Controllers
Controller files contain the logic of the API routes. The controller files mirror the layout of the routes directory, with corresponding controller being contained in similarly named files to those found in routes.

## Controller Layout

All of the logic in the controller is contained in a try/catch block. Any error caught here is handed to the error handler using `next(err)`.

```js
export const <CONTROLLER_NAME> =
    async (req, res, next) => {
        try {
        //    Controller logic
        }
        catch (err) {
            next(err);
        }
    };
```