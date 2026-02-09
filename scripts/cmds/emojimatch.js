// Mega Emoji Array 500+ emojis
const emojis = [
  // Fruits & food
  "🍎","🍌","🍇","🍉","🍓","🍍","🥝","🍑","🍒","🥥","🥭","🍋","🍊","🍏","🍈","🥑","🥦","🥬","🥕","🌽",
  "🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥗","🥘","🥫","🍱","🍣","🍛","🍜","🍲","🍿","🧂","🥓","🥩","🍖",
  "🍗","🦴","🧄","🧅","🥔","🍠","🥜","🌰","🍞","🥐","🥖","🥯","🫓","🥨","🥞","🧇","🧀","🥚","🍳","🥫",
  // Animals
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🦁","🐯","🐨","🐸","🐵","🐔","🦆","🦉","🦅","🦇","🐧","🐦",
  "🦉","🦢","🦜","🦩","🦚","🦃","🐓","🐣","🐤","🐥","🐺","🦝","🦨","🦡","🐗","🐴","🦄","🐝","🐛","🦋",
  "🐌","🐞","🐜","🪲","🪳","🦟","🦗","🕷️","🕸️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦀","🐡",
  "🐠","🐟","🐬","🐳","🐋","🦈","🦭","🐊","🐅","🐆","🦓","🦍","🦧","🦣","🐘","🦛","🦏","🐪","🐫","🦙",
  "🦒","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦌","🐐","🐓","🦃","🦚","🦜","🦢","🦩",
  // Fantasy & faces
  "🧙‍♂️","🧙‍♀️","🦸‍♂️","🦸‍♀️","🦹‍♂️","🦹‍♀️","👹","👺","👻","💀","☠️","🧛‍♂️","🧛‍♀️","🧟‍♂️","🧟‍♀️",
  "🤖","👽","👾","👿","😈","👺","👹","👻","👨‍🚀","👩‍🚀","🧝‍♂️","🧝‍♀️","🧞‍♂️","🧞‍♀️","🧚‍♂️","🧚‍♀️",
  "💩","🤡","👹","👺","👻","👽","🤖","💀","☠️","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
  // People
  "👰","🧑‍🎄","👨‍🍼","🤴","👸","🧝‍♂️","🧝‍♀️","🧞‍♂️","🧞‍♀️","🧚‍♂️","🧚‍♀️","🧙‍♂️","🧙‍♀️","🦸‍♂️","🦸‍♀️",
  "🦹‍♂️","🦹‍♀️","🧑‍🚀","👨‍🚀","👩‍🚀","👮‍♂️","👮‍♀️","🕵️‍♂️","🕵️‍♀️","💂‍♂️","💂‍♀️",
  // Flags & logos
  "🏳️","🏴","🏁","🇺🇸","🇬🇧","🇯🇵","🇰🇷","🇩🇪","🇫🇷","🇮🇳","🇨🇳","🇷🇺","🇧🇷","🇮🇹","🇨🇦","🇦🇺","🇲🇽","🇪🇸",
  // Misc / Objects / Symbols / Vehicles
  "💜","💢","💕","🤌","🫰","🤏","🤲","☠️","👺","😼","😩","😐","🤑","😍","🙃","😝","🔥","🌟","✨","💥",
  "💫","🎃","🎄","🎁","🎈","🎉","🎊","🎖️","🏆","⚡","⭐","🌈","🌊","🌍","🌙","🌞","🌻","🌹","🌺","🌸",
  "🌼","🥀","🍀","🍁","🍂","🍃","🍄","🌵","🎋","🎍","🎑","🪷","🎇","🎆","🪐","🌌","🌠","⚜️","🔱","🛡️",
  "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍️","🛺","✈️","🛩️","🚀"
];

const fontMap = {
  'a': '𝗮','b': '𝗯','c': '𝗰','d': '𝗱',
  'A': '𝗔','B': '𝗕','C': '𝗖','D': '𝗗'
};
function toFont(str) {
  return str.split('').map(ch => fontMap[ch] || ch).join('');
}

function generateExtremeLine() {
  const line=[];
  const matchEmoji = emojis[Math.floor(Math.random()*emojis.length)];
  const matchLength = Math.floor(Math.random()*3)+3; // 3–5 consecutive
  const matchStart = Math.floor(Math.random()*(9-matchLength));

  for(let i=0;i<9;i++){
    if(i>=matchStart && i<matchStart+matchLength){
      line.push(matchEmoji);
    } else {
      let e;
      do { e = emojis[Math.floor(Math.random()*emojis.length)]; }
      while(e===matchEmoji);
      line.push(e);
    }
  }

  const numDistractors=Math.floor(Math.random()*3)+2;
  for(let d=0;d<numDistractors;d++){
    const pos=Math.floor(Math.random()*9);
    const e=emojis[Math.floor(Math.random()*emojis.length)];
    line[pos]=e;
  }

  return {line, matchLength};
}

function boardToText(board){
  return board.map((obj,i)=>`${toFont((i+1).toString())}: ${obj.line.join(" ")}`).join("\n");
}

module.exports = {
  config: {
    name: "emojimatch",
    version: "12.0",
    author: "Omar Faruk",
    role: 0,
    shortDescription: toFont("Ultimate INSANE Emoji Match MEGA EXTREME"),
    longDescription: "Extreme hard mode emoji match game with 9 emojis per line. Pick max consecutive match line only! 500+ emojis used.",
    category: "game",
    guide: "{p}emojimatch"
  },

  onStart: async function({ message, event, usersData }){
    global.GoatBot.emojiBoard ??= new Map();
    const board=[];
    for(let i=0;i<10;i++){
      board.push(generateExtremeLine());
    }
    global.GoatBot.emojiBoard.set(event.senderID,{board});
    return message.reply(
      `${toFont("🍬 Ultimate MEGA INSANE Emoji Crush 🍬")}\n\n${boardToText(board)}\n\n👉 Reply with line number 1-10 for max match!`,
      (err, info)=>{
        global.GoatBot.onReply.set(info.messageID,{
          commandName:"emojimatch",
          author:event.senderID
        });
      }
    );
  },

  onReply: async function({ message, event, usersData, Reply }){
    if(event.senderID!==Reply.author) return;
    const data=global.GoatBot.emojiBoard.get(event.senderID);
    if(!data || !data.board) return message.reply("❌ Game not found!");

    const choice=parseInt(event.body);
    if(!(choice>=1 && choice<=data.board.length)) return message.reply(`⚠️ Reply 1-${data.board.length} only!`);

    const selected=data.board[choice-1];
    const overallMax=Math.max(...data.board.map(obj=>obj.matchLength));

    if(selected.matchLength<overallMax){
      const consolation=Math.floor(Math.random()*50)+20;
      global.GoatBot.emojiBoard.delete(event.senderID);
      await usersData.addMoney(event.senderID,consolation);
      return message.reply(`❌ Wrong line! Max match was ${overallMax}\n💰 Consolation: ${consolation} coins\nGame over!`);
    }

    let reward;
    if(selected.matchLength===3) reward=Math.floor(Math.random()*51)+50;
    if(selected.matchLength===4) reward=Math.floor(Math.random()*51)+100;
    if(selected.matchLength===5) reward=Math.floor(Math.random()*51)+150;
    await usersData.addMoney(event.senderID,reward);

    data.board.splice(choice-1,1);

    if(data.board.length===0){
      const finalReward=500+Math.floor(Math.random()*1000);
      await usersData.addMoney(event.senderID,finalReward);
      global.GoatBot.emojiBoard.delete(event.senderID);
      return message.reply(`${toFont("🏆 EMOJI MASTER MEGA EXTREME INSANE!")}\nAll lines matched!\n💰 Final reward: ${finalReward} coins!`);
    } else {
      return message.reply(
        `✅ Line ${toFont(choice.toString())} matched! 💰 ${reward} coins\n\nRemaining lines:\n${boardToText(data.board)}\n\nReply with line number 1-${data.board.length}`,
        (err,info)=>{
          global.GoatBot.onReply.set(info.messageID,{
            commandName:"emojimatch",
            author:event.senderID
          });
        }
      );
    }
  }
};
