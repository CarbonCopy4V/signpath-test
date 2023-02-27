const wait = require('./wait');
const process = require('process');
const cp = require('child_process');
const path = require('path');
const fetch = require('node-fetch');
const http = require('@actions/http-client');
const FormData = require('form-data');
const fs = require("fs");

test('throws invalid number', async () => {
    await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('http', async () => {
    await fetch("https://app.signpath.io/API/v1/dc2fd7b3-5b0d-40a4-96a6-27ab31969ee9/SigningRequests/fc8aabc0-2b8c-4eb6-94d4-6ae6c0697889", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer CIUSERTOKEN',
        },
    })
            .then(response => response.json())
            .then((data) => console.log(data));
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_MILLISECONDS'] = 100;
    process.env['INPUT_CIUSERTOKEN'] = "";
    process.env['INPUT_PROJECTSLUG'] = "";
    process.env['INPUT_SIGNINGPOLICYSLUG'] = "";
    process.env['INPUT_ARTIFACTCONFIGURATIONSLUG'] = "";
    process.env['INPUT_ARTIFACT'] = "";
    
    const ip = path.join(__dirname, 'index.js');
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
})
