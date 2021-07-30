let config = require('./config.json');
let Discord = require('discord.js');
const { exec } = require('child_process');
let client = new Discord.Client();
const axios = require('axios');

client.login(config.BOT_TOKEN);


const BOOR_PHRASES = [
    ' Епта)0',
    ' Епть',
    ' Епты бля)0',
    ', слышь епта)))',
    ', епты, ыыыыыыы',
    " блять",
    " нахуй)0",
    " нахуй блять 😃",
    ", ты нахуй"
]

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
    return (string + ' епты блять)){end}\n—').trim();
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

    return string[0];
    
}

async function getContext(message) {
    return new Promise(async function(resolve, reject) {
        const LIMIT = 3;
        let messages = await message.channel.messages.fetch({ limit: LIMIT });
        let result = ''
        let count = 0
        let messagesArray = Array.from(await messages).reverse();

        await messagesArray.forEach((elem) => {
            count++
            let messageBody = elem[1].content
            // let messageBody = contextMessage.content;
            messageBody = clearMentions(messageBody).trim();
            messageBody = '— ' + messageBody + getRandomArrayElement(BOOR_PHRASES) + '\n';
            result += messageBody;
            if (count == LIMIT - 1) {
                result += '—'
                resolve( result );
            }
        })
    })
    
}

client.on('message', async function(message) {
    if(message.author.bot == true) return;


    // getContext(message).then(context => {

    // });


    async function doReply() {
        let messageBody = clearMentions(message.content);
        let moodinizeString = moodinize(messageBody);
        let context = await getContext(message)
        let seedWithContext = ( await context ).trim() + ' ' + moodinizeString.trim();

        console.log('——————————————————————————————————————————');
        console.log(JSON.stringify(seedWithContext));
        console.log('..........................................');
        console.log(seedWithContext);
        console.log('——————————————————————————————————————————');

        getPrediction(await seedWithContext).then(async function(prediction) {
            prediction = prediction.replace(/[^]*{end}\n—/, '').trim();

            console.log('——————————————————————————————————————————');
            console.log(JSON.stringify(prediction));
            console.log('..........................................');
            console.log(prediction);
            console.log('——————————————————————————————————————————');

            prediction = clearExcess(await prediction);

            message.reply(await prediction);
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
