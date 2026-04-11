const mongoose =  require('mongoose');

const tweetSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        max: [250, 'Tweet Cannot be more than 250 Charcters']
    },
   hashtag:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hashtag'
        }
   ]
    

}, {timestamps: true});




// tweetSchema.virtual('contentWithEmail').get(function process(){
//     return `${this.content} \nCreated By: ${this.userEmail}`;
// })

// tweetSchema.pre('save', async function(){
//     console.log("inside a hook");
//     this.content = this.content + '.....';
// });

const Tweet = mongoose.model('Tweet',tweetSchema);


module.exports = Tweet;