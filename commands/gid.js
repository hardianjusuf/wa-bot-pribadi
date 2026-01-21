module.exports = async ({ sock, text, from, isGroup }) => {
  if (text !== '.gid') return false
  if (!isGroup) return true

  await sock.sendMessage(from, {
    text: `🆔 *GROUP ID*\n\n${from}`
  })

  return true
}
