const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require("discord.js");

async function sendTicketPanel(channel) {

    const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("🎫 Team InVorex Support Center")
        .setDescription(`⭐ **Welcome to the Team InVorex Support Center.**

If you need assistance or would like to get in touch with our management team, select the appropriate ticket option below.

## 📋 Available Categories

⚔️ **TvT**
Schedule or discuss Team vs Team matches.

🤝 **Merge Request**
Request to merge your team with Team InVorex.

👑 **Team Apply**
Apply to become a member of Team InVorex.

💙 **Ally Request**
Request a partnership or alliance with Team InVorex.

Please provide all necessary details after opening your ticket.

Thank you for choosing **Team InVorex ❤️**`)
        // Replace this with your banner image URL if you want
        .setImage("https://media.discordapp.net/attachments/1522622724466413639/1529096171791056906/2ada8202-18d5-456c-8692-f12d58146594.png?ex=6a712c08&is=6a6fda88&hm=6fe233f3c8cc876272ebe3abef090992a9f63161e87765438c055a1f54e8fe8f&=&format=webp&quality=lossless&width=1024&height=409")
        .setFooter({
            text: "Team InVorex Support Center"
        });

    const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket_menu")
        .setPlaceholder("📩 Select a Ticket Category")
        .addOptions(
            {
                label: "General Support",
                description: "General questions or support",
                value: "general",
                emoji: "🎫"
            },
            {
                label: "Team Apply",
                description: "Apply for Team InVorex",
                value: "apply",
                emoji: "👑"
            },
            {
                label: "TvT",
                description: "Team vs Team",
                value: "tvt",
                emoji: "⚔️"
            },
            {
                label: "Merge Request",
                description: "Merge your team",
                value: "merge",
                emoji: "🤝"
            },
            {
                label: "Ally Request",
                description: "Become an ally",
                value: "ally",
                emoji: "💙"
            }
        );

    const row = new ActionRowBuilder().addComponents(menu);

    await channel.send({
        embeds: [embed],
        components: [row]
    });

}

module.exports = {
    sendTicketPanel
};