"use client"
import { ChevronRight } from "lucide-react"
import React from "react"

import { useRef } from "react"

import { useRouter } from "next/navigation"
import { SharedNav } from "./shared-nav"
import { useState, useEffect } from "react"

// 用户评价数据
const testimonials = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
    stat: "89%",
    statDesc: "用户服用后感受效果明显*",
    footnote: "*以上数据来自 2023 年 Morning 用户回访调研。",
    quote: "不知不觉坚持吃了一个月，入睡时间变短了起来，之后也明显感到很精神。",
    userName: "Sunny",
    userGoal: "改善睡眠",
    userInfo: "女 / 32岁 / 宝妈",
    memberSince: "MORNING 会员自 2021 年起",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    stat: "92%",
    statDesc: "用户表示精力更充沛*",
    footnote: "*以上数据来自 2024 年 Morning 用户回访调研。",
    quote: "以前下午总是犯困，现在精力充沛很多，工作效率明显提高了。",
    userName: "小雨",
    userGoal: "提升精力",
    userInfo: "女 / 28岁 / 白领",
    memberSince: "MORNING 会员自 2022 年起",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    stat: "85%",
    statDesc: "用户肠胃问题得到改善*",
    footnote: "*以上数据来自 2024 年 Morning 用户回访调研。",
    quote: "之前经常便秘，吃了益生菌后肠胃舒服多了，排便也规律了。",
    userName: "阿明",
    userGoal: "肠胃健康",
    userInfo: "男 / 35岁 / 程序员",
    memberSince: "MORNING 会员自 2023 年起",
  },
]

export function MorningHome() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // 手势滑动支持
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < testimonials.length - 1) {
        setCurrentSlide(prev => prev + 1)
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      {/* 顶部状态栏 */}
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-border">
        <span className="text-base font-medium text-foreground">Morning</span>
      </div>

      {/* Hero区域 */}
      <div className="bg-white px-5 py-6">
        <div className="relative">
          {/* 装饰圆圈 - 添加浮动动画 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8FFE8] rounded-full -translate-y-4 translate-x-4 animate-float" />
          <div className="absolute top-8 right-8 w-16 h-16 bg-[#D0F5D0] rounded-full opacity-60 animate-float-delayed" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
              私人定制，
              <br />
              只补充所需。
            </h1>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => router.push("/report")}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-foreground border border-border"
              >
                全部产品
              </button>
              <button 
                onClick={() => router.push("/questionnaire")}
                className="px-4 py-2 bg-primary rounded-full text-sm font-medium text-white"
              >
                精准测评
              </button>
            </div>
          </div>
        </div>
        
        {/* 定制营养卡片 */}
        <div className="mt-6 p-4 rounded-2xl border border-border bg-gradient-to-br from-white to-[#F8FFF8]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <span className="text-sm font-medium text-foreground">定制营养</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                根据测评了解身体，更有针对性补充营养
              </p>
            </div>
            <button 
              onClick={() => router.push("/questionnaire")}
              className="ml-4 px-4 py-2 bg-primary/10 rounded-full text-xs font-medium text-primary"
            >
              立即测评
            </button>
          </div>
        </div>
      </div>

      {/* 简单3步 */}
      <div className="px-5 py-6 border-t border-border">
        <h2 className="text-lg font-bold text-primary text-center mb-2">3 步搞定专属营养，简单到离谱</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">AI 精准分析 · 无推销纯建议 · 社区陪伴成长</p>
        
        <div className="flex gap-2">
          {/* 第一步 */}
          <button 
            onClick={() => router.push("/questionnaire")}
            className="flex-1 bg-white rounded-xl p-3 border border-border card-hover"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8FFE8] flex items-center justify-center mb-2 mx-auto">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h4 className="font-bold text-foreground text-xs text-center mb-1">1 分钟轻量评估</h4>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">不用专业知识，勾选饮食/作息/运动偏好</p>
          </button>

          {/* 第二步 */}
          <button 
            onClick={() => router.push("/report")}
            className="flex-1 bg-white rounded-xl p-3 border border-border card-hover"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8FFE8] flex items-center justify-center mb-2 mx-auto">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h4 className="font-bold text-foreground text-xs text-center mb-1">AI 科学解读</h4>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">只给科学建议，标注营养缺口，无推销</p>
          </button>

          {/* 第三步 */}
          <button 
            onClick={() => router.push("/community")}
            className="flex-1 bg-white rounded-xl p-3 border border-border card-hover"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8FFE8] flex items-center justify-center mb-2 mx-auto">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-foreground text-xs text-center mb-1">社区打卡同行</h4>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">加入健康圈子，互相监督成长</p>
          </button>
        </div>
      </div>

      {/* 用户评价轮播 */}
      <div className="px-5 py-6 border-t border-border">
        <h2 className="text-base font-bold text-foreground mb-1">真实用户，真实反馈</h2>
        <p className="text-xs text-muted-foreground mb-4">Real Stories from Real Users</p>
        
        {/* 轮播容器 - 支持手势滑动 */}
        <div 
          className="relative overflow-hidden rounded-2xl touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0">
                {/* 图片区域 */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.userName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-4xl font-bold text-white">{item.stat}</span>
                    <p className="text-sm text-white/90 mt-1">{item.statDesc}</p>
                  </div>
                  <p className="absolute bottom-4 left-4 right-4 text-[10px] text-white/70">
                    {item.footnote}
                  </p>
                </div>
                
                {/* 文字区域 */}
                <div className="pt-4">
                  <p className="text-lg font-medium text-foreground leading-relaxed mb-4">
                    {item.quote}
                  </p>
                  
                  {/* 用户信息 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.userName} | {item.userGoal}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.userInfo}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 轮播指示器 */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentSlide ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 每日一包 */}
      <div className="px-5 pt-6">
        <div 
          className="w-full py-6 px-6 rounded-2xl transition-all duration-200"
          style={{ 
            background: "linear-gradient(135deg, #E8FFE8 0%, #D0F5D0 100%)"
          }}
        >
          <div className="flex items-center justify-between">
            {/* 左侧文案区 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-primary tracking-wide mb-2">每日一包</h2>
              <p className="text-base text-foreground mb-1.5">更方便，更省心。</p>
              <p className="text-sm text-muted-foreground italic tracking-wide">Once a Day Pack</p>
            </div>
            
            {/* 右侧视觉区 */}
            <div className="flex flex-col items-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              {/* 装饰点 */}
              <div className="flex gap-1 mt-2">
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="w-1 h-1 rounded-full bg-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 品牌故事 */}
      <div className="px-5 pt-6">
        <div 
          className="w-full py-6 px-6 bg-white rounded-2xl border border-border transition-all duration-200 hover:border-primary hover:bg-[#FAFFFA]"
        >
          {/* 品牌标识 */}
          <h2 className="text-lg font-bold text-foreground mb-3 tracking-wide">
            Hi, 我们是猫柠 <span className="text-primary">MORNING</span>.
          </h2>
          
          {/* 品牌主张 */}
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
            我们相信，健康不应该是千篇一律的解决方案。每个人的身体都是独特的，需要个性化的关注。
          </p>
          
          {/* 三个核心价值 */}
          <div className="flex justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <svg className="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-bold text-foreground">科学依据</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-bold text-foreground">健康打卡</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-bold text-foreground">画像回溯</span>
            </div>
          </div>
        </div>
      </div>

      {/* 品牌信任状 */}
      <div className="px-5 pt-6">
        <div 
          className="w-full py-6 px-6 bg-white rounded-2xl border border-border transition-colors duration-200 hover:bg-[#FAFFFA]"
        >
          <div className="flex">
            {/* 左侧用户规模区 */}
            <div className="flex-[6]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-primary tracking-tight">1000 万 +</span>
                <span className="text-base font-bold text-foreground tracking-wide">用户</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className="text-xs text-muted-foreground tracking-wide">8,000,000+ Morning Customers</span>
              </div>
            </div>
            
            {/* 右侧用户反馈区 */}
            <div className="flex-[4] pl-4 border-l border-border">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-primary tracking-tight">2000+</span>
              </div>
              <div className="flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                </svg>
                <span className="text-[13px] text-foreground leading-5">用户坚持健康打卡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-6">
        <button 
          onClick={() => router.push("/questionnaire")}
          className="w-full py-4 bg-primary rounded-xl text-white font-medium flex items-center justify-center gap-2"
        >
          开始测评
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 底部间距 */}
      <div className="pb-20" />

      <SharedNav />
    </div>
  )
}
