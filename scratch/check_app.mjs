import fs from "fs";

const text = fs.readFileSync("src/App.tsx", "utf8");
console.log("App.tsx total lines:", text.split("\n").length);
