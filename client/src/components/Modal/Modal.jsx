import React, { useState } from 'react'
import {useCookies} from 'react-cookie'
import "./modal.css"

const Modal = ({mode, setShowModal, task, getData}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const selectMode = mode === "edit" ? true : false
  const [input, setInput] = useState({
    user_email: selectMode ? task.user_email : cookies.Email,
    title: selectMode ? task.title : "",
    date: selectMode ? task.date : new Date()
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setInput(prevValue => ({
      ...prevValue,
      [name] : value
    }))

  }

  const postTask = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/task`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      })
      if (response.status === 200) {
        setShowModal(false)
        getData()
      }

    } catch(err) {
      console.error(err)
    }
  }

  const editTask = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/task/${task.id}`,{
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(input)
      })
      if(response.status === 200) {
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.log(err);
      
    }
  }
  

  return (
    <div className='modal-overlay'>
      <div className="modal-content">
        <div className='form-title-container'>
          <h1>{mode} your task!</h1>
          <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input type="text" 
            required
            maxLength={30}
            placeholder='Add a new task!'
            name='title'
            value={input.title}
            onChange={handleChange}
          />
          <button className='modal-add-new-btn' type='submit' onClick={selectMode ? editTask : postTask}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Modal