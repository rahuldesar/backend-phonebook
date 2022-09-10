const express = require('express');
const app = express();
const morgan = require('morgan');

morgan.token('dataJson', function (req, res) { return JSON.stringify(req.body) })


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataJson'));

app.use(express.json());

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];


app.get('/',(request, response) => {
response.send('HELO');
})

app.get('/api/persons', (request, response) => {
response.json(persons);
})

app.get('/info',(request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people</div>
    <div> Request made on : ${new Date} </div>
    `
    );
})

app.get('/api/persons/:id', (request, response) => {
 const id = Number(request.params.id);
 let person = persons.find(person => person.id === id );
 if(person) response.json(person);
 else response.status(404).end(); 
})

app.delete('/api/persons/:id', (request, response) => {
  id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
})



const generateId = () => {
  const maxId = persons.length > 0? Math.max(...persons.map(n => n.id)): 0
  return maxId + 1
}

const isDuplicate = (name) =>{
  return ((persons.map(person => person.name)).includes(name));
}


app.post('/api/persons', (request, response) => {
  const body = request.body;
  // console.log(JSON.stringify(body));
  if (!body.name) {
    return response.status(400).json({ 
      error: 'NAME missing' 
    })
  }
  else if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }
  else if(isDuplicate(body.name)){
    return response.status(400).json({ 
      error: 'name should be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number ,
  }
  persons = persons.concat(person);

  response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
console.log(`Server running on port ${PORT}`);
});

