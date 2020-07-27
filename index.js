var TelegramBot = require('node-telegram-bot-api');
var telegram = new TelegramBot("1327805449:AAGeNbr6dUA6WRIP6qNKBBrE0jsD6RKbqQk", { polling: true });
const axios = require('axios');
var genius = require('genius-lyrics-api');
var getLyrics = genius.getLyrics;



const options = {
    apiKey: 'Pvx5cKguUCoD0bRRX7Z-bYJFD59YQmw6DfjQpj3ZeWNaMtbX3u9csBzruwFI80eg',
    title: '',
    artist: 'adele',
    optimizeQuery: true
};


const config = {
    client: {
        id: 'b7LlBrvWvXp4wAjl3L8ZVPwkGPEFZQC2X9Ug8gCaQdVHPO51PpEuzviUtllcVnU2',
        secret: '1Rslqu9NL1aR-4tiiudwA-anF43cChtsgsc8HzqiI5V8o_XvV37Q4Mg4XllAtsuMGVljiUT9sP_k5q3kbJo-sw'
    },
    auth: {
        tokenHost: 'https://api.genius.com/oauth/token'
    }
};

const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');


/*
https: //api.genius.com/oauth/authorize?client_id=b7LlBrvWvXp4wAjl3L8ZVPwkGPEFZQC2X9Ug8gCaQdVHPO51PpEuzviUtllcVnU2&redirect_uri=/&scope=me&state=200&response_type=code
*/

telegram.on("text", (message) => {
    getToken().then((token) => {


    });
    /*
    getLyrics(options).then((lyrics) => {
        options.title = message.text.toString();

        console.log(lyrics)
        telegram.sendMessage(message.chat.id, lyrics);

    }).catch((e) => {
        console.log(e);
    });
    */
});

async function getToken() {
    const client = new ClientCredentials(config);
    const tokenParams = {
        scope: 'me',
    };
    try {
        const accessToken = await client.getToken(tokenParams);
        return accessToken.token.access_token;
    } catch (error) {
        console.log('Access Token error', error.message);
    }
}

async function searchSong(title) {

}