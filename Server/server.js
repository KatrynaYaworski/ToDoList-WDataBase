require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env

const { seed, getList, addTask, deleteTask, isCompleteToggle } = require('./controller.js')

app.use(express.json())
app.use(cors())

app.use(express.static(`public`))

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

app.get('/js',(req,res) => {
    res.sendFile(path.join(__dirname,'../public/toDoList.js'))
})

app.get('/css',(req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.css'))
})

app.post('/list', seed)

app.get('/list', getList)
app.post('/list',addTask)
app.put('/list/:id',isCompleteToggle)
app.delete('/list',deleteTask)


app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))