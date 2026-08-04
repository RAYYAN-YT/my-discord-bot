// Ticket + Slash Commands

client.on('interactionCreate', async (interaction) => {
    try {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            if (interaction.commandName === "warassemble") {
                const command = require("./commands/warassemble");
                return command.execute(interaction);
            }

        }

        // Ticket Dropdown
        if (interaction.isStringSelectMenu()) {
            return ticketHandler(interaction);
        }

        // Ticket Buttons
        if (interaction.isButton()) {
            return closeHandler(interaction);
        }

        // Ticket Modals
        if (interaction.isModalSubmit()) {
            return closeHandler(interaction);
        }

    } catch (err) {

        console.error(err);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Something went wrong.",
                ephemeral: true
            });
        }

    }
});