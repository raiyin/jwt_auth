const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw new Error(`User with email ${email} already exist`);
        }

        const hashPassword = await bcrypt.hash(password, salt);
        const activationLink = uuid.v4();

        const user = await userModel.create({ email, password: hashPassword, activationLink });
        await mailService.sendActivationLink(email, activationLink);

        const userDto = new UserDto(user);

        // Скобки, чтобы передать обычный объект, а не инстанс DTO.
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }
}

module.exports = new UserService();
