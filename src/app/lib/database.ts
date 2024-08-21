import mongoose from "mongoose";



export default  async function dbConnect(){
    try {
       
       
        
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}