import UserService from "../services/user-service.js";

const userService = new UserService();

export const getProfile = async (req, res) => {
    try {
        const user = await userService.getUser(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
                err: { message: "User not found" }
            });
        }
        return res.status(200).json({
            success: true,
            message: "Successfully fetched user profile",
            data: user,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            err: error
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
                err: { message: "User not found" }
            });
        }
        return res.status(200).json({
            success: true,
            message: "Successfully fetched user",
            data: user,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            err: error
        });
    }
};
