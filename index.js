const express = require('express');
const http = require('http');
const cors = require('cors');

const port = process?.env?.port || 8888;
const address = '127.0.0.1';

const { exec } = require('child_process');

var app = express();
let server = http.Server( app );
app.use( cors() );

app.use('/saveClipboard', async ( request, response, next ) => {
  console.log( request.baseUrl )
  let [ success, result ] = await saveClipBoardToImage();

  if ( success && result.toLowerCase().startsWith('results: ' ) ) {
    let file =  result.replace('Results: ', '').trim();
    response.sendFile( file );
  } else {
    response.send( `${ success ? 'success' : 'fail' } ${ result }` );
  }
});

server.listen( port, address, async () => {
  let address = server.address();
  console.log( `server listening via ${address.family} on ${address.address}:${address.port}` );
  process.send( 'ready' );
} );


function saveClipBoardToImage() {
  return new Promise( async resolve => {

    let scriptName = 'save2cap.ps1';
    let scriptPath = `${ __dirname }/${ scriptName }`;

    exec( scriptPath, {'shell':'powershell.exe'}, ( error, stdout, stderr ) => {
      if ( error ) {
        console.error( error );
        resolve([ false, error ]);
      }
      if ( !!stdout && stdout.toString().length > 0 ) {
        console.log( stdout );
      }
      if ( !!stderr && stderr.toString().length > 0 ) {
        console.log( stderr );
      }
      resolve([ true, `Results: ${ stdout.toString() }` ]);
    });

  });
}