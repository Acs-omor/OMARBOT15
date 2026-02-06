const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");

try {
  registerFont(path.join(__dirname, "fonts", "Poppins-Bold.ttf"), { family: "Poppins", weight: "bold" });
  registerFont(path.join(__dirname, "fonts", "Poppins-Regular.ttf"), { family: "Poppins" });
  registerFont(path.join(__dirname, "fonts", "Poppins-SemiBold.ttf"), { family: "Poppins", weight: "600" });
  registerFont(path.join(__dirname, "fonts", "Montserrat-Bold.ttf"), { family: "Montserrat", weight: "bold" });
} catch (e) {}

const { config } = global.GoatBot;

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money"],
    version: "3.0",
    author: "Mahi",
    countDown: 1,
    role: 0,
    description: "Premium banking system with futuristic design",
    category: "economy",
    guide: { en: "" }
  },

  onStart: async function ({ message, usersData, event, args, api }) {
    const senderID = event.senderID;
    const allowedUIDs = [config.adminBot, ...config.adminBot];

    const formatMoney = (num) => {
      const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
      let unit = 0;
      let number = Number(num);

      while (number >= 1000 && unit < units.length - 1) {
        number /= 1000;
        unit++;
      }

      return `${number.toFixed(2)}${units[unit]}`;
    };

    const isValidAmount = (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    };

    const getTargetUID = () => {
      if (event.messageReply) return event.messageReply.senderID;
      if (Object.keys(event.mentions).length > 0) return Object.keys(event.mentions)[0];
      if (!isNaN(args[1])) return args[1];
      return null;
    };

    const getAmount = () => args[args.length - 1];

    const createHexagon = (ctx, x, y, size, color, stroke = false) => {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (stroke) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        ctx.fill();
      }
      ctx.restore();
    };

    if (args[0] === "help") {
      const canvas = createCanvas(1000, 600);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 1000, 600);
      gradient.addColorStop(0, "#000814");
      gradient.addColorStop(0.5, "#001d3d");
      gradient.addColorStop(1, "#003566");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1000, 600);

      for (let i = 0; i < 15; i++) {
        createHexagon(ctx, Math.random() * 1000, Math.random() * 600, 20 + Math.random() * 30, "rgba(0, 255, 255, 0.03)", true);
      }

      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 48px Montserrat, Arial";
      ctx.fillText("💠 BANKING SYSTEM", 280, 100);

      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(280, 120);
      ctx.lineTo(720, 120);
      ctx.stroke();

      const commands = [
        "🔹 {pn} → View your balance",
        "🔹 {pn} @user → View other's balance",
        "🔹 {pn} transfer UID amount → Send money",
        "🔹 {pn} request amount → Request from admin",
        "🔹 {pn} add UID amount → Admin add money",
        "🔹 {pn} delete UID amount → Admin remove money"
      ];

      ctx.fillStyle = "#ffffff";
      ctx.font = "26px Poppins, Arial";
      for (let i = 0; i < commands.length; i++) {
        ctx.fillText(commands[i], 150, 200 + (i * 55));
      }

      ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
      ctx.font = "italic 20px Arial";
      ctx.fillText("Quantum Banking v3.0 • Designed by Mahi", 300, 560);

      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "tmp", `help_${Date.now()}.png`);
      if (!fs.existsSync(path.join(__dirname, "tmp"))) fs.mkdirSync(path.join(__dirname, "tmp"));
      fs.writeFileSync(imagePath, buffer);

      message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      }, 5000);
      return;
    }

    if (args[0] === "add") {
      if (!allowedUIDs.includes(senderID)) return message.reply("❌ Permission denied.");
      
      const targetUID = getTargetUID();
      const amount = getAmount();

      if (!targetUID) return message.reply("❌ User not found.");
      if (!isValidAmount(amount)) return message.reply("❌ Invalid amount.");

      const userData = await usersData.get(targetUID) || { money: "0" };
      const userName = userData.name || "Unknown";
      const newBalance = (Number(userData.money) + Number(amount)).toString();
      await usersData.set(targetUID, { money: newBalance });

      const canvas = createCanvas(900, 500);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 900, 500);
      gradient.addColorStop(0, "#064e3b");
      gradient.addColorStop(0.5, "#065f46");
      gradient.addColorStop(1, "#047857");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 900, 500);

      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "rgba(167, 243, 208, 0.1)";
        createHexagon(ctx, Math.random() * 900, Math.random() * 500, 15 + Math.random() * 20, "rgba(167, 243, 208, 0.1)");
      }

      try {
        const avatarUrl = `https://nagi-sheishiro7x.vercel.app/pp?uid=${targetUID}`;
        const profileImage = await loadImage(avatarUrl);
        ctx.save();
        createHexagon(ctx, 150, 150, 70, "transparent");
        ctx.clip();
        ctx.drawImage(profileImage, 80, 80, 140, 140);
        ctx.restore();
      } catch (error) {
        createHexagon(ctx, 150, 150, 70, "#0d9488");
        ctx.fillStyle = "#ffffff";
        ctx.font = "40px Arial";
        ctx.fillText("👤", 130, 160);
      }

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      createHexagon(ctx, 150, 150, 75, "#ffffff", true);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Montserrat, Arial";
      ctx.fillText("💰 FUNDS CREDITED", 350, 100);

      ctx.fillStyle = "#a7f3d0";
      ctx.font = "24px Poppins, Arial";
      ctx.fillText(`👤 ${userName}`, 350, 160);
      ctx.fillText(`🆔 ${targetUID}`, 350, 200);
      ctx.fillText(`💎 +${formatMoney(amount)}$`, 350, 240);
      ctx.fillText(`📊 Old: ${formatMoney(userData.money)}$`, 350, 280);
      ctx.fillText(`📈 New: ${formatMoney(newBalance)}$`, 350, 320);

      ctx.beginPath();
      ctx.moveTo(350, 350);
      ctx.lineTo(850, 350);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "italic 18px Arial";
      ctx.fillText("Admin Transaction • Secure Network", 350, 400);

      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "tmp", `add_${Date.now()}.png`);
      fs.writeFileSync(imagePath, buffer);

      message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      }, 5000);
      return;
    }

    if (args[0] === "delete") {
      if (!allowedUIDs.includes(senderID)) return message.reply("❌ Permission denied.");
      
      const targetUID = getTargetUID();
      const amount = getAmount();

      if (!targetUID) return message.reply("❌ User not found.");
      if (!isValidAmount(amount)) return message.reply("❌ Invalid amount.");

      const userData = await usersData.get(targetUID) || { money: "0" };
      const userName = userData.name || "Unknown";
      const currentBalance = Number(userData.money);

      if (currentBalance < Number(amount)) return message.reply("❌ Insufficient balance.");

      const newBalance = (currentBalance - Number(amount)).toString();
      await usersData.set(targetUID, { money: newBalance });

      const canvas = createCanvas(900, 500);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 900, 500);
      gradient.addColorStop(0, "#450a0a");
      gradient.addColorStop(0.5, "#7f1d1d");
      gradient.addColorStop(1, "#991b1b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 900, 500);

      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = "rgba(252, 165, 165, 0.1)";
        createHexagon(ctx, Math.random() * 900, Math.random() * 500, 15 + Math.random() * 20, "rgba(252, 165, 165, 0.1)");
      }

      try {
        const avatarUrl = `https://nagi-sheishiro7x.vercel.app/pp?uid=${targetUID}`;
        const profileImage = await loadImage(avatarUrl);
        ctx.save();
        createHexagon(ctx, 150, 150, 70, "transparent");
        ctx.clip();
        ctx.drawImage(profileImage, 80, 80, 140, 140);
        ctx.restore();
      } catch (error) {
        createHexagon(ctx, 150, 150, 70, "#dc2626");
        ctx.fillStyle = "#ffffff";
        ctx.font = "40px Arial";
        ctx.fillText("👤", 130, 160);
      }

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      createHexagon(ctx, 150, 150, 75, "#ffffff", true);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Montserrat, Arial";
      ctx.fillText("💰 FUNDS DEBITED", 350, 100);

      ctx.fillStyle = "#fca5a5";
      ctx.font = "24px Poppins, Arial";
      ctx.fillText(`👤 ${userName}`, 350, 160);
      ctx.fillText(`🆔 ${targetUID}`, 350, 200);
      ctx.fillText(`💎 -${formatMoney(amount)}$`, 350, 240);
      ctx.fillText(`📊 Old: ${formatMoney(currentBalance)}$`, 350, 280);
      ctx.fillText(`📉 New: ${formatMoney(newBalance)}$`, 350, 320);

      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "tmp", `delete_${Date.now()}.png`);
      fs.writeFileSync(imagePath, buffer);

      message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      }, 5000);
      return;
    }

    if (args[0] === "transfer") {
      const targetUID = getTargetUID();
      const amount = getAmount();

      if (!targetUID) return message.reply("❌ User not found.");
      if (targetUID === senderID) return message.reply("❌ Can't transfer to yourself.");
      if (!isValidAmount(amount)) return message.reply("❌ Invalid amount.");

      const senderData = await usersData.get(senderID) || { money: "0" };
      const recipientData = await usersData.get(targetUID) || { money: "0" };
      const recipientName = recipientData.name || "Unknown";

      const senderBalance = Number(senderData.money);
      const recipientBalance = Number(recipientData.money);

      if (senderBalance < Number(amount)) return message.reply("❌ Insufficient funds.");

      const updatedSenderBalance = (senderBalance - Number(amount)).toString();
      const updatedRecipientBalance = (recipientBalance + Number(amount)).toString();

      await usersData.set(senderID, { money: updatedSenderBalance });
      await usersData.set(targetUID, { money: updatedRecipientBalance });

      const canvas = createCanvas(1000, 600);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 1000, 600);
      gradient.addColorStop(0, "#0c4a6e");
      gradient.addColorStop(0.3, "#0369a1");
      gradient.addColorStop(0.7, "#0284c7");
      gradient.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1000, 600);

      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        createHexagon(ctx, Math.random() * 1000, Math.random() * 600, 25 + Math.random() * 30, "transparent", true);
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 42px Montserrat, Arial";
      ctx.fillText("💎 QUANTUM TRANSFER", 300, 100);

      try {
        const senderAvatar = `https://nagi-sheishiro7x.vercel.app/pp?uid=${senderID}`;
        const recipientAvatar = `https://nagi-sheishiro7x.vercel.app/pp?uid=${targetUID}`;
        
        const senderImg = await loadImage(senderAvatar);
        const recipientImg = await loadImage(recipientAvatar);
        
        ctx.save();
        createHexagon(ctx, 200, 200, 60, "transparent");
        ctx.clip();
        ctx.drawImage(senderImg, 140, 140, 120, 120);
        ctx.restore();

        ctx.save();
        createHexagon(ctx, 800, 200, 60, "transparent");
        ctx.clip();
        ctx.drawImage(recipientImg, 740, 140, 120, 120);
        ctx.restore();
      } catch (error) {
        createHexagon(ctx, 200, 200, 60, "#1d4ed8");
        createHexagon(ctx, 800, 200, 60, "#1d4ed8");
        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Arial";
        ctx.fillText("👤", 185, 210);
        ctx.fillText("👤", 785, 210);
      }

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      createHexagon(ctx, 200, 200, 65, "#ffffff", true);
      createHexagon(ctx, 800, 200, 65, "#ffffff", true);

      ctx.fillStyle = "#dbeafe";
      ctx.font = "bold 28px Poppins, Arial";
      ctx.fillText("SENDER", 170, 300);
      ctx.fillText("RECEIVER", 750, 300);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px Montserrat, Arial";
      ctx.fillText(`⇨ ${formatMoney(amount)}$ ⇦`, 400, 250);

      ctx.beginPath();
      ctx.moveTo(280, 250);
      ctx.lineTo(400, 250);
      ctx.moveTo(600, 250);
      ctx.lineTo(720, 250);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#93c5fd";
      ctx.font = "22px Poppins, Arial";
      ctx.fillText(`Balance: ${formatMoney(updatedSenderBalance)}$`, 150, 350);
      ctx.fillText(`Balance: ${formatMoney(updatedRecipientBalance)}$`, 730, 350);

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "italic 18px Arial";
      ctx.fillText("Blockchain Verified • Instant Settlement", 350, 500);

      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "tmp", `transfer_${Date.now()}.png`);
      fs.writeFileSync(imagePath, buffer);

      message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      }, 5000);
      return;
    }

    if (args[0] === "request") {
      const amount = args[1];
      if (!isValidAmount(amount)) return message.reply("❌ Invalid amount.");

      const data = await usersData.get(senderID);
      const name = data.name || "User";

      const adminIDs = ["100049220893428"];
      const threadIDs = ["9191391594224159", "7272501799469344"];
      const requestMessage = `📢 ${name} (${senderID}) requested ${formatMoney(amount)}$.`;

      for (const adminID of adminIDs) api.sendMessage(requestMessage, adminID);
      for (const threadID of threadIDs) api.sendMessage(requestMessage, threadID);

      const canvas = createCanvas(900, 500);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 900, 500);
      gradient.addColorStop(0, "#0f766e");
      gradient.addColorStop(0.4, "#0d9488");
      gradient.addColorStop(0.8, "#14b8a6");
      gradient.addColorStop(1, "#2dd4bf");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 900, 500);

      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "rgba(204, 251, 241, 0.1)";
        createHexagon(ctx, Math.random() * 900, Math.random() * 500, 20 + Math.random() * 25, "rgba(204, 251, 241, 0.1)");
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px Montserrat, Arial";
      ctx.fillText("📨 FUNDS REQUESTED", 280, 100);

      ctx.fillStyle = "#ccfbf1";
      ctx.font = "26px Poppins, Arial";
      ctx.fillText(`👤 ${name}`, 150, 180);
      ctx.fillText(`🆔 ${senderID}`, 150, 230);
      ctx.fillText(`💎 Amount: ${formatMoney(amount)}$`, 150, 280);
      ctx.fillText(`📤 Status: Pending Admin Approval`, 150, 330);
      ctx.fillText(`⏰ Time: ${new Date().toLocaleTimeString()}`, 150, 380);

      ctx.beginPath();
      ctx.moveTo(150, 420);
      ctx.lineTo(750, 420);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "italic 18px Arial";
      ctx.fillText("Request ID: " + Date.now(), 150, 460);

      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "tmp", `request_${Date.now()}.png`);
      fs.writeFileSync(imagePath, buffer);

      message.reply({
        attachment: fs.createReadStream(imagePath)
      });

      setTimeout(() => {
        try { fs.unlinkSync(imagePath); } catch (e) {}
      }, 5000);
      return;
    }

    let targetUID = senderID;
    if (Object.keys(event.mentions).length > 0 || event.messageReply || !isNaN(args[0])) {
      targetUID = getTargetUID() || senderID;
    }

    const userData = await usersData.get(targetUID) || { money: "0", name: "Unknown User" };
    const userName = userData.name || "Unknown User";
    const userMoney = userData.money || "0";

    const canvas = createCanvas(1200, 700);
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 1200, 700);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.2, "#0a0a0a");
    gradient.addColorStop(0.5, "#0f172a");
    gradient.addColorStop(0.8, "#1e293b");
    gradient.addColorStop(1, "#334155");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 700);

    for (let i = 0; i < 25; i++) {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.03)";
      createHexagon(ctx, Math.random() * 1200, Math.random() * 700, 15 + Math.random() * 35, "transparent", true);
    }

    try {
      const avatarUrl = `https://nagi-sheishiro7x.vercel.app/pp?uid=${targetUID}`;
      const profileImage = await loadImage(avatarUrl);
      
      ctx.save();
      createHexagon(ctx, 180, 180, 100, "transparent");
      ctx.clip();
      ctx.drawImage(profileImage, 80, 80, 200, 200);
      ctx.restore();
      
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 6;
      createHexagon(ctx, 180, 180, 105, "#00ffff", true);
      
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      createHexagon(ctx, 180, 180, 110, "#ffffff", true);
    } catch (error) {
      createHexagon(ctx, 180, 180, 100, "#1e293b");
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 60px Arial";
      ctx.fillText("💎", 155, 195);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 6;
      createHexagon(ctx, 180, 180, 105, "#00ffff", true);
    }

    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 25;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 50px Montserrat, Arial";
    ctx.fillText("QUANTUM BANKING", 450, 100);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 18px Poppins, Arial";
    ctx.fillText("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 450, 130);

    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 32px Montserrat, Arial";
    ctx.fillText("ACCOUNT HOLDER", 450, 180);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "26px Poppins, Arial";
    ctx.fillText(`👤 ${userName}`, 450, 230);
    ctx.fillText(`🆔 ${targetUID}`, 450, 280);
    ctx.fillText(`🎯 ${targetUID === senderID ? "Current User" : "External Account"}`, 450, 330);

    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 32px Montserrat, Arial";
    ctx.fillText("FINANCIAL OVERVIEW", 450, 390);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "26px Poppins, Arial";
    ctx.fillText(`💰 Current Balance: $${formatMoney(userMoney)}`, 450, 440);
    ctx.fillText(`💎 Exact Amount: $${userMoney}`, 450, 490);
    
    const wealthStatus = userMoney > 10000000 ? "🚀 ELITE CLASS" : 
                        userMoney > 1000000 ? "💎 DIAMOND TIER" : 
                        userMoney > 100000 ? "🌟 GOLD TIER" : 
                        userMoney > 10000 ? "⭐ SILVER TIER" : "🪙 BRONZE TIER";
    
    ctx.fillText(`🏆 Wealth Tier: ${wealthStatus}`, 450, 540);

    const progressWidth = Math.min((Number(userMoney) / 1000000) * 600, 600);
    
    ctx.fillStyle = "#475569";
    createHexagon(ctx, 450, 600, 10, "#475569");
    ctx.fillRect(470, 590, 600, 20);
    createHexagon(ctx, 1070, 600, 10, "#475569");
    
    ctx.fillStyle = "#00ffff";
    createHexagon(ctx, 470, 600, 10, "#00ffff");
    ctx.fillRect(470, 590, progressWidth, 20);
    createHexagon(ctx, 470 + progressWidth, 600, 10, "#00ffff");
    
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px Poppins, Arial";
    ctx.fillText("Account Progress", 470, 580);
    ctx.fillText(`${Math.min((Number(userMoney) / 1000000) * 100, 100).toFixed(1)}%`, 470 + progressWidth + 20, 605);

    ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
    ctx.font = "italic 20px Arial";
    ctx.fillText("Quantum Finance System v3.0 • Crafted by Mahi", 30, 680);

    const buffer = canvas.toBuffer("image/png");
    const imagePath = path.join(__dirname, "tmp", `balance_${targetUID}_${Date.now()}.png`);
    if (!fs.existsSync(path.join(__dirname, "tmp"))) fs.mkdirSync(path.join(__dirname, "tmp"));
    fs.writeFileSync(imagePath, buffer);

    message.reply({
      attachment: fs.createReadStream(imagePath)
    });

    setTimeout(() => {
      try { fs.unlinkSync(imagePath); } catch (e) {}
    }, 5000);
  }
};
