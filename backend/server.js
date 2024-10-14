const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersController = require('./controllers/authController');
const itemsController = require('./controllers/itemsController');

const app = express();
const PORT = 4001;

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
db.connect();

app.use('/api', usersController); 
app.use('/api', itemsController); 

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
