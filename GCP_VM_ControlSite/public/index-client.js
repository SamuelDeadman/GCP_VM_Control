function writeinfo(responsePayload){
        console.log("Decoded JWT ID token fields:");
        console.log("  Full Name: " + responsePayload.name);
        console.log("  Given Name: " + responsePayload.given_name);
        console.log("  Family Name: " + responsePayload.family_name);
        console.log("  Unique ID: " + responsePayload.sub);
        console.log("  Profile image URL: " + responsePayload.picture);
        console.log("  Email: " + responsePayload.email);
        console.log("  Email verified: " + responsePayload.email_verified);
        console.log("  Gender: " + responsePayload.gender);
        console.log("  Locale: " + responsePayload.locale);
        console.log("  Hosted domain: " + responsePayload.hd);
        
        addTextNode("name:" + responsePayload.name,"logininfo");
        addTextNode("given_name:" + responsePayload.given_name,"logininfo");
        addTextNode("family_name:" + responsePayload.family_name,"logininfo");
        addTextNode("sub:" + responsePayload.sub,"logininfo");
        addTextNode("picture:" + responsePayload.picture,"logininfo");
        addTextNode("email:" + responsePayload.email,"logininfo");
        addTextNode("email_verified:" + responsePayload.email_verified,"logininfo");
        addTextNode("gender:" + responsePayload.gender,"logininfo");
        addTextNode("email_verified:" + responsePayload.email_verified,"logininfo");
        addTextNode("gender:" + responsePayload.gender,"logininfo");
        addTextNode("locale:" + responsePayload.locale,"logininfo");
        addTextNode("hd:" + responsePayload.hd,"logininfo");
}

function addTextNode(text,htmlid) {
  const newText = document.createTextNode(text);
  const p1 = document.getElementById(htmlid);
  const br = document.createElement("br");

  p1.appendChild(newText);
  p1.appendChild(br);
}

// **** UI developer can create multiple of these....

async function sendAction(returnFunc) {

  console.log("sendAction");
  console.log(globalCredential);

  const response = await fetch("/user-single-action", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // Automatically converted to format of list of parameters
    body: new URLSearchParams({ credential: globalCredential }),
    });

  const resultTxt = await response.text();
  console.log("RESULT:"+resultTxt);

  returnFunc(resultTxt);
}

// **** THIS IS MODIFIED BY DEVELOPER OF UI *****

function sendActionSaveDemo(resultInfo){

  console.log("Save this to display or variables:"+resultInfo);

  addTextNode(resultInfo,"logininfo");

}


const statusElement = document.getElementById("server-status");
const logContainer = document.getElementById("log-container");

const eventSource = new EventSource(
    "http://localhost:3000/events"
);

eventSource.onmessage = function(event) {

    const log = JSON.parse(event.data);

    console.log(log);

    if (log.level === "STATUS") {
        statusElement.textContent =
            `Status: ${log.message}`;
    }
};

eventSource.onmessage = function(event) {

    const log = JSON.parse(event.data);

    if (log.level === "STATUS") {
        statusElement.textContent =
            `Status: ${log.message}`;
    }

    const line = document.createElement("div");

    line.textContent =
        `[${log.level}] ${log.message}`;

    logContainer.prepend(line);
};

eventSource.onerror = function() {
    statusElement.textContent =
        "Status: Disconnected";
};