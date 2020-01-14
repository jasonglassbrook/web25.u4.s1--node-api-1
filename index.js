/// tools ///
const _ = require ('lodash/fp')
const express = require ('express')

/// database ///
const db = {
  users : require ('./data/db.js'),
}

/// server ///
const port = 5555
const server = express ()
server.use (express.json ())

/// routes ///
const { routes } = require ('./routes')
console.log (routes)

/***************************************
  validate data
***************************************/

const hasValidUserBio =
  _.conforms ({ 'bio' : _.isString })

const hasValidUserName =
  _.conforms ({ 'name' : _.isString })

const isValidUser =
  _.overEvery ([ hasValidUserBio, hasValidUserName ])

/***************************************
  define requests
***************************************/

/*******************
  .root
*******************/

/// get ///
server.get (routes.root, (ri, ro) => {
  console.log (`>>> ${routes.root} .GET <<<`)
  ro
    .status (200)
    .json ({
      message : 'hello world',
    })
})

/*******************
  .api.root
*******************/

/// get ///
server.get (routes.api.root, (ri, ro) => {
  console.log (`>>> ${routes.api.root} .GET <<<`)
  ro
    .status (200)
    .json ({
      message : 'hello world',
    })
})

/*******************
  .api.users.all
*******************/

/// get ///
server.get (routes.api.users.all (), (ri, ro) => {
  console.log (`>>> ${routes.api.users.all ()} .GET <<<`)
  db.users
    .find ()
    .then ((users) => {
      console.log (`>>> ${routes.api.users.all ()} .GET .find .then <<<`)
      ro
        .status (200)
        .json (users)
    })
    .catch ((error) => {
      console.log (`>>> ${routes.api.users.all ()} .GET .find .catch <<<`)
      ro
        .status (500)
        .json ({
          error : error,
        })
    })
})

/// post ///
server.post (routes.api.users.all (), (ri, ro) => {
  console.log (`>>> ${routes.api.users.all ()} .POST <<<`)

  const user = ri.body
  console.log (user)

  if (isValidUser (user)) {
    console.log (`>>> ${routes.api.users.all ()} .POST .insert <<<`)
    db.users
      .insert (user)
      .then ((users) => {
        console.log (`>>> ${routes.api.users.all ()} .POST .insert .then <<<`)
        ro
          .status (201)
          .json (users)
      })
      .catch ((error) => {
        console.log (`>>> ${routes.api.users.all ()} .POST .insert .catch <<<`)
        ro
          .status (500)
          .json ({
            error : error,
          })
      })
  }
  else {
    console.log (`>>> ${routes.api.users.all ()} .POST no-valid-user <<<`)
    ro
      .status (400)
      .json ({
        error : 'user must conform to { bio : string, name : string }'
      })
  }
})

/*******************
  .api.users.one
*******************/

/***************************************
  run server
***************************************/

server.listen (port, () => {
  console.log (`it's alive!`)
  console.log (`\n>>> listening on port ${port} <<<\n`)
})
