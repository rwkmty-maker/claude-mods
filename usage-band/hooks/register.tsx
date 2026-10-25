import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit, Limits } from '../types'

const limits = atom({ plugin: 'usage-band', key: 'limits' } as const, [] as Limits)

const NAMES: Record<string, string> = { five_hour: '5時間', seven_day: '7日間', spend_limit: '利用上限' }

// time left until the window resets, as 2時間15分 / 3日4時間 / 12分 (no time zone needed)
function until(iso: string | undefined, now: number): string {
  if (!iso) return ''
  const ms = Date.parse(iso) - now
  if (!(ms > 0)) return ''
  const min = Math.ceil(ms / 60000)
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60
  if (d > 0) return `${d}日${h}時間`
  if (h > 0) return `${h}時間${m}分`
  return `${m}分`
}

function line(l: Limit, now: number): string {
  const left = Math.max(0, Math.round((100 - l.percentUsed) * 10) / 10)
  const reset = until(l.resetsAt, now)
  return `${NAMES[l.kind] ?? l.kind} 残り${left}%` + (reset ? `（回復まで${reset}）` : '')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    const u = await $.session.usage()
    await update($, limits, () => u.rateLimits)
    return r
  })

  on('session.measure', async ($, e, next) => {
    await update($, limits, () => e.rateLimits)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const ls = await read($, limits)
    if (e.props.hasSurvey || ls.length === 0) return next(e)
    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)
    const low = ls.some(l => l.percentUsed >= 80)
    return (
      <Box>
        <Text dimColor={!low} color={low ? 'yellow' : undefined}>
          {'残りの使用量: ' + ls.map(l => line(l, now)).join(' · ')}
        </Text>
      </Box>
    )
  })
}
