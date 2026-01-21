// commands/payment.js
const fs = require('fs')
const path = require('path')

module.exports = async ({ sock, text, from }) => {
  if (text !== '.qr') return false

  try {
    // path ke file QR
    const qrPath = path.join(__dirname, '../assets/danaqr-dhika.jpg')

    // baca file QR
    const qrBuffer = fs.readFileSync(qrPath)

    await sock.sendMessage(from, {
      image: qrBuffer,
      // caption:
      // `yang asli yang ada ~badak~ Dhika-nya`
    })
  } catch (err) {
    // ❌ TIDAK kirim pesan apa pun ke user
    // ❌ Silent error
    console.error('Payment QR error (silent):', err.message)
  }

  return true
}
