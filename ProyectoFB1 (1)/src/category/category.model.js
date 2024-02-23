import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true,
        minlength: [3, 'The descriptions is to short']
    }
})

export default model('category', categorySchema)