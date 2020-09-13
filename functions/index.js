/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin')

// var serviceAccount = require("../../serviceAccountKey.json");

var config = {
    apiKey: "<PUBLIC ACCESS>",
    // credential: admin.credential.cert(serviceAccount),
    authDomain: "pennapps-2020-58432.firebaseapp.com",
    databaseURL: "https://pennapps-2020-58432.firebaseio.com",
    projectId: "pennapps-2020-58432",
    storageBucket: "pennapps-2020-58432.appspot.com",
};
admin.initializeApp(config);

function isIntro(file) {
    if (file.name) {
        let nameParts = file.name.split("_");
        console.log(nameParts);
        return nameParts[0].valueOf() === "intro".valueOf();
    }
    return false;
}

async function getVoiceUrl() {
    // Create a root reference
    var bucket = admin.storage().bucket('pennapps-2020-58432.appspot.com');
    var recording = '';
    // Find all the prefixes and items.
    await bucket.getFiles().then(([files]) => {
        console.log("list done");
        // console.log(files);
        introFiles = files.filter(isIntro);
        introFiles.forEach(file => console.log(file.name));
        recording = introFiles[Math.floor(Math.random() * introFiles.length)].name;
        console.log(recording);
        console.log('path found');
        // console.log(voiceUrl);
        }).catch((error) => {
            // Handle any errors
            console.log(error);
        });
    
    console.log("returning");
    return recording;
}

getVoiceUrl().then((a) => {
    console.log(a);
}).catch((error) => {
    // Handle any errors
    console.log(error);
});
const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/', async (req, res) => {
    let fileName = await getVoiceUrl();
    let fileSuffix = fileName.split("_")[1];
    let url = "https://firebasestorage.googleapis.com/v0/b/pennapps-2020-58432.appspot.com/o/" + fileName + "?alt=media"
    res.send({'url': url,
            'file': fileName,
            'suffix': fileSuffix
        });
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
