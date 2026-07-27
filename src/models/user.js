import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{timestamps: true});

// For Password bcrypt hook
userSchema.pre('save',async function(){
    const user = this;

    const SALT = await bcrypt.genSalt(9);
    const encryptedPassword = await bcrypt.hash(user.password, SALT);
    user.password = encryptedPassword;
})

const User = mongoose.model('User',userSchema);


export default User;