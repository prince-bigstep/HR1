if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
} 

const mongoose = require('mongoose');
const User = require('./models/user');
const Password = require('secure-random-password');
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/hr1';

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const seedDB = async () => {
    await User.deleteMany({});
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
        console.log("registerUser", registerdUser)
        console.log(`Credentials=>  Username: ${username} Password ${password}`)

    }
    else{
        console.log("firstUser present", firstUser)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});