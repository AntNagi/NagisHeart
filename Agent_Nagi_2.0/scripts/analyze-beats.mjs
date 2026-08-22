/**
 * 统计 Nagi 在 V17 语料里「一次连说几句」的分布，并列出连说 3 句以上的全部实例。
 *
 * 为什么需要它：resources 里原本只有定性描述（「短句」「不要追加解释性独白」），
 * 而模型据此稳定输出 2-3 句——把最罕见的说话方式当成了默认。
 * 这个脚本把「什么时候会破例」变成可复跑的证据，而不是谁的印象。
 *
 * 用法：
 *   node scripts/analyze-beats.mjs ../authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md
 *
 * 注意空行**不打断**连发——剧本里连续台词之间常有空行，
 * 按空行切会得到「100%都是单句」这种明显错误的结论（第一版就是这么错的）。
 */
import { readFileSync } from 'node:fs'
const src = readFileSync(process.argv[2], 'utf8').split(/\r?\n/)
const NAGI = /^\s*(Nagi|凪)\s*[:：]\s*(.+)$/
const runs = []
let cur = null, ctx = ''
for (const line of src) {
  const m = NAGI.exec(line)
  if (m) { if (!cur) cur = { lines: [], ctx }; cur.lines.push(m[2].trim()); continue }
  if (!line.trim()) continue                    // 空行不打断连发
  if (cur) { runs.push(cur); cur = null }
  ctx = line.trim().slice(0, 70)                // 记住上一条非空的上下文行
}
if (cur) runs.push(cur)
const dist = {}
for (const r of runs) dist[r.lines.length] = (dist[r.lines.length] ?? 0) + 1
const total = runs.length
console.log(`Nagi 发言（连续段）总数: ${total}`)
for (const k of Object.keys(dist).sort((a,b)=>a-b)) console.log(`  ${k} 句: ${dist[k]} 次 (${(dist[k]/total*100).toFixed(1)}%)`)
console.log('\n--- 连说 3 句及以上（全部）---')
for (const r of runs.filter(r=>r.lines.length>=3)) console.log(`  [上文] ${r.ctx}\n   → ${r.lines.join(' / ')}\n`)
