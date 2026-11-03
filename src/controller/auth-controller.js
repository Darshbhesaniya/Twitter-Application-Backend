import UserService from "../services/user-service.js";

const userservice = new UserService();

export const signup = async (req, res) => {
    try {
        const response = await userservice.signup({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        return res.status(201).json({
            success: true,
            message: 'Successfully Created a new user',
            data: response,
            err: {}
        });
    } catch (error) {
        const errorMsg = error.message || 'Something went Wrong';
        const isClientError = (
            errorMsg.includes('already taken') ||
            errorMsg.includes('already registered') ||
            errorMsg.includes('required') ||
            errorMsg.includes('Username') ||
            errorMsg.includes('Password') ||
            errorMsg.includes('Email')
        );

        return res.status(isClientError ? 400 : 500).json({
            message: errorMsg,
            data: {},
            success: false,
            err: { message: errorMsg }
        });
    }
};

export const login = async (req, res) => {
    try {
        const token = await userservice.signIn(req.body);
        return res.status(200).json({
            success: true,
            message: 'Successfully Logged In',
            data: token,
            err: {}
        });
    } catch (error) {
        const errorMsg = error.message || 'Something went Wrong';
        const isAuthError = (
            errorMsg.includes('Invalid') ||
            errorMsg.includes('Please enter') ||
            errorMsg.includes('No User Found') ||
            errorMsg.includes('Incorrect Password')
        );

        return res.status(isAuthError ? 401 : 500).json({
            message: errorMsg,
            data: {},
            success: false,
            err: { message: errorMsg }
        });
    }
};
