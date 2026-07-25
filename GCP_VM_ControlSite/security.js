
"use strict";

import * as googleAuth from 'google-auth-library';

export class webSecurity {

    authorisedUsers  = [ 'example@gmail.com' ] ;

    // ################################################################################################
    // ################################################################################################
    // JWT VALIDATIONS USING google auth library

    static async parseValidateCredential2(reqestDic){
      console.log('webSecurity.parseValidateCredential2');
    
      const credential = reqestDic["credential"];
      console.log("credential:" + credential);  
    
      try {
        const client = new googleAuth.OAuth2Client();
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience : ''
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
    
    }

    // ################################################################################################
    // pass in JWT token and validate start time, expire time
    // call by const { isValid , message } = authoriseToken(...)
    authoriseTokenTime(token){
        console.log('webSecurity.authoriseToken');

        const unixtime = Math.floor(new Date().getTime() / 1000);
        console.log("Now:"+unixtime+" Expire:"+token.exp+" Date:"+new Date(token.exp*1000).toString());

        if (token.exp < unixtime ){
            console.log("Token has expired:"+token.exp);
            return { isValid: false , message:"Token has expired"};
        }
        
        if (token.iat > unixtime ){
            console.log("Token time has gone backwards:"+token.iat);
            return { isValid: false , message:"Token time has gone backwards"};
        }
        console.log("Token Time is valid.")
        return { isValid: true , message:"Token is valid" };
    }

    // pass in JWT token and validate against user list
    // call by const { isValid , message } = authoriseToken(...)
    authoriseUserEmail(token){
        console.log('webSecurity.authoriseUserEmail');
        console.log('authorising:'+token.email);
        console.log("Authorsied User list " + this.authorisedUsers);

        //const searchUser = this.authorisedUsers[token.email];
        const searchUser = this.authorisedUsers.includes(token.email);
        console.log('searchUser:'+searchUser);

        if ( searchUser == false){
            console.log("Unauthorised user of email:" + token.email + " not found in authorised list.");
            console.log("ALARM UNATHORISED USER SECURITY ALERT: " + token.email + " not found in authorised list. Action Not allowed.");
            return { isValid: false , message:"User is not authorised"};
        }
        else {
            console.log("Token Email is valid.")
            return { isValid: true , message:"User is authorised"};
        }
    }

}