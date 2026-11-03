import { UserRepository } from '../repository/index.js';

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signup(data) {
        try {
            if (!data.name || !data.name.trim()) {
                throw new Error('Name is required');
            }

            if (!data.username || !data.username.trim()) {
                throw new Error('Username is required');
            }

            const cleanUsername = data.username.trim().toLowerCase();
            const usernameRegex = /^[a-zA-Z0-9_.]+$/;
            if (!usernameRegex.test(cleanUsername)) {
                throw new Error('Username can only contain alphanumeric characters, underscores, and dots');
            }
            if (cleanUsername.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }
            if (cleanUsername.length > 30) {
                throw new Error('Username cannot exceed 30 characters');
            }

            if (!data.email || !data.email.trim()) {
                throw new Error('Email is required');
            }
            const cleanEmail = data.email.trim().toLowerCase();

            if (!data.password || data.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // 1. Proactive check for existing username
            const existingUsername = await this.userRepository.findBy({ username: cleanUsername });
            if (existingUsername) {
                throw new Error('Username is already taken');
            }

            // 2. Proactive check for existing email
            const existingEmail = await this.userRepository.findBy({ email: cleanEmail });
            if (existingEmail) {
                throw new Error('Email is already registered');
            }

            const user = await this.userRepository.create({
                name: data.name.trim(),
                username: cleanUsername,
                email: cleanEmail,
                password: data.password
            });

            return user;
        } catch (error) {
            // Handle race-condition MongoDB duplicate key errors (E11000)
            if (error.code === 11000) {
                if (error.keyPattern?.username || error.keyValue?.username) {
                    throw new Error('Username is already taken');
                }
                if (error.keyPattern?.email || error.keyValue?.email) {
                    throw new Error('Email is already registered');
                }
                throw new Error('An account with these details already exists');
            }
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findBy({ email: email.trim().toLowerCase() });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            const user = await this.userRepository.findBy({ username: username.trim().toLowerCase() });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const user = await this.userRepository.get(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async signIn(data) {
        try {
            const identifier = (data.identifier || data.email || data.username || '').trim();
            const password = data.password;

            if (!identifier) {
                throw new Error('Please enter your username or email');
            }

            if (!password) {
                throw new Error('Please enter your password');
            }

            const cleanIdentifier = identifier.toLowerCase();

            // Detect whether identifier is an email or username
            let user;
            if (cleanIdentifier.includes('@')) {
                user = await this.userRepository.findBy({ email: cleanIdentifier });
            } else {
                user = await this.userRepository.findBy({ username: cleanIdentifier });
            }

            // Fallback for edge cases (e.g. username containing unusual characters or old users)
            if (!user) {
                user = await this.userRepository.findBy({
                    $or: [
                        { email: cleanIdentifier },
                        { username: cleanIdentifier }
                    ]
                });
            }

            if (!user) {
                throw new Error('Invalid username/email or password');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid username/email or password');
            }

            const token = user.genJWT();
            return token;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
