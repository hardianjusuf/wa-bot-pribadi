// commands/resend.js
const { ADMIN_IDS } = require('../config/admin-whitelist')

module.exports = async ({ sock, msg, text, from, isGroup }) => {
  if (!text.toLowerCase().startsWith('.resend')) return false

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Command ini hanya bisa digunakan di grup'
    })
    return true
  }

  // ambil sender (LID-aware)
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = rawSenderJid.split(':')[0]

  // cek whitelist admin
  if (!ADMIN_IDS.includes(senderJid)) {
    await sock.sendMessage(from, {
      text: '❌ Kamu tidak memiliki izin menggunakan command ini'
    })
    return true
  }

  // HARUS reply
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted) {
    await sock.sendMessage(from, {
      text: '❌ Gunakan .resend dengan reply ke pesan'
    })
    return true
  }

  // ===============================
  // AMBIL ISI PESAN YANG DIREPLY
  // ===============================
  let resendText = ''

  if (quoted.conversation) {
    resendText = quoted.conversation
  } else if (quoted.extendedTextMessage?.text) {
    resendText = quoted.extendedTextMessage.text
  } else if (quoted.imageMessage?.caption) {
    resendText = quoted.imageMessage.caption
  } else if (quoted.videoMessage?.caption) {
    resendText = quoted.videoMessage.caption
  } else {
    await sock.sendMessage(from, {
      text: '❌ Jenis pesan ini tidak bisa di-resend'
    })
    return true
  }

  // kirim ulang pesan
  await sock.sendMessage(from, {
    text: resendText
  })

  return true
}
