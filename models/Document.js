const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        trim: true,
    },
    content:{
        type : String,
        required : true,
        trim : true,
    },
    tags:{
        type :[string],
        default : [],
    }
},{
    timestamps : true,
});

documentSchema.index({title : 'text', content : 'text', tags:'text'});

module.exports= mongoose.model('Document', documentSchema);