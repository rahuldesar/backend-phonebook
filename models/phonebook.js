const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.log('ERROR CONNECTING TO MONGODB', error));


const phonebookSchema = new mongoose.Schema({
  name : {
    type: String,
    minLength :3,
    required : true,
  },
  number : {
    type: String,
    minLength:8,
    required:true,
    validate: {
      validator: function(v) {
        if(/^\d{2}-\d{6,}$/.test(v) ||
          /^\d{3}-\d{5,}$/.test(v) ||
          /^\d{8,}$/.test(v)){
          return true;
        } else {
          return false;
        }
      },
    }
  }

});

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Phonebook', phonebookSchema);

