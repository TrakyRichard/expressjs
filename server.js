require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnexion = require('./utilities/dbConnect')
const cookieParser = require('cookie-parser')
const fetchUser = require('./utilities/fetchUser')
const axios = require('axios')
const authRoutes = require('./routes/auth')
const slotsRoutes = require('./routes/slots')
const adminRoutes = require('./routes/admin')
const evaluationRoutes = require('./routes/evaluation')
const usersRoutes = require('./routes/users')

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use(cors())
// process.on("uncaughtException", function (error) {
//   console.log(error.stack);
// });
app.get('/user/:email', async (req, res) => {
  const { email } = req.params
  const user = await fetchUser(email)
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.send(user)
})

app.use('/users', usersRoutes)
app.use('/slots', slotsRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/evaluation', evaluationRoutes)
dbConnexion(process.env.PISCINE_URL)
app.get('/', (req, res) => {
  res.send('Yo')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
})
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`)
})
