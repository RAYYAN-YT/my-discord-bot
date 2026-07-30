require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require('@discordjs/voice');

const { Innertube } = require('youtubei.js');


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

  console.log("MESSAGE:", message.content);

  if (message.author.bot) return;

  const msg = message.content.toLowerCase().trim();



  // Ping
  if (msg === '!ping') {
    return message.reply('🏓 Pong!');
  }



  // Hello
  if (msg === 'hello') {
    return message.reply('Hey! 👋 Welcome!');
  }



  // Rules
  if (msg === 'rules') {
    return message.reply('📜 Please check the rules channel!');
  }



  // Apply Embed
  if (msg === 'apply') {

    const embed = new EmbedBuilder()

      .setColor('#FFFFFF')

      .setTitle('Team Apply')

      .setDescription('Answer the following questions:')

      .setThumbnail(
        'https://cdn.discordapp.com/icons/1508771055551123547/5d2e04fac0200b6878b605986f56e447.webp'
      )

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


    return message.reply({
      embeds: [embed]
    });

  }





  // Play Music
  if (msg.startsWith('!play')) {


    const voiceChannel = message.member?.voice?.channel;


    if (!voiceChannel) {
      return message.reply(
        '❌ Join a voice channel first.'
      );
    }



    const song = message.content
      .substring(5)
      .trim();



    if (!song) {
      return message.reply(
        '❌ Enter a song name.'
      );
    }



    try {


      const yt = await Innertube.create();



      const search = await yt.search(song);



      const video = search.results.find(
        item => item.type === 'Video'
      );



      if (!video) {

        return message.reply(
          '❌ Song not found.'
        );

      }



      const connection = joinVoiceChannel({

        channelId: voiceChannel.id,

        guildId: message.guild.id,

        adapterCreator: message.guild.voiceAdapterCreator

      });



      const player = createAudioPlayer();



      const stream = await yt.download(

        video.id,

        {
          type: 'audio',
          quality: 'best'
        }

      );



      const resource = createAudioResource(
        stream
      );



      player.play(resource);



      connection.subscribe(player);



      return message.reply(
        `🎵 Playing: **${video.title.text}**`
      );



    } catch (error) {


      console.log("YOUTUBE ERROR:");

      console.log(error);



      return message.reply(
        '❌ Music failed. Check logs.'
      );


    }

  }






  // Join VC
  if (msg === '!join') {


    const voiceChannel = message.member?.voice?.channel;



    if (!voiceChannel) {

      return message.reply(
        '❌ Please join a voice channel first.'
      );

    }



    joinVoiceChannel({

      channelId: voiceChannel.id,

      guildId: message.guild.id,

      adapterCreator: message.guild.voiceAdapterCreator

    });



    return message.reply(
      '✅ Joined your voice channel!'
    );


  }


});



console.log("VERSION 8");


client.login(process.env.TOKEN);