import * as React from "react";

import { useAuth0 } from "@auth0/auth0-react";

// Hook
export const useDebounce = (value, delay) => {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
};

export const useProfile = () => {
    const [userMetadata, setUserMetadata] = React.useState(null);
    const [accessToken, setaccessToken] = React.useState<string>();

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    React.useEffect(() => {
        const getUserMetadata = async () => {
            const domain = "dev-es0mr9n7.us.auth0.com";

            try {
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`,
                    scope: "read:current_user",
                });
                setaccessToken(accessToken);
                const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

                const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const { userMetadata } = await metadataResponse.json();

                setUserMetadata(userMetadata);
            } catch (e) {
                console.log(e.message);
            }
        };

        getUserMetadata();
    }, [getAccessTokenSilently, user?.sub]);

    return { userMetadata, isAuthenticated, user, accessToken };
};
