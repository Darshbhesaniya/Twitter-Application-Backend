import TweetService from "../services/tweet-service.js";
const tweetService = new TweetService();

export const createTweet = async (req, res) =>{
    try {
        console.log(req.file);
        const data = {
            ...req.body,
            user: req.user?.id || req.user?._id
        };
        const response = await tweetService.create(data, req.file);
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
                    message: error.message || 'Something Went Wrong',
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
                    message: error.message || 'Something Went Wrong',
                    data: {},
                    error: error
                 })
    }
}

export const destroyTweet = async (req,res) => {
    try {
        const response = await tweetService.destroy(req.params.id, req.user?.id || req.user?._id);
        
        return res.status(200).json({
            success: true,
            message: "Tweet Deleted Successfully",
            data: response,
            error: {}
        });

    } catch (error) {
        const statusCode = error.message?.includes("Unauthorized") ? 403 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Something Went Wrong",
            data: {},
            error: error
        });
    }
};

export const getAllTweets = async (req, res) => {
    try {
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        // Optional: filter by userId to get a specific user's tweets (used in Profile page)
        const userId = req.query.userId || null;
        
        const response = await tweetService.getAll(page, limit, userId);

        return res.status(200).json({
            success: true,
            message: "Tweet fetched Successfully",
            data: response,
            error: {}
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something Went Wrong",
            data: {},
            error: error
        })
    }
}
