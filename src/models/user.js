import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        sparse: true, // allows existing documents without username to coexist without index collision
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_.]+$/, 'Username can only contain alphanumeric characters, underscores, and dots']
    }
}, { timestamps: true });

// For Password bcrypt hook
userSchema.pre('save', async function() {
    const user = this;
    if (!user.isModified('password')) return;

    const SALT = await bcrypt.genSalt(9);
    const encryptedPassword = await bcrypt.hash(user.password, SALT);
    user.password = encryptedPassword;
});

userSchema.methods.comparePassword = async function compare(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.genJWT = function generate() {
    return jwt.sign(
        { id: this.id, email: this.email, username: this.username },
        process.env.JWT_SECRET || 'twitter_secret',
        { expiresIn: '1h' }
    );
};

const User = mongoose.model('User', userSchema);

export default User;
