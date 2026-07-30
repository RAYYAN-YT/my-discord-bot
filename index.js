require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase().trim();

  // Ping
  if (msg === '!ping') {
    return message.reply('🏓 Pong!');
  }

  // Join VC
  if (msg === '!join') {
    const channel = message.member.voice.channel;

    if (!channel) {
      return message.reply('❌ First join a voice channel!');
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    return message.reply('✅ Joined your voice channel!');
  }

  // Hello
  if (msg === 'hello') {
    return message.reply('Hey! 👋 Welcome!');
  }

  // Rules
  if (msg === 'rules') {
    return message.reply('📜 Please check the rules channel!');
  }

  // Team Apply
  if (msg === 'apply') {
    return message.channel.send(`**Team Apply**

Answer the following questions:

1. What's ur IGN?
2. Cracked/Premium?
3. Gamemode Applying For (Pvper / Grinder)?
4. How much time can you contribute towards the team?
5. Your Tier? (If Sword)
6. Are you familiar with team community?
7. Your previous Team?
8. Why should we accept your Team Apply? How are you better than others?`);
  }
});

client.login(process.env.TOKEN);