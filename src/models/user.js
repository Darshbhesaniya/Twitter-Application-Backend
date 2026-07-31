import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

userSchema.methods.comparePassword = async function compare(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.genJWT = function generate() {
    return jwt.sign({id: this.id, email: this.email}, 'twitter_secret',{
        expiresIn: '1h'
    })
}


const User = mongoose.model('User',userSchema);


export default User;