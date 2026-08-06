import TweetService from "../services/tweet-service.js";
const tweetService = new TweetService();

export const createTweet = async (req, res) =>{
    try {
        console.log(req.file);
        
        const response = await tweetService.create(req.body,req.file);
        return res
               .status(201)
               .json({
                    success: true,
                    message: 'successfully created a new Tweet',
                    data: response,
                    error: {}
                 })

    } catch (error) {
        console.log(error);
        
        return res.
                status(500)
                .json({
                    success: false,
                    message: 'Something Went Wrong',
                    data: {},
                    error: error
                 })
    }
}

export const getTweet = async (req, res) => {
    try {
        const response = await tweetService.get(req.params.id);
        return res
               .status(200)
               .json({
                    success: true,
                    message: 'Successfully Fetchd a Tweet',
                    data: response,
                    error: {}
                 })

    } catch (error) {
        console.log(error);
        
        return res.
                status(500)
                .json({
                    success: false,
                    message: 'Something Went Wrong',
                    data: {},
                    error: error
                 })
    }
}

export const destroyTweet = async (req,res) => {
    try {
        const response = await tweetService.destroy(req.params.id);
        
        return res.status(200).json({
            success: true,
            message: "Tweet Deleted Successfully",
            data: response,
            error: {}
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong",
            data: {},
            error: error
        });
    }
};