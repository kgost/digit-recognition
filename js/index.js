function getCharacterMatrices( inputMatrix ) {
  const colActivation = inputMatrix.cumsum( 0, false, true )
    .flatten()
    .slice( 0, inputMatrix.shape[1] ).dataSync()
  const matrices = []

  for ( let i = 1, j = 0; i < colActivation.length; i++ ) {
    if ( colActivation[i] < 1 ) {
      if ( i !== j + 1 ) {
        matrices.push( tf.split( inputMatrix, [j, i - j, colActivation.length - i], 1 )[1] )
      }

      j = i
    }
  }

  return matrices
}

function normalizeCharacterMatries( inputMatrices ) {
  for ( let i = 0; i < inputMatrices.length; i++ ) {
    if ( inputMatrices[i].shape[1] > 28 ) {
      inputMatrices[i] = inputMatrices[i].slice( [0, 0], [28, 28] )
    } else {
      const padding = [[0, 0], [Math.floor( ( 28 - inputMatrices[i].shape[1] ) / 2 ), Math.ceil( ( 28 - inputMatrices[i].shape[1] ) / 2 )]]
      inputMatrices[i] = tf.pad2d( inputMatrices[i], padding )
    }
  }

  return inputMatrices
}

function seperateCharacters( inputMatrix ) {
  return getCharacterMatrices( centerCharacterMatries( inputMatrix ) )
}

async function run( digits ) {
  const real = []

  for ( let i = 0; i < digits.length; i += 4 ) {
    real.push( ( ( digits[i] + digits[i + 1] + digits[i + 2] ) / 3 ) / 255 )
  }

  const digitsTensor = tf.tensor2d( real, [28, real.length / 28] )
  const splitMatrices = getCharacterMatrices( digitsTensor )
  const normalMatrices = normalizeCharacterMatries( getCharacterMatrices( digitsTensor ) )

  for ( let i = 0; i < normalMatrices.length; i++ ) {
    normalMatrices[i] = normalMatrices[i].expandDims(2)
  }

  const normalTensor = tf.stack( normalMatrices )
  const model = await tf.loadModel( '/digit-recognition/model.json' )

  const output = model.predict( normalTensor )
  const result = output.argMax( 1 ).dataSync()

  $( '#output' ).empty()

  for ( let i = 0; i < normalMatrices.length; i++ ) {
    $( '#output' ).append( '<div class="output"><canvas id="canvas' + i + '"></canvas><p>' + result[i] + '</p></div>' )
    tf.toPixels( normalMatrices[i], document.getElementById( 'canvas' + i ) )
  }
}

$( '#input-canvas' ).mouseup( function( e ) {
  run( tf.fromPixels( this ).flatten().dataSync() )
} )

$( '#input-canvas' ).mouseleave( function( e ) {
  run( tf.fromPixels( this ).flatten().dataSync() )
} )

//$.getJSON( '/digits.json', ( digits ) => {
  //run( digits )
//} )
