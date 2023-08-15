const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return next(ApiError.UnauthorizedError());
        }

        const accesToken = authorization.split(' ')[1];
        if (!accesToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accesToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    }
    catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
