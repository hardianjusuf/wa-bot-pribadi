// commands/unsend.js
const { isSuperAdmin } = require('../config/admin-whitelist')

module.exports = async ({ sock, msg, text, from, isGroup }) => {
  if (!text.toLowerCase().startsWith('.unsend')) return false

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Command ini hanya bisa digunakan di grup'
    })
    return true
  }

  // ===============================
  // CEK SUPERADMIN
  // ===============================
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = rawSenderJid.split(':')[0]

  if (!isSuperAdmin(senderJid)) {
    await sock.sendMessage(from, {
      text: '❌ Command ini hanya untuk *SUPERADMIN*'
    })
    return true
  }

  // ===============================
  // HARUS REPLY PESAN
  // ===============================
  const ctx = msg.message?.extendedTextMessage?.contextInfo

  if (!ctx?.stanzaId || !ctx?.quotedMessage) {
    await sock.sendMessage(from, {
      text: '❌ Reply pesan yang ingin dihapus lalu ketik *.unsend*'
    })
    return true
  }

  const targetMessageId = ctx.stanzaId
  const targetParticipant = ctx.participant

  // 🔑 cek apakah pesan dari bot sendiri
  const isFromBot = ctx.participant === sock.user.id

  try {
    await sock.sendMessage(from, {
      delete: {
        remoteJid: from,
        id: targetMessageId,
        fromMe: isFromBot,
        participant: isFromBot ? undefined : targetParticipant
      }
    })
  } catch (err) {
    console.log('❌ Unsend error:', err?.output?.payload || err)

    await sock.sendMessage(from, {
      text:
`❌ Gagal menghapus pesan

Kemungkinan penyebab:
• Pesan terlalu lama
• Bot bukan admin grup
• Pesan bukan milik bot
`
    })
  }

  return true
}
