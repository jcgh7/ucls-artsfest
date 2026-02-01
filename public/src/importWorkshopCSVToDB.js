import fs from "fs";
import { parse } from "csv-parse/sync";
import { writeLoc } from "./main.js";

const csvText = fs.readFileSync("workshops2.csv", "utf8");
const containsDescriptions = fs.readFileSync("dataincldes.csv", "utf-8");

const records = parse(csvText, {
  columns: true,       // first row = headers
  skip_empty_lines: true,
});

records.forEach((record) => {
    let name = record["WORKSHOP NAME "];
    let capacity = record["MAX STUDENTS"];
    let location = record["Location "];
    let description = record["Description"];
    let p1 = record["Workshop #1"];
    let p2 = record["Workshop #2"];
    let p3 = record["Workshop #3"];
    let periods = [];
    if(p1.indexOf("double") != -1){
        periods.push(4);
    }
    if(p1.indexOf("x") != -1){
        periods.push(1);
    }
    if(p2.indexOf("x") != -1){
        periods.push(2);
    }
    if(p3.indexOf("x") != -1){
        periods.push(3);
    }
    periods.forEach((period) => {
        console.log("-------------------Workshop-------------------");
        console.log("Name: " + name);
        console.log("Capacity: " + capacity);
        console.log("Location: " + location);
        console.log("Description: " + description);
        console.log("Period: " + period);
    })
});
