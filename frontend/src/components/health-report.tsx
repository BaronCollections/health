"use client"

import { Moon, Activity, Heart, Check, AlertTriangle, ChevronRight } from "lucide-react"
import { SharedNav } from "./shared-nav"

const userData = {
  userName: "用户",
  userTag: "儿童,4-12岁,男",
  totalScore: 82,
  scoreLevel: "营养状态良好",
}

const dimensionScores = [
  { id: 1, name: "生活习惯", score: 78, icon: Moon, color: "var(--warning-orange)" },
  { id: 2, name: "饮食习惯", score: 85, icon: Activity, color: "var(--success-green)" },
  { id: 3, name: "身体状况", score: 80, icon: Heart, color: "var(--success-green)" },
]

const advantageList = [
  "作息规律：每天睡眠7-8小时，入睡顺利",
  "蔬菜摄入充足：每天摄入3种以上蔬菜",
]

const nutrientGapList = [
  "维生素D摄入不足，建议每日晒太阳15分钟",
  "钙质补充不够，建议增加奶制品摄入",
]

export function HealthReport() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success-green)"
    if (score >= 60) return "var(--warning-orange)"
    return "var(--danger-red)"
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "营养状态良好"
    if (score >= 60) return "营养基本均衡"
    return "营养缺口较大"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* 顶部信息栏 */}
      <header className="bg-primary pt-14 pb-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-sm">
              <span className="text-2xl">🍋</span>
            </div>
            <div>
              <p className="text-lg font-bold text-primary-foreground">{userData.userName}</p>
              <p className="text-sm text-white/80">{userData.userTag.replace(/,/g, " · ")}</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg px-4 py-2 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: getScoreColor(userData.totalScore) }}>
              {userData.totalScore}
            </p>
            <p className="text-xs" style={{ color: getScoreColor(userData.totalScore) }}>
              {getScoreLevel(userData.totalScore)}
            </p>
          </div>
        </div>
      </header>

      {/* 核心数据区 */}
      <div className="px-5 -mt-2">
        <div className="flex gap-2">
          {dimensionScores.map((dim) => {
            const Icon = dim.icon
            return (
              <div
                key={dim.id}
                className="flex-1 bg-card rounded-xl p-4 border border-border flex flex-col items-center"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `color-mix(in srgb, ${dim.color} 15%, transparent)` }}
                >
                  <Icon className="w-5 h-5" style={{ color: dim.color }} />
                </div>
                <p className="text-xl font-bold" style={{ color: dim.color }}>
                  {dim.score}
                </p>
                <p className="text-xs text-foreground">{dim.name}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 详情区域 */}
      <div className="px-5 mt-4 flex-1 pb-24">
        {/* 优势保持卡片 */}
        <div
          className="bg-card rounded-xl p-5 border border-border mb-4"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="mb-3">
            <h3 className="text-base font-bold text-foreground">优势保持</h3>
            <div className="w-15 h-0.5 bg-primary mt-1" style={{ width: 60 }} />
          </div>
          <div className="space-y-3">
            {advantageList.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-chart-2 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <p className="text-sm text-foreground leading-5">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 核心缺口卡片 */}
        <div
          className="bg-card rounded-xl p-5 border border-border mb-4"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="mb-3">
            <h3 className="text-base font-bold text-foreground">核心缺口</h3>
            <div className="w-15 h-0.5 bg-destructive mt-1" style={{ width: 60 }} />
          </div>
          <div className="space-y-3">
            {nutrientGapList.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <p className="text-sm text-foreground leading-5">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 查看完整报告按钮 */}
        <div className="flex justify-center mt-6">
          <button
            className="w-4/5 py-3 bg-primary text-primary-foreground text-base font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            onClick={() => {
              alert("完整报告暂未生成，敬请期待")
            }}
          >
            查看完整报告
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 复评提醒 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            建议每3个月重新测评一次，动态调整营养方案
          </p>
        </div>
      </div>

      <SharedNav />
    </div>
  )
}
