const fs = require("fs");
const { parse } = require("csv-parse");
const sendAxios = require('./send_axios.js');

let domains = [];

let j = 0;

fs.createReadStream("./top-domain.csv")
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
        if (j !== 0) {
            domains.push({rank: row[0], rankChange: row[1], domain: row[2], category: row[3]})
        }
        j++;
    })
    .on("end", async function () {
        // console.log(read_csv);
        console.log(domains);
        sendAxios([{key: 'domains', value: JSON.stringify(domains)}]);
    })
    .on("error", function (error) {
        // console.log(error.message);
    });
