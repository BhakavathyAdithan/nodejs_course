let mongoose=require('mongoose');

let bookSchema=mongoose.Schema({

    title:{

        type: String,
        required: true
    },
    author:{

        type: String,
        required: true
    },
    Genre:{

        type: String,
        required: true
    }
});

let Book=module.exports=mongoose.model('Book',bookSchema);