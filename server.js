// require express 
const express = require('express')
const { scheduler } = require('timers/promises')
// initialize our app server 
const app = express()
//name port
const PORT = 4999

// middleware (aka. barer between req and res )

//to configure server to receive json information 
app.use(express.json())
// sets homepage to the index.html (will override git request to same page "/")
app.use(express.static('public'))
//if frontend and server are on different ports you will need cors 
app.use(require('cors')())
// run the middleware function on all pages 
app.use(mw)


// function to ask for an authentication key 
function mw(req, res, next) {
    console.log("HIT THE MIDDLEWARE")
    // next means run allow traffic through
    const {id} = req.query
    if (id !== "exampleKey") {
      return  res.sendStatus(403)
    }
    next()
}


// temporary DataBase (deletes on refresh)
const db = []

//scheduler
function cron(ms, fn) {
    async function callback() {
        clearTimeout(timeout)
        await fn()
        timeout = setTimeout(callback, ms)
    }
let timeout = setTimeout(callback, ms )
return () => {}
}

function consoleDB() {
    console.log('DB=', db)
}

cron(1000, consoleDB)

// routes  Common Options:(get post patch put delete)

app.delete('/', (req,res) => {
    console.log(" you have reached the home route: DELETE")
    res.status(200).send('<h1>This is html</h1><p>this is also html</p>')
})



// 
app.post('/api/info', (req,res) =>  {
    const {information} = req.body 
     console.log("the posted massage was", information)
     db.push(information)
     console.log('DB:', db)
    res.status(201).json({"yourMessage":information})

})


app.put('/api', (req,res) =>  {
 // destructuring both words after "?" in the search parameter eg.http://localhost:4999/api/?word=ryan&banana=ripe
 const {word, banana} = req.query
 console.log(word, banana)
 res.sendStatus(200)
})

// dynamic ids ("id and name in this case") go at the bottom so that it can not anciently call a previously named word
app.delete('/delete/:id', (req,res) => {
   

    const {id,} = req.params
    console.log("do you want to delete?",id,)
    res.sendStatus(200)
})



//  tell server to listen for incoming
//  requests at this port. Also name server port used in a console log
app.listen(PORT, () => console.log(`server has started at ${PORT}`))