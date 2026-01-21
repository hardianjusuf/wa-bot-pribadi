// tag admin dan list admin (exclude bot secara aman)

const BOT_NUMBER = '6282195152360'

module.exports = async ({ sock, text, from, isGroup }) => {
  if (!isGroup) return false

  const cmd = text.trim().toLowerCase()
  if (!['.admin', '.adminlist', '.tagadmin'].includes(cmd)) return false

  try {
    const metadata = await sock.groupMetadata(from)

    const admins = metadata.participants.filter(p => {
      if (!(p.admin === 'admin' || p.admin === 'superadmin')) return false

      // 🔒 AMAN: ambil nomor saja
      const number = p.id.split('@')[0].split(':')[0]

      return number !== BOT_NUMBER
    })

    const mentions = admins.map(a => a.id)

    // ======================
    // .admin / .adminlist
    // ======================
    if (cmd === '.admin' || cmd === '.adminlist') {
      let adminList = '*DAFTAR ADMIN GRUP*\n\n'

      admins.forEach((admin, i) => {
        const number = admin.id.split('@')[0].split(':')[0]
        adminList += `${i + 1}. @${number}\n`
      })

      await sock.sendMessage(from, {
        text: adminList,
        mentions
      })
    }

    // ======================
    // .tagadmin
    // ======================
    if (cmd === '.tagadmin') {
      await sock.sendMessage(from, {
        text: '🚨 *TAG ADMIN*',
        mentions
      })
    }
  } catch (err) {
    console.log('❌ Admin command error:', err)
  }

  return true
}
