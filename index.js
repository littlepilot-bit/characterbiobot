// ===================================
// OC RP BOT — EASY ALL-IN-ONE FILE
// ===================================

import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  PermissionsBitField
} from "discord.js";
import fs from "fs";
import cron from "node-cron";

// ---------- FOLDERS ----------
const DATA = "./data";
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA);

const FILES = {
  characters: `${DATA}/characters.json`,
  servers: `${DATA}/servers.json`,
  ships: `${DATA}/ships.json`,
  birthdays: `${DATA}/lastBirthdayRun.json`
};

for (const f of Object.values(FILES))
  if (!fs.existsSync(f)) fs.writeFileSync(f, "{}");

// ---------- BOT ----------
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ---------- COMMANDS ----------
const commands = [

  new SlashCommandBuilder()
    .setName("setup-server")
    .setDescription("Admin setup")
    .addChannelOption(o => o.setName("birthday_channel").setRequired(true))
    .addRoleOption(o => o.setName("birthday_role").setRequired(true))
    .addStringOption(o => o.setName("timezone").setRequired(true)),

  new SlashCommandBuilder()
    .setName("character-add")
    .setDescription("Create character")
    .addStringOption(o => o.setName("name").setRequired(true))
    .addStringOption(o => o.setName("fc").setRequired(true))
    .addStringOption(o => o.setName("bio").setRequired(true))
    .addStringOption(o => o.setName("backstory"))
    .addStringOption(o => o.setName("job"))
    .addStringOption(o => o.setName("relationship"))
    .addStringOption(o => o.setName("birthday"))
    .addStringOption(o => o.setName("age"))
    .addStringOption(o => o.setName("major"))
    .addStringOption(o => o.setName("clubs"))
    .addStringOption(o => o.setName("housing"))
    .addStringOption(o => o.setName("district"))
    .addStringOption(o => o.setName("avatar"))
    .addStringOption(o => o.setName("tupper")),

  new SlashCommandBuilder()
    .setName("character-view")
    .setDescription("View character")
    .addStringOption(o => o.setName("name").setRequired(true)),

  new SlashCommandBuilder()
    .setName("character-delete")
    .setDescription("Delete character")
    .addStringOption(o => o.setName("name").setRequired(true)),

  new SlashCommandBuilder()
    .setName("directory")
    .setDescription("Directory filters")
    .addUserOption(o => o.setName("member"))
    .addStringOption(o => o.setName("job"))
    .addStringOption(o => o.setName("major"))
    .addStringOption(o => o.setName("housing"))
    .addStringOption(o => o.setName("district")),

  new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Ship characters")
    .addStringOption(o => o.setName("char1").setRequired(true))
    .addStringOption(o => o.setName("char2").setRequired(true)),

  new SlashCommandBuilder()
    .setName("ships")
    .setDescription("View ships"),

  new SlashCommandBuilder()
    .setName("birthdays")
    .setDescription("View birthdays this month")
];

// ---------- UTIL ----------
const load = f => JSON.parse(fs.readFileSync(f));
const save = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// ---------- READY ----------
client.once("ready", async () => {
  console.log("🧠 OC RP BOT ONLINE");
  await client.application.commands.set(commands);
});

// ---------- INTERACTIONS ----------
client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;

  const chars = load(FILES.characters);
  const servers = load(FILES.servers);
  const ships = load(FILES.ships);

  const uid = i.user.id;
  if (!chars[uid]) chars[uid] = [];

  // SETUP
  if (i.commandName === "setup-server") {
    if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return i.reply({ content: "Admins only.", ephemeral: true });

    servers[i.guild.id] = {
      channel: i.options.getChannel("birthday_channel").id,
      role: i.options.getRole("birthday_role").id,
      tz: i.options.getString("timezone")
    };
    save(FILES.servers, servers);
    return i.reply({ content: "✅ Server setup complete.", ephemeral: true });
  }

  // ADD CHARACTER
  if (i.commandName === "character-add") {
    const c = {};
    for (const o of i.options.data)
      c[o.name] = o.value;
    c.server = i.guild.id;

    chars[uid].push(c);
    save(FILES.characters, chars);
    return i.reply({ content: `✅ ${c.name} created.`, ephemeral: true });
  }

  // VIEW CHARACTER
  if (i.commandName === "character-view") {
    const name = i.options.getString("name").toLowerCase();
    for (const u in chars) {
      const c = chars[u].find(x => x.name?.toLowerCase() === name);
      if (!c) continue;

      const embed = new EmbedBuilder()
  .setTitle(`🎭 ${char.name}`)
  .setThumbnail(char.avatar || null)
  .setColor(0x9b59b6);

if (char.fc) {
  embed.setDescription(`*Face Claim:* **${char.fc}**`);
}

const basics = [];
if (char.age) basics.push(`**Age:** ${char.age}`);
if (char.orientation) basics.push(`**Orientation:** ${char.orientation}`);
if (char.birthday) basics.push(`**Birthday:** ${char.birthday}`);

if (basics.length)
  embed.addFields({ name: "🧬 Basics", value: basics.join("\n"), inline: false });

const work = [];
if (char.job) work.push(`**Job:** ${char.job}`);
if (char.major) work.push(`**Major:** ${char.major}`);
if (char.clubs) work.push(`**Clubs:** ${char.clubs}`);

if (work.length)
  embed.addFields({ name: "💼 Occupation", value: work.join("\n"), inline: false });

if (char.housing) {
  embed.addFields({
    name: "🏠 Housing",
    value: char.district
      ? `${char.housing}\n*${char.district}*`
      : char.housing,
    inline: false
  });
}

if (char.bio)
  embed.addFields({ name: "📖 Bio", value: char.bio });

if (char.backstory)
  embed.addFields({ name: "🕯️ Backstory", value: char.backstory });

if (char.tupper)
  embed.addFields({
    name: "🎭 Tupper Prefix",
    value: `\`${char.tupper}\``
  });

      const f = [
        ["FC", c.fc],
        ["Job", c.job],
        ["Relationship", c.relationship],
        ["Major", c.major],
        ["Clubs", c.clubs],
        ["Housing", c.housing ? `${c.housing}${c.district ? " — " + c.district : ""}` : null],
        ["Backstory", c.backstory]
      ];

      f.forEach(x => x[1] && e.addFields({ name: x[0], value: x[1] }));

      return i.reply({ embeds: [e] });
    }
    return i.reply({ content: "Not found.", ephemeral: true });
  }

  // DIRECTORY
  if (i.commandName === "directory") {
    const job = i.options.getString("job")?.toLowerCase();
    const major = i.options.getString("major")?.toLowerCase();
    const housing = i.options.getString("housing")?.toLowerCase();
    const district = i.options.getString("district")?.toLowerCase();
    const member = i.options.getUser("member");

    const list = [];

    for (const u in chars) {
      if (member && u !== member.id) continue;

      chars[u].forEach(c => {
        if (c.server !== i.guild.id) return;
        if (job && !c.job?.toLowerCase().includes(job)) return;
        if (major && !c.major?.toLowerCase().includes(major)) return;
        if (housing && !c.housing?.toLowerCase().includes(housing)) return;
        if (district && !c.district?.toLowerCase().includes(district)) return;

        list.push(`• **${c.name}**`);
      });
    }

    return i.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("📖 Directory")
          .setDescription(list.join("\n") || "No results.")
      ]
    });
  }

  // SHIPS
  if (i.commandName === "ship") {
    if (!ships[i.guild.id]) ships[i.guild.id] = [];
    ships[i.guild.id].push({
      a: i.options.getString("char1"),
      b: i.options.getString("char2")
    });
    save(FILES.ships, ships);
    return i.reply("💞 Ship added.");
  }

  if (i.commandName === "ships") {
    const s = ships[i.guild.id] || [];
    return i.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("💞 Ships")
          .setDescription(s.map(x => `• ${x.a} × ${x.b}`).join("\n") || "None yet.")
      ]
    });
  }
});

// ---------- LOGIN ----------
client.login(process.env.TOKEN);
