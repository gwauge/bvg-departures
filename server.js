require('dotenv').config(); // load environment variables from .env file

//import modules
const app = require('./src/app');

const port = process.env.PORT || 3000; // select port
app.listen(port, () => console.log(`running on port ${port}`)); // start the server