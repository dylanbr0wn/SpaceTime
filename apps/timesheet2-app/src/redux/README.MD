# Redux Configuration

Redux is the state management tool used in the Timesheet system. For a basic overview and information getting started read the [Redux documentation](https://redux.js.org/)

The Redux store configuration is dependant on the environment configuration but the difference is very minor. When the NODE_ENV is set to `'development'`, `configureStore.dev.js` is used. When set to `'production'`, `configureStore.prod.js` is used. The difference between the tool files in the addition of Redux browser dev tools and some immuatble state checking included in teh the development configuration. 

`configureStore.js` is called in `@/src/index.js` and is used to initialize Redux for our application.

## Actions

`/actions` contains dispatchers for each type of object in the Redux Store. These dispatchers handle dispatching actions to the reducers to store data in the Redux store. Each dispatcher that makes an API call also dispatches and API action traking the number of ongoing API calls the applicatin is making.

This folder also contains a `actionTypes.js` file where all the action types are stored. This is done to provide a master list of actions, but to also aid with spelling with autofill functionality.

## Reducers

`/reducers` contains Reducers corresponding to the objects in the Redux store. *Notice here objects are seperated in departments, projects, and workCodes*. Each reducer receives all dispatched actions, but only has cases for those actions concerning the objects it is storing. It is prefered that all processing of data from a dispatched action is done in reducers.

`/reducers/index.js` is the root reducer. This file is called in the store configuration process.

`/initialState.js` is the initial state for all the objects in the Redux Store. This file is also called in the store configuration process.
