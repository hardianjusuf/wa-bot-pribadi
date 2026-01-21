// commands/vote.js
const { isAdmin } = require('../config/admin-whitelist')

module.exports = async ({ sock, msg, text, from, isGroup }) => {
  if (!text.toLowerCase().startsWith('.vote')) return false

  // hanya di grup
  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Command vote hanya bisa digunakan di grup'
    })
    return true
  }

  // ambil sender (LID-aware)
  const rawSenderJid = msg.key.participant || msg.key.remoteJid
  const senderJid = rawSenderJid.split(':')[0]

  // 🚫 BUKAN ADMIN WHITELIST → KASIH NOTIF
  if (!isAdmin(senderJid)) {
    await sock.sendMessage(from, {
      text: '❌ *Hanya admin yang bisa menggunakan command ini*'
    })
    return true
  }

  // hapus ".vote"
  const content = text.slice(5).trim()

  if (!content.includes('|')) {
    await sock.sendMessage(from, {
      text:
`❌ *Format salah*

Gunakan:
.vote Judul vote | opsi 1 | opsi 2 | opsi 3

Contoh:
.vote Mau mabar kapan? | Malam | Besok | Weekend`
    })
    return true
  }

  // parsing aman
  const parts = content.split(/\s*\|\s*/)
  const title = parts.shift()
  const options = parts.filter(v => v.length > 0)

  if (options.length < 2) {
    await sock.sendMessage(from, {
      text: '❌ Minimal harus ada 2 opsi vote'
    })
    return true
  }

  if (options.length > 12) {
    await sock.sendMessage(from, {
      text: '❌ Maksimal 12 opsi vote'
    })
    return true
  }

  // 🗳️ KIRIM POLL (BISA DIKLIK)
  await sock.sendMessage(from, {
    poll: {
      name: title,
      values: options,
      selectableCount: 1
    }
  })

  return true
}
