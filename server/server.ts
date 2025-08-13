import mysql, { Pool } from "mysql2/promise";

let db: Pool | null = null;

interface MysqlConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

function getConvarValue(name: string, defaultValue = ""): string {
  return GetConvar(name, defaultValue);
}

function loadMysqlConfig(): MysqlConfig {
  return {
    host: getConvarValue("mysql_config").match(/host=([^;]+)/)?.[1] ?? "",
    user: getConvarValue("mysql_config").match(/user=([^;]+)/)?.[1] ?? "",
    password: getConvarValue("mysql_config").match(/password=([^;]+)/)?.[1] ?? "",
    database: getConvarValue("mysql_config").match(/database=([^;]+)/)?.[1] ?? "",
  };
}

on("onResourceStart", async (resourceName: string) => {
  if (resourceName !== GetCurrentResourceName()) return;

  try {
    const config = loadMysqlConfig();

    if (!config.host || !config.user || !config.password || !config.database) {
      console.error("MySQL configuration missing or incomplete. Check your vox.cfg convars.");
      return;
    }

    db = await mysql.createPool(config);
  } catch (err) {
    console.error("Error creating MySQL pool:", err);
  }
});

on("playerConnecting", async (name: string, setKickReason: (reason: string) => void, deferrals: any) => {
  deferrals.defer();

  const src = global.source;
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    if (!db) {
      deferrals.done();
      return;
    }

    const identifiers = getPlayerIdentifiers(src);
    const discordId = identifiers.find(id => id.startsWith("discord:"))?.split(":")[1];

    if (!discordId) {
      deferrals.done("You must have Discord linked to join this server.");
      return;
    }

    const [rows] = await db.query("SELECT reason FROM bans WHERE discId = ? LIMIT 1", [discordId]);

    if ((rows as any[]).length > 0) {
      const reason = (rows as any)[0].reason || "You are banned from this server.";
      deferrals.done(`You are banned from this server for ${reason}`);
      return;
    }

    deferrals.done();
  } catch (err) {
    console.error("Error checking ban list:", err);
    deferrals.done("An unexpected error occurred while checking your connection.");
  }
});

function getPlayerIdentifiers(src: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < GetNumPlayerIdentifiers(src as any); i++) {
    ids.push(GetPlayerIdentifier(src as any, i));
  }
  return ids;
}