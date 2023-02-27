const core = require('@actions/core');
const http = require('@actions/http-client');
const wait = require('./wait');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");

const artifact = require('@actions/artifact');
const artifactClient = artifact.create()
const artifactName = 'my-artifact';
const path = 'some/directory'
const options = {
    createArtifactFolder: false
}


// most @actions toolkit packages have async methods
async function run() {
    try {
        const ciUserToken = core.getInput('CIUserToken');
        const projectSlug = core.getInput('ProjectSlug');
        const signingPolicySlug = core.getInput('SigningPolicySlug');
        const artifactConfigurationSlug = core.getInput('ArtifactConfigurationSlug');
        const artifact = core.getInput('Artifact');
        const artifactName = core.getInput('ArtifactName');
        const organizationId = core.getInput('OrganizationId');


        core.info(`Custom SignPath Action ... `);
        const downloadResponse = await artifactClient.downloadArtifact(artifact, path, options);
        var file = fs.readFileSync(downloadResponse.downloadPath + "/" + artifactName, (err, data) => {
            if (err)
                throw err;
        });

        var data = new FormData();
        data.append('Artifact', file, 'Artifact');
        data.append('ProjectSlug', projectSlug);
        data.append('SigningPolicySlug', signingPolicySlug);
        data.append('ArtifactConfigurationSlug', artifactConfigurationSlug);
        data.append('Description', 'Description-TEST');

        await fetch('https://app.signpath.io/API/v1/' + organizationId + '/SigningRequests', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + ciUserToken,
            },
            body: data
        })
        .then(response => response.json())
        .then((data) => console.log(data));


        core.debug((new Date()).toTimeString());
        core.info((new Date()).toTimeString());
        core.debug("SignPath Test");
        core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
