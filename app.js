const express = require('express');

const port = process.env.port || 4000;
const app = express();
app.use(express.static('public'));
app.listen(port);