const context = document.getElementById( 'input-canvas' ).getContext( '2d' )
context.fillRect( 0, 0, context.canvas.width, context.canvas.height )

let paint = false
let clickX = []
let clickY = []
let clickDrag = []

$( '#input-canvas' ).mousedown( function( e ) {
  let mouseX = ( e.pageX - this.offsetLeft ) / 4
  let mouseY = ( e.pageY - this.offsetTop ) / 4

  paint = true
  addClick( mouseX, mouseY )
  redraw()
} )

$( '#input-canvas' ).mousemove( function( e ) {
  let mouseX = ( e.pageX - this.offsetLeft ) / 4
  let mouseY = ( e.pageY - this.offsetTop ) / 4

  if ( paint ) {
    addClick( mouseX, mouseY, true )
    redraw()
  }
} )

$( '#input-canvas' ).mouseup( function( e ) {
  paint = false
} )

$( '#input-canvas' ).mouseleave( function( e ) {
  paint = false
} )

function addClick( x, y, dragging ) {
  clickX.push( x )
  clickY.push( y )
  clickDrag.push( dragging )
}

function redraw() {
  context.fillRect( 0, 0, context.canvas.width, context.canvas.height )

  context.strokeStyle = '#ffffff'
  context.lineJoin = 'round'
  context.lineWidth = 2

  for ( let i = 0; i < clickX.length; i++ ) {
    context.beginPath()

    if ( clickDrag[i] && i ) {
      context.moveTo( clickX[i - 1], clickY[i - 1] )
    } else {
      context.moveTo( clickX[i] - 1, clickY[i] )
    }

    context.lineTo( clickX[i], clickY[i] )
    context.closePath()
    context.stroke()
  }
}
