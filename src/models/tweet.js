import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        max: [250, 'Tweet Cannot be more than 250 Charcters']
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    image: {
        type: String,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    }
}, { timestamps: true });




// tweetSchema.virtual('contentWithEmail').get(function process(){
//     return `${this.content} \nCreated By: ${this.userEmail}`;
// })

// tweetSchema.pre('save', async function(){
//     console.log("inside a hook");
//     this.content = this.content + '.....';
// });

const Tweet = mongoose.model('Tweet', tweetSchema);
export default Tweet;