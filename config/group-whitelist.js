// config/whitelist.js
// Daftar grup yang DIIZINKAN bot berjalan

const WHITELIST_GROUPS = [
  '120363144047586923@g.us', // Grup AJG YOYOI
  '120363425764585463@g.us', // admin + bot
  '120363422858664631@g.us', // ptptx8
]

// helper function (opsional tapi rapi)
const isGroupAllowed = (groupId) => {
  return WHITELIST_GROUPS.includes(groupId)
}

module.exports = {
  WHITELIST_GROUPS,
  isGroupAllowed
}
