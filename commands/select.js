const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const RESULT_CHANNEL_ID = "1534467634744266794";

module.exports = {

    data: new SlashCommandBuilder()
        .setName("select")
        .setDescription("Announce a selected player.")

        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Selected player")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        const channel = interaction.guild.channels.cache.get(
            RESULT_CHANNEL_ID
        );

        if (!channel) {
            return interaction.reply({
                content: "❌ Result channel not found.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle("<:Green_Crown:1523571607409262642> Test Results")
            .setDescription(
`**Player:** ${user}

**Result:** Selected ✅`
            )
            .addFields({
                name: "Selection Status",
                value:
`Congratulations on your selection!

Your performance during the testing process demonstrated the skills and commitment we were looking for.

Welcome to **Team InVorex!** ❤️`
            })
            .setThumbnail(user.displayAvatarURL({
                dynamic: true,
                size: 1024
            }))
            .setFooter({
                text: "Team InVorex"
            })
            .setTimestamp();

        try {

            await channel.send({
                content: `${user}`,
                embeds: [embed]
            });

            await interaction.reply({
                content: "✅ Selection message sent.",
                ephemeral: true
            });

        } catch (err) {

            console.error("SELECT COMMAND ERROR:");
            console.error(err);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `❌ ${err.message}`,
                    ephemeral: true
                });
            }

        }

    }

};