import Api, { handleError, handleResponse } from "./Api";

/**
 * @name savePassword
 * @function
 * @category API
 * @param {Int} UserID ID of a user.
 * @param {String} password New password to be saved.
 * @description
 * PUT request to API to update a user password.
 */
export const savePassword = async (UserID, password) => {
    try {
        const res = await Api().put(`user/${UserID}/changePassword`, {
            password,
        });
        return handleResponse(res);
    } catch (error) {
        return handleError(error);
    }
};
