const { UnAuthenticatedError, BadRequestError } = require('../errors');
const User = require('../models/users');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new BadRequestError('Please provide username and password');
        }

        const user = await User.findOne({ username });

        if (!user) {
            throw new UnAuthenticatedError('Invalid credentials');
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect) {
            throw new UnAuthenticatedError ('Invalid credentials');
        }

        const token = user.createJWT();

        res.status(StatusCodes.OK).json({ user:{ username: user.username, role: user.role }, token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const signup = async (req, res) => {
    try {
        const { username, password, role, email } = req.body;

        if(!username || !password || !email) {
            res.status(400).json({ message: 'please provide a username and a password' });
            return;
        }

        const userAlreadyExists = await User.findOne({ username });

        if(userAlreadyExists) {
            res.status(400).json({ message: 'username already exists' });
            return;
        }

        const user = await User.create({ username, password, role, email });
        const token = user.createJWT();

        res.status(200).json({ user: { username: user.username, role: user.role, email: user.email }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { login, signup }