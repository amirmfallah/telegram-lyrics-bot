var TelegramBot = require('node-telegram-bot-api');
var telegram = new TelegramBot("1327805449:AAGeNbr6dUA6WRIP6qNKBBrE0jsD6RKbqQk", { polling: true });
const axios = require('axios');
var genius = require('genius-lyrics-api');
var getLyrics = genius.getLyrics;
const Lyricist = require('lyricist/node6');



const options = {
    apiKey: '',
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

telegram.on("inline_query", (message) => {

    console.log(message.query.toString());

    /*
                getToken().then((token) => {
                    options.apiKey = token;

                });
    
                getLyrics(options).then((lyrics) => {
                    options.title = message.text.toString();

                    console.log(lyrics)
                    telegram.sendMessage(message.chat.id, lyrics);

                }).catch((e) => {
                    console.log(e);
                });
                */
});



telegram.on("text", (msg) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message   
    const chatId = msg.chat.id;
    msg = msg.text.toString();

    if (msg.search("/search") != -1) {
        var res = msg.match(/\/search (.+)/);
        console.log(res);
        getToken().then((token) => {
            searchSong(res[1], token).then((result) => {
                console.log("res: ");
                console.log(result);
                if (result.meta.status == 200) {
                    var response = "";
                    var hits = result.response.hits;
                    for (let i = 0; i < hits.length; i++) {
                        const element = hits[i];
                        response += element.result.full_title + "  " + "/dl_" + element.result.id + "\n";
                    }
                    telegram.sendMessage(chatId, response);
                }
            });
        });

    } else if (msg.search("/dl_") != -1) {
        var res = msg.match(/\/dl_(.+)/);
        console.log(res);
        getToken().then((token) => {
            console.log("got: " + token);
            getlyrics(res[1], token).then((lyrics) => {

                if (lyrics) {
                    telegram.sendMessage(chatId, lyrics)
                } else {
                    telegram.sendMessage(chatId, "lyrics not found.")

                }

            }).catch((e) => {
                console.log(e);
            });
        });

    }
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

async function searchSong(title, token) {
    try {
        const response = await axios.get('https://api.genius.com/search?q=' + title, { headers: { Authorization: "Bearer " + token } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function getlyrics(id, token) {
    try {
        const response = await axios.get('https://api.genius.com/songs/' + id, { headers: { Authorization: "Bearer " + token } });
        var title = response.data.response.song.title;
        var artist = response.data.response.song.primary_artist.name;

        options.title = title;
        options.artist = artist;
        options.apiKey = token;

        console.log(options);

        var lyrics = await getLyrics(options);
        console.log(lyrics);


        return lyrics;


    } catch (error) {
        console.error(error);
    }
}