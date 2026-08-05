const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("dmall")
        .setDescription("Send a custom DM to every member of a role.")

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role whose members will receive the DM")
                .setRequired(true)
        )

        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Optional channel to mention")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Title of the DM")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");
        const title = interaction.options.getString("title");
        const message = interaction.options.getString("message");

        await interaction.reply({
            content: "📨 Sending DMs... Please wait.",
            ephemeral: true
        });

        let sent = 0;
        let failed = 0;

        const members = await interaction.guild.members.fetch();

        for (const [, member] of members) {

            if (member.user.bot) continue;
            if (!member.roles.cache.has(role.id)) continue;

            try {

                const embed = new EmbedBuilder()
                    .setColor("#FFFFFF")
                    .setTitle(title)
                    .setDescription(message)
                    .addFields(
                        channel
                            ? {
                                  name: "📢 Related Channel",
                                  value: `${channel}`,
                                  inline: false
                              }
                            : {
                                  name: "\u200B",
                                  value: "\u200B",
                                  inline: false
                              }
                    )
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    })
                    .setTimestamp();

                await member.send({
                    embeds: [embed]
                });

                sent++;

            } catch (err) {

                failed++;

            }

        }

        await interaction.editReply({
            content:
`✅ DM Process Finished

👥 Role: ${role}

✅ Sent: ${sent}
❌ Failed: ${failed}`
        });

    }

};