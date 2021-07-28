let config = require('./config.json');
let Discord = require('discord.js');
const { exec } = require('child_process');
let client = new Discord.Client();
const axios = require('axios');

client.login(config.BOT_TOKEN);

const EMOJIS = [
    '🍎',
    '🍊',
    '😄',
    '👍'
]

const COMPLIMENTS = [
    'Воу-воу, крутое сообщение!',
    'Ты всех поразил своим сообщением!',
    'Это отличное замечание!',
    'Кто не согласен с этим, тот пусть хорошо подумает!',
    'Кайф',
    'Круть!',
    'bruh',
    'Лучший!',
    'Однозначно лайк!'
] 

function getRandomArrayElement(arr) {
    let len = arr.length;
    let rand = Math.floor(Math.random() * len);
    return arr.slice()[rand];
}

function executeWithProbability(prob, cb) {
    let len = 1/prob;
    let rand1 = Math.floor(Math.random() * len);
    let rand2 = Math.floor(Math.random() * len);
    if(rand1 == rand2) cb()
}

function getAnswer(question, prediction) {
    return prediction.replace(question, '')
}

function moodinize(string) {
    return ('— ' + string + ' епта ептыть))0\n— ').trim();
}

async function getPrediction(text) {
    let options = {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    }

    let data = {
        text: text
    }


    return (await axios.post('https://api.aicloud.sbercloud.ru/public/v1/public_inference/gpt3/predict?', data, options)).data.predictions
}

// (async function() {
//     console.log(await getPrediction(`— Как дела? — `));
// })()

function isBotMentioned(message) {
    return message.mentions.users.get(client.user.id) ? true : false;
}

function clearMentions(string) {
    let exp = /<@.\d*>/gmi;
    return string.replace(exp, '').trim();
}

function clearExcess(string) {
    // string = clearMentions(string);
    let exp = /^([^—\n]*)/mi;
    string = string.match(exp);
    // console.log(string);
    return string[0];
    
}


client.on('message', function(message) {
    if(message.author.bot == true) return;
    console.log('сообщение пользователя: ' + message.content);

    function doReply() {
        let string = clearMentions(message.content);
        let moodinizeString = moodinize(string);
        console.log('затравка: ' + moodinizeString);
        getPrediction(moodinizeString).then(prediction => {
            prediction = prediction.trim().replace(moodinizeString, '').trim();
            console.log('предсказание: ' + prediction);
            prediction = clearExcess(prediction);
            console.log('предсказание с очисткой: ' + prediction);
            message.reply(prediction);
        }).catch(console.log);
    }

    if(isBotMentioned(message)) {
        doReply()
    }

    executeWithProbability(0.1, doReply);


    

    // if(message.content.trim().startsWith('<@!868933682088513576>')) {
    //     let text = message.content.replace('<@!868933682088513576>', '').trim();
    //     if(text != '') {
    //         getPrediction(text).then(prediction => {
    //             // let subPrediction = prediction.split('.')[0];
    //             // console.log(prediction);

    //             console.log(`Мы должны из (` + prediction.trim() + ') вычесть (' + text.trim());
    //             message.reply(prediction.trim().replace(text.trim(), '').split('.')[0])
    //             // prediction = prediction.replace(text, '...').split('.')[0];
    //             // message.reply(prediction)
    //             // console.log(prediction);
    //             // console.log(text);
    //             // if(message.content.endsWith('?')) {
    //             //     // message.reply(getAnswer(text, subPrediction))
    //             // } else {
    //             //     // message.reply(getAnswer(text, subPrediction));
    //             // }
    //         })
    //     }
    // }

    // function doReply() {
        // let reply = getRandomArrayElement(COMPLIMENTS);
        // message.reply(reply);
        // if(reply != 'bruh') {
        //     console.log(reply);
        //     console.log('bruh' == reply);
        //     let emoji = getRandomArrayElement(EMOJIS);
        //     message.react(emoji)
        // } else {
        //     console.log('должен быть bruh');
        //     message.react('👎');
        // }

        
    // }

    // executeWithProbability(1, doReply);
        
});
//   https://discord.com/api/oauth2/authorize?client_id=868101846290546718&permissions=2151016512&scope=bot%20applications.commands
