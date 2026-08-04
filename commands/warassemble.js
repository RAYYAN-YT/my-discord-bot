const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warassemble")
        .setDescription("DM all members with a selected role.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role to ping")
                .setRequired(true)
        )

        .addChannelOption(option =>
            option
                .setName("voice")
                .setDescription("Voice channel to join")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Assembly message")
                .setRequired(true)
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");
        const voice = interaction.options.getChannel("voice");
        const customMessage = interaction.options.getString("message");

        await interaction.reply({
            content: "📨 Sending DMs...",
            ephemeral: true
        });

        const embed = new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle("⚔️ Team InVorex War Assemble")
            .setDescription(
`Hello!

${customMessage}

Please join the voice channel immediately.

**Voice Channel**
${voice}

See you there!`
            )
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Join Voice Channel")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/channels/${interaction.guild.id}/${voice.id}`
                )
        );

        let success = 0;
        let failed = 0;

        await interaction.guild.members.fetch();

        const members = role.members;

        for (const [, member] of members) {

            try {

                await member.send({
                    embeds: [embed],
                    components: [row]
                });

                success++;

            } catch {

                failed++;

            }

        }

        await interaction.editReply(
            `✅ Finished!\n\nSent: **${success}**\nFailed: **${failed}**`
        );

    }
};