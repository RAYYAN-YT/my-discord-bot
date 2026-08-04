const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");

const config = require("./ticketConfig");

module.exports = async (interaction) => {

    // Open Close Modal
    if (
        interaction.isButton() &&
        interaction.customId === "close_ticket"
    ) {

        const modal = new ModalBuilder()
            .setCustomId("close_reason_modal")
            .setTitle("Close Ticket");

        const reasonInput = new TextInputBuilder()
            .setCustomId("close_reason")
            .setLabel("Reason for closing ticket")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Enter reason...")
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(reasonInput)
        );

        return interaction.showModal(modal);
    }


    // Modal Submit
    if (
        interaction.isModalSubmit() &&
        interaction.customId === "close_reason_modal"
    ) {

        const reason = interaction.fields.getTextInputValue("close_reason");

        // DM Ticket Owner
        try {

            if (interaction.channel.topic) {

                const user = await interaction.client.users.fetch(interaction.channel.topic);

                const dmEmbed = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle("🎫 Your Ticket Has Been Closed")
                    .setDescription(`
Your ticket in **Team InVorex** has been closed.

**Closed By**
${interaction.user}

**Reason**
${reason}

Thank you for contacting Team InVorex ❤️
`)
                    .setTimestamp();

                await user.send({
                    embeds: [dmEmbed]
                });

            }

        } catch (err) {

            console.log("Couldn't DM ticket owner.");

        }


        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🔒 Ticket Closed")
            .setDescription(`
This ticket has been closed.

**Closed By**
${interaction.user}

**Reason**
${reason}
`)
            .setTimestamp();

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("delete_ticket")
                    .setLabel("Delete Ticket")
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("reopen_ticket")
                    .setLabel("Reopen Ticket")
                    .setEmoji("🔓")
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({
            content: "✅ Ticket closed.",
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [buttons]
        });

        return;
    }


    // Delete Ticket
if (
    interaction.isButton() &&
    interaction.customId === "delete_ticket"
) {

    const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL_ID);

    if (logChannel) {

        const logEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🗑️ Ticket Deleted")
            .addFields(
                {
                    name: "📁 Ticket",
                    value: interaction.channel.name,
                    inline: true
                },
                {
                    name: "👮 Deleted By",
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: "👤 Ticket Owner",
                    value: interaction.channel.topic
                        ? `<@${interaction.channel.topic}>`
                        : "Unknown",
                    inline: false
                }
            )
            .setTimestamp();

        await logChannel.send({
            embeds: [logEmbed]
        });

    }

    return interaction.channel.delete();

}


    // Reopen Ticket
    if (
        interaction.isButton() &&
        interaction.customId === "reopen_ticket"
    ) {

        await interaction.reply({
            content: "🔓 Ticket reopened.",
            ephemeral: true
        });

        const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("🔓 Ticket Reopened")
            .setDescription(`Ticket reopened by ${interaction.user}`)
            .setTimestamp();

        return interaction.channel.send({
            embeds: [embed]
        });

    }

};