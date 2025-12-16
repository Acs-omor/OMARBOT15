const axios = require("axios");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

let xfont = null;
let yfont = null;
let categoryEmoji = null;

async function loadResources() {
 try {
 const [catRes, cmdRes, emojiRes] = await Promise.all([
 axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
 axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
 axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
 ]);
 xfont = catRes.data;
 yfont = cmdRes.data;
 categoryEmoji = emojiRes.data;
 } catch (err) {}
}

function fontConvert(text, type = "command") {
 const fontMap = type === "category" ? xfont : yfont;
 if (!fontMap) return text;
 return text.split("").map(ch => fontMap[ch] || ch).join("");
}

function getCategoryEmoji(cat) {
 return categoryEmoji?.[cat.toLowerCase()] || "🗂️";
}

function roleTextToString(role) {
 switch (role) {
 case 0: return "All Users";
 case 1: return "Group Admins";
 case 2: return "Bot Admin";
 default: return "Unknown";
 }
}

module.exports = {
 config: {
 name: "help",
 aliases: "menu",
 version: "2.0",
 author: "Saimx69x",
 countDown: 5,
 role: 0,
 shortDescription: { en: "Shows all commands or details." },
 longDescription: { en: "Display categories, command lists or specific command info." },
 category: "info",
 guide: { en: "{pn}, {pn} [command], {pn} -c [category]" }
 },

 onStart: async function ({ message, args, event, role }) {
 const prefix = getPrefix(event.threadID);

 if (!xfont || !yfont || !categoryEmoji) await loadResources();

 const categories = {};
 for (const [name, cmd] of commands) {
 if (!cmd?.config || typeof cmd.onStart !== "function") continue;
 if (cmd.config.role > role) continue;
 const cat = (cmd.config.category || "UNCATEGORIZED").toUpperCase();
 if (!categories[cat]) categories[cat] = [];
 categories[cat].push(name);
 }

 const input = args.join(" ").trim();

 if (args[0] === "-c" && args[1]) {
 const categoryName = args[1].toUpperCase();
 if (!categories[categoryName]) {
 return message.reply(`❌ Category "${categoryName}" not found.`);
 }

 const emoji = getCategoryEmoji(categoryName);
 const list = categories[categoryName];
 const total = list.length;

 let msg = "";
 msg += "━━━━━━━━━━━━━━\n";
 msg += `𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${emoji} | ${fontConvert(categoryName, "category")}\n`;
 msg += "╭──────୨ৎ──────╮\n";

 for (const cmd of list.sort()) {
 msg += `╎ ᯓ✧. ${fontConvert(cmd, "command")}\n`;
 }

 msg += "┕━─────୨ৎ─────━ᥫ᭡\n";
 msg += "• 𝙽𝚎𝚎𝚍 𝚑𝚎𝚕𝚙 𝚠𝚒𝚝𝚑 𝚊 𝚌𝚘𝚖𝚖𝚊𝚗𝚍? 𝚄𝚜𝚎 /𝚑𝚎𝚕𝚙 <𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚗𝚊𝚖𝚎>.\n";
 msg += "╭──────୨ৎ──────╮\n";
 msg += `╎ 🔢 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${total}\n`;
 msg += `╎ ⚡️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n`;
 msg += "╎ 👤 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐒𝐚𝐢𝐦𝐱𝟔𝟗𝐱\n";
 msg += "╰──────୨ৎ──────╯";

 return message.reply(msg);
 }

 if (!input) {
 let msg = "";
 msg += "━━━━━━━━━━━━━━\n";
 msg += "𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:\n";
 msg += "━━━━━━━━━━━━━━\n";

 for (const cat of Object.keys(categories).sort()) {
 msg += `┍─━〔 ${getCategoryEmoji(cat)} | ${fontConvert(cat, "category")} 〕\n`;
 for (const cmd of categories[cat].sort()) {
 msg += `╎ᯓ✧. ${fontConvert(cmd, "command")}\n`;
 }
 msg += "┕━─────୨ৎ─────━ᥫ᭡\n";
 }

 msg += "• 𝙽𝚎𝚎𝚍 𝚑𝚎𝚕𝚙 𝚠𝚒𝚝𝚑 𝚊 𝚌𝚘𝚖𝚖𝚊𝚗𝚍? 𝚄𝚜𝚎 /𝚑𝚎𝚕𝚙 <𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚗𝚊𝚖𝚎>.\n";
 msg += "╭──────୨ৎ──────╮\n";
 msg += `╎ 🔢 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${commands.size}\n`;
 msg += `╎ ⚡️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n`;
 msg += "╎ 👤 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐒𝐚𝐢𝐦𝐱𝟔𝟗𝐱\n";
 msg += "╰──────୨ৎ──────╯";

 return message.reply(msg);
 }

 const cmdName = input.toLowerCase();
 const cmd = commands.get(cmdName) || commands.get(aliases.get(cmdName));

 if (!cmd || !cmd.config) {
 return message.reply(`❌ Command "${cmdName}" not found.`);
 }

 const c = cmd.config;
 const usage = c.guide?.en?.replace(/{pn}/g, `${prefix}${c.name}`) || "No usage.";

 const msg = `
╭═══ [ 𝘊𝘖𝘔𝘔𝘈𝘕𝘋 𝘐𝘕𝘍𝘖 ] ═══╮
╎🧩 Name : ${c.name}
╎📦 Category : ${(c.category || "UNCATEGORIZED").toUpperCase()}
╎📜 Description: ${c.longDescription?.en || "No description."}
╎🔁 Aliases : ${c.aliases ? c.aliases.join(", ") : "None"}
╎⚙️ Version : ${c.version || "1.0"}
╎🔐 Permission : ${c.role} (${roleTextToString(c.role)})
╎⏱️ Cooldown : ${c.countDown || 5}s
╎👑 Author : ${c.author || "Unknown"}
╎📖 Usage : ${usage}
╰═════════୨ৎ═════════╯`;

 return message.reply(msg);
 }
};
