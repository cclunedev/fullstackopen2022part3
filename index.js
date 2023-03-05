const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

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
    ]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ 
            error: 'name required' 
        })
    }

    if (!person.number) {
        return response.status(400).json({ 
            error: 'number required' 
        })
    }

    const matchingPerson = persons.find(existingPerson => existingPerson.name === person.name)

    if (matchingPerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    else{
        const id = Math.floor(Math.random() * 10000) + 5
        person.id = id
        persons = persons.concat(person)
        response.json(person)
    }
})

app.get('/info', (request, response) => {
    const d = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people </p><p>${d}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})