// commands/config.js
function normJid(jid = '') {
  return jid.split(':')[0]
}

module.exports = async ({ sock, msg, text, from }) => {
  if (text !== '.config') return false

  // ambil sender (LID-aware)
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = normJid(rawSenderJid)

  await sock.sendMessage(from, {
    text:
      `⚙️ *USER CONFIG*\n\n` +
      `• LID kamu: ${senderJid}\n`

  })

  return true
}
