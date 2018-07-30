const express = require( 'express' ),
  app = express()

app.use( express.static( 'js' ) )

app.get( '/', ( req, res ) => {
  res.sendFile( __dirname + '/views/index.html' )
} )

app.listen( 3000, () => {
  console.log( 'Started Server' )
} )
