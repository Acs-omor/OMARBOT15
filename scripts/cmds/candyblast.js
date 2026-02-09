const fs = require("fs");
const { createCanvas } = require("canvas");

function generateBoard() {
  const candies = ["🍬","🍫","🍭","🧁","🍩"];
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => candies[Math.floor(Math.random()*candies.length)])
  );
}

function checkMatches(board) {
  let match = 0;

  // rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) match++;
  }

  // cols
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) match++;
  }

  // diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) match++;
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) match++;

  return match;
}

async function drawBoard(board) {
  const path = `${__dirname}/cache/candy-${Date.now()}.png`;
  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffb6c1";
  ctx.fillRect(0, 0, 600, 600);

  ctx.font = "120px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.fillText(board[i][j], j * 200 + 100, i * 200 + 100);
    }
  }

  fs.writeFileSync(path, canvas.toBuffer());
  return fs.createReadStream(path);
}

module.exports = {
  config: {
    name: "candyblast",
    version: "1.0",
    author: "Omar Faruk",
    role: 0,
    countDown: 180, // 3 min cooldown
    shortDescription: "🍬 Candy Crush Style Game",
    longDescription: "Match candies and win coins!",
    category: "game",
    guide: "{p}candyblast"
  },

  onStart: async function ({ message, usersData, event }) {
    const { senderID } = event;

    const board = generateBoard();
    const matches = checkMatches(board);

    let reward = 0;
    let text = "";

    if (matches >= 2) {
      // JACKPOT
      reward = Math.floor(Math.random()*500) + 700;
      text = `💎 MEGA CANDY BLAST!\n🔥 ${matches} combo!\n💰 তুমি ${reward} coin জিতেছো!`;
    }
    else if (matches === 1) {
      reward = Math.floor(Math.random()*200) + 200;
      text = `✨ Sweet Match!\n💰 ${reward} coin পেয়েছো!`;
    }
    else {
      reward = Math.floor(Math.random()*80) + 50;
      text = `🙂 Small candy reward!\n🍬 ${reward} coin পেয়েছো! আবার খেলো!`;
    }

    await usersData.addMoney(senderID, reward);

    const img = await drawBoard(board);

    return message.reply({
      body: text,
      attachment: img
    });
  }
};
