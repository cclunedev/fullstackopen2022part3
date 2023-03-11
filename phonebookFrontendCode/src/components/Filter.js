const Filter = ({nameFilter, handleNameFilterChange}) => {
    return(
      <div>
        <form>
          filter shown with: 
          <input value={nameFilter}
          onChange={handleNameFilterChange} />
        </form>
      </div>
    )
  }

export default Filter