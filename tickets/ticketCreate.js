const {
    ChannelType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const config = require("./ticketConfig");


module.exports = async (interaction) => {


    if (!interaction.isStringSelectMenu()) return;


    if (interaction.customId !== "ticket_menu") return;



    const type = interaction.values[0];


    const category = config.CATEGORIES[type];



    if (!category) {

        return interaction.reply({
            content: "❌ Invalid ticket category.",
            ephemeral: true
        });

    }



    const existing = interaction.guild.channels.cache.find(
        c => c.name === `${type}-${interaction.user.username.toLowerCase()}`
    );



    if (existing) {

        return interaction.reply({
            content: `❌ You already have a ticket: ${existing}`,
            ephemeral: true
        });

    }




    const channel = await interaction.guild.channels.create({

        name: `${type}-${interaction.user.username}`,

        type: ChannelType.GuildText,

        parent: category,


        permissionOverwrites: [

            {
                id: interaction.guild.roles.everyone,

                deny: [
                    PermissionFlagsBits.ViewChannel
                ]
            },


            {
                id: interaction.user.id,

                allow: [

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages,

                    PermissionFlagsBits.ReadMessageHistory

                ]

            },


            {
                id: config.STAFF_ROLE_ID,

                allow: [

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages,

                    PermissionFlagsBits.ReadMessageHistory

                ]

            }

        ]

    });





    const embed = new EmbedBuilder()

        .setColor("#FFFFFF")

        .setTitle("🎫 Team InVorex Ticket")

        .setDescription(
`
Welcome ${interaction.user} 👋

Thank you for contacting **Team InVorex Support Center**.

A staff member will respond to your ticket shortly.

**Ticket Details**

📌 Category:
\`${type}\`

📝 Please provide all required information.

<:yellow_crown:1523021384622670029> Please be patient while our staff reviews your request.

**Team InVorex ❤️**
`
        )

        .setTimestamp()

        .setFooter({
            text: "Team InVorex Support"
        });






    const buttons = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId("close_ticket")

                .setLabel("Close Ticket")

                .setEmoji("🔒")

                .setStyle(ButtonStyle.Danger)

        );






    await channel.send({

        content: `${interaction.user} <@&${config.STAFF_ROLE_ID}>`,

        embeds: [embed],

        components: [buttons]

    });






    await interaction.reply({

        content: `✅ Your ticket has been created: ${channel}`,

        ephemeral: true

    });



};