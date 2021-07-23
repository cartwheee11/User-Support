let config = require('./config.json');
let Discord = require('discord.js');
const { exec } = require('child_process');
let client = new Discord.Client();

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

    console.log(len);
    
    console.log(rand1 + ' ' + rand2);
    if(rand1 == rand2) cb()
}

const PROBABILITY  = 0.1;

client.on('message', function(message) {
    if(message.author.bot == true) return;

    function doReply() {
        let reply = getRandomArrayElement(COMPLIMENTS);
        message.reply(reply);
        if(reply != 'bruh') {
            console.log(reply);
            console.log('bruh' == reply);
            let emoji = getRandomArrayElement(EMOJIS);
            message.react(emoji)
        } else {
            console.log('должен быть bruh');
            message.react('👎');
        }
    }

    executeWithProbability(0.03, doReply);
        
});
//   https://discord.com/api/oauth2/authorize?client_id=868101846290546718&permissions=2151016512&scope=bot%20applications.commands
