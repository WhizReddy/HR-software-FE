import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const getMatches = () =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
      : false

  const [isMobile, setIsMobile] = React.useState(getMatches)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    )

    const onChange = () => setIsMobile(mediaQuery.matches)
    onChange()

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
