import type { ReactNode } from 'react'
import type { DeviceFrame as DeviceFrameType } from '../store/types'

interface Props {
  device: DeviceFrameType
  primaryColor: string
  children: ReactNode
}

const FRAME_CONFIG: Record<DeviceFrameType, { width: string; height: string; rounded: string; shadow: string }> = {
  mobile: { width: '390px', height: '844px', rounded: 'rounded-[44px]', shadow: 'shadow-2xl' },
  tablet: { width: '768px', height: '600px', rounded: 'rounded-[20px]', shadow: 'shadow-2xl' },
  desktop: { width: '100%', height: '100%', rounded: 'rounded-none', shadow: 'shadow-none' },
  fullscreen: { width: '100%', height: '100%', rounded: 'rounded-none', shadow: 'shadow-none' },
}

export default function DeviceFrame({ device, primaryColor, children }: Props) {
  const cfg = FRAME_CONFIG[device]
  const isMobile = device === 'mobile'
  const isTablet = device === 'tablet'

  if (device === 'desktop' || device === 'fullscreen') {
    return (
      <div className="w-full h-full overflow-hidden bg-white">
        {children}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4 overflow-auto" style={{ maxHeight: '100%' }}>
      <div
        className={`relative ${cfg.rounded} ${cfg.shadow} overflow-hidden bg-white flex-shrink-0`}
        style={{
          width: cfg.width,
          height: cfg.height,
          maxHeight: 'calc(100vh - 160px)',
          aspectRatio: isMobile ? '390/844' : isTablet ? '768/600' : undefined,
          border: `3px solid ${primaryColor}30`,
          outline: `1px solid ${primaryColor}15`,
        }}
      >
        {/* Device chrome — top notch for mobile */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-2 pointer-events-none">
            <div className="w-28 h-7 rounded-full bg-black" />
          </div>
        )}
        {/* Device chrome — camera dot for tablet */}
        {isTablet && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-3 h-3 rounded-full bg-black/60 pointer-events-none" />
        )}
        {/* Content */}
        <div className="w-full h-full overflow-hidden" style={{ paddingTop: isMobile ? '44px' : isTablet ? '10px' : 0 }}>
          {children}
        </div>
        {/* Bottom home indicator for mobile */}
        {isMobile && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-black/30 pointer-events-none" />
        )}
      </div>
    </div>
  )
}
