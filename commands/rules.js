module.exports = async ({ sock, text, from }) => {
  if (text !== '.rules') return false

  await sock.sendMessage(from, {
    text:
`❌ *Harap baca dan hargai rules yang ada* ❌

* NO SHARE LINK GRUB LAIN
* NO PROMOSI GRUB LAIN
* NO TAG SW
* NO SPAM
* NO ADMN HANYA TERTERA SEPERTI YANG DI ATAS
* MELANGGAR RULES, HARAP LAPOR KE ADMIN DEMI KENYAMANAN BERSAMA`
  })

  return true
}
