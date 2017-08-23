const fs = require('fs');
const assetMap = JSON.parse(fs.readFileSync('./firebase-public/assets/assetMap.json', 'utf8'));
let firebaseJson = fs.readFileSync('./firebase.json', 'utf8')

Object.keys(assetMap.assets).forEach(asset => {
    const filename = assetMap.assets[asset];
    const filenameSafe = filename.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    const regex = new RegExp(filenameSafe.replace(/-[0-9a-f]{32}/, '-[0-9a-f]{32}'));
    firebaseJson = firebaseJson.replace(regex, filename);
})

fs.writeFileSync('./firebase.json', firebaseJson);

const fastbootPackageJson =  JSON.parse(fs.readFileSync('./functions/dist/package.json', 'utf8'));
const functionsPackageJson =  JSON.parse(fs.readFileSync('./functions/package.json', 'utf8'));

Object.keys(fastbootPackageJson.dependencies).forEach(dependency => {
    const version = fastbootPackageJson.dependencies[dependency];
    functionsPackageJson.dependencies[dependency] = version;
});

fs.writeFileSync('./functions/package.json', JSON.stringify(functionsPackageJson, null, '  '));