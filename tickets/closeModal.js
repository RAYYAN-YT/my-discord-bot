const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");


module.exports = async (interaction) => {


    // CLOSE BUTTON
    if (interaction.isButton() && interaction.customId === "close_ticket") {


        const modal = new ModalBuilder()

            .setCustomId("close_reason_modal")

            .setTitle("Close Ticket Reason");



        const reason = new TextInputBuilder()

            .setCustomId("reason")

            .setLabel("Why are you closing this ticket?")

            .setStyle(TextInputStyle.Paragraph)

            .setPlaceholder("Enter closing reason...")

            .setRequired(true);



        const row = new ActionRowBuilder()
            .addComponents(reason);



        modal.addComponents(row);



        return interaction.showModal(modal);

    }





    // MODAL SUBMIT
    if (interaction.isModalSubmit() && interaction.customId === "close_reason_modal") {


        const reason =
            interaction.fields.getTextInputValue("reason");



        await interaction.channel.permissionOverwrites.edit(
            interaction.channel.guild.roles.everyone,
            {
                ViewChannel: false
            }
        );



        const embed = new EmbedBuilder()

            .setColor("#FF0000")

            .setTitle("🔒 Ticket Closed")

            .setDescription(
`
This ticket has been closed.

**Closed By:**
${interaction.user}

**Reason:**
${reason}
`
            )

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





        await interaction.channel.send({

            embeds:[embed],

            components:[buttons]

        });



        return interaction.reply({

            content:"✅ Ticket closed.",

            ephemeral:true

        });

    }





    // DELETE TICKET
    if (interaction.isButton() && interaction.customId === "delete_ticket") {


        return interaction.channel.delete();


    }







    // REOPEN TICKET
    if (interaction.isButton() && interaction.customId === "reopen_ticket") {


        await interaction.channel.permissionOverwrites.edit(

            interaction.channel.guild.roles.everyone,

            {

                ViewChannel:false

            }

        );



        await interaction.reply({

            content:"🔓 Ticket reopened.",

            ephemeral:true

        });



        const embed = new EmbedBuilder()

            .setColor("#00FF00")

            .setTitle("🔓 Ticket Reopened")

            .setDescription(
`
This ticket has been reopened by ${interaction.user}.

Staff can continue helping here.
`
            );



        return interaction.channel.send({

            embeds:[embed]

        });


    }


};