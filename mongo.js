
const mongoose = require('mongoose');

if(process.argv.length < 3){
  console.log("PLEASE INSERT PASSWORD WITH THE COMMAND");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rahuldesar:${password}@cluster0.tn7lddt.mongodb.net/phoneApp?retryWrites=true&w=majority`;

const phonebookSchema = new mongoose.Schema({
  name : String,
  number : Number,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if(process.argv.length === 3) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("Phonebook :");

      Phonebook.find({}).then(result => {
        result.forEach(contact => {
          console.log(contact.name, contact.number);
        })
        mongoose.connection.close()
      })
    })
}


if(process.argv.length === 5){
  const newContact = new Phonebook({
    name : process.argv[3],
    number : process.argv[4],
  })
  console.log(newContact);
  mongoose
    .connect(url)
    .then((result) => {
    console.log("Database CONNECTED")
      return newContact.save()
  })
  .then(() =>{
    console.log("Contact Saved");
    mongoose.connection.close();
  })

}