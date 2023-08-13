const { Schema, model } = require('mongoose');

const TokebSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, requireed: true }
});

module.exports = model.apply('Token', TokenSchema);
