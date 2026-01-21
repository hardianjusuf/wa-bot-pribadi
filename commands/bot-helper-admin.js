// commands/bot-helper-admin.js
const { isAdmin } = require('../config/admin-whitelist')

module.exports = async ({ sock, msg, text, from }) => {
  if (text !== '.bot-helper-admin' && text !== '!bot-helper admin')
    return false

  // ambil sender (LID-aware)
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = rawSenderJid.split(':')[0]

  // hanya admin bot
  if (!isAdmin(senderJid)) {
    await sock.sendMessage(from, {
      text: '❌ Command ini hanya untuk *ADMIN*'
    })
    return true
  }

  const adminHelpText =
`🛡️ *BOT ADMIN COMMAND LIST*
🛡️• *.config* — Informasi konfigurasi bot
• *.all <pesan>* — Silent tag semua anggota grup
• *.close* — Menutup chat grup
• *.open* — Membuka chat grup kembali
• *.resend* — Mengirim ulang pesan (reply pesan)
• *.unsend* — Menghapus pesan (reply pesan)

🌍 *GLOBAL COMMAND (ADMIN)*
• *.ping* — Cek respon bot
• *.rules* — Menampilkan rules
• *.bot-helper* — Bantuan bot umum
• *.gif* — Kirim GIF
• *.tagadmin* — Tag admin grup
• *.gid* — Tampilkan Group ID
• *.payment* — Informasi pembayaran
• *.qr* — QRIS pembayaran
• *.danakaget* — Info Dana Kaget

Gunakan bot dengan bijak.
`

  await sock.sendMessage(from, {
    text: adminHelpText
  })

  return true
}
