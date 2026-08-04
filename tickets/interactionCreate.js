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



    // Prevent multiple tickets

    const existing = interaction.guild.channels.cache.find(
        c => c.topic === interaction.user.id
    );


    if (existing) {

        return interaction.reply({
            content: `❌ You already have a ticket: ${existing}`,
            ephemeral: true
        });

    }



    // Create Ticket Channel

    const channel = await interaction.guild.channels.create({

        name: `${type}-${interaction.user.username}`,

        type: ChannelType.GuildText,

        parent: category,


        // Store owner ID for transcript/logs
        topic: interaction.user.id,


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

        .setTitle("🎫 Team InVorex Support")

        .setDescription(`
Welcome ${interaction.user}!

Thank you for creating a support ticket.

**Category**
\`${type.toUpperCase()}\`

Please explain your issue in detail and wait for a staff member to respond.

<:yellow_crown:1523021384622670029> A member of Team InVorex will assist you shortly.
`)

        .setTimestamp()

        .setFooter({
            text: "Team InVorex Support"
        });






    const row = new ActionRowBuilder()
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

        components: [row]

    });






    await interaction.reply({

        content: `✅ Your ticket has been created: ${channel}`,

        ephemeral: true

    });


};