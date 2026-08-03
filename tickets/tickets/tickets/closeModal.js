const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    Events
} = require("discord.js");

module.exports = (client) => {

    client.on(Events.InteractionCreate, async interaction => {

        // Close instantly
        if (interaction.isButton() && interaction.customId === "close_ticket") {

            await interaction.reply({
                content: "🔒 Closing ticket in 3 seconds...",
                ephemeral: true
            });

            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 3000);

            return;
        }

        // Show reason modal
        if (interaction.isButton() && interaction.customId === "close_reason") {

            const modal = new ModalBuilder()
                .setCustomId("close_reason_modal")
                .setTitle("Close Ticket");

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Reason for closing")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

            return interaction.showModal(modal);
        }

        // Modal submitted
        if (interaction.isModalSubmit() && interaction.customId === "close_reason_modal") {

            const reason = interaction.fields.getTextInputValue("reason");

            const userId = interaction.channel.topic;

            try {

                const user = await client.users.fetch(userId);

                await user.send(
`Your **Team InVorex** ticket has been closed.

**Reason:**
${reason}`
                );

            } catch {}

            await interaction.reply({
                content: "✅ Reason sent. Closing ticket...",
                ephemeral: true
            });

            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 3000);
        }

    });

};