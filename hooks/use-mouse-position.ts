import { RefObject, useEffect, useState } from "react"

export const useMousePosition = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let rect: DOMRect | null = null

    const updatePosition = (clientX: number, clientY: number) => {
      if (containerRef && containerRef.current) {
        if (!rect) {
          rect = containerRef.current.getBoundingClientRect()
        }
        const relativeX = clientX - rect.left
        const relativeY = clientY - rect.top

        // Calculate relative position even when outside the container
        setPosition({ x: relativeX, y: relativeY })
      } else {
        setPosition({ x: clientX, y: clientY })
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY)
    }

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }

    const handleScrollOrResize = () => {
      rect = null
    }

    // Listen for both mouse and touch events
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("resize", handleScrollOrResize)
    window.addEventListener("scroll", handleScrollOrResize, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("resize", handleScrollOrResize)
      window.removeEventListener("scroll", handleScrollOrResize)
    }
  }, [containerRef])

  return position
}
