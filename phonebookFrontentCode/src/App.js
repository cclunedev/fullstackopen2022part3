import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationError, setNotificationError] = useState(false)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [newName, setNewName] = useState('')
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const [newNumber, setNewNumber] = useState('')
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  

  const addPerson = (event) => {
    event.preventDefault()

    //Determine if newName is currently in persons
    let personsNames = []
    persons.forEach(persons => personsNames.push(persons.name))
    
    const nameInPersons = personsNames.includes(newName)

    //If name is unique
    if (!nameInPersons) {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personsService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Added ${newName}`)
          setNotificationError(false)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationMessage(`${error.response.data.error}`)
          setNotificationError(true)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })        
    }

    //Otherwise ask to update number
    else {
      if (window.confirm(`${newName} is already added to phonebook, 
            replace the old number with a new one?`)) {
        const existingPerson = persons.find(person => person.name === newName)
        const updatedPerson = {
          name: existingPerson.name,
          number: newNumber,
          id: existingPerson.id
        }
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(response => {           
            setPersons(persons.map(person => 
              person.name !== existingPerson.name ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(`Updated number for ${newName}`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationMessage(
              `${error.response.data.error}`
            )
            setNotificationError(true)
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationError(false)
            }, 5000)
          })

      }
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`))
      personsService
        .deletePerson(person)
        .then(id => {
          setPersons(persons.filter(person => person.id != id))
          setNewName('')
          setNewNumber('')
          })
  }

  const [nameFilter, setNameFilter] = useState('')
  
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const namesToShow = (nameFilter == "") 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().startsWith(nameFilter.toLowerCase()))

  
    return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} notificationError={notificationError}/>
      <h3>Filter</h3>
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange} />

      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      
      <h3>Numbers</h3>
      <Numbers namesToShow={namesToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App