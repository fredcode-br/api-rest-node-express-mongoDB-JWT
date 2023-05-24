const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});


// Register User
// app.post('/auth/register', async (req, res) => {

//     const { name, email, password, confirmpassword } = req.body;

//     // Validations
//     if (!name) {
//         res.status(422).json({ msg: 'O nome é obrigatório!' });
//     };
//     if (!email) {
//         res.status(422).json({ msg: 'O nome é obrigatório!' });
//     };
//     if (!password) {
//         res.status(422).json({ msg: 'O nome é obrigatório!' });
//     };
// });


module.exports = User;