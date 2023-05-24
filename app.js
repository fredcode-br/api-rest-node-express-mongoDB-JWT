require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models 
const user = require('./models/User');
const User = require('./models/User');

const app = express();

// Config JSON response
app.use(express.json());

// Open Route - Public
app.get('/', (req, res) => { 
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
});

app.post('/auth/register', async (req, res) => {

    const { name, email, password, confirmpassword } = req.body;

    // Validations
    if (!name) {
        res.status(422).json({ msg: 'O nome é obrigatório!' });
    };
    if (!email) {
        res.status(422).json({ msg: 'O email é obrigatório!' });
    };
    if (!password) {
        res.status(422).json({ msg: 'A senha é obrigatória!' });
    };

    if(password !== confirmpassword){
        res.status(422).json({ msg: 'As senhas não conferem!' });
    };

    // Check if user exist 
    const userExist = await User.findOne({ email: email });
    if(userExist){
        res.status(422).json({ msg: 'Por favor utilize outro email!' });
    }

    // Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res
        .status(201)
        .json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res
        .status(500)
        .json({ msg: error }); //nao é bom imprimir o erro do servidor
    };
});

app.post('/auth/login', async (req, res) => {

    const {email, password } = req.body;

    // Validations
    if (!email) {
        res.status(422).json({ msg: 'O email é obrigatório!' });
    };
    if (!password) {
        res.status(422).json({ msg: 'A senha é obrigatória!' });
    };

    // Check if user exist 
    const user = await User.findOne({ email: email });
    if(!user){
        res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    // Check password
    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        return res.status(422).json({ msg: 'Senha inválida!' });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({
            id: user._id
        }, 
        secret,
        );

        res
        .status(201)
        .json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res
        .status(500)
        .json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    };
});


// Credencials
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@api-rest-jwt-cluster.gt3vu8n.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => {
    console.log('Conectamos ao MongoDB');
    app.listen(3000);
})
.catch((err) => console.log(err));

