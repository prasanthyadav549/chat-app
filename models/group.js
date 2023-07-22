const mongoose = require('mongoose')

const groupChat = new mongoose.Schema({
    name : {
          type: String
    },

    isPersonal: {
        type: Boolean,
        default: false
    }
})

const Chat = mongoose.model('Group',groupChat);

module.exports = Chat;