console.log("Site Loaded");





async function startServer() {

//console.log("Start server requested");

document.getElementById("server-status").innerText =
"Status: Starting instance...";

const response = await fetch("/VMstart", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // Automatically converted to format of list of parameters
    body: new URLSearchParams({ credential: globalCredential }),
    });

  const resultTxt = await response.text();
  console.log("RESULT:"+resultTxt);


//fetch("VMstart");
/*
Future API call will go here

fetch('/api/start-server', {
method: 'POST'
})
*/

}

async function stopServer() {

console.log("Stop server requested");

document.getElementById("server-status").innerText =
"Status: Stopping instance...";

const response = await fetch("/VMstop", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // Automatically converted to format of list of parameters
    body: new URLSearchParams({ credential: globalCredential }),
    });

  const resultTxt = await response.text();
  console.log("RESULT:"+resultTxt);

/*
Future API call will go here

fetch('/api/stop-server', {
method: 'POST'
})
*/

}

async function SuspendServer() {

console.log("Suspend server requested");

document.getElementById("server-status").innerText =
"Status: Suspend instance...";

const response = await fetch("/VMsuspend", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // Automatically converted to format of list of parameters
    body: new URLSearchParams({ credential: globalCredential }),
    });

  const resultTxt = await response.text();
  console.log("RESULT:"+resultTxt);

/*
Future API call will go here

fetch('/api/stop-server', {
method: 'POST'
})
*/

}


async function StatusServer() {

console.log("Suspend server requested");

document.getElementById("server-status").innerText =
"Status: Gettting instance status...";

const response = await fetch("/VMstatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // Automatically converted to format of list of parameters
    body: new URLSearchParams({ credential: globalCredential }),
    });

  const resultTxt = await response.text();
  console.log("RESULT:"+resultTxt);

/*
Future API call will go here

fetch('/api/stop-server', {
method: 'POST'
})
*/

}



// Example small feature
document.querySelectorAll(".post").forEach(post => {
post.addEventListener("mouseenter", () => {
post.style.transform = "scale(1.02)";
post.style.transition = "0.2s";
});

post.addEventListener("mouseleave", () => {
post.style.transform = "scale(1)";
});
});