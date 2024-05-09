import { exec } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

console.log('Reading "package.json"');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");
const packageJsonRoot = path.join(projectRoot, "package.json");
const staticLayerPath = path.join(projectRoot, "layers", "nodejs");
const packageJsonOfStaticLayer = path.join(staticLayerPath, "package.json");
let { dependencies: dependenciesFromRoot } = JSON.parse(
  fs.readFileSync(packageJsonRoot, { encoding: "utf-8" })
);

// Create path (./layers/nodejs/package.json) if not exists
if (!fs.existsSync(packageJsonOfStaticLayer)) {
  fs.mkdirSync(staticLayerPath, { recursive: true });
  fs.writeFileSync(
    packageJsonOfStaticLayer,
    JSON.stringify(
      {
        name: "layers",
        description: "External dependencies of the project",
      },
      null,
      2
    )
  );
}

if (dependenciesFromRoot) {
  console.log(
    `Changing dependencies in "${path.relative(
      projectRoot,
      packageJsonOfStaticLayer
    )}"`
  );

  const destinationFile = JSON.parse(
    fs.readFileSync(packageJsonOfStaticLayer, { encoding: "utf-8" })
  );

  destinationFile["dependencies"] = dependenciesFromRoot;
  fs.writeFileSync(
    packageJsonOfStaticLayer,
    JSON.stringify(destinationFile, null, 2)
  );

  console.log(
    `Executing 'npm i' in "${path.relative(projectRoot, staticLayerPath)}"`
  );
  exec(`cd ${staticLayerPath} && npm i`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
} else {
  console.log("No dependencies to install at this moment");
}
