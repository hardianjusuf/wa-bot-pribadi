module.exports = async ({ sock, text, from, isGroup, isAdmin }) => {
  if (text !== '.open') return false
  if (!isGroup) return true

  if (!isAdmin) {
    await sock.sendMessage(from, {
      text: '❌ Hanya admin yang bisa membuka grup'
    })
    return true
  }

  await sock.groupSettingUpdate(from, 'not_announcement')

  await sock.sendMessage(from, {
    text: '🔓 Grup dibuka.'
  })

  return true
}
