const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("./ticketConfig");

module.exports = async (interaction) => {

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== "ticket_menu") return;

    const type = interaction.values[0];

    const categoryId = config.CATEGORIES[type];

    const existing = interaction.guild.channels.cache.find(c =>
        c.parentId === categoryId &&
        c.topic === interaction.user.id
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
        parent: categoryId,
        topic: interaction.user.id,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
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
        .setColor("Yellow")
        .setTitle("🎫 Ticket Created")
        .setDescription(
`Welcome ${interaction.user}

A staff member will assist you shortly.

Please explain your request in detail.`
        );

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("🔒 Close")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("close_reason")
            .setLabel("📝 Close With Reason")
            .setStyle(ButtonStyle.Secondary)
    );

    await channel.send({
        content: `<@&${config.STAFF_ROLE_ID}> ${interaction.user}`,
        embeds: [embed],
        components: [buttons]
    });

    // Auto trigger apply message
    if (type === "apply") {
        await channel.send("apply");
    }

    await interaction.reply({
        content: `✅ Ticket created: ${channel}`,
        ephemeral: true
    });

};