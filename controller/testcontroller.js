const express = require('express');
const app = express();
app.test=(req, res) => {
    res.send('Welcome to Edurekas REST API with Node.js Tutorial!!');
 };

module.exports=app;