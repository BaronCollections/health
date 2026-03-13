"use client"

import { useState } from "react"
import { FileText, Clock, Settings, HelpCircle, ChevronRight, Trash2, Lock, X } from "lucide-react"
import { SharedNav } from "./shared-nav"

const userData = {
  userName: "用户",
  userTag: "儿童 · 4-12岁 · 男",
  avatar: "🍋",
}

export function PricingPage() {
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState<"default" | "large">("default")

  const functionEntries = [
    { icon: FileText, label: "我的报告" },
    { icon: Clock, label: "评估记录" },
    { icon: Settings, label: "设置", onClick: () => setShowSettings(true) },
    { icon: HelpCircle, label: "帮助中心" },
  ]

  const handleClearCache = () => {
    if (confirm("确定清理缓存吗？清理后需重新加载数据")) {
      localStorage.clear()
      alert("缓存已清理")
    }
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <header className="px-5 pt-14 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSettings(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">设置</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="flex-1">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="text-base text-foreground">字体大小</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize("default")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  fontSize === "default"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                默认
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  fontSize === "large"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                放大
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">缓存清理</span>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-1.5 bg-secondary text-muted-foreground text-sm rounded-md"
            >
              清理本地缓存
            </button>
          </div>

          <button className="w-full flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="text-base text-foreground">隐私政策</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <SharedNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <header
        className="pt-14 pb-6 px-5"
        style={{
          background: "linear-gradient(180deg, var(--primary) 0%, var(--lemon-yellow-dark) 100%)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center border-4 border-card shadow-md mb-4">
            <span className="text-3xl">{userData.avatar}</span>
          </div>
          
          <p className="text-lg font-bold text-primary-foreground mb-1">{userData.userName}</p>
          <p className="text-sm text-white/80 mb-4">{userData.userTag}</p>
          
          <button className="px-6 py-2 bg-card rounded-full text-sm font-medium text-primary">
            编辑资料
          </button>
        </div>
      </header>

      <div className="px-5 -mt-2">
        <div className="grid grid-cols-2 gap-3">
          {functionEntries.map((entry, index) => {
            const Icon = entry.icon
            return (
              <button
                key={index}
                onClick={entry.onClick}
                className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 hover:bg-accent transition-colors"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{entry.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 px-5 mt-6 pb-24">
        <div
          className="bg-accent rounded-xl p-4 border border-primary/20"
          style={{ boxShadow: "0 2px 8px rgba(255,209,102,0.1)" }}
        >
          <h3 className="text-sm font-bold text-foreground mb-2">今日健康小贴士</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            多喝水有助于身体代谢，建议每天饮用8杯水，保持身体水分充足。
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">Morning 健康助手 v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">适合3岁以上全人群，儿童需家长协助</p>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
