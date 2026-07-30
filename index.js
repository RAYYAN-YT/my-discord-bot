require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} is online!`);
});

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

if (msg === 'apply') {

    const embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Team Apply')
      .setDescription('Answer the following questions:')
      .setThumbnail('https://cdn.discordapp.com/icons/1508771055551123547/5d2e04fac0200b6878b605986f56e447.webp')
      .addFields(
        { name: '1. IGN', value: "What's your IGN?" },
        { name: '2. Account', value: 'Cracked / Premium?' },
        { name: '3. Gamemode', value: 'Pvper / Grinder?' },
        { name: '4. Activity', value: 'How much time can you contribute towards the team?' },
        { name: '5. Tier', value: 'Your Tier? (If Sword)' },
        { name: '6. Community', value: 'Are you familiar with team community?' },
        { name: '7. Previous Team', value: 'Your previous Team?' },
        { name: '8. Why You?', value: 'Why should we accept your Team Apply? How are you better than others?' }
      )
      .setFooter({
        text: 'Good luck with your application!'
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
}

  if (msg === '!join') {
    const voiceChannel = message.member?.voice?.channel;

    if (!voiceChannel) {
      return message.reply('❌ Please join a voice channel first.');
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    return message.reply('✅ Joined your voice channel!');
  }
});
console.log("VERSION 5");

client.login(process.env.TOKEN);
