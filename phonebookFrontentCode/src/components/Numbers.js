const Numbers = ({namesToShow, deletePerson}) => {
    return(
      <div>
      {namesToShow.map(person =>
      <Person key={person.id} person={person} deletePerson={() => deletePerson(person)} />)}
      </div>
    )
  }
const Person = ({person, deletePerson}) => {
    return(
        <div key={person.id}>
          {person.name}     {person.number}
          <button onClick={deletePerson}>Delete</button>
        </div>
    )
}

export default Numbers