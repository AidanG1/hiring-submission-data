const fs = require("fs");
const { parse } = require("csv-parse");
const sendAxios = require('./send_axios.js');

let keys = [];
let values = [];
let total = [];
let http = [];
let meta = [];

let j = 0;

fs.createReadStream("./internet-traffic.csv")
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
        console.log(row.length);
        for (let i = 1; i < row.length; i++) {
            if (j === 0) {
                keys.push(row[i]);
            } else {
                if (row[i] !== "" || row[i] === ' ') {
                    values.push(row[i]);
                }
            }
        }
        j++;
    })
    .on("end", async function () {

        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes('total')) {
                total.push({ key: keys[i], value: values[i] });
            }
            else if (keys[i].includes('http')) {
                http.push({ key: keys[i], value: values[i] });
            }
            else {
                meta.push({ key: keys[i], value: values[i] });
            }
        }

        // console.log(read_csv);
        
        sendAxios([{key: 'total', value: JSON.stringify(total)}, {key: 'http', value: JSON.stringify(http)}, {key: 'meta', value: JSON.stringify(meta)}]);
    })
    .on("error", function (error) {
        // console.log(error.message);
    });
