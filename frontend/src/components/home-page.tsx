"use client"
import { FileText, Calendar, Users, ClipboardList, HelpCircle, Flame, MessageCircle } from "lucide-react"
import Link from "next/link"
import { SharedNav } from "./shared-nav"

export function HomePage() {
  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* 顶部Banner区 */}
      <div 
        className="relative w-full h-[180px] rounded-b-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #90EE90 0%, #66CDAA 50%, #3CB371 100%)"
        }}
      >
        {/* 装饰元素 */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-white/10" />
        <div className="absolute top-12 left-1/4 w-6 h-6 rounded-full bg-white/15" />
        
        {/* 文案 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-xl font-bold text-white mb-2">欢迎来到健康空间</h1>
          <p className="text-sm text-white/80">一站式健康管理、打卡与社区交流</p>
        </div>
      </div>

      {/* 核心功能入口区 */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/questionnaire"
            onClick={triggerHaptic}
            className="bg-white rounded-xl p-4 shadow-sm border border-border hover:bg-accent hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground">健康评估</span>
              <span className="text-xs text-muted-foreground">生成专属报告</span>
            </div>
          </Link>

          <Link 
            href="/report"
            onClick={triggerHaptic}
            className="bg-white rounded-xl p-4 shadow-sm border border-border hover:bg-accent hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground">个人报告</span>
              <span className="text-xs text-muted-foreground">查看健康数据</span>
            </div>
          </Link>

          <Link 
            href="/checkin"
            onClick={triggerHaptic}
            className="bg-white rounded-xl p-4 shadow-sm border border-border hover:bg-accent hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground">打卡服务</span>
              <span className="text-xs text-muted-foreground">养成健康习惯</span>
            </div>
          </Link>

          <Link 
            href="/community"
            onClick={triggerHaptic}
            className="bg-white rounded-xl p-4 shadow-sm border border-border hover:bg-accent hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-semibold text-foreground">健康社区</span>
              <span className="text-xs text-muted-foreground">交流打卡心得</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 功能介绍区 */}
      <div className="px-5 mt-6 space-y-3">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base text-foreground leading-relaxed">3-5分钟完成评估，精准分析营养状况</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base text-foreground leading-relaxed">连续打卡赢勋章，养成健康好习惯</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base text-foreground leading-relaxed">加入专属打卡圈，和同好一起成长</p>
        </div>
      </div>

      {/* 底部引导区 */}
      <div className="flex-1 flex items-end justify-center pb-24 pt-6">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-bold">Go</span>
          </div>
          <span className="text-base font-semibold text-primary">立即开启你的健康之旅吧</span>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
