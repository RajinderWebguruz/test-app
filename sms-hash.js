// sms-hash.js
const crypto = require("crypto");

function base64Hash(packageName, sha1) {
  const signature = Buffer.from(sha1.replace(/:/g, ""), "hex");
  const data = Buffer.concat([Buffer.from(packageName, "utf8"), signature]);
  const hash = crypto.createHash("sha256").update(data).digest();
  return hash.toString("base64").substring(0, 11);
}

// Replace with your package name and SHA-1 (no colons, uppercase)
const packageName = "com.rajinder160725.y";
const sha1 = "9ADD3DAD30318E427796E3F648E84026DD5DD920";

console.log(base64Hash(packageName, sha1));
