// commands/tag-all.js
const { ADMIN_IDS } = require('../config/admin-whitelist')


module.exports = async ({ sock, msg, text, from, isGroup }) => {
  if (!text.toLowerCase().startsWith('.all')) return false

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Command ini hanya bisa digunakan di grup'
    })
    return true
  }

  // ambil sender (LID-aware)
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = rawSenderJid.split(':')[0]

  // cek admin
  if (!ADMIN_IDS.includes(senderJid)) {
    await sock.sendMessage(from, {
      text: '❌ Kamu tidak memiliki izin menggunakan command ini'
    })
    return true
  }

  // ambil pesan setelah ".all"
  const messageText = text.slice(4).trim()

  const groupMetadata = await sock.groupMetadata(from)
  const mentions = groupMetadata.participants.map(p => p.id)

  // silent tag
  const finalText =
    messageText.length > 0 ? messageText : '\u200B'

  await sock.sendMessage(from, {
    text: finalText,
    mentions
  })

  return true
}
