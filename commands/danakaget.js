// commands/danakaget.js

module.exports = async ({ sock, text, from }) => {
  if (!text.toLowerCase().startsWith('.danakaget')) return false

  // ===============================
  // SETTING DANA KAGET
  // ===============================
  const DANA_KAGET_AKTIF = false // ⬅️ ubah ke true jika ada dana kaget
  const DANA_KAGET_LINK = 'https://link.dana.id/danakaget?c=sb99ztvc3&r=h6o05p&orderId=20260121101214555515010300166411659572574' // ⬅️ isi link jika aktif

  // ===============================
  // JIKA BELUM ADA DANA KAGET
  // ===============================
  if (!DANA_KAGET_AKTIF) {
    await sock.sendMessage(from, {
      text: '❌ *Saat ini tidak ada Dana Kaget*\n\nTunggu info selanjutnya ya 👀'
    })
    return true
  }

  // ===============================
  // JIKA ADA DANA KAGET
  // ===============================
  const message =
`🔥 *GAS SERANG!* 🔥
🎉 *SELAMAT YANG DAPAT!* 🎉

💸 Dana Kaget:
👉 ${DANA_KAGET_LINK}`

  await sock.sendMessage(from, {
    text: message
  })

  return true
}
