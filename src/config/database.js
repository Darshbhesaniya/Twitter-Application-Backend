import mongoose from 'mongoose';

export const connect = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost/twitter_Dev';
    await mongoose.connect(uri);
}

