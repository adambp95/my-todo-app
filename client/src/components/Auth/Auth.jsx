import React, {  useState } from 'react'
import {useCookies} from 'react-cookie'
import "./auth.css"

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(false)
  const [error,setError] =useState(null)
  const [email, setEamil] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const toggleModalType = () => setIsLogin(!isLogin);

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if(!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${endpoint}`, {
      method: 'POST',
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({email, password})
    })
    const result = await response.json()
    if(result.message){
      setError(result.message)
    } else {
      setCookie('Email', result.email)
      setCookie('jwtToken', result.jwtToken)
      window.location.reload()
    }
    
  }

  return (
      <div className="modal-overlay">
          <div className="modal">
              <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
              <form>
                  <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name='email' required onChange={(e) => {setEamil(e.target.value)}}/>
                  </div>
                  <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" id="password" name='password' onChange={(e) => {setPassword(e.target.value)}} required />
                  </div>
                  {!isLogin && (
                      <div className="form-group">
                          <label htmlFor="passwordConfirm">Confirm Password</label>
                          <input type="password" id="passwordConfirm" onChange={(e) => {setConfirmPassword(e.target.value)}} required />
                      </div>
                  )}
                  <p>{error && <p>{error}</p>}</p>
                  <button type="submit" className="submit-btn" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}>
                      {isLogin ? 'Login' : 'Sign Up'}
                  </button>
              </form>
              <p>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <span onClick={toggleModalType} className="switch-link">
                      {isLogin ? ' Sign Up' : ' Login'}
                  </span>
              </p>
          </div>
      </div>
  );
};


export default Auth