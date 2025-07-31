const mysql = require("mysql2/promise");
let db;

const config = {
    mysql: {
        host: "",
        user: "",
        password: "",
        database: ""
    },
}

on("onResourceStart", async (resourceName) => {
    if (resourceName === GetCurrentResourceName()) {
        try {
            db = await mysql.createPool(config.mysql);
        } catch (err) {
            console.error("Error on resource start:", err);
        }
    }
});

on('playerConnecting', async (name, setKickReason, deferrals) => {
    deferrals.defer();

    const source = global.source;

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        if (!db) {
            deferrals.done();
            return;
        }

        const identifiers = getPlayerIdentifiers(source);
        const discordId = identifiers.find(id => id.startsWith("discord:"))?.split(":")[1];

        if (!discordId) {
            deferrals.done("You must have Discord linked to join this server.");
            return;
        }

        const [rows] = await db.query("SELECT reason FROM bans WHERE discId = ? LIMIT 1", [discordId]);

        if (rows.length > 0) {
            const reason = rows[0].reason || "You are banned from this server.";
            deferrals.done(`You are banned from this server for ${reason}`);
            return;
        }

        deferrals.done();

    } catch (err) {
        console.error("Error checking ban list:", err);
        deferrals.done("An unexpected error occurred while checking your connection.");
    }
});


function getPlayerIdentifiers(src) {
    const ids = [];
    for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
        ids.push(GetPlayerIdentifier(src, i));
    }
    return ids;
}
