const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

module.exports = {
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
                        expiresIn: 300
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

    async verifyJWT(req, res, next){
        var token = req.headers['authorization'];
        console.log(token)
        if (!token)
            return res.status(401).json({ auth: false, message: 'No token provided.' });
        if(typeof token !== 'undefined'){
            const bearer = token.split(' ');
            token = bearer[1];
            
            jwt.verify(token, process.env.SECRET, {algorithms: ['HS256']}, (err, decoded) => {
                if(typeof decoded !== 'undefined'){
                  next()  
                } else {
                    return res.status(403);
                }
            })  
        } else {
            return res.status(403);
        }
    },
    
}