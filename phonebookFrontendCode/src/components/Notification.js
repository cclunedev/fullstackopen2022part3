const Notification = ({notificationMessage, notificationError}) => {
    
    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }
    
    const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
    }

    if (notificationMessage === null) {
        return null
    }

    if (notificationError) {
        return(
            <p style={errorStyle}>{notificationMessage}</p>
          )
    }
    else {
        return(
        <p style={notificationStyle}>{notificationMessage}</p>
        )
    }
  }

export default Notification