/**
 * Shared inline SVG icon set matching the mockup's icon language:
 * stroke-based line icons, 1.6-1.8 stroke width, 24x24 viewBox,
 * rounded joins/caps. Used in place of emoji across the kid-facing UI.
 */

type IconProps = { size?: number; className?: string }

const base = { fill: 'none' as const, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function GearIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" {...base} />
      <path
        d="M12 2.5v3M12 18.5v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1"
        stroke="currentColor"
        {...base}
      />
    </svg>
  )
}

export function BackArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" {...base} />
    </svg>
  )
}

export function ChevronRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" {...base} />
    </svg>
  )
}

export function CloseIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" {...base} />
    </svg>
  )
}

export function CameraIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" {...base} />
      <path d="M8 7l2-3h4l2 3" stroke="currentColor" {...base} />
      <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" {...base} />
    </svg>
  )
}

export function BookIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="4" width="7" height="7" rx="1.5" stroke="currentColor" {...base} />
      <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="currentColor" {...base} />
      <rect x="3" y="13" width="7" height="7" rx="1.5" stroke="currentColor" {...base} />
      <rect x="14" y="13" width="7" height="7" rx="1.5" stroke="currentColor" {...base} />
    </svg>
  )
}

export function MedalIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="9" r="6" fill="currentColor" />
      <path d="M9 14l-2 7 5-3 5 3-2-7" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export function LockIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" {...base} />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" {...base} />
    </svg>
  )
}

export function SnowflakeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2v20M4.2 7l15.6 10M4.2 17L19.8 7M12 6l-2 1.5M12 6l2 1.5M12 18l-2-1.5M12 18l2-1.5"
        stroke="currentColor"
        {...base}
      />
    </svg>
  )
}

export function CompassIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" {...base} />
      <path d="M12 8v4l3 2" stroke="currentColor" {...base} />
    </svg>
  )
}

export function SignalIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 17a11 11 0 0116 0M7.5 13.5a6.5 6.5 0 019 0M11 10a2 2 0 012 2"
        stroke="currentColor"
        {...base}
      />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function SpeakerIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 10v4h3l5 4V6l-5 4H4z" fill="currentColor" />
      <path d="M16 9.5a4 4 0 010 5M18.5 7.5a7 7 0 010 9" stroke="currentColor" {...base} />
    </svg>
  )
}

export function PineTagIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2c-5 4-8 8-8 12a8 8 0 0016 0c0-4-3-8-8-12z" fill="currentColor" />
      <rect x="11" y="15" width="2" height="7" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

/** Growth-stage badge icons for the Home level card, keyed by level name (data stays in levels.ts). */
export function LevelBadgeIcon({ levelName, size = 22, className }: { levelName: string } & IconProps) {
  switch (levelName) {
    case 'Seed':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <ellipse cx="12" cy="13" rx="4.5" ry="6" fill="currentColor" />
        </svg>
      )
    case 'Sprout':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 20V12" stroke="currentColor" {...base} />
          <path d="M12 12c-4-1-6 1-7 4 4 1 7-1 7-4zM12 12c4-1 6 1 7 4-4 1-7-1-7-4z" fill="currentColor" />
        </svg>
      )
    case 'Sapling':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 20V9" stroke="currentColor" {...base} />
          <circle cx="12" cy="7" r="4.2" fill="currentColor" />
        </svg>
      )
    case 'Young Tree':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 20V11" stroke="currentColor" {...base} />
          <circle cx="12" cy="8" r="5.4" fill="currentColor" />
        </svg>
      )
    case 'Mature Tree':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 20V10" stroke="currentColor" {...base} />
          <path d="M12 2c-5 4-8 8-8 10a8 8 0 0016 0c0-2-3-6-8-10z" fill="currentColor" />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 21V9" stroke="currentColor" {...base} />
          <ellipse cx="7.5" cy="7" rx="4.5" ry="4" fill="currentColor" opacity="0.85" />
          <ellipse cx="14.5" cy="5.5" rx="5" ry="4.3" fill="currentColor" />
        </svg>
      )
  }
}

/** Kid avatar icons, keyed by the emoji stored on the Profile (data/storage format unchanged). */
const AVATAR_PATHS: Record<string, string> = {
  '🦉': 'M12 3c-4 0-7 3-7 7 0 3 2 6 7 10 5-4 7-7 7-10 0-4-3-7-7-7z', // owl silhouette
  '🦊': 'M12 4l6 3-2 7-4 6-4-6-2-7 6-3z', // fox face
  '🐿️': 'M6 18c0-7 3-12 8-12 3 0 5 2 5 5 0 4-3 6-7 6-2 0-3 1-3 3v1', // squirrel tail curl
  '🦌': 'M12 22V11M12 11l-4-6M12 11l4-6M8 5l-2-2M16 5l2-2', // deer antlers
  '🐦': 'M3 13c3-5 9-7 14-5-1 2-3 3-5 3 3 1 4 4 3 7-3-1-5-3-6-6-2 1-4 2-6 1z', // bird wing
  '🦝': 'M12 4c-5 0-8 4-8 8 0 5 4 8 8 8s8-3 8-8c0-4-3-8-8-8zM7 9l1-3M17 9l-1-3', // raccoon mask
  '🐢': 'M12 7a7 5 0 017 5 7 5 0 01-14 0 7 5 0 017-5zM9 8l-3-2M15 8l3-2M12 17v3', // turtle shell
  '🦔': 'M4 16c0-6 4-10 8-10s8 4 8 10c-2-1-3-3-5-2 1-2 0-4-2-4s-3 2-2 4c-2-1-3 1-5 2 1 1 3 2 5 1', // hedgehog spikes
}

export function AvatarIcon({ avatar, size = 22, className }: { avatar: string } & IconProps) {
  const d = AVATAR_PATHS[avatar]
  if (!d) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" {...base} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={d} stroke="currentColor" {...base} fill="currentColor" fillOpacity={0.15} />
    </svg>
  )
}

export const AVATAR_OPTIONS = Object.keys(AVATAR_PATHS)
