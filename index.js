const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const robot = new Discord.Client(); // Объявляем, что robot - бот
const easyvk = require('easyvk');
var config = require('./config.json'); // Подключаем файл с параметрами и информацией
var discord_token = config.discord_token; // «Вытаскиваем» из него токен
var discord_id = config.discord_ch_id;
var vk_id = config.vk_comm_id;
var vk_token = config.vk_token;
var channel = robot.channels.cache.get(discord_id);
var bot_id = 0

VKListen();
DiscordListen();





async function VKListen() {
    easyvk({
        token: vk_token,
        utils: {
            bots: true
        }
    }).then(vk => {
        const LPB = vk.bots.longpoll
        LPB.connect({
            forGetLongPollServer: {},
            forLongPollServer: {}
        }).then((connection) => {
            connection.on('message_new', (msg) => {
                console.log("Идентификатор сообщества" + msg.peer_id);
                vk.call('users.get', {
                    user_id: msg.from_id,
                    random_id: easyvk.randomId()
                }).then((user) => {
                    console.log(user);
                    SendToDiscord(user[0].first_name + ' ' + user[0].last_name, msg.text);
                })
            })
        })
    })
}

async function DiscordListen() {
    robot.on('message', (msg) => { // Реагирование на сообщения
        SendToVK(msg.author.username, msg.content)
    });

    robot.on("ready", client => {
        console.log(robot.user.username + " запустился!");
        channel = robot.channels.cache.get(discord_id);
    });

    robot.login(discord_token); // Авторизация бота
}

async function SendToDiscord(fio, text) {
    channel.send(fio + "\n" + text);
}


async function SendToVK(fio, text) {
    easyvk({
        token: vk_token,
        utils: {
            bots: true
        }
    }).then(vk => {
        vk.call('messages.send', {
            peer_id: 2000000000 + parseInt(vk_id),
            message: fio + "\n" + text,
            random_id: easyvk.randomId()
        }).catch(err => {
            console.log(err);
        });
    })


}