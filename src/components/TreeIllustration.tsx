import type { TreeForm } from '../treeForm'

const GROUND_Y = 58
const TRUNK_COLOR = '#7a5c3e'

/** trunk height/width and canopy radius for each of the 5 growth stages (seed through mature). */
const STAGE_METRICS = [
  { trunkH: 0, trunkW: 0, canopyR: 0 },
  { trunkH: 5, trunkW: 1.5, canopyR: 0 },
  { trunkH: 14, trunkW: 2.5, canopyR: 7 },
  { trunkH: 24, trunkW: 3.5, canopyR: 11 },
  { trunkH: 34, trunkW: 5, canopyR: 15 },
]

function Canopy({ form, cx, topY, r, color }: { form: TreeForm; cx: number; topY: number; r: number; color: string }) {
  const scale = form === 'small' ? 0.75 : 1
  const rr = r * scale

  if (form === 'conifer') {
    const top = topY - rr * 0.6
    return (
      <g fill={color}>
        <polygon points={`${cx},${top} ${cx - rr * 0.9},${top + rr * 1.1} ${cx + rr * 0.9},${top + rr * 1.1}`} />
        <polygon
          points={`${cx},${top + rr * 0.6} ${cx - rr * 1.1},${top + rr * 1.9} ${cx + rr * 1.1},${top + rr * 1.9}`}
        />
      </g>
    )
  }

  if (form === 'vase') {
    return (
      <g fill={color} fillOpacity={0.85}>
        <ellipse cx={cx - rr * 0.5} cy={topY} rx={rr * 0.8} ry={rr * 0.6} />
        <ellipse cx={cx + rr * 0.5} cy={topY} rx={rr * 0.8} ry={rr * 0.6} />
        <ellipse cx={cx} cy={topY - rr * 0.3} rx={rr} ry={rr * 0.6} />
      </g>
    )
  }

  if (form === 'weeping') {
    return (
      <g>
        <ellipse cx={cx} cy={topY} rx={rr} ry={rr * 0.7} fill={color} fillOpacity={0.85} />
        {[-0.6, -0.2, 0.2, 0.6].map((offset) => (
          <path
            key={offset}
            d={`M${cx + offset * rr} ${topY} q${offset * 2} ${rr * 1.6} ${offset * rr * 0.4} ${rr * 2.2}`}
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
    )
  }

  if (form === 'spreading') {
    return <ellipse cx={cx} cy={topY + rr * 0.1} rx={rr * 1.3} ry={rr * 0.8} fill={color} fillOpacity={0.85} />
  }

  return <circle cx={cx} cy={topY} r={rr} fill={color} fillOpacity={0.85} />
}

export function TreeIllustration({
  stage,
  form,
  color,
  size = 64,
}: {
  /** 0 = seed, 1 = sprout, 2 = sapling, 3 = young tree, 4 = mature tree */
  stage: 0 | 1 | 2 | 3 | 4
  form: TreeForm
  color: string
  size?: number
}) {
  const { trunkH, trunkW, canopyR } = STAGE_METRICS[stage]
  const scale = form === 'small' ? 0.8 : 1
  const cx = 32
  const trunkTop = GROUND_Y - trunkH * scale

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`growth stage ${stage + 1} of 5`}>
      <ellipse cx={cx} cy={GROUND_Y + 1} rx="14" ry="3" fill="#000" opacity="0.06" />

      {stage === 0 && <ellipse cx={cx} cy={GROUND_Y - 1} rx="3" ry="3.5" fill={color} />}

      {stage >= 1 && (
        <rect x={cx - trunkW / 2} y={trunkTop} width={trunkW} height={trunkH * scale} fill={TRUNK_COLOR} rx={trunkW / 2} />
      )}

      {stage === 1 && (
        <g fill={color} fillOpacity={0.85}>
          <ellipse cx={cx - 2.5} cy={trunkTop - 1} rx="3" ry="1.8" transform={`rotate(-20 ${cx - 2.5} ${trunkTop - 1})`} />
          <ellipse cx={cx + 2.5} cy={trunkTop - 1} rx="3" ry="1.8" transform={`rotate(20 ${cx + 2.5} ${trunkTop - 1})`} />
        </g>
      )}

      {stage >= 2 && <Canopy form={form} cx={cx} topY={trunkTop} r={canopyR * scale} color={color} />}
    </svg>
  )
}
