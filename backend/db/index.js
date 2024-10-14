const moongoose = require('mongoose');

async function connect() {
    try {
        await moongoose.connect('mongodb://localhost:27017/crudDB');
        console.log('Connection successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };