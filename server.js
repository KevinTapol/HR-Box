const express = require('express') // allow use of express
const app = express() //setting a constant to express method for shorthand
const MongoClient = require('mongodb').MongoClient //allows the use of methods with MongoClient to talk to our database
const PORT = 8000 //setting a constant to where to listen on localhost
const mongoose = require('mongoose')
require('dotenv').config() //allows us to look for variables inside of the .env file


// use mongoose to create and connect to the db instead of mongoclient
// then changed CRUD methods becasue they are using mongoclient

// mongoose connection
//const connectDB = async () => {
//    try {
//        const conn = await mongoose.connect(
//            process.env.DB_STRING
//        )
//        console.log(`MongoDB connected: ${conn.connection.host}`)
//    } catch (error) {
//        console.log(err)
//        process.exit(1)
//    }
//}


//Creating the Database
let db, 
    dbConnectionStr = process.env.DB_STRING, 
    dbName = 'human-resources' 

// Connecting to MongoDB
// MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
//     .then(client => { 
//         console.log(`Connected to ${dbName} Database`)
//         db = client.db(dbName)
// })

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => { 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
})

////Creating the Database
//let db, //declare a variable called db but not assigning a value
//    dbConnectionStr = process.env.DB_STRING, // declaring and assigning a variable to the database connection string from the .env file
//    dbName = 'human-resources' // declaring and assinging the name of the collection database to human-resources
//
//// Connecting to MongoDB
//MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB and passing in the connection string. Passing in an additional property to use MongoDB driver's new connection managment engine
//    .then(client => { // waiting for the connection, proceeding if successful and passing in all client information
//        console.log(`Connected to ${dbName} Database`) //log to the console connected to dbName in this case 'human-resources
//        db = client.db(dbName) // assigning a value to the previous declared db variable that contains a db client factory method
//    }) // closing the promise

// Middleware    
app.set('view engine', 'ejs') // sets ejs as the default render method or view engine
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


//app.get('/', async (request, response) => { 
//    try{
//        await db.collection('employees').find().sort({likes: -1}).toArray()
//        response.render('index.ejs', { info: data })
//    } catch (err) {
//        console.log(error)
//    }
//
//})
// async version of GET promise below
app.get('/', async (request, response)=>{
    try {
        const data = await db.collection('employees').find().sort({likes: -1}).toArray()
        response.render('index.ejs', { info: data })
    } catch (error) {
        console.error(error)
    }
})

//app.get('/',(request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
//    // If I was to make this async await I would put async in app.get('/', async (request, response))
//    // Then declare a const human-resourcesInfo = await db.collection('employees').find().sort({likes: -1}).toArray()
//    // then response.render('index.ejs', {info: human-resourcesInfo})
//    db.collection('employees').find().sort({likes: -1}).toArray() // sets a variable and awaits using a promise for ALL items from the employess collection and sorting them by descending order of the ammount of likes
//    .then(data => { // when promise succeeds take the response and assign it as data in an arrow function
//        response.render('index.ejs', { info: data }) // use the middleware ejs to render the data 
//    }) // close the success promise
//    .catch(error => console.error(error)) // if the promise is rejected then log the error in the console
//}) // end of GET

// async version of POST promise below
app.post('/addEmployee', async (request, response) => {
    try {
        const result = await db.collection('employees').insertOne({
            employeeName: request.body.employeeName,
            employeeSuggestion: request.body.employeeSuggestion, 
            likes: 0
        }) 
            console.log(`Employee Suggestion ${request.body.employeeSuggestion} Added`)
            response.redirect('/')
    } catch (error) {
        console.error(error)
    }
})

//// POST method for route addEmployee
//app.post('/addEmployee', (request, response) => { // starts a POST method when the add route is passed in
//    db.collection('employees').insertOne({employeeName: request.body.employeeName, 
//    employeeSuggestion: request.body.employeeSuggestion, likes: 0}) // inserts a new employee suggestion into the employee collection and gives it a likes value by default of 0
//    .then(result => { // if insert is succesfull...
//        console.log(`Employee Suggestion ${request.body.employeeSuggestion} Added`) //console log the success string by suggestion
//        response.redirect('/') // redirect back to the homepage
//    }) // close the success promise
//    .catch(error => console.error(error)) // if the promise is rejected console log the error
//}) // end of POST

// async version of PUT promise below
app.put('/addOneLike', async (request, response) => { 
    try {
        const result = await db.collection('employees').updateOne({
        employeeName: request.body.employeeNameS, 
        employeeSuggestion: request.body.employeeSuggestionS,
        likes: request.body.likesS
        },{ 
            $set: {
                likes:request.body.likesS + 1 
            }
        },{
            sort: {_id: -1},
            upsert: true 
    })
        console.log(`Added One Like to ${request.body.employeeSuggestionS}`) 
        response.json('Like Added') 
    } catch (error) {
        console.error(error)
    }
})

//// PUT method for Likes
//app.put('/addOneLike', (request, response) => { // starts a PUT method when the addOneLike route is passed in
//    db.collection('employees').updateOne({employeeName: request.body.employeeNameS, employeeSuggestion: request.body.employeeSuggestionS,likes: request.body.likesS},{ // look in the db for the employee docmument matching the name of the item passed in from the main.js file that was clicked on
//        $set: {
//            likes:request.body.likesS + 1 // add a like
//        }
//    },{
//        sort: {_id: -1}, // reorder the list by likes id
//        upsert: true // inserts item regardless if it already exists (normally upsert: false is used to prevent insertion if the item does not already exist)
//    })
//    .then(result => { // if promise is successful...
//        console.log(`Added One Like to ${request.body.employeeSuggestionS}`) // console log added like clicked on by suggestion
//        response.json('Like Added') // send a response back to the sender
//    }) // close the success promise
//    .catch(error => console.error(error)) // if the promise fails, console log the error
//}) // end PUT method

// async version of the DELETE promise below
app.delete('/deleteEmployee', async (request, response) => {
    try {
        const result = db.collection('employees').deleteOne({
            employeeName: request.body.employeeNameS, 
            employeeSuggestion: request.body.employeeSuggestionS
        })
        console.log(`Employee Suggestion From Deleted`)
        response.json('Employee Deleted')
    } catch (error) {
        console.error(error)
    }
})

//// Delete method for employee suggestion
//app.delete('/deleteEmployee', (request, response) => { // starts a delete method when the delete route is passed in
//    db.collection('employees').deleteOne({employeeName: request.body.employeeNameS, employeeSuggestion: request.body.employeeSuggestionS}) // look inside the employee collection
//    .then(result => { // if the promise is successful...
//        console.log(`Employee Suggestion From Deleted`) // console log successful deletion by employee name
//        response.json('Employee Deleted') // send a response back to the sender
//    }) // close the success promise
//    .catch(error => console.error(error)) // console log the promise fail error
//}) // end DELETE method

// Setting up the listening PORT
app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on which is either the port from the .env file or the port variable we set in this case localhost8000
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // end the listen method