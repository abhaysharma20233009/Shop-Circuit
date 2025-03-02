
let server = require('http').createServer();


const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });

require('dotenv').config();
console.log("Database URL:", process.env.DATABASE);


const DB = process.env.DATABASE.replace(
    '<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
    console.log('DB connection successful!');
});


const Port = process.env.PORT || 3000;
server.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});
