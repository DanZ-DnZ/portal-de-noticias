const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    email: String,
    senha: String,
    admin: Boolean
},{collection: 'users'})

let Users = mongoose.model("Users", userSchema );

module.exports = Users;