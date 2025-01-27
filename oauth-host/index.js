const express = require('express');
const fs = require('fs/promises');
const app = express();
const port = 4794; // Can't change the port because we are forced to use a specific redirect url

const SERVICE_ID = 'v285zxnl3h'; // Leave this default
const REDIRECT_URI = 'http://localhost:4794/signin/callback'; // We can't change this unfortunately

app.use(express.urlencoded({ extended: true }));

// Initial authentication route
app.get('/auth', (req, res) => {
    const authUrl = `https://account.samsung.com/mobile/account/check.do?` +
        `serviceID=${SERVICE_ID}` +
        `&actionID=StartOAuth2` +
        `&accessToken=Y` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    res.redirect(authUrl);
});

// Callback route that Samsung will redirect to
app.post('/signin/callback', async (req, res) => {
    let tokenData = JSON.parse(req.body.code);


    if (!tokenData) {
        res.status(400).send(HTML_FAIL);
        process.exit(1);
    }

    res.send(HTML_SUCCESS);

    result = {
        success: true,
        access_token: tokenData.access_token,
        user_id: tokenData.userId,
        email: tokenData.inputEmailID,
    };

    console.log(result);

    fs.writeFile(`../tokens/samsung_token.json`, JSON.stringify(result));

    process.exit(0);
});

app.listen(port, () => {
    console.log(`Open http://localhost:${port}/auth in your browser and sign in to create the developer certificate`);
});


const HTML_SUCCESS = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Successful</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #4CAF50;
                    margin-bottom: 20px;
                }
                p {
                    color: #666;
                    margin-bottom: 20px;
                }
                .close-button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .close-button:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Authentication Successful!</h1>
                <p>You have been successfully authenticated. You may now close this window.</p>
            </div>
        </body>
        </html>
    `;

const HTML_FAIL = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Failed</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #f44336;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666;
                        margin-bottom: 20px;
                    }
                    .error-details {
                        font-size: 0.8em;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Authentication Failed</h1>
                    <p>Sorry, we couldn't complete the authentication process.</p>
                </div>
            </body>
            </html>
        `;