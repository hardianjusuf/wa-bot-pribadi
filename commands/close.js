module.exports = async ({ sock, text, from, isGroup, isAdmin }) => {
  if (text !== '.close') return false
  if (!isGroup) return true

  if (!isAdmin) {
    await sock.sendMessage(from, {
      text: '❌ Hanya admin yang bisa menutup grup'
    })
    return true
  }

  await sock.groupSettingUpdate(from, 'announcement')

  await sock.sendMessage(from, {
    text: '🔒 Grup ditutup.'
  })

  return true
}
