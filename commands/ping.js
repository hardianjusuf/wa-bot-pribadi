// commands/ping.js
const https = require('https')

module.exports = async ({ sock, text, from }) => {
  if (text !== '.ping') return false

  const start = Date.now()

  https.get('https://www.google.com', () => {
    const latency = Date.now() - start
    sock.sendMessage(from, {
      text: `📡 Network Ping\n⏱️ ${latency} ms`
    })
  }).on('error', () => {
    sock.sendMessage(from, {
      text: '❌ Gagal mengukur koneksi jaringan'
    })
  })

  return true
}
