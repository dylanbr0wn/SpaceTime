import { LogLevel } from "msal";

export const auth0Config = {
    domain: "dev-es0mr9n7.us.auth0.com",
    clientId: "KPOmSVdqMaPUjs68CNrcJQ2Zd5iKjLTb",
    audience: "https://dev-es0mr9n7.us.auth0.com/api/v2/",
    redirectUri: "http://localhost:3000",
};

export const axiosConfig = {
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.API_URL + "api/"
            : "http://localhost:3030/api/",
    // baseURL: "http://localhost:81/api/",
    // withCredentials: true,
};
