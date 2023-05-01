const ApiMessages = Object.freeze({
    OK: 'api.common.ok',
    BAD_REQUEST: 'api.common.bad_request',
    UNAUTHORIZED: 'api.common.unauthorized',
    PASSWORD_MISMATCHED: 'api.common.password_mismatched',
    CREDENTIAL_INVALID: 'api.common.credential_invalid',
    TOKEN_EXPIRED: 'api.common.token_expired',
    TOKEN_INVALID: 'api.common.token_invalid',
    FORBIDDEN: 'api.common.forbidden',
    NOT_FOUND: 'api.common.not_found',
    CONFLICT: 'api.common.conflict',
    CANNOT_DELETE: 'api.common.error',
    INTERNAL_SERVER_ERROR: 'api.common.error',
    ERROR: 'api.common.error',

    ACCOUNT_LOCKED: 'api.user.locked',
    ACCOUNT_WAITING: 'api.user.waiting',

    USER_ALREADY_EXIST: 'api.user.already_exist',

    SIGNUP_CONFLICT: 'api.signup.conflict',

    CODE_USED: 'api.code.used',

    EMAIL_TITLE_SIGNUP_VERIFICATION: 'email.title.signup.verification',
    EMAIL_TITLE_SIGNUP_NOTIFICATION: 'email.title.signup.notification',
    EMAIL_TITLE_INVITE: 'email.title.invite',
    EMAIL_TITLE_PASSWORD_RESET_REQUEST: 'email.title.password_reset.request',
    EMAIL_TITLE_PASSWORD_RESET_NOTIFICATION: 'email.title.password_reset.notification',
});

export default ApiMessages;
