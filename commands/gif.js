const fs = require('fs')
const path = require('path')

module.exports = async ({ sock, text, from }) => {
  if (!text.startsWith('.gif')) return false

  const args = text.trim().split(' ')
  const key = args[1] // a / b / c

  if (!key) {
    await sock.sendMessage(from, {
      text: '❗ Gunakan format:\n.gif a\n.gif b'
    })
    return true
  }

  const gifPath = path.join(__dirname, `../assets/gif/${key}.gif`)

  if (!fs.existsSync(gifPath)) {
    await sock.sendMessage(from, {
      text: `❌ GIF "${key}" tidak ditemukan`
    })
    return true
  }

  const gifBuffer = fs.readFileSync(gifPath)

  await sock.sendMessage(from, {
    video: gifBuffer,
    gifPlayback: true
  })

  return true
}
