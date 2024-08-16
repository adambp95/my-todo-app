const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

//signup
app.post("/signup", async (req, res) => {
  const { email, password} = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  try {
    const signup = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`, [email,hashedPassword])
    const jwtToken = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

    res.json({email, jwtToken})
  } catch (err) {
    console.log(err);
    if(err) {
      res.json({message: err.detail})
    }
  }
})

//login
app.post("/login", async (req, res) => {
  const { email, password} = req.body
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if(!user.rows.length){
      return res.json({message: 'User does not exist!'})
    }
    const checkPassword = await bcrypt.compare(password,user.rows[0].hashed_password)
    const jwtToken = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
    if(checkPassword) {
      res.json({'email' : user.rows[0].email, jwtToken})
    } else {
      res.json({message: 'Login failed'})
    }
  } catch (err) {
    console.log(err);
  }
})


//get task from database

app.get("/task/:userEmail", async (req,res)=> {
  const {userEmail} = req.params
  
  try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
    res.json(todos.rows)
  } catch (err) {
    console.log(err);
  }
})

//post a new task

app.post('/task', async(req, res) => {
  const { user_email, title, date } = req.body
  const id = uuidv4()
  try {
    const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, date) VALUES($1, $2, $3, $4)`,
      [id, user_email, title, date])
    res.json(newToDo)
  } catch (err) {
    console.error(err)
  }
})

//edit a task

app.put('/task/:id', async (req, res) => {
  const {id} = req.params
  const {user_email, title} = req.body

  try {
    const editTask = await pool.query('UPDATE todos SET user_email = $1, title = $2 WHERE id = $3', [user_email, title, id])
    res.json(editTask)
  } catch (err) {
    console.log(err);
  }
})

//delet a task

app.delete('/task/:id', async (req,res) => {
  const { id } = req.params
  
  try {
    const deleted = await pool.query('DELETE FROM todos WHERE id = $1', [id])
    res.json(deleted)
  } catch (err) {
    console.log(err);
    
  }
})

app.listen(port,()=> {
  console.log(`Server is running on port: ${port}`);
})