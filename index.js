require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Phonebook = require ('./models/phonebook');

app.use(express.static('build'));

morgan.token('dataJson', function (req, res) { return JSON.stringify(req.body); });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataJson'));
app.use(express.json());

let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
];

app.get('/',(request, response) => {
  response.send('HELO');
});

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(contact => {
    console.log(contact.length);
    response.json(contact);
  });
});

app.get('/info',(request, response) => {
  Phonebook.find({}).then(contactList => {
    let count = contactList.length;
    response.send(
      `<div>Phonebook has info for ${count} people</div>
    <div> Request made on : ${new Date} </div>
    `
    );
  });
});

app.get('/api/persons/:id', (request, response) => {
  Phonebook.findById(request.params.id).then(note => {
    if(note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end();
  })
    .catch(error => next(error));
});

const isDuplicate = (name) => {
  return ((persons.map(person => person.name)).includes(name));
};

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  console.log(JSON.stringify(body) , isDuplicate(body));
  if (!body.name) {
    return response.status(400).json({
      error: 'NAME missing'
    });
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    });
  }
  else if(isDuplicate(body.name)){
    return response.status(400).json({
      error: 'name should be unique'
    });
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number ,
  });
  person.save().then( result =>
    response.json(result))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next ) => {
  const { name, number } = request.body;
  console.log(request.params.id);

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new:true, runValidators: true, context:'query' })
    .then(updatedContact => {
      response.json(updatedContact);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

