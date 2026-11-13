// Fails the build early if www/data.json is missing or empty.
const fs = require("fs");
const p = "www/data.json";
if (!fs.existsSync(p)) { console.error("Missing www/data.json. Download it from the ledger and upload it to the www folder."); process.exit(1); }
const d = JSON.parse(fs.readFileSync(p, "utf8"));
const n = Object.keys(d.people || {}).length;
if (!n) { console.error("www/data.json has no people in it."); process.exit(1); }
console.log(`data.json OK: ${n} people, ${Object.keys(d.events || {}).length} events, ${Object.keys(d.trails || {}).length} trails (saved ${d.savedAt || "?"})`);
