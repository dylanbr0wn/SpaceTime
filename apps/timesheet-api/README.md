# City of Langford Timesheet API

Timesheet system API for City of Langford. This API supports the React front end web application by providing database and authentication functionality.

-   [City of Langford Timesheet Front End](https://github.com/dylanbr0wn/COL_Timesheet_App)

## Links

-   [Technologies](#technologies)
-   [Development Installation](#development-installation)
    -   [Database](#database)
    -   [API](#api)
-   [Build](#build)
-   [Login](#login)
-   [Routes](./src/api/APIDOC.md)

## Technologies

-   [Babel](https://babeljs.io/)
-   [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
-   [Express](https://expressjs.com/)
-   [express-validator](https://github.com/express-validator/express-validator)
-   [helmet](https://helmetjs.github.io/)
-   [jwt-redis](https://github.com/Natashkinsasha/jwt-redis-v2)
-   [morgan](https://github.com/expressjs/morgan)
-   [node-mssql](https://github.com/tediousjs/node-mssql)
-   [npm-run-all](https://github.com/mysticatea/npm-run-all)
-   [passport](http://www.passportjs.org/)
-   [passport-custom](https://github.com/mbell8903/passport-custom)
-   [ESLint](https://eslint.org/)
-   [passport-azure-ad](https://github.com/AzureAD/passport-azure-ad)

## Development Installation

### Database

Firstly you must have a working version of the timsheet database on a Microsoft SQL Server instance. Below are some resources to get started installing the SQL server.

-   [Windows 10](https://www.microsoft.com/en-us/sql-server/sql-server-2019)

-   [MacOS](https://medium.com/faun/installing-sql-server-in-mac-os-x-using-docker-e076dbc52240)

-   [Linux](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-overview?view=sql-server-ver15)

Once installed, restore a backup of the Timesheet database for development.

### API

Make sure you are using up to date versions of [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm).
Depending on your system you may need to install [Python 3+](https://www.python.org/), and [Microsoft Build Tools](https://visualstudio.microsoft.com/downloads/) or XCode Command Line Tools for Apple platforms.

First clone the repo to your local machine and access the folder

```bash
git clone https://github.com/dylanbr0wn/COL_Timesheet_Api.git & cd COL_Timesheet_Api
```

Use NPM to install the dependencies.

```bash
npm install
```

Navigate to the database config file and modify the user, password, and server as necessary to fit your database configuration.

```javascript
/* src/config/database.js */

const config = {
    user: ...,
    password: ...,
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Timesheet',
}
```

## Usage

To run the API without file watching use the following.

```bash
npm run dev
```

To run the API with file watching from nodemon use the following command. This will only watch the /src folder and will need to be restarted when new modules are installed.

```bash
npm run start:dev
```

## Build

APIs are usually not needed to be bundled to be served in a browser. However, as this application takes advantage of some modern javascript features, the code must be transpiled for compatability. This is done using Babel.

Due to the way this development environment is configured, this API will rebuild itself when running as a development server. Therefore, there is no need to build the application if it has been running in development.

To build the API from scratch, run the build npm command.

```sh
npm run build
```

The API build will be stored in the `build` directory in the API root.

### Build steps

1. Make database changes
2. Install Node
3. Install UrlRewrite
4. Install IISNode
5. Create directories for client and server
6. Setup IIS
    - Create site for both client and server (App and API)
    - Add authentication for IIS user. Add user to the directory permissions.
    - Setup SSL
    - Enable handlers in feature delegation (if needed)
    - turn off directory browsing
    - Enable the .md MIME type for the project or the APP site.
    - ensure IIS is pointed at the root directory of the API.
7. Build APP using `npm run build` and copy build files to the destination folder
8. Copy API src, package files, web.config, iisnode.yml into API directory
9. Install API dependencies using `npm i`
10. Run `npm run build` as mentioned above.

## Login

The Timesheet login flow has shifted to use [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/). This shift to Azure was to facilitate a standardized and secure login flow that is accessible from any platform. The administration of this can be done through the Azure Portal.

In the API this details a authorization flow. A user will have been authenticated through Azure AD in the front end and will have a Authorization Bearer token.

This token is authorized using the Azure AD, no authentication in the API. If the token is valid, the request will be processed as reqeuested. If the token is invalid, or expired, passport will respond with a `HTTP 401`.

In order to identify the employee from the Azure AD login information, Azure AD provides the user email as an identifier. This email is used to uniquly identify the employee.

## Structure

The structure of the API contains 4 main catagories of files. This catagorization is to seperate the concerns of each part of the route. This helps with building modular routes, as well as testing.

-   [Controllers](src/api/controllers/controllers.md)
-   [Routes](src/api/routes/routes.md)
-   [Database](src/api/database/database.md)
-   [Services](src/api/services)
