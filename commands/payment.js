// commands/payment.js

module.exports = async ({ sock, text, from }) => {
  if (!text.toLowerCase().startsWith('.payment')) return false

  const paymentText = 
`*INFORMASI PEMBAYARAN*

Bagi yang ingin *QRIS*  
silakan gunakan command:
➡️ *.qr*

Bagi yang ingin *payment manual* bisa ke nomor berikut:

*Dana*  : 082320239123 (A.n Dhika Ramadhan)

⚠️ *Disarankan menggunakan QRIS*`

  await sock.sendMessage(from, {
    text: paymentText
  })

  return true
}
