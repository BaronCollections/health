"use client"
import { useState } from "react"
import { Calendar, Clock, Users, Flame, Leaf, Moon, Dumbbell, Check, Award, PieChart, Plus } from "lucide-react"
import { SharedNav } from "./shared-nav"

interface CheckInItem {
  id: string
  name: string
  icon: typeof Leaf
  checked: boolean
  iconColor: string
}

export function CheckInPage() {
  const [continuousDays, setContinuousDays] = useState(7)
  const [showMedalModal, setShowMedalModal] = useState(false)
  const [checkInItems, setCheckInItems] = useState<CheckInItem[]>([
    { id: "1", name: "营养摄入", icon: Leaf, checked: true, iconColor: "#27AE60" },
    { id: "2", name: "运动达标", icon: Dumbbell, checked: false, iconColor: "#999" },
    { id: "3", name: "作息规律", icon: Moon, checked: false, iconColor: "#999" },
  ])

  const [stats] = useState({
    totalCheckIns: 28,
    monthlyRate: 80,
    medals: 1,
  })

  const [medals] = useState([
    { name: "活力勋章", condition: "连续打卡10天", unlocked: true },
    { name: "坚持勋章", condition: "连续打卡30天", unlocked: false },
    { name: "全能勋章", condition: "完成所有打卡项", unlocked: false },
  ])

  const triggerHaptic = (type: "light" | "success") => {
    if ("vibrate" in navigator) {
      if (type === "light") navigator.vibrate(10)
      else navigator.vibrate([30, 50, 30])
    }
  }

  const handleCheckIn = (id: string) => {
    setCheckInItems(items =>
      items.map(item => {
        if (item.id === id && !item.checked) {
          triggerHaptic("success")
          setContinuousDays(prev => prev + 1)
          return { ...item, checked: true, iconColor: "#27AE60" }
        }
        return item
      })
    )
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col max-w-md mx-auto relative pb-20">
      {/* 顶部导航区 */}
      <div className="px-5 py-4 bg-white border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">每日健康打卡</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-primary text-sm font-medium">
            <Clock className="w-4 h-4" /> 打卡记录
          </button>
          <button className="flex items-center gap-1 text-primary text-sm font-medium">
            <Users className="w-4 h-4" /> 打卡圈
          </button>
        </div>
      </div>

      {/* 连续打卡激励区 */}
      <div className="px-5 py-6 flex flex-col items-center">
        <button
          onClick={() => setShowMedalModal(true)}
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform"
          style={{
            background: "linear-gradient(135deg, #90EE90 0%, #66CDAA 100%)",
            boxShadow: "0 4px 20px rgba(144, 238, 144, 0.4)"
          }}
        >
          <Flame className="w-6 h-6 text-white mb-1" />
          <span className="text-xs text-white font-medium">连续打卡</span>
          <span className="text-lg text-white font-bold">{continuousDays}天</span>
        </button>
        
        <div className="mt-3 flex items-center gap-2 text-muted-foreground">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-sm">距离下一个勋章还有3天</span>
        </div>
        
        {/* 进度条 */}
        <div className="w-48 h-1 bg-border rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: "70%", background: "linear-gradient(90deg, #90EE90, #66CDAA)" }}
          />
        </div>
      </div>

      {/* 今日打卡项区 */}
      <div className="px-5">
        <h2 className="text-base font-semibold text-foreground mb-3">今日打卡</h2>
        <div className="space-y-3">
          {checkInItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg p-4 shadow-sm border flex items-center justify-between transition-all ${
                item.checked ? "border-green-200 bg-green-50/50" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: item.iconColor }} />
                <span className="text-base text-foreground">{item.name}</span>
              </div>
              
              {item.checked ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <button
                  onClick={() => handleCheckIn(item.id)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #90EE90, #66CDAA)" }}
                >
                  打卡
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 打卡统计区 */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-foreground">{stats.totalCheckIns}次</span>
              <span className="text-xs text-muted-foreground">总打卡次数</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PieChart className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-foreground">{stats.monthlyRate}%</span>
              <span className="text-xs text-muted-foreground">本月完成率</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-foreground">{stats.medals}枚</span>
              <span className="text-xs text-muted-foreground">已获勋章</span>
            </div>
          </div>
        </div>
      </div>

      {/* 自定义打卡项按钮 */}
      <div className="px-5 mt-6 pb-4">
        <button className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #90EE90, #66CDAA)" }}
        >
          <Plus className="w-5 h-5" /> 创建自定义打卡项
        </button>
      </div>

      {/* 勋章弹窗 */}
      {showMedalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowMedalModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[80%] max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">我的勋章</h3>
            <div className="space-y-3">
              {medals.map((medal) => (
                <div 
                  key={medal.name}
                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                    medal.unlocked ? "border-primary bg-accent" : "border-border bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    medal.unlocked ? "bg-primary" : "bg-muted"
                  }`}>
                    <Award className={`w-5 h-5 ${medal.unlocked ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${medal.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                      {medal.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{medal.condition}</p>
                  </div>
                  {medal.unlocked && (
                    <span className="ml-auto text-xs text-primary font-medium">已解锁</span>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowMedalModal(false)}
              className="mt-4 w-full py-2 rounded-lg border border-border text-muted-foreground"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <SharedNav />
    </div>
  )
}
