import Api, { handleError, handleResponse } from "./Api";
import { InvalidTokenError } from "../errors";

/**
 * @name getAD
 * @function
 * @category API
 * @description
 * POST request to API for AD Authentication and to grab user info
 *
 */
export const getAD = async (email) => {
    try {
        const res = await Api().post(`auth/ad`, { email });
        const status = res.status;
        if (status === 200) {
            return handleResponse(res);
        } else if (status === 401) {
            throw new InvalidTokenError("Invalid Access Token");
        } else {
            throw new Error("Unexpected status code received.");
        }
    } catch (error) {
        return handleError(error);
    }
};
