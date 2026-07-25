"use strict";

// logger.js

const fs = require("fs").promises;
const path = require("path");

class JsonLogger {
    constructor(filename = "serverlog.json") {
        this.logFile = path.join(__dirname, filename);

        this.init().catch(console.error);
    }

    async init() {
        try {
            await fs.access(this.logFile);
        } catch {
            await fs.writeFile(
                this.logFile,
                JSON.stringify([], null, 4),
                "utf8"
            );
        }
    }

    async readLogs() {
        try {
            const data = await fs.readFile(this.logFile, "utf8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async writeLogs(logs) {
        await fs.writeFile(
            this.logFile,
            JSON.stringify(logs, null, 4),
            "utf8"
        );
    }

    appendLog(level, message, data = null) {
        // Fire and forget
        this._appendLog(level, message, data)
            .catch(err => console.error("Log Error:", err));
    }

    async _appendLog(level, message, data) {
        const logs = await this.readLogs();

        logs.push({
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            data
        });

        await this.writeLogs(logs);
    }
}

module.exports = JsonLogger;






/*
export class logging {
    getVMStatus (logMessage,res){
            if (log.logMessage.includes("operationType"))
            {
                //this means the message is from a command to start, stop or suspend request
                if (logMessage.includes("start")){
                    
                } else if (logMessage.includes("stop")){
                    
                } else if (logMessage.includes("suspend")){
                    
                } else {
                    //unknown type of status check, possible error.
                }
            } else if (!log.logMessage.includes("operationType")) {
                //This means the message is from a status check request
                if (logMessage.includes("RUNNING")){
            
                } else if (logMessage.includes("TERMINATED")){
                    
                } else if (logMessage.includes("SUSPENDED")){
                    
                } else {
                    //unknown type of status check, possible error.
                }
            } else {
                //unknown type of status check, possible error.
            }
           
    }
    writeLog (logMessage,type,res){
        console.log(type, logMessage);
    }
    readLog (vmInfo,res){

    }
    readRecentLog (vmInfo,res){

    }
    sendLog (vmInfo,res){

    }

}
*/