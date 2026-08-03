const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");


module.exports = async (interaction) => {


    // Open close reason modal
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

            .setPlaceholder("Enter reason...")

            .setStyle(TextInputStyle.Paragraph)

            .setRequired(true);



        const row = new ActionRowBuilder()

            .addComponents(reasonInput);



        modal.addComponents(row);



        return interaction.showModal(modal);

    }





    // Modal submit
    if (
        interaction.isModalSubmit() &&
        interaction.customId === "close_reason_modal"
    ) {



        const reason =
            interaction.fields.getTextInputValue("close_reason");



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




        await interaction.reply({
            content: "✅ Ticket closed.",
            ephemeral: true
        });



        await interaction.channel.send({

            embeds:[embed],

            components:[buttons]

        });



    }





    // Delete
    if (
        interaction.isButton() &&
        interaction.customId === "delete_ticket"
    ) {

        await interaction.channel.delete();

    }





    // Reopen
    if (
        interaction.isButton() &&
        interaction.customId === "reopen_ticket"
    ) {


        await interaction.reply({

            content:"🔓 Ticket reopened.",

            ephemeral:true

        });


        const embed = new EmbedBuilder()

            .setColor("#00FF00")

            .setTitle("🔓 Ticket Reopened")

            .setDescription(
                `Ticket reopened by ${interaction.user}`
            );


        return interaction.channel.send({

            embeds:[embed]

        });


    }


};