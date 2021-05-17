// connect db
// check first user 
// if not username = admin:
// random password(Rand)
// user.register(details)
// console.credentials(user, pas)

const mongoose = require('mongoose');
const User = require('./models/user');
const Password = require('secure-random-password');

mongoose.connect('mongodb://localhost:27017/hr1', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async (req,res) => {
    const firstUser = await User.findOne({username : "admin"});
    if (!firstUser){
        const password = Password.randomPassword({ length: 8, characters: [Password.lower, Password.upper, Password.digits] })
        const username = 'admin';
        const user = new User({
            username,
            designation: 'Admin',
            email: 'bigstep@gmail.com',
        });
        const registerdUser = await User.register(user, password);
        // console.log("registerUser", registerdUser)
        console.log(`Credentials=>  Username: ${username} Password ${password}`)
    }
    else{
        console.log("firstUser present", firstUser)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});