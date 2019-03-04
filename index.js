'use strict';

const dotenv = require("dotenv");
dotenv.config();

const loginKey = process.env.KEYS_TO_THE_KINGDOM;

const moment = require("moment");

const Discord = require("discord.js");
const client = new Discord.Client();

var ping = (msg) => {
    msg.reply('pong');
};

var purge = (cmd, msg) => {
    if(cmd[1] != null){
        let option = cmd[1];

        if(option == "channels"){
            let channels = msg.guild.channels;

            var deadChannel = channels.find(channel => channel.name.toLowerCase() == "dead channels");

            channels.filter(channel => channel.type == "text" && channel.parentID != deadChannel.id).forEach((channel, key) => {
                channel.fetchMessage(channel.lastMessageID)
                    .then(message => {
                        let now = moment();
                        let createdAt = moment(message.createdAt);

                        if(now.diff(createdAt, 'months', true) > 6){
                            channel.setParent(deadChannel.id);
                            msg.reply(`${channel.name} moved to ${deadChannel.name}`);
                        }
                    });
            });
        }   
    }
}

var gotTime = (cmd, msg) => {
    let now = moment();
    let gotDate = moment("14/04/2019 21:00:00", "DD/MM/YYYY HH:mm:ss");

    var s = now.to(gotDate);

    msg.reply("Game of Thones will air in " + s);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if(msg.content.startsWith("!")){
        let command = msg.content.split(" ");
        let operation = command[0].substr(1);

        switch(operation){
            case "ping":
                ping(msg);
                break;
            case "purge":
                purge(command, msg);
                break;
            case "got":
                gotTime(command, msg);
                break;
        }
    }
});

client.login(loginKey);