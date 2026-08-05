require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');


// Tickets
const { sendTicketPanel } = require('./tickets/ticketCreate');
const ticketHandler = require('./tickets/interactionCreate');
const closeHandler = require('./tickets/closeModal');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});


const player = new Player(client);

require("./welcome")(client);


(async () => {
    await player.extractors.loadMulti(DefaultExtractors);
})();


client.once('ready', () => {
    console.log(`${client.user.tag} is online`);
});


// Ticket + Slash Commands

client.on('interactionCreate', async (interaction) => {

    try {

        // Slash Commands
if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "warassemble") {
        const command = require("./commands/warassemble");
        return command.execute(interaction);
    }

    if (interaction.commandName === "dmall") {
        const command = require("./commands/dmall");
        return command.execute(interaction);
    }

    if (interaction.commandName === "select") {

    console.log("SELECT COMMAND RECEIVED");

    try {
        const command = require("./commands/select");
        await command.execute(interaction);
    } catch (err) {
        console.error("SELECT FAILED:");
        console.error(err);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ " + err.message,
                ephemeral: true
            });
        }
    }

    return;
}
}

        // Ticket Dropdown
        if (interaction.isStringSelectMenu()) {
            return ticketHandler(interaction);
        }

        // Ticket Buttons
        if (interaction.isButton()) {
            return closeHandler(interaction);
        }

        // Ticket Modals
        if (interaction.isModalSubmit()) {
            return closeHandler(interaction);
        }

    } catch (err) {

        console.error(err);

        if (!interaction.replied && !interaction.deferred) {

            await interaction.reply({
                content: "❌ Something went wrong.",
                ephemeral: true
            });

        }

    }

});



// Music

player.events.on('playerStart', (queue, track) => {

    if(queue.metadata?.channel){

        queue.metadata.channel.send(
            `🎵 Now Playing: **${track.title}**`
        );

    }

});


player.events.on('error',(queue,error)=>{

    console.log("PLAYER ERROR");
    console.log(error);

});




// Commands

client.on('messageCreate', async message => {


    if(message.author.bot) return;


    const msg = message.content.toLowerCase().trim();



    if(msg === '!ping'){
        return message.reply("🏓 Pong!");
    }



    if(msg === 'hello'){
        return message.reply("Hey 👋");
    }




    // Ticket Panel

    if(msg === '!ticketpanel') {


        console.log("TICKET COMMAND RECEIVED");


        if(!message.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        )){

            return message.reply("❌ Admin only");

        }


        try {


            await sendTicketPanel(message.channel);


            console.log("PANEL SENT");


            return message.reply(
                "✅ Ticket panel sent"
            );


        } catch(error){


            console.log("PANEL ERROR:");
            console.log(error);


            return message.reply(
                "❌ Ticket panel failed"
            );


        }

    }





    // Apply

    if(msg === 'apply'){


        const embed = new EmbedBuilder()

        .setColor("#FFFFFF")

        .setTitle("Team Apply")

        .setDescription(
            "Answer the following questions:"
        )

        .addFields(
            {
                name:"IGN",
                value:"Your IGN?"
            },
            {
                name:"Account",
                value:"Cracked / Premium?"
            },
            {
                name:"Gamemode",
                value:"Pvper / Grinder?"
            },
            {
                name:"Activity",
                value:"How much time?"
            }
        );


        return message.reply({
            embeds:[embed]
        });

    }





    // Join VC

    if(msg === '!join'){


        const vc = message.member.voice.channel;


        if(!vc)
            return message.reply(
                "❌ Join voice first"
            );


        joinVoiceChannel({

            channelId:vc.id,

            guildId:message.guild.id,

            adapterCreator:
            message.guild.voiceAdapterCreator

        });


        return message.reply(
            "✅ Joined"
        );

    }





    // Play

    if(msg.startsWith("!play")){


        const vc = message.member.voice.channel;


        if(!vc)
            return message.reply(
                "❌ Join VC first"
            );


        const song =
        message.content.slice(5).trim();



        if(!song)
            return message.reply(
                "❌ Enter song"
            );



        try{


            await player.play(vc,song,{
                nodeOptions:{
                    metadata:{
                        channel:message.channel
                    },
                    leaveOnEnd:false,
                    leaveOnEmpty:true,
                    leaveOnEmptyCooldown:30000
                }
            });


            return message.reply(
                `🔎 Searching ${song}`
            );


        }catch(err){

            console.log(err);

            return message.reply(
                "❌ Music error"
            );

        }


    }





    if(msg === '!stop'){

        const queue =
        player.nodes.get(message.guild.id);


        if(!queue)
            return message.reply(
                "❌ Nothing playing"
            );


        queue.delete();


        return message.reply(
            "⏹️ Stopped"
        );

    }


});



console.log("VERSION 14");


client.login(process.env.TOKEN);