import axios from "axios";
import { axiosConfig } from "../../config";
import { getIdToken } from "../authProvider";

export const setToken = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
/**
 * @name API
 * @function
 * @category API
 * @description
 * General purpose API instance
 */
export default () => {
    const instance = axios.create(axiosConfig);
    instance.defaults.headers.post["Content-Type"] = "application/json";

    return instance;
};

/**
 * @name handleResponse
 * @function
 * @category API
 * @param {Object} res Response object from API call.
 * @description
 * Deconstructs data from response and adds success wrapper
 */
export const handleResponse = (res) => {
    if (
        res.statusText !== "OK" &&
        res.statusText !== "No Content" &&
        res.statusText !== ""
    ) {
        return { success: false, status: res.status };
    }
    const data = res.data ? res.data.data : res;
    return { success: true, data };
};

/**
 * @name handleError
 * @function
 * @category API
 * @param {Object} error Error object produced from API call.
 * @description
 * Error logging for all cases. Deconstructs message or response from error and adds a success wrapper.
 */
export const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        return {
            success: false,
            data: error.response.data.message,
            status: error.response.status,
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return { success: false, data: error.message, status: 500 };
    }
};

export const silentRecover = async () => {
    try {
        console.log("attempting silent recovery");
        const idToken = await getIdToken();
        console.log("setting id token", idToken);
        setToken(idToken);
        console.log("silent recover success");
        return true;
    } catch (err) {
        console.log("silent recover failed", err);
        return false;
    }
};
