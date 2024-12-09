const mongoose = require('mongoose')

const categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active",
    }
}, {timestamps: true})

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
