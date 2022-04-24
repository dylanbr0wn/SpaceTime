/**
 * Azure Active Directory Authentication
 *
 * The configurations in this file are found on the Azure AD page for the Timesheet application.
 */
import { aadConfig } from "../config";

import {
    PublicClientApplication,
    InteractionRequiredAuthError,
    EventType,
    InteractionStatus,
    EventMessage,
    AuthenticationResult,
} from "@azure/msal-browser";
import { useState, useEffect } from "react";
import { useAccount, useMsal } from "@azure/msal-react";
import store from "../redux/configureStore";
// Msal Configurations

export function useIdToken() {
    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const account = useAccount(accounts[0] || {});

    useEffect(() => {
        if (account && inProgress === InteractionStatus.None) {
            const request = {
                scopes: ["User.Read"],
                account: account,
                forceRefresh: true,
            };
            instance
                .acquireTokenSilent(request)
                .then((response) => {
                    setAccessToken(response.idToken);
                })
                .catch((error) => {
                    console.log("Silent token acquisition failed.");
                    console.error(error);
                    // acquireTokenSilent can fail for a number of reasons, fallback to interaction
                    // if (error instanceof InteractionRequiredAuthError) {
                    //     instance.acquireTokenRedirect(request).then(response => {
                    //         setIdToken(response.idToken);
                    //     });
                    // }
                    if (error instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect({
                            scopes: ["User.Read"],
                        });
                    }
                });
        }
    }, [account, inProgress, instance]);

    return accessToken;
}

// Options
// const options = {
//     loginType: LoginType.Redirect,
//     tokenRefreshUri: window.location.origin + "/app/auth.html",
// };

const authProvider = new PublicClientApplication(aadConfig);

authProvider.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        authProvider.setActiveAccount(account);
    }

    if (event.eventType === EventType.LOGIN_FAILURE) {
        console.log(JSON.stringify(event));
    }
});

const accounts = authProvider.getAllAccounts();

export const getIdToken = async () => {
    if (accounts.length > 0) {
        const request = {
            scopes: ["openid"],
            account: accounts[0],
        };
        try {
            const response = await authProvider.acquireTokenSilent(request);
            const accessToken = response.idToken;
            return accessToken;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return null;
};

export { authProvider };
