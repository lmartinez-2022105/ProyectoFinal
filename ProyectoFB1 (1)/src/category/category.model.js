import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required: true,
        minlength: [3, 'The descriptions is to short']
    }
},
    {versionKey: false}
)

export default model('Category', categorySchema)