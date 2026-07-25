// server.js
import { createServer } from 'node:http';
import { createGzip, createDeflate } from 'node:zlib';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { vmapp } from './app.js';


const JsonLogger = require("./logger");
const logger = new JsonLogger("serverlog.json");

logger.appendLog("INFO", "Server started");
logger.appendLog("WARNING", "High memory usage", {
    memoryUsed: "850MB"
});
logger.appendLog("ERROR", "Database connection failed", {
    host: "127.0.0.1",
    port: 3306
});


//import OAuth2Client from 'google-auth-library';
import * as googleAuth from 'google-auth-library';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');

const PORT = process.env.PORT || 3000;

// Common MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
};

const authorisedUsers = [ 'stonesix649@gmail.com', 'samueldeadmanbusiness@gmail.com' ] ;



//const {InstancesClient} = require('@google-cloud/compute').v1;
import "@google-cloud/compute";
import {InstancesClient} from "@google-cloud/compute";


function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function shouldCompress(acceptEncoding) {
  return acceptEncoding?.includes('gzip') || acceptEncoding?.includes('deflate');
}

// Instantiates app.js
const app = new vmapp();
//const logging = new vmlogging();


// Instantiates a client
const computeClient = new InstancesClient();
const instance = '5493437872450935780'
const project = 'armaserverhosting'
const zone = 'us-central1-a'
const VMInstants = [instance, project, zone]; //three string array
//Instatiate a client with enviroment

  const eVcomputeClient = process.env.COMPUTE_CLIENT_ID || 'test1';
  console.log(`Enviranemt vaible set Compute client ID as ${eVcomputeClient} `);


/*
async function callStart() {
  // Construct request
  const request = {
    instance,
    project,
    zone,
  };

  // Run request
  const response = await computeClient.start(request);
  console.log(response);
}

async function callStop() {
    // Construct request
      const request = {
      instance,
      project,
      zone,
    };

    // Run request
    const response = await computeClient.stop(request);
    console.log(response);
  }


    async function callSuspend() {
    // Construct request
    const request = {
      instance,
      project,
      zone,
    };

    // Run request
    const response = await computeClient.suspend(request);
    console.log(response);
  }
  */


var action = false;

const server = createServer((req, res) => {
  const method = req.method;
  const url = req.url;


  // routing

  if (req.method == 'POST') {

    //##########################################
    // Generic CSRF security

    const secFetchSite = validateSecFetchSite(req,res);
    if (secFetchSite == false){
      return;
    }

    //##########################################    
    // Session-less Action ******

    if (req.url == '/user-single-action') {
      postUserAction(req,res);
      return ;
    }

    if (req.url == '/VMstart') {
      //start gcp vm mashine
      console.log(`VM Start command recived`);
      
      //asyncPostUserActionCheck(req,res,action).then((result) => {
      app.vmStart(req,res);
      console.log(res);
      return;
      };

      if (req.url == '/VMstop') {
      //stop gcp vm mashine
      console.log(`VM stop command recived`);

      //callStop();
      app.vmStop(req,res);
      console.log(res);
      return;
    }

    if (req.url == '/VMsuspend') {
      //suspend gcp vm mashine
      console.log(`VM susp command recived`);

      //callSuspend();
      app.vmSuspend(req,res);
      console.log(res);
      return;
    }

    if (req.url == '/VMstatus') {
      //suspend gcp vm mashine
      console.log(`VM get current status command recived`);

      //callSuspend();
      app.vmStatus(req,res);
      console.log(res);
      return;
    }




      //console.log("ACTION :" + action);
      
      if (action){
        //callStart();
        res.statusCode = 200;
        res.end("POST USER AUTHORISED + ACTION COMPLETED")
      } else {
        res.statusCode = 403;
        res.end("POST USER ACTION BLOCKED");
      }
        return;
      }



    

    if (url === '/api/echo') {    
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: data, echoedAt: new Date().toISOString() }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
      return;
    }
    

  //} 
    else if (req.method != 'GET'){
    res.statusCode = 501;
    res.end(`Method ${req.method} not implemented.`);
    return;
  }


  if (method === 'GET') {
    if (url === '/' || url === '/index.html') {
      const filePath = join(PUBLIC_DIR, 'index.html');
      serveFile(res, req, filePath);
      return;
    }
    
    if (url === '/about') {
      const filePath = join(PUBLIC_DIR, 'about.html');
      serveFile(res, req, filePath);
      return;
    }

    if (url === '/api/hello') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Hello from native Node.js server!',
        time: new Date().toISOString(),
        node: process.version
      }));
      return;
    }
  }

  //https://docs.cloud.google.com/compute/docs/reference/rest/v1/instances/get#http-request
  
  // Static files (everything else)

  const normalizedPath = normalize(url);
  if (normalizedPath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const filePath = join(PUBLIC_DIR, normalizedPath === '/' ? 'index.html' : normalizedPath);
  serveFile(res, req, filePath);
  }
);

function serveFile(res, req, filePath) {
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Not Found</h1><p>The page you requested could not be found.</p>');
    return;
  }

  const stat = statSync(filePath);
  if (stat.isDirectory()) {
    res.writeHead(301, { Location: `${req.url}/` });
    res.end();
    return;
  }

  const mime = getMimeType(filePath);
  const acceptEncoding = req.headers['accept-encoding'];
  const canCompress = shouldCompress(acceptEncoding);

  const headers = {
    'Content-Type': mime,
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };

  if (canCompress) {
    if (acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);

      createReadStream(filePath)
        .pipe(createGzip())
        .pipe(res);
      return;
    }
    
  }

  // No compression
  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
}

// **** Generic CSRF Protection


function validateSecFetchSite(req,res) {
  console.log('validateSecFetchSite');
  const secFetchSite = req.headers['sec-fetch-site'];
  console.log("sec-fetch-site:" + secFetchSite);
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    console.log("Sec-Fetch-Site allowed:" + secFetchSite);
    return true;
    // Update state
  } else {
    console.log("Sec-Fetch-Site denied"+secFetchSite);
    res.statusCode = 403;
    res.end("Forbidden due to Sec-Fetch-Site header:"+secFetchSite );
    return false;
    // Don't update state
  }
}

// **** SINGLE PAGE NON SESSION *******************


function postUserAction(req,res){
  console.log('postUserAction'); 
  var contentLength;
  try {
    contentLength = req.headers['content-length'];
  } catch (error) {
    console.log(error);
  }
  console.log('Content-Length: ' + contentLength); 

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  var requestDic = {};

  req.on('end', () => {
    console.log("POST USER ACTION BODY:" + body);

    // SPLIT BODY TO EXTRACT CREDENTIALS
    var items = body.split('&');
    console.log("Count of items in body:",items.length);
    // if (items.length != 2){
    //   console.error("COUNT IS NOT 2:"+body);
    //}
    items.forEach(element => {
      var elements = element.split('=');
      requestDic[elements[0]] = elements[1];
    });

    parseValidateCredential(requestDic).then(( objReturn ) => {
      console.log(JSON.stringify(objReturn)) ;
      var id_valid2 = objReturn.state;
      var id_message2 = objReturn.id;

      if (id_valid2){ 
        console.log("LOGIN AS:"+id_message2.email);
      }

      var isAuth = authoriseUser(id_message2);
      if (isAuth){
        console.log("Token is authorised.")
        res.statusCode = 200;
        res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email);
      }
      else {
        res.statusCode = 403;
        res.end("POST USER ACTION BLOCKED:"+id_message2.email);
      }


    }); // end-then


  });
}

function postUserActionCheck(req,res,action){
  console.log('postUserActionCheck called'); 
  var contentLength;
  try {
    contentLength = req.headers['content-length'];
  } catch (error) {
    console.log(error);
  }
  console.log('Content-Length: ' + contentLength); 

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  var requestDic = {};

  req.on('end', () => {
    console.log("POST USER ACTION BODY:" + body);

    // SPLIT BODY TO EXTRACT CREDENTIALS
    var items = body.split('&');
    console.log("Count of items in body:",items.length);
    // if (items.length != 2){
    //   console.error("COUNT IS NOT 2:"+body);
    //}
    items.forEach(element => {
      var elements = element.split('=');
      requestDic[elements[0]] = elements[1];
    });



    //need this to wait and complete before i do my true/false check wrap in fucntion in async & wait ???? 01/05/26 17:45
    parseValidateCredential(requestDic).then(( objReturn ) => {
      console.log(JSON.stringify(objReturn)) ;
      var id_valid2 = objReturn.state;
      var id_message2 = objReturn.id;

      if (id_valid2){ 
        console.log("LOGIN AS:"+id_message2.email);``
      }

      var isAuth = authoriseUser(id_message2);
      if (isAuth){
        console.log("Token is authorised.")
        //res.statusCode = 200;
        action = true;
        //res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email);
      }
      else {
        //res.statusCode = 403;
        action = false;
        //res.end("POST USER ACTION BLOCKED:"+id_message2.email);
      }


    }); // end-then


  });
}


/*
//Async version of identity check
async function asyncPostUserActionCheck(req,res,action){
  console.log('postUserActionCheck called'); 
  var contentLength;
  try {
    contentLength = req.headers['content-length'];
  } catch (error) {
    console.log(error);
  }
  console.log('Content-Length: ' + contentLength); 

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  var requestDic = {};

  req.on('end', () => {
    console.log("POST USER ACTION BODY:" + body);

    // SPLIT BODY TO EXTRACT CREDENTIALS
    var items = body.split('&');
    console.log("Count of items in body:",items.length);
    // if (items.length != 2){
    //   console.error("COUNT IS NOT 2:"+body);
    //}
    items.forEach(element => {
      var elements = element.split('=');
      requestDic[elements[0]] = elements[1];
    });

    //objReturn

    //need this to wait and complete before i do my true/false check wrap in fucntion in async & wait ???? 01/05/26 17:45
    var objReturn = await parseValidateCredential(requestDic);
    // Code after each await expression can be thought of as existing in a .then callback
      console.log(JSON.stringify(objReturn)) ;
      var id_valid2 = objReturn.state;
      var id_message2 = objReturn.id;

      if (id_valid2){ 
        console.log("LOGIN AS:"+id_message2.email);
      }

      var isAuth = authoriseUser(id_message2);
      if (isAuth){
        console.log("Token is authorised.")
        //res.statusCode = 200;
        action = true;
        //res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email);
      }
      else {
        //res.statusCode = 403;
        action = false;
        //res.end("POST USER ACTION BLOCKED:"+id_message2.email);
      }


    
  });
}
*/




function authoriseUser(token){
  console.log('authoriseUser');

  var unixtime = Math.floor(new Date().getTime() / 1000);

  console.log("Now:"+unixtime+" Expire:"+token.exp+" Date:"+new Date(token.exp*1000).toString());

  if (token.exp < unixtime ){
    console.log("Token has expired:"+token.exp);
    return false;
  }
  
  if (token.iat > unixtime ){
    console.log("Token time has gone backwards:"+token.iat);
    return false;
  }

  const found = authorisedUsers.indexOf(token.email);
  

  if (found > -1 ) {
    console.log("Authorised user of email:" + token.email + " found in authorised list.");
    return true;
  }
  else {
    return false;
  }
}


getVMStatus (logMessage,res)
  {
                //this means the message is from a command to start, stop or suspend request
                if (logMessage.includes("'start'")){
                  res = res + "Operation 'start' sent to Server"
                  logger.appendLog("INFO", "Server started");

                }  if (logMessage.includes("'stop'")){
                  res = res + "Operation 'stop' sent to Server"
                  logger.appendLog("INFO", "Server stopped");

                }  if (logMessage.includes("'suspend'")){
                  res = res + "Operation 'suspend' sent to Server"
                  logger.appendLog("INFO", "Server suspended");

                } if (logMessage.includes("'RUNNING'")){
                  res = res + "current server status ='RUNNING'";
                  logger.appendLog("INFO", "Server is running");

                }  if (logMessage.includes("'TERMINATED'")){
                  res = res + "current server status ='TERMINATED'";
                  logger.appendLog("INFO", "Server is running");

                }  if (logMessage.includes("'SUSPENDED'") || logMessage.includes("SUSPENDING")){
                  res = res + "current server status ='SUSPENDED'";
                  logger.appendLog("INFO", "Server is running");

                }
                return res;
    }


/*
async function parseValidateCredential(reqestDic){
  return new Promise((resolve, reject) => {
  console.log('parseValidateCredential');

  const credential = reqestDic["credential"];
  console.log("credential:" + credential);  

  try {
    const client = new googleAuth.OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience : '844267666089-nqhi6en1vpdks85ufso3o6m32hoobn9r.apps.googleusercontent.com'
    });
    // Code after each await expression can be thought of as existing in a .then callback
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log('sub:' + userid);

    return { state: true, id: payload } ;
  } 
  catch (err) {
    console.error(err);
    return { state: false, id: err } ;
  }

  console.log("NEVER CALLED");
  }
)};
*/

// END **** OF GOOGLE IDNETITY AUTH *******************

server.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`Static files from → ${PUBLIC_DIR}`);
});
