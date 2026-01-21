const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const qrcode = require('qrcode-terminal')
const Pino = require('pino')

// ===== WHITELIST GROUP =====
const { isGroupAllowed } = require('./config/group-whitelist')

// ===== IMPORT COMMANDS =====
const cmdConfig = require('./commands/config')
const cmdTagAll = require('./commands/tag-all')
const cmdPing = require('./commands/ping')
const cmdBotHelper = require('./commands/bot-helper')
const cmdBotHelperAdmin = require('./commands/bot-helper-admin')
const cmdQr = require('./commands/qr')
const cmdGif = require('./commands/gif')
const cmdClose = require('./commands/close')
const cmdOpen = require('./commands/open')
const cmdRules = require('./commands/rules')
const cmdTagAdmin = require('./commands/tagadmin')
const cmdGid = require('./commands/gid')
const cmdResend = require('./commands/resend')
const cmdUnsend = require('./commands/unsend')
const cmdPayment = require('./commands/payment')
const cmdDanaKaget = require('./commands/danakaget')
const cmdVote = require('./commands/vote')


async function startBot () {
  const { state, saveCreds } = await useMultiFileAuthState('session')

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)

  // ===============================
  // 🔌 CONNECTION
  // ===============================
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) qrcode.generate(qr, { small: true })

    if (connection === 'open') {
      console.log('✅ Bot Baileys aktif')
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    }
  })


  // ===============================
  // 👋 WELCOME (ONLY JOIN)
  // ===============================
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update

    if (!isGroupAllowed(id)) return
    if (action !== 'add') return // ⛔ tidak ada pesan leave

    // ambil nama grup
    let namaGrup = 'grup ini'
    try {
      const metadata = await sock.groupMetadata(id)
      namaGrup = metadata.subject
    } catch {}

    for (const user of participants) {
      const jid = typeof user === 'string' ? user : user.id
      if (!jid) continue

      const namaUser = jid.split('@')[0]

      await sock.sendMessage(id, {
        text:
  `👋 *WELCOME* 

  Halo @${namaUser} 👋
  Selamat datang di ${namaGrup}

  📌 Baca deskripsi grup`,
        mentions: [jid]
      })
    }
  })

  // ===============================
  // 📩 MESSAGE HANDLER
  // ===============================
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message) return
    if (msg.key.fromMe) return

    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.documentMessage?.caption ||
      ''

    const context = { sock, msg, text, from, isGroup }

    // ===============================
    // 🌍 GLOBAL COMMAND
    // ===============================
    if (await cmdConfig(context)) return
    if (await cmdPing(context)) return
    if (await cmdRules(context)) return
    if (await cmdBotHelper(context)) return
    if (await cmdBotHelperAdmin(context)) return
    if (await cmdGif(context)) return
    if (await cmdTagAdmin(context)) return
    if (await cmdGid(context)) return
    if (await cmdPayment(context)) return
    if (await cmdQr(context)) return
    if (await cmdDanaKaget(context)) return

    // ===============================
    // ⛔ BLOK NON-WHITELIST
    // ===============================
    if (isGroup && !isGroupAllowed(from)) return

    // ===============================
    // 👮 CEK ADMIN
    // ===============================
    let isAdmin = false
    if (isGroup) {
      try {
        const sender = msg.key.participant
        const metadata = await sock.groupMetadata(from)
        isAdmin = metadata.participants.some(
          p =>
            p.id === sender &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        )
      } catch {}
    }

    context.isAdmin = isAdmin

    // ===============================
    // 🚫 ANTI LINK
    // ===============================
    if (isGroup && text) {
      const linkRegex =
        /\b((https?:\/\/)?(www\.)?[a-z0-9-]+\.[a-z]{2,})(\/\S*)?\b/i

      if (linkRegex.test(text) && !isAdmin) {
        await sock.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: msg.key.participant
          }
        })

        await sock.sendMessage(from, {
          text: '🚫 *Link tidak diperbolehkan di grup ini!*'
        })
        return
      }
    }

    // ===============================
    // 🔐 COMMAND GRUP
    // ===============================
    if (await cmdTagAll(context)) return
    if (await cmdClose(context)) return
    if (await cmdOpen(context)) return
    if (await cmdResend(context)) return
    if (await cmdUnsend(context)) return
    if (await cmdVote(context)) return
  })
}

startBot()
