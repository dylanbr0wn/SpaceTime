import { LogLevel } from "msal";

export const aadConfig = {
    auth: {
        authority:
            "https://login.microsoftonline.com/e6daa991-402f-46f2-b53b-09367f7d9ea8",
        clientId: "a2118ebc-ba9d-488b-b0cb-0b5b9c06145b",
        // postLogoutRedirectUri: window.location.origin + "app/login",
        // redirectUri:
        //     process.env.NODE_ENV === "production"
        //         ? "https://timesheet.test/app"
        //         : "http://localhost:3030/app",
        redirectUri: window.location.origin,
        // validateAuthority: true,
        navigateToLoginRequestUrl: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level:LogLevel, message:string, containsPii:boolean) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
            piiLoggingEnabled: false,
        },
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
};

export const axiosConfig = {
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.API_URL + "api/"
            : "http://localhost:3000/api/",
    // baseURL: "http://localhost:81/api/",
    // withCredentials: true,
};
