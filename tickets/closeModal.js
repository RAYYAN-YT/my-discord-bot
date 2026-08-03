const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== "close_ticket") return;

    await interaction.reply({
        content: "🔒 Closing ticket in **5 seconds...**",
        ephemeral: true
    });

    setTimeout(async () => {

        try {
            await interaction.channel.delete();
        } catch (err) {
            console.log(err);
        }

    }, 5000);

};