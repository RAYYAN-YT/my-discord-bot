require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  // Ping command
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  }

  // Auto replies
  if (message.content.toLowerCase() === 'hello') {
    message.reply('Hey! 👋 Welcome!');
  }

  if (message.content.toLowerCase() === 'rules') {
    message.reply('📜 Please check the rules channel!');
  }

  // Team Apply
  if (message.content.toLowerCase() === 'apply') {
    message.channel.send(
`**Team Apply**

Answer the following questions:

1. What's ur IGN?
2. Cracked/Premium?
3. Gamemode Applying For (Pvper / Grinder)?
4. How much time can you contribute towards the team?
5. Your Tier? (If Sword)
6. Are you familiar with team community?
7. Your previous Team?
8. Why should we accept your Team Apply? How are you better than others?`
    );
  }
});

client.login(process.env.TOKEN);