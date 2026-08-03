const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require("discord.js");

async function sendTicketPanel(channel) {

    const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle("<:ChatGPT_Image_Jul_19_2026_0451:1529099145351139328> Team InVorex Support Center")
        .setDescription(`
<:star:1520466761055473756> **Welcome to the Team Invorex Support Center.**

**__If you need assistance or would like to get in touch with our management team, select the appropriate ticket option below. Please choose the category that best matches your request to help us respond as quickly as possible.__**

<:Notes:1508801360223670333> ** Available Categories **

• **TvT** — Schedule or discuss Team vs Team matches.

• **Merge Request** — Request to merge your team with Team Invorex.

• **Team Join** — Apply to become a member of Team Invorex.

• **Ally Request** — Request a partnership or alliance with Team Invorex.

<:yellow_crown:1523021384622670029> **Please provide all necessary details after opening your ticket. Our staff will review your request and respond as soon as possible.**

<:grinders:1523569600489590897> **Thank you for choosing Team Invorex.**
`)
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
                value: "general"
            },
            {
                label: "TvT",
                description: "Schedule or discuss Team vs Team",
                value: "tvt"
            },
            {
                label: "Merge Request",
                description: "Request a team merge",
                value: "merge"
            },
            {
                label: "Team Join",
                description: "Apply for Team InVorex",
                value: "apply"
            },
            {
                label: "Ally Request",
                description: "Request an alliance",
                value: "ally"
            }
        );


    const row = new ActionRowBuilder()
        .addComponents(menu);


    await channel.send({
        embeds: [embed],
        components: [row]
    });

}


module.exports = {
    sendTicketPanel
};