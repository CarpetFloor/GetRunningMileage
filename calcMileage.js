const fs = require("fs");
const path = require("path");

let fileFound = true;
let data = "";

console.log("\n");

try {
    let filePath = path.join(__dirname, "/Activities.csv");
    data = fs.readFileSync(filePath, "utf8").split("Running");
}
catch(err) {
    fileFound = false;
    console.log("ERROR: File Activities.csv not found");
}

if(fileFound) {
    let finalUnformatted = [];

    for(let i = 0; i < data.length; i++) {
        let splitByComma = data[i].split("\",");
        
        if(splitByComma.length == 1) {
            let getTitle = splitByComma[0].split("\"");

            if(typeof getTitle[1] != "undefined") {
                if(getTitle[1].includes("Track")) {
                    finalUnformatted.push("METERS");
                }
            }
        }
        else if(splitByComma.length == 35) {
            let distanceSplitted = splitByComma[1].split("\"");
            let actualDistance = distanceSplitted[1];

            finalUnformatted.push(actualDistance);
        }
    }

    // format
    let final = [];
    let sum = 0.0;

    let nextIsInMeters = false;
    for(let i = 0; i < finalUnformatted.length; i++) {
        let updateSum = true;

        if(finalUnformatted[i] == "METERS") {
            updateSum = false;
            nextIsInMeters = true;
        }
        else if(!(nextIsInMeters)) {
            final.push(parseFloat(finalUnformatted[i]));
        }
        else if(nextIsInMeters) {
            nextIsInMeters = false;

            let withoutCommas = finalUnformatted[i].replace(",", "");
            let asNumber = parseFloat(withoutCommas);

            // convert to miles
            let converted = asNumber * 0.000621371;
            final.push(converted);
        }

        // update sum
        if(updateSum) {
            sum += final[final.length - 1];
        }
    }

    console.log("Total Mileage:", sum);
}