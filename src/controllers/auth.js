const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { verify } = require("jsonwebtoken");

module.exports = {
    //create JWT token for authenticated user
    async createUserToken(user, code, req, res){
        const token = signToken(user._id);
        //set expiry to 1 month
        let d = new Date();
        d.setDate(d.getDate() + 30);
    
        //first-party cookie settings
        res.cookie('jwt', token, {
            expires: d,
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] ===   'https',
            sameSite: 'none'
        });
        //remove user password from output for security
        user.password = undefined;
        res.status(code).json({
            status: 'success',
            token,
            data: {
            user
            }
        });
    },
    async login(req, res){
        const {email, password} = req.body;

        try {
            const count = await User.count({
                where: {
                    email: email
                }
            });

            if(count <= 0){
                return res.json({
                    success: false,
                    status: 0,
                    message: "E-mail não encontrado! Cadastre-se ou cheque as credenciais de login e tente novamente."
                });
            } else {
                var user = await User.findOne({
                    attributes: ['password', 'id', 'user_type'],
                    where: {
                        email: email
                    }
                });

                const passbd = user.getDataValue("password");
                var match = false;
                //const match = await bcrypt.compare(password, passbd);
                if (password == passbd)
                    match = true;

                const id = user.getDataValue("id");
                if (match){
                    const token = jwt.sign({id}, process.env.SECRET, {
                        expiresIn: "2d"
                    });

                    return res.status(200).json({
                        message: "Login realizado com Sucesso!",
                        data: user,
                        auth: true,
                        token: token
                    });
                } else {
                    return res.status(500).json({
                        auth: false,
                        message: "Senha incorreta!"
                    });
                }
            }
        } catch (error) {
            console.log("Erro: " + error);

            return res.status(400).json({
                success: false,
                message: "Credenciais inválidas!"
            });
        }
    },

    async logout(res){
        return res.status(200).json({
            message: "Logout realizado com Sucesso!",
            auth: false,
            token: null
        });
    },

    async googleLogin(req, res){
        try {
            const client = new OAuth2Client(process.env.CLIENT_ID)

            console.log(client);

            const {token} = req.body;

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID
            });

            const payload = ticket.getPayload();
            const userId = payload['sub'];

            const count = await User.count({
                where: {
                    email: payload.email
                }
            })

            if (count == 1){
                var user = await User.findOne({
                    attributes: ['id', 'user_type'],
                    where: {
                        email: payload.email
                    }
                });
                

                const jwtToken = jwt.sign({userId}, process.env.SECRET, {
                    expiresIn: "2d"
                });
    
                return res.status(200).json({
                    message: "Login realizado com Sucesso!",
                    user: user,
                    token: jwtToken
                });
            }         
        } catch(error){
            console.log(error)
        }
    },

    //sign JWT token for authenticated user
    async signToken(id){
        return jwt.sign({ id }, process.env.SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    },
 
    //create new user
    async registerUser(req, res, next){
        //pass in request data here to create user from user schema
        try {
            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm
        });
        createUserToken(newUser, 201, req, res);
        //if user can't be created, throw an error
        } catch(err) {
            next(err);
        }
    },
    //log user in
    async loginUser(req, res, next){
        const { username, password } = req.body;
            
        //check if email & password exist
        if (!username || !password) {
            return next(new AppError('Please provide a username and password!', 400));
        }
        //check if user & password are correct
        const user = await User.findOne({ username }).select('+password');
        
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect username or password', 401));
        }
        createUserToken(user, 200, req, res);
    },

    async verifyJWT(req, res, next){
        let currentUser;
        if (req.headers['authorization']) {
            const token = req.headers['authorization'];
            const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
            currentUser = await User.findById(decoded.id);
        } else {
            currentUser =  null;
        }
        res.status(200).send({ currentUser });
    },

    async logout(req, res){
        res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
        res.status(200).send('user is logged out');
    },

    async checkUser(req, res, next){
        var token = req.headers['authorization'];
        if (!token)
            return res.status(401).json({ auth: false, message: 'No token provided.' });
        if(typeof token !== 'undefined'){
            
            jwt.verify(token, process.env.SECRET, {algorithms: ['HS256']}, async (err, decoded) => {
                if(typeof decoded !== 'undefined'){
                    console.log(decoded);
                    var user = await User.findOne({
                        where: {
                            id: decoded.userId ? decoded.userId : decoded.id 
                        }
                    }); 
                    res.status(200).send({ user }); 
                } else {
                    return res.status(403);
                }
            })  
        } else {
            return res.status(403);
        }
    },
    
}