require('dotenv').config()
const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')

morgan.token('reqBody', function getBody (request) {
  if (JSON.stringify(request.body) !== '{}') {
    return JSON.stringify(request.body)
  }
  else {
    return null
  }
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/api/persons', (_request, response, next) => {
  Person.find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: 'name required'
    })
  }

  if (!request.body.number) {
    return response.status(400).json({
      error: 'number required'
    })
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save()
    .then(() => {
      console.log('person saved!')
      response.json(person)
    })
    .catch(error => next(error))


})


app.put('/api/persons/:id', (request, response, next) => {
  const person = new Person({
    _id: request.params.id,
    name: request.body.name,
    number: request.body.number,
  })

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  const d = new Date()
  Person.countDocuments()
    .then(count =>
      response.send(`<p>Phonebook has info for ${count} people </p><p>${d}</p>`)
    )
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})