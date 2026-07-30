require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
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
    return message.reply(`**Team Apply**

1. What's your IGN?
2. Cracked/Premium?
3. Gamemode Applying For (Pvper / Grinder)?
4. How much time can you contribute towards the team?
5. Your Tier? (If Sword)
6. Are you familiar with team community?
7. Your previous Team?
8. Why should we accept your Team Apply? How are you better than others?`);
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

client.login(process.env.TOKEN);