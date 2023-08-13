const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');

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
    }
}

module.exports = new UserService();
