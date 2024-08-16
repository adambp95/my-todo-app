import React, { useState } from 'react'
import "./taskcard.css"
import Modal from '../Modal/Modal'

const TaskCard = ({task, getData}) => {

  const [showModal, setShowModal] = useState(false)

  const deleteItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/task/${task.id}`,{
        method: 'DELETE'
      })
      if( response.status === 200) {
        getData()
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="task-list">
      <div className="task-card">
        <span>{task.title}</span>
        <div className="task-info">
          <span className="priority-dot high"></span>
          <span className="added-date">Added: {task.date.toString().slice(0,10)}</span>
          <span className="edit-icon" onClick={() => setShowModal(true)}>✎</span>
          <button className="delete-btn" onClick={deleteItem}>✖</button>
        </div>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData}/>}
    </div>
  )
}

export default TaskCard