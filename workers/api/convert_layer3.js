const fs = require("fs");
const { parse } = require("csv-parse");
const sendAxios = require('./send_axios.js');

let keys = [];
let values = [];
let total = [];
let meta = [];

let j = 0;

fs.createReadStream("./attack-layer3-traffic.csv")
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
            else {
                meta.push({ key: keys[i], value: values[i] });
            }
        }

        // console.log(read_csv);
        
        sendAxios([{key: 'layer3-total', value: JSON.stringify(total)}, {key: 'layer3-meta', value: JSON.stringify(meta)}]);
    })
    .on("error", function (error) {
        // console.log(error.message);
    });
