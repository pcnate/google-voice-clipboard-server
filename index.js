const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const homedir = require( 'os' ).homedir();

const port = process?.env?.port || 8888;
const address = process?.env?.address || '127.0.0.1';
const filePath = ( process?.env?.outputfile || "%USERPROFILE%\\Desktop\\capture.png" ).replace('%USERPROFILE%', homedir);

const { exec } = require('child_process');

var app = express();
let server = http.Server( app );
app.use( cors() );

app.use('/saveClipboard', async ( request, response, next ) => {
  console.log( request.baseUrl )
  let [ success, result, file ] = await saveClipBoardToImage();

  if ( success && file ) {

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

    const command = `powershell.exe "${ scriptPath }" "${ filePath }"`;
    console.info( 'Executing', command );
    exec( command, ( error, stdout, stderr ) => {
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


      let filePath = stdout.toString().toLowerCase().startsWith('c:') ? stdout.toString().trim() : false;
      resolve([ true, `Results: ${ stdout.toString() }`, filePath ]);
    });

  });
}