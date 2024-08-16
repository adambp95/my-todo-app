import React, { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import TaskCard from './components/TaskCard/TaskCard'
import Auth from './components/Auth/Auth'
import {useCookies} from 'react-cookie'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email
  const [task, setTask] = useState([])
  const authToken = cookies.jwtToken

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/task/${userEmail}`)
      const json = await response.json()
      setTask(json)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(authToken) {
      getData()}
    }
  , [])
  
  return (
    <div className='app-container'>
      {!authToken && <Auth />}
      {authToken && <><Header user={task[0]?.user_email} getData={getData}/>
      {task.map((item,index) => <TaskCard key={index} task={item} getData={getData}/>)}</>}
    </div>
  )
}

export default App