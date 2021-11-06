const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    adminId: { 
        type: Schema.Types.ObjectId ,
        ref: 'User'
    },
    secretCodehash:  String,
    secretCodesalt: String,
},{
    timestamps: true
});


groupSchema.methods.setCode = (code)=>{
    this.secretCodesalt = crypto.randomBytes(16).toString('hex');

    this.secretCodehash = crypto.pbkdf2Sync(code,this.secretCodesalt,1000,64,'sha512').toString(`hex`);
}


groupSchema.methods.validCode = function(code) { 
    var hash = crypto.pbkdf2Sync(code,  
    this.secretCodesalt, 1000, 64, `sha512`).toString(`hex`); 
    return this.secretCodehash === hash; 
}; 


module.exports = mongoose.model('Group',groupSchema);