import mongoose from 'mongoose';

const DbConnection = async () => {
    const conn = await 
        mongoose.connect(process.env.DB_URI, {
            dbName:"PhotoApi",
        })
        .catch(err => {
            console.log(`Db connection error, ${err}`);
        })
    };
    console.log(`Db Connection Succesfull`)


export default DbConnection;