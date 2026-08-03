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

// Ticket System
const { sendTicketPanel } = require('./tickets/ticketCreate');
const interactionHandler = require('./tickets/interactionCreate');

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

(async () => {
    await player.extractors.loadMulti(DefaultExtractors);
})();

client.once('clientReady', () => {
    console.log(`${client.user.tag} is online!`);
});

// Ticket interactions
client.on('interactionCreate', interactionHandler);

// Music Events
player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`🎵 Now Playing: **${track.title}**`);
});

player.events.on('error', (queue, error) => {
    console.log(error);
});

// Commands
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    const msg = message.content.toLowerCase().trim();

    if (msg === '!ping') {
        return message.reply('🏓 Pong!');
    }

    if (msg === 'hello') {
        return message.reply('Hey! 👋 Welcome!');
    }

    if (msg === 'rules') {
        return message.reply('📜 Please check the rules channel!');
    }

    // Send Ticket Panel
    if (msg === '!ticketpanel') {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Admin only.');
        }

        await sendTicketPanel(message.channel);
        return message.reply('✅ Ticket panel sent!');
    }

    // Apply Command
    if (msg === 'apply') {

        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('Team Apply')
            .setDescription('Answer the following questions:')
            .addFields(
                { name: '1. IGN', value: "What's your IGN?" },
                { name: '2. Account', value: 'Cracked / Premium?' },
                { name: '3. Gamemode', value: 'Pvper / Grinder?' },
                { name: '4. Activity', value: 'How much time can you contribute?' },
                { name: '5. Tier', value: 'Your Tier? (If Sword)' },
                { name: '6. Community', value: 'Are you familiar with team community?' },
                { name: '7. Previous Team', value: 'Your previous Team?' },
                { name: '8. Why You?', value: 'Why should we accept you?' }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // Join VC
    if (msg === '!join') {

        const voiceChannel = message.member?.voice?.channel;

        if (!voiceChannel)
            return message.reply('❌ Please join a voice channel first.');

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        return message.reply('✅ Joined your voice channel!');
    }

    // Play
    if (msg.startsWith('!play')) {

        const voiceChannel = message.member?.voice?.channel;

        if (!voiceChannel)
            return message.reply('❌ Join a voice channel first.');

        const query = message.content.slice(5).trim();

        if (!query)
            return message.reply('❌ Enter a song name.');

        try {

            await player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel
                    },
                    leaveOnEnd: false,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 30000
                }
            });

            return message.reply(`🔎 Searching: **${query}**`);

        } catch (err) {

            console.log(err);
            return message.reply('❌ Music failed.');

        }
    }

    // Stop
    if (msg === '!stop') {

        const queue = player.nodes.get(message.guild.id);

        if (!queue)
            return message.reply('❌ Nothing playing.');

        queue.delete();

        return message.reply('⏹️ Stopped music.');
    }

});

console.log("VERSION 11");

client.login(process.env.TOKEN);