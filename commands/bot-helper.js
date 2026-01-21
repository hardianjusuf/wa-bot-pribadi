// commands/bot-helper.js
module.exports = async ({ sock, text, from }) => {
  if (text !== '!bot-helper') return false

  await sock.sendMessage(from, {
    text: `
    🤖 *BOT COMMAND LIST*

    • *.ping* — Cek kecepatan respon bot
    • *.rules* — Menampilkan rules grup
    • *.bot-helper* — Menampilkan bantuan bot
    • *.gif* — Kirim GIF
    • *.qr* — QRIS pembayaran
    • *.payment* — Informasi pembayaran
    • *.danakaget* — Info Dana Kaget
    • *.vote* — Membuat voting
    `
  })

  return true
}
