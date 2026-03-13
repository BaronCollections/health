"use client"
import { useState } from "react"
import { FileText, Calendar, Award, Star, Edit2, ChevronRight, Bell, Shield, Settings, HelpCircle, Info, ImageIcon, Bookmark, Users, MessageCircle } from "lucide-react"
import { SharedNav } from "./shared-nav"

export function ProfilePage() {
  const [userData] = useState({
    name: "小柠檬",
    tag: "儿童 · 4-12岁 · 男",
    level: "LV.3 营养达人",
    points: 280,
    medals: 1,
  })

  const [notificationEnabled, setNotificationEnabled] = useState(true)

  const healthMenus = [
    { icon: FileText, label: "个人报告", href: "/report" },
    { icon: Calendar, label: "打卡记录", href: "/checkin" },
    { icon: Award, label: "勋章墙", href: "#" },
    { icon: Star, label: "积分明细", href: "#" },
  ]

  const socialMenus = [
    { icon: ImageIcon, label: "我的动态", href: "#", color: "#4299E1" },
    { icon: Bookmark, label: "我的收藏", href: "#", color: "#90EE90" },
    { icon: Bell, label: "消息通知", href: "#", badge: true, color: "#E63946" },
    { icon: Users, label: "我的圈子", href: "#", color: "#4299E1" },
  ]

  return (
    <div className="min-h-screen bg-muted flex flex-col max-w-md mx-auto relative pb-20">
      {/* 顶部个人信息区 */}
      <div 
        className="w-full px-5 pt-10 pb-6"
        style={{ background: "linear-gradient(135deg, #90EE90 0%, #66CDAA 100%)" }}
      >
        <div className="flex flex-col items-center">
          {/* 头像 */}
          <div className="w-16 h-16 rounded-full bg-white border-4 border-white/50 flex items-center justify-center mb-3">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">L</span>
            </div>
          </div>
          
          {/* 昵称 */}
          <h2 className="text-lg font-bold text-white mb-1">{userData.name}</h2>
          
          {/* 标签 */}
          <p className="text-sm text-white/80 mb-2">{userData.tag}</p>
          
          {/* 等级 */}
          <span className="px-3 py-1 rounded-full text-sm text-white font-medium" style={{ background: "rgba(255,159,28,0.8)" }}>
            {userData.level}
          </span>
          
          {/* 编辑资料按钮 */}
          <button className="mt-3 px-6 py-1.5 rounded-full bg-white text-primary text-sm font-medium flex items-center gap-1">
            <Edit2 className="w-4 h-4" /> 编辑资料
          </button>
          
          {/* 积分勋章 */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-white" />
              <span className="text-sm text-white">积分：{userData.points}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-white" />
              <span className="text-sm text-white">勋章：{userData.medals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 健康管理板块 */}
      <div className="px-5 mt-4">
        <h3 className="text-base font-semibold text-foreground mb-2">健康管理</h3>
        <div className="h-px bg-border mb-3" />
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          {healthMenus.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 hover:bg-accent transition-colors ${
                index !== healthMenus.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* 社区互动板块 */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-semibold text-foreground mb-2">社区互动</h3>
        <div className="h-px bg-border mb-3" />
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          {socialMenus.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 hover:bg-accent transition-colors ${
                index !== socialMenus.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <span className="text-base text-foreground">{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* 系统设置板块 */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-semibold text-foreground mb-2">系统设置</h3>
        <div className="h-px bg-border mb-3" />
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          {/* 消息通知开关 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">消息通知</span>
            </div>
            <button
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notificationEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                notificationEnabled ? "translate-x-6" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* 账号安全 */}
          <a href="#" className="flex items-center justify-between px-5 py-4 border-b border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">账号安全</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive">未绑定手机号</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </a>

          {/* 模式切换 */}
          <a href="#" className="flex items-center justify-between px-5 py-4 border-b border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">模式切换</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">标准模式</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </a>

          {/* 帮助与反馈 */}
          <a href="#" className="flex items-center justify-between px-5 py-4 border-b border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">帮助与反馈</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </a>

          {/* 版本信息 */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">版本信息</span>
            </div>
            <span className="text-sm text-muted-foreground">V1.0.0 最新版</span>
          </div>
        </div>
      </div>

      {/* 底部信息区 */}
      <div className="px-5 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          2026 健康科技 | <span className="hover:text-primary cursor-pointer">隐私政策</span> | <span className="hover:text-primary cursor-pointer">用户协议</span>
        </p>
      </div>

      <SharedNav />
    </div>
  )
}
