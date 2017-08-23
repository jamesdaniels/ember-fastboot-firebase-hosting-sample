const fs = require('fs');

// *****************************************************************************
// *** Ensure that firebase.json has up-to-date signatures for static assets ***
// *****************************************************************************

const assetMap = JSON.parse(fs.readFileSync('./firebase-public/assets/assetMap.json', 'utf8'));
let firebaseJson = fs.readFileSync('./firebase.json', 'utf8') // read as string

// Iterate over asset, form a regex, and replace any instance of it in firebaseJSON
Object.keys(assetMap.assets).forEach(asset => {
    const filename = assetMap.assets[asset];
    const filenameSafe = filename.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    // create a regex for replacing outdated asset names:
    //   "assets/vendor-22719269676451a5ba94c44fa37f0b5c\\.js" => /assets\/vendor-[0-9a-f]{32}\.js/
    //                 ------------------------------------                      ---------------
    const regex = new RegExp(filenameSafe.replace(/-[0-9a-f]{32}\\./, '-[0-9a-f]{32}\\.'));
    // replace any matches with the new filename
    firebaseJson = firebaseJson.replace(regex, filename);
})

fs.writeFileSync('./firebase.json', firebaseJson); // write back

// ***************************************************************************************************
// *** Ensure that functions/package.json includes the dependencies that our FastBoot app requires ***
// ***************************************************************************************************

const fastbootPackageJson = JSON.parse(fs.readFileSync('./functions/dist/package.json', 'utf8'));
const functionsPackageJson = JSON.parse(fs.readFileSync('./functions/package.json', 'utf8'));

// Iterate over each dependency in dist/package.json and override existing dependencies
Object.keys(fastbootPackageJson.dependencies).forEach(dependency => {
    const version = fastbootPackageJson.dependencies[dependency];
    functionsPackageJson.dependencies[dependency] = version;
});

// Write back to the file, pretty printed
fs.writeFileSync('./functions/package.json', JSON.stringify(functionsPackageJson, null, '  '));