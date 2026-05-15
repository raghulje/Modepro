import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(name)) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("motionless-top-bar")) {
        fs.writeFileSync(full, content.replaceAll("motionless-top-bar", "motionless-top-bar"));
        fs.writeFileSync(
          full,
          fs.readFileSync(full, "utf8").replaceAll("motionless-top-bar", "div")
        );
        console.log("fixed", path.relative(root, full));
      }
    }
  }
}

walk(root);
