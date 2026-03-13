"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import React from "react"

interface FloatingArrowBallProps {
  targetRef?: React.RefObject<HTMLDivElement | null>
  onShoot?: () => void
  onCapsuleArrived?: (data: string) => void
}

export function FloatingArrowBall({ targetRef, onShoot, onCapsuleArrived }: FloatingArrowBallProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const ballRef = useRef<HTMLDivElement>(null)
  const initialPos = useRef({ x: 0, y: 0 })
  const dragStartPos = useRef({ x: 0, y: 0 })
  const dragStartTime = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)

  // 营养元素
  const symbolElements = [
    { symbol: "V", color: "#6DD5C7" },
    { symbol: "B", color: "#FF8A8A" },
    { symbol: "C", color: "#FFD93D" },
    { symbol: "D", color: "#A8E6CF" },
    { symbol: "E", color: "#C4B5FD" },
    { symbol: "Ca", color: "#6699FF" },
    { symbol: "Fe", color: "#FFB5BA" },
    { symbol: "Zn", color: "#87CEEB" },
    { symbol: "Mg", color: "#80CBC4" },
    { symbol: "K", color: "#F9A8D4" },
  ]

  const ballSize = 48
  const friction = 0.98 // 摩擦系数
  const bounceDamping = 0.7 // 弹跳衰减
  const minVelocity = 0.5 // 最小速度阈值

  // 初始化位置：右下角
  useEffect(() => {
    const initX = window.innerWidth - 80
    const initY = window.innerHeight - 180
    initialPos.current = { x: initX, y: initY }
    setPosition({ x: initX, y: initY })
  }, [])

  const triggerHaptic = (type: "light" | "medium" | "success") => {
    if ("vibrate" in navigator) {
      switch (type) {
        case "light": navigator.vibrate(10); break
        case "medium": navigator.vibrate(20); break
        case "success": navigator.vibrate([30, 50, 30, 50, 50]); break
      }
    }
  }

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    
    // 取消正在进行的弹跳动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setIsBouncing(false)
    setIsDragging(true)
    triggerHaptic("light")

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    
    dragStartPos.current = { x: clientX, y: clientY }
    dragStartTime.current = Date.now()
    lastPos.current = { x: clientX, y: clientY }
  }

  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // 计算即时速度
    velocityRef.current = {
      x: clientX - lastPos.current.x,
      y: clientY - lastPos.current.y,
    }
    lastPos.current = { x: clientX, y: clientY }

    const newX = Math.max(0, Math.min(window.innerWidth - ballSize, clientX - ballSize / 2))
    const newY = Math.max(0, Math.min(window.innerHeight - ballSize, clientY - ballSize / 2))

    setPosition({ x: newX, y: newY })
  }, [isDragging])

  // 物理弹跳动画
  const startBounceAnimation = useCallback(() => {
    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocityRef.current.x
        let newY = prev.y + velocityRef.current.y
        let vx = velocityRef.current.x * friction
        let vy = velocityRef.current.y * friction

        // 边界碰撞检测 - 左右墙壁
        if (newX <= 0) {
          newX = 0
          vx = -vx * bounceDamping
          triggerHaptic("light")
        } else if (newX >= window.innerWidth - ballSize) {
          newX = window.innerWidth - ballSize
          vx = -vx * bounceDamping
          triggerHaptic("light")
        }

        // 边界碰撞检测 - 上下墙壁
        if (newY <= 0) {
          newY = 0
          vy = -vy * bounceDamping
          triggerHaptic("light")
        } else if (newY >= window.innerHeight - ballSize - 100) { // 留出底部导航栏空间
          newY = window.innerHeight - ballSize - 100
          vy = -vy * bounceDamping
          triggerHaptic("light")
        }

        velocityRef.current = { x: vx, y: vy }

        // 检测是否击中目标圆圈
        if (targetRef?.current) {
          const targetRect = targetRef.current.getBoundingClientRect()
          const ballCenterX = newX + ballSize / 2
          const ballCenterY = newY + ballSize / 2
          const targetCenterX = targetRect.left + targetRect.width / 2
          const targetCenterY = targetRect.top + targetRect.height / 2
          const distance = Math.sqrt(
            Math.pow(ballCenterX - targetCenterX, 2) + 
            Math.pow(ballCenterY - targetCenterY, 2)
          )

          if (distance < targetRect.width / 2 + ballSize / 2) {
            // 命中目标
            triggerHaptic("success")
            setIsBouncing(false)
            
            // 发送营养元素
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const element = symbolElements[Math.floor(Math.random() * symbolElements.length)]
                onCapsuleArrived?.(element.color + "|" + element.symbol)
              }, i * 100)
            }
            
            onShoot?.()
            
            const points = Math.floor(Math.random() * 41) + 10
            setEarnedPoints(points)
            setShowSuccess(true)
            
            setTimeout(() => {
              setShowSuccess(false)
              setPosition(initialPos.current)
            }, 2000)
            
            return { x: targetCenterX - ballSize / 2, y: targetCenterY - ballSize / 2 }
          }
        }

        // 如果速度足够低，停止动画
        if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) {
          setIsBouncing(false)
          return prev
        }

        return { x: newX, y: newY }
      })

      if (isBouncing) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isBouncing, targetRef, onCapsuleArrived, onShoot, symbolElements])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // 计算释放时的速度（基于拖拽力道）
    const speed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x + 
      velocityRef.current.y * velocityRef.current.y
    )

    if (speed > 2) {
      // 有足够的力道，开始弹跳
      velocityRef.current = {
        x: velocityRef.current.x * 2,
        y: velocityRef.current.y * 2,
      }
      setIsBouncing(true)
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove)
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchmove", handleDragMove, { passive: false })
      window.addEventListener("touchend", handleDragEnd)
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", handleDragMove)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // 弹跳动画
  useEffect(() => {
    if (isBouncing) {
      startBounceAnimation()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isBouncing, startBounceAnimation])

  return (
    <>
      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-[#A7DDD8] to-[#80CBC4] text-white px-10 py-6 rounded-3xl shadow-2xl shadow-[#80CBC4]/30">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">命中目标</p>
                <p className="text-white/80 text-sm">营养补充成功</p>
              </div>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-400/25">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">获得能量</p>
                <p className="text-2xl font-bold text-[#80CBC4]">+{earnedPoints}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 弹跳时显示目标区域 */}
      {(isDragging || isBouncing) && targetRef?.current && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {/* 目标圆圈高亮 */}
          <div
            className="absolute rounded-full border-4 border-[#80CBC4]/50 animate-pulse"
            style={{
              width: targetRef.current.getBoundingClientRect().width + 20,
              height: targetRef.current.getBoundingClientRect().height + 20,
              left: targetRef.current.getBoundingClientRect().left - 10,
              top: targetRef.current.getBoundingClientRect().top - 10,
              boxShadow: "0 0 30px rgba(128, 203, 196, 0.3)",
            }}
          />
        </div>
      )}

      {/* 悬浮球 */}
      <div
        ref={ballRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={`fixed z-50 cursor-grab active:cursor-grabbing select-none touch-none ${
          isDragging || isBouncing ? "" : "transition-all duration-300"
        }`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl ${
            isDragging ? "scale-110" : isBouncing ? "scale-105" : "hover:scale-105"
          }`}
          style={{
            background: "radial-gradient(circle at 35% 30%, #B2DFDB 0%, #80CBC4 45%, #4DB6AC 100%)",
            boxShadow: isBouncing 
              ? `0 12px 40px rgba(128, 203, 196, 0.6), 0 6px 16px rgba(128, 203, 196, 0.4), inset 0 -4px 12px rgba(0, 0, 0, 0.15)`
              : `0 8px 30px rgba(128, 203, 196, 0.5), 0 4px 12px rgba(128, 203, 196, 0.3), inset 0 -4px 12px rgba(0, 0, 0, 0.15)`,
            animation: isDragging || isBouncing ? "none" : "float 3s ease-in-out infinite",
          }}
        >
          {/* 高光 */}
          <div
            className="absolute top-1 left-2 w-4 h-3 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
              filter: "blur(1px)",
            }}
          />
          <span className="text-white text-sm font-bold">球</span>
        </div>
      </div>
    </>
  )
}
