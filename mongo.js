const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Please enter password')
  process.exit(1)
}


const password = process.argv[2]
const newName = process.argv[3]
const newPhonenumber = process.argv[4]

const url = `mongodb+srv://cclunedev:${password}@cluster0.z34m0u0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {

  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

else{
  const person = new Person({
    name: newName,
    number: newPhonenumber,
  })

  person.save().then(() => {
    console.log(`Added ${newName} number ${newPhonenumber} to phonebook`)
    mongoose.connection.close()
  })
}
