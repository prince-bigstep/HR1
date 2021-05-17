// connect db
// check first user 
// if not username = admin:
// random password(Rand)
// user.register(details)
// console.credentials(user, pas)
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
} 

const mongoose = require('mongoose');
const User = require('./models/user');
const Password = require('secure-random-password');
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/hr1';


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const secret = process.env.SECRET || 'thisshouldbebettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const seedDB = async () => {
    const firstUser = await User.findOne({username : "admin"});
    if (!firstUser){
        const password = Password.randomPassword({ length: 8, characters: [Password.lower, Password.upper, Password.digits] })
        const username = 'admin';
        const user = new User({
            username,
            designation: 'Admin',
            email: 'bigstep@gmail.com',
        });
        try{
        const registerdUser = await User.register(user, password);
        }
        catch (e){
            console.log(e)
        }
        console.log(`Credentials=>  Username: ${username} Password ${password}`)
        // console.log("registerUser", registerdUser)

    }
    else{
        console.log("firstUser present", firstUser)
    }
}

seedDB();
// seedDB().then(() => {
//     console.log("comming")
//     db.close();
//     console.log("comming")
// }).catch(e => console.log(e));