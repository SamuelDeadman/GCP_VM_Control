
"use strict";

import { webSecurity } from './security.js';

const sessionMgr = new webSecurity();

//const {InstancesClient} = require('@google-cloud/compute').v1;
import "@google-cloud/compute";
import {InstancesClient} from "@google-cloud/compute";

// Instantiates a client
const computeClient = new InstancesClient();
const instance = '1234'
const project = 'projectname'
const zone = 'gcp region'



export class vmapp {
    vmStart(req,res){
        console.log('vmapp.vmStarting called'); 
        const contentLength = req.headers['content-length'];
        console.log('Content-Length: ' + contentLength); 

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        var requestDic = {};

        req.on('end', async () => {
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

            var id_message2 = "EMPTY";
            var id_valid2 = false;

            const credential = requestDic["credential"];
            console.log("credential:" + credential);  
            
            var objReturn = { } ;

            objReturn = await webSecurity.parseValidateCredential2(requestDic);
            
            console.log(JSON.stringify(objReturn)) ;
            id_valid2 = objReturn.state;
            id_message2 = objReturn.id;

            if (id_valid2){ 
                console.log("LOGIN AS:"+id_message2.email);
            }

            var isAuthorisedTime = false;
            var isAuthorisedEmail = false;
            var isAuthorised = false;

            if (id_valid2){
                isAuthorisedTime = sessionMgr.authoriseTokenTime(id_message2);
            }

            if (id_valid2){
                isAuthorisedEmail = sessionMgr.authoriseUserEmail(id_message2);
            }

            isAuthorised = isAuthorisedTime.isValid && isAuthorisedEmail.isValid;

            if (isAuthorised){
                const request = {
                    instance,
                    project,
                    zone,
                };
                // Run request
                const response = await computeClient.start(request);
                console.log('vmapp.vmStarting start command sent and recived responce'); 
                console.log(response);
                //console.log(response);
                console.log("Token is authorised.")
                res.statusCode = 200;
                res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email+"|| STATUS: "+response.statusCode);
            }
            else {
                res.statusCode = 403;
                res.end("POST USER ACTION BLOCKED:"+id_message2.email);
            }


        });
    }

    vmStop(req,res){
        console.log('vmapp.vmStopping called'); 
        const contentLength = req.headers['content-length'];
        console.log('Content-Length: ' + contentLength); 

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        var requestDic = {};

        req.on('end', async () => {
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

            var id_message2 = "EMPTY";
            var id_valid2 = false;

            const credential = requestDic["credential"];
            console.log("credential:" + credential);  
            
            var objReturn = { } ;

            objReturn = await webSecurity.parseValidateCredential2(requestDic);
            
            console.log(JSON.stringify(objReturn)) ;
            id_valid2 = objReturn.state;
            id_message2 = objReturn.id;

            if (id_valid2){ 
                console.log("LOGIN AS:"+id_message2.email);
            }

            var isAuthorisedTime = false;
            var isAuthorisedEmail = false;
            var isAuthorised = false;

            if (id_valid2){
                isAuthorisedTime = sessionMgr.authoriseTokenTime(id_message2);
            }

            if (id_valid2){
                isAuthorisedEmail = sessionMgr.authoriseUserEmail(id_message2);
            }

            isAuthorised = isAuthorisedTime.isValid && isAuthorisedEmail.isValid;

            if (isAuthorised){
                const request = {
                    instance,
                    project,
                    zone,
                };
                // Run request
                const response = await computeClient.stop(request);
                console.log(response);
                //console.log(response);
                console.log("Token is authorised.")
                res.statusCode = 200;
                res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email+"|| STATUS: "+response.statusCode);
            }
            else {
                res.statusCode = 403;
                res.end("POST USER ACTION BLOCKED:"+id_message2.email);
            }


        });
    }

    vmSuspend(req,res){
        console.log('vmapp.vmsuspend called'); 
        const contentLength = req.headers['content-length'];
        console.log('Content-Length: ' + contentLength); 

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        var requestDic = {};

        req.on('end', async () => {
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

            var id_message2 = "EMPTY";
            var id_valid2 = false;

            const credential = requestDic["credential"];
            console.log("credential:" + credential);  
            
            var objReturn = { } ;

            objReturn = await webSecurity.parseValidateCredential2(requestDic);
            
            console.log(JSON.stringify(objReturn)) ;
            id_valid2 = objReturn.state;
            id_message2 = objReturn.id;

            if (id_valid2){ 
                console.log("LOGIN AS:"+id_message2.email);
            }

            var isAuthorisedTime = false;
            var isAuthorisedEmail = false;
            var isAuthorised = false;

            if (id_valid2){
                isAuthorisedTime = sessionMgr.authoriseTokenTime(id_message2);
            }

            if (id_valid2){
                isAuthorisedEmail = sessionMgr.authoriseUserEmail(id_message2);
            }

            isAuthorised = isAuthorisedTime.isValid && isAuthorisedEmail.isValid;

            if (isAuthorised){
                const request = {
                    instance,
                    project,
                    zone,
                };
                // Run request
                const response = await computeClient.suspend(request);
                console.log(response);
                //console.log(response);
                console.log("Token is authorised.")
                res.statusCode = 200;
                res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email+"|| STATUS: "+response.statusCode);
            }
            else {
                res.statusCode = 403;
                res.end("POST USER ACTION BLOCKED:"+id_message2.email);
            }


        });
    }

    vmStatus(req,res){
        console.log('vmapp.vmStatus called'); 
        const contentLength = req.headers['content-length'];
        console.log('Content-Length: ' + contentLength); 

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        var requestDic = {};

        req.on('end', async () => {
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

            var id_message2 = "EMPTY";
            var id_valid2 = false;

            const credential = requestDic["credential"];
            console.log("credential:" + credential);  
            
            var objReturn = { } ;

            objReturn = await webSecurity.parseValidateCredential2(requestDic);
            
            console.log(JSON.stringify(objReturn)) ;
            id_valid2 = objReturn.state;
            id_message2 = objReturn.id;

            if (id_valid2){ 
                console.log("LOGIN AS:"+id_message2.email);
            }

            var isAuthorisedTime = false;
            var isAuthorisedEmail = false;
            var isAuthorised = false;

            if (id_valid2){
                isAuthorisedTime = sessionMgr.authoriseTokenTime(id_message2);
            }

            if (id_valid2){
                isAuthorisedEmail = sessionMgr.authoriseUserEmail(id_message2);
            }

            isAuthorised = isAuthorisedTime.isValid && isAuthorisedEmail.isValid;

            if (isAuthorised){
                const request = {
                    instance,
                    project,
                    zone,
                };
                // Run request
                const response = await computeClient.get(request);
                var current_status = response;
                console.log(response);
                console.log("Token is authorised.")
                res.statusCode = 200;
                res.end("POST USER AUTHORISED + ACTION COMPLETED AS:"+id_message2.email+"|| STATUS: "+response.statusCode);
            }
            else {
                res.statusCode = 403;
                res.end("POST USER ACTION BLOCKED:"+id_message2.email);
            }


        });
    }
}

