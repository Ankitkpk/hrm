const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://teotiasiddhant:%24iddsCompany953@cluster0.iip1gmg.mongodb.net/myDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
