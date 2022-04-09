import { IBearerStrategyOptionWithRequest } from "passport-azure-ad";

const database_creds = {
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT),
    options: {
        trustServerCertificate: true,
    },
    server: String(process.env.DB_SERVER),
    database: String(process.env.DB_DATABASE),
};

const aad_creds: IBearerStrategyOptionWithRequest = {
    // Requried
    identityMetadata:
        "https://login.microsoftonline.com/e6daa991-402f-46f2-b53b-09367f7d9ea8/v2.0/.well-known/openid-configuration",

    // Required
    clientID: "a2118ebc-ba9d-488b-b0cb-0b5b9c06145b",

    // Required.
    // If you are using the common endpoint, you should either set `validateIssuer` to false, or provide a value for `issuer`.
    validateIssuer: true,

    // Required.
    // Set to true if you use `function(req, token, done)` as the verify callback.
    // Set to false if you use `function(req, token)` as the verify callback.
    passReqToCallback: true,

    // Required if you are using common endpoint and setting `validateIssuer` to true.
    // For tenant-specific endpoint, this field is optional, we will use the issuer from the metadata by default.
    // issuer: "https://login.microsoftonline.com/e6daa991-402f-46f2-b53b-09367f7d9ea8/v2.0/",

    // Optional, default value is clientID
    // audience: "a2118ebc-ba9d-488b-b0cb-0b5b9c06145b",

    // Optional. Default value is false.
    // Set to true if you accept access_token whose `aud` claim contains multiple values.
    allowMultiAudiencesInToken: false,

    // Optional. 'error', 'warn' or 'info'
    loggingLevel: "warn",

    loggingNoPII: true,
};

const mail_creds = {
    from_address: '"City of Langford" <donotreply@langford.ca>',
    host: "mailrelay.cityoflangford.ca",
    port: 25,
};

export default {
    database_creds,
    aad_creds,
    mail_creds,
};
