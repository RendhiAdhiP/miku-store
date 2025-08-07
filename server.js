const express = require('express')
const morgan = require('morgan')
const routeApi = require('./routes/api')
const path = require('path')

const app = express()
const port = 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', routeApi)


app.listen(port, () => {
    console.log(`Server run at port ${port}`)
})
