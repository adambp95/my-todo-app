import React, { useState } from 'react'
import "./header.css"
import Modal from '../Modal/Modal'
import {useCookies} from 'react-cookie'


const Header = ({getData}) => {

  const [showModal, setShowModal] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const cookiUser = cookies.Email

  const signOut = () => {
    removeCookie('Email')
    removeCookie('jwtToken')
    window.location.reload()
  }

  return (
    <div className='header'>
      <div className="username">
        <span>{cookiUser}</span>
      </div>
      <div className='btn-container'>
        <button className="add-new-btn" onClick={() => setShowModal(true)}>Add New</button>
        <button className="sign-out-btn" onClick={signOut}>Sign Out</button>
      </div>
      {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/>}
    </div>
  )
}

export default Header