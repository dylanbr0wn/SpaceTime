import passport from "passport";
import { readEmployeeFromEmail } from "../database/employeeDB";
import { BearerStrategy } from "passport-azure-ad";
import config from "../../config/config";
import { UserInfo } from "./types";

// const OIDCBearerStrategy = OIDC.BearerStrategy;

const creds = config.aad_creds;

passport.use(
    new BearerStrategy(creds, async (_, token, done) => {
        try {
            if (token.preferred_username) {
                const result = await readEmployeeFromEmail(
                    token.preferred_username
                );
                if (!result.success) {
                    return done(null, false, { message: result.message }); // SQL Error
                } else if (!result.data) {
                    return done(null, false, {
                        message: "Email not found. Contact IT.",
                    }); // AD didnt provide valid Email.
                } else {
                    const user: UserInfo = result.data;
                    return done(null, user);
                }
            } else {
                return done(null, false, {
                    message: "AD authentication error.",
                });
            }
        } catch (err) {
            done(err);
        }
    })
);
