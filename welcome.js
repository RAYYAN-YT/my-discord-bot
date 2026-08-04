const { EmbedBuilder } = require("discord.js");

const WELCOME_CHANNEL_ID = "1524607789563908166";


module.exports = (client) => {

    client.on("guildMemberAdd", async (member) => {

        const channel = member.guild.channels.cache.get(
            WELCOME_CHANNEL_ID
        );

        if (!channel) return;


        const embed = new EmbedBuilder()

            .setColor("#FFFFFF")

            .setAuthor({
                name: member.user.username,
                iconURL: member.user.displayAvatarURL({
                    dynamic: true
                })
            })

            .setThumbnail(
                member.user.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                })
            )

            .setDescription(`
<:ChatGPT_Image_Jul_19_2026_04_51_:1529099145351139328> **Welcome to Team InVorex!**

> ⭐ We're excited to have you as part of our community. Take a moment to explore the server, read the rules, and choose your roles. Whether you're here to compete, connect, or simply enjoy the experience, we hope you'll feel right at home.

<:Notes:1508801360223670333> **__Member Count__** #${member.guild.memberCount}
            `)

            .setImage(
                member.guild.bannerURL({
                    size: 1024
                })
            )

            .setFooter({
                text: "InVorex Manager",
                iconURL: member.client.user.displayAvatarURL()
            })

            .setTimestamp();


        await channel.send({
            content: `${member}`,
            embeds: [embed]
        });


    });

};