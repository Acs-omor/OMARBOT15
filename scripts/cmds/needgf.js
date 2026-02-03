module.exports = {
  config: {
    name: "needgf",
    aliases: ["needgfimg", "needgfimage"],
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    shortDescription: "Sends a random needgf image",
    longDescription: "This module sends a random image from the provided needgf image links.",
    category: "media",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const links = [
      "https://files.catbox.moe/6m3o6q.jpg",
      "https://files.catbox.moe/dzrzzc.jpg",
      "https://files.catbox.moe/sibi79.jpg",
      "https://files.catbox.moe/9qomgb.jpg",
      "https://files.catbox.moe/4zq75m.jpg",
      "https://files.catbox.moe/psved4.jpg",
      "https://files.catbox.moe/m0xkkw.jpg",
      "https://files.catbox.moe/e53ix0.jpg",
      "https://files.catbox.moe/ohkq7n.jpg",
      "https://files.catbox.moe/j3e7rc.jpg",
      "https://files.catbox.moe/0w4wqc.jpg",
      "https://files.catbox.moe/sfde92.jpg",
      "https://files.catbox.moe/pmcq56.jpg",
      "https://files.catbox.moe/xk4x0k.jpg",
      "https://files.catbox.moe/v848h4.jpg",
      "https://files.catbox.moe/k0u1u8.jpg",
      "https://files.catbox.moe/e8evtt.jpg",
      "https://files.catbox.moe/epatrq.jpg",
      "https://files.catbox.moe/4h6jkh.jpg",
      "https://files.catbox.moe/d7kbo7.jpg",
      "https://files.catbox.moe/wpg9o5.jpg",
      "https://files.catbox.moe/p7txmw.jpg",
      "https://files.catbox.moe/56tb5b.jpg",
      "https://files.catbox.moe/lja2qa.jpg",
      "https://files.catbox.moe/9oct5c.jpg",
      "https://files.catbox.moe/hw5waq.jpg",
      "https://files.catbox.moe/zjwq40.jpg",
      "https://files.catbox.moe/r7zl8l.jpg",
      "https://files.catbox.moe/g2hg0v.jpg",
      "https://files.catbox.moe/zex66g.jpg",
      "https://files.catbox.moe/484atr.jpg",
      "https://files.catbox.moe/2uza4h.jpg",
      "https://files.catbox.moe/30y7uf.jpg",
      "https://files.catbox.moe/85wx7t.jpg",
      "https://files.catbox.moe/0w4wqc.jpg",
      "https://files.catbox.moe/vjzzj0.jpg",
      "https://files.catbox.moe/j3e7rc.jpg",
      "https://files.catbox.moe/mks2om.jpg",
      "https://files.catbox.moe/ohkq7n.jpg"
    ];

    const randomIndex = Math.floor(Math.random() * links.length);
    const selectedImage = links[randomIndex];

    try {
      return api.sendMessage(
        {
          body: `Here’s a random needgf image for you!`,
          attachment: await global.utils.getStreamFromURL(selectedImage)
        },
        event.threadID,
        event.messageID
      );
    } catch (error) {
      return api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
