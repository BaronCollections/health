"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronRight, Calendar, Flame, MessageCircle, ArrowLeft, X } from "lucide-react"
import { SharedNav } from "./shared-nav"

// 数字滚动动画组件
function AnimatedNumber({ value, duration = 1000 }: { value: number, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true)
      const startValue = prevValue.current
      const endValue = value
      const startTime = Date.now()
      
      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(startValue + (endValue - startValue) * easeOut)
        setDisplayValue(current)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          prevValue.current = value
        }
      }
      requestAnimationFrame(animate)
    }
  }, [value, duration])

  return <span className={isAnimating ? "text-primary" : ""}>{displayValue}</span>
}

// 全部营养补剂数据
const allSupplements = [
  // 图1 - 抗氧、平衡、肠道、免疫、心脑、经期
  { id: 1, category: "抗氧", nameEn: "Curcumin", name: "C3 姜黄素", color: "from-amber-600 to-amber-700", type: "capsule", 
    benefit: "强效抗氧化，保护细胞健康", supplement: "姜黄素C3复合物 500mg", usage: "每日1粒，随餐服用，避免空腹", 
    desc: "姜黄素是一种强效的天然抗氧化剂，能够清除自由基，保护细胞免受氧化损伤，支持关节健康和心血管功能。" },
  { id: 2, category: "平衡", nameEn: "Daily Probiotics", name: "Daily 益生菌", color: "from-gray-100 to-amber-100", type: "capsule-white",
    benefit: "调节肠道菌群，增强免疫力", supplement: "复合益生菌 100亿CFU", usage: "每日1粒，早餐前空腹服用效果最佳",
    desc: "含有多种有益菌株，帮助维持肠道菌群平衡，促进消化吸收，增强身体免疫功能。" },
  { id: 3, category: "肠道", nameEn: "Dietary Fiber", name: "膳食纤维", color: "from-amber-500 to-amber-600", type: "oval",
    benefit: "促进肠道蠕动，改善便秘", supplement: "水溶性膳食纤维 5g", usage: "每日1-2次，用200ml温水冲服",
    desc: "优质水溶性膳食纤维，能够促进肠道蠕动，帮助排出体内毒素，维持肠道健康。" },
  { id: 4, category: "免疫", nameEn: "Vitamin C", name: "维生素 C", color: "from-yellow-400 to-orange-400", type: "round",
    benefit: "增强免疫力，美白抗氧化", supplement: "维生素C 1000mg", usage: "每日1粒，餐后服用",
    desc: "高含量维生素C，增强机体免疫力，促进胶原蛋白合成，美白肌肤，加速伤口愈合。" },
  { id: 5, category: "心脑", nameEn: "Algae Oil", name: "海藻油", color: "from-amber-300 to-amber-400", type: "softgel",
    benefit: "保护心脑血管，改善记忆力", supplement: "DHA藻油 250mg", usage: "每日1-2粒，随餐服用",
    desc: "植物来源的DHA，不含海洋污染物，支持大脑和视力健康，保护心血管系统。" },
  { id: 6, category: "经期", nameEn: "Evening Primrose Oil", name: "月见草油", color: "from-amber-200 to-amber-300", type: "softgel",
    benefit: "调节内分泌，缓解经期不适", supplement: "γ-亚麻酸 500mg", usage: "每日1-2粒，经期前一周开始服用",
    desc: "富含γ-亚麻酸，帮助调节女性内分泌平衡，缓解经前综合症和经期不适。" },
  
  // 图2 - 肌肤、压力、脑力、男性、孕期、发质
  { id: 7, category: "肌肤", nameEn: "Grape Seed Extract", name: "葡萄籽提取物", color: "from-rose-400 to-rose-500", type: "capsule",
    benefit: "美白淡斑，延缓肌肤衰老", supplement: "原花青素OPC 95% 100mg", usage: "每日1粒，餐后服用",
    desc: "高纯度葡萄籽提取物，强效抗氧化，保护皮肤胶原蛋白，美白淡斑，延缓衰老。" },
  { id: 8, category: "压力", nameEn: "Ashwagandha", name: "南非醉茄", color: "from-amber-200 to-amber-300", type: "capsule",
    benefit: "缓解压力焦虑，改善睡眠", supplement: "南非醉茄提取物 300mg", usage: "每日1-2粒，睡前服用",
    desc: "印度传统草药，帮助身体适应压力，降低皮质醇水平，改善睡眠质量和精力。" },
  { id: 9, category: "脑力", nameEn: "Bacopa Monniera Extract", name: "假马齿苋提取物", color: "from-amber-500 to-amber-600", type: "capsule",
    benefit: "增强记忆力，提高专注力", supplement: "假马齿苋提取物 300mg", usage: "每日1粒，早餐后服用",
    desc: "传统阿育吠陀草药，经科学验证能够增强记忆力和认知功能，适合学生和上班族。" },
  { id: 10, category: "男性", nameEn: "Lycopene Extract", name: "番茄红素", color: "from-red-600 to-red-700", type: "softgel",
    benefit: "保护前列腺，抗氧化", supplement: "番茄红素 10mg", usage: "每日1粒，随餐服用",
    desc: "强效抗氧化剂，特别有助于男性前列腺健康，保护心血管系统。" },
  { id: 11, category: "孕期", nameEn: "Prenatal Multivitamin", name: "高活孕期多维", color: "from-rose-300 to-rose-400", type: "capsule",
    benefit: "全面补充孕期所需营养", supplement: "叶酸400mcg+多种维生素矿物质", usage: "每日1粒，早餐后服用",
    desc: "专为孕期女性设计，含活性叶酸、铁、钙等关键营养素，支持胎儿健康发育。" },
  { id: 12, category: "发质", nameEn: "Biotin", name: "生物素", color: "from-amber-100 to-amber-200", type: "capsule-white",
    benefit: "强健发质，防止脱发", supplement: "生物素 5000mcg", usage: "每日1粒，随餐服用",
    desc: "维生素H，促进头发、皮肤和指甲健康，改善发质，减少脱发。" },
  
  // 图3 - 明眸、睡眠、疲劳、水润、阳光、眼睛
  { id: 13, category: "明眸", nameEn: "Bilberry Extract", name: "越橘提取物", color: "from-pink-500 to-pink-600", type: "capsule",
    benefit: "保护视力，缓解眼疲劳", supplement: "越橘提取物 80mg", usage: "每日1粒，早餐后服用",
    desc: "富含花青素，保护视网膜，改善夜间视力，缓解长时间用眼导致的疲劳。" },
  { id: 14, category: "睡眠", nameEn: "GABA", name: "GABA", color: "from-gray-100 to-amber-50", type: "capsule-white",
    benefit: "改善睡眠质量，放松神经", supplement: "γ-氨基丁酸 250mg", usage: "每日1粒，睡前30分钟服用",
    desc: "天然氨基酸，帮助放松神经系统，改善入睡困难，提高睡眠质量。" },
  { id: 15, category: "疲劳", nameEn: "Vitamin B Complex", name: "维生素 B 族", color: "from-yellow-400 to-yellow-500", type: "round",
    benefit: "缓解疲劳，提升精力", supplement: "复合维生素B族", usage: "每日1粒，早餐后服用",
    desc: "全面的B族维生素配方，帮助能量代谢，缓解疲劳，支持神经系统健康。" },
  { id: 16, category: "水润", nameEn: "Hyaluronic Acid", name: "玻尿酸水光片", color: "from-gray-200 to-gray-300", type: "round",
    benefit: "深层补水，提亮肤色", supplement: "透明质酸钠 100mg", usage: "每日1粒，空腹服用效果更佳",
    desc: "口服玻尿酸，从内而外补充肌肤水分，改善皮肤干燥，提升肌肤光泽。" },
  { id: 17, category: "阳光", nameEn: "Vitamin D3", name: "维生素 D3", color: "from-amber-100 to-amber-200", type: "softgel-small",
    benefit: "促进钙吸收，增强免疫", supplement: "维生素D3 2000IU", usage: "每日1粒，随餐服用",
    desc: "阳光维生素，促进钙质吸收，维护骨骼健康，增强免疫系统功能。" },
  { id: 18, category: "眼睛", nameEn: "Lutein Pro", name: "叶黄素 Pro", color: "from-red-500 to-red-600", type: "softgel",
    benefit: "保护黄斑，抵御蓝光", supplement: "叶黄素20mg+玉米黄质4mg", usage: "每日1粒，随餐服用",
    desc: "高含量叶黄素配方，保护眼睛黄斑区，过滤有害蓝光，适合长期使用电子设备人群。" },
  
  // 图4 - 气血、骨骼、熬夜
  { id: 19, category: "气血", nameEn: "Iron", name: "铁", color: "from-gray-100 to-gray-200", type: "capsule-white",
    benefit: "补充铁元素，改善贫血", supplement: "富马酸亚铁 30mg", usage: "每日1粒，餐后服用，避免与茶同服",
    desc: "易吸收的铁剂形式，有效补充体内铁元素，改善缺铁性贫血，提升气色。" },
  { id: 20, category: "骨骼", nameEn: "Calcium Citrate Complex", name: "复合柠檬酸钙", color: "from-gray-100 to-gray-200", type: "capsule-long",
    benefit: "强健骨骼，预防骨质疏松", supplement: "柠檬酸钙 500mg+维生素D3", usage: "每日1-2粒，随餐服用",
    desc: "高吸收率的柠檬酸钙配方，添加维生素D3促进吸收，维护骨骼和牙齿健康。" },
  { id: 21, category: "熬夜", nameEn: "Milk Thistle Extract", name: "乳蓟提取物", color: "from-amber-400 to-amber-500", type: "capsule",
    benefit: "保护肝脏，修复肝细胞", supplement: "水飞蓟素 200mg", usage: "每日1粒，餐后服用",
    desc: "天然护肝草药，帮助修复受损肝细胞，保护肝脏免受毒素侵害，适合熬夜和应酬人群。" },
  
  // 图5 - 尿酸、抗糖、关节、运动、心脏、稳态
  { id: 22, category: "尿酸", nameEn: "Celery Seed Extract", name: "西芹籽精华", color: "from-amber-200 to-amber-300", type: "capsule",
    benefit: "降低尿酸，缓解痛风", supplement: "西芹籽提取物 300mg", usage: "每日1-2粒，餐后服用，多喝水",
    desc: "帮助促进尿酸排泄，缓解痛风症状，维护关节健康。" },
  { id: 23, category: "抗糖", nameEn: "Garcinia Cambogia", name: "藤黄果抗糖素", color: "from-amber-300 to-amber-400", type: "capsule",
    benefit: "控制血糖，减少糖化反应", supplement: "藤黄果提取物HCA 500mg", usage: "每日1粒，餐前30分钟服用",
    desc: "帮助控制糖分吸收，减少体内糖化反应，维护皮肤和身体健康。" },
  { id: 24, category: "关节", nameEn: "Glucosamine", name: "氨糖", color: "from-gray-200 to-gray-300", type: "capsule-long",
    benefit: "修复软骨，润滑关节", supplement: "氨基葡萄糖 1500mg", usage: "每日1-2粒，随餐服用",
    desc: "关节软骨的重要组成成分，帮助修复受损软骨，缓解关节疼痛和僵硬。" },
  { id: 25, category: "运动", nameEn: "L-Carnitine", name: "左旋肉碱", color: "from-amber-300 to-amber-400", type: "capsule",
    benefit: "促进脂肪燃烧，提升运动表现", supplement: "左旋肉碱 500mg", usage: "每日1粒，运动前30分钟服用",
    desc: "帮助将脂肪转化为能量，提升运动表现和耐力，适合健身减脂人群。" },
  { id: 26, category: "心脏", nameEn: "CoEnzyme Q10", name: "还原型辅酶 Q10", color: "from-red-800 to-red-900", type: "softgel",
    benefit: "保护心脏，抗氧化抗衰老", supplement: "还原型辅酶Q10 100mg", usage: "每日1粒，随餐服用",
    desc: "心脏健康必需营养素，强效抗氧化，保护心血管系统，延缓衰老。" },
  { id: 27, category: "稳态", nameEn: "Vitamin E", name: "维生素 E", color: "from-amber-300 to-amber-400", type: "softgel",
    benefit: "抗氧化，保护细胞膜", supplement: "天然维生素E 400IU", usage: "每日1粒，随餐服用",
    desc: "脂溶性抗氧化剂，保护细胞膜免受自由基损伤，维护皮肤健康。" },
]

// 药丸图标组件
function PillIcon({ color, type }: { color: string, type: string }) {
  switch (type) {
    case "capsule":
      return (
        <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
      )
    case "capsule-white":
      return (
        <div className="w-6 h-14 rounded-full bg-gradient-to-b from-gray-50 to-amber-100 shadow-sm border border-gray-200" />
      )
    case "capsule-long":
      return (
        <div className={`w-5 h-16 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
      )
    case "round":
      return (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
      )
    case "oval":
      return (
        <div className={`w-10 h-6 rounded-full bg-gradient-to-r ${color} shadow-sm`} />
      )
    case "softgel":
      return (
        <div className={`w-8 h-12 rounded-full bg-gradient-to-b ${color} shadow-sm`} style={{ borderRadius: "40%" }} />
      )
    case "softgel-small":
      return (
        <div className={`w-7 h-7 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
      )
    default:
      return (
        <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
      )
  }
}

export function MorningCheckin() {
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [fillProgress, setFillProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [selectedSupplement, setSelectedSupplement] = useState<typeof allSupplements[0] | null>(null)
  const [streakDays, setStreakDays] = useState(7)
  const [monthlyCheckins, setMonthlyCheckins] = useState(25)
  const [totalCheckins, setTotalCheckins] = useState(180)
  const [healthPoints, setHealthPoints] = useState(520)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const fillInterval = useRef<NodeJS.Timeout | null>(null)
  
  // 月份切换
  const prevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }
  
  const nextMonth = () => {
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    if (next <= new Date()) {
      setCalendarMonth(next)
    }
  }

  const triggerHaptic = (type: "light" | "medium" | "success") => {
    if ("vibrate" in navigator) {
      switch (type) {
        case "light": navigator.vibrate(10); break
        case "medium": navigator.vibrate(20); break
        case "success": navigator.vibrate([30, 50, 30, 50, 50]); break
      }
    }
  }

  const handleLongPressStart = () => {
    if (checkedIn) return
    setIsLongPressing(true)
    setFillProgress(0)
    triggerHaptic("medium")

    let progress = 0
    fillInterval.current = setInterval(() => {
      progress += 3.33
      setFillProgress(Math.min(progress, 100))
      if (progress >= 100) clearInterval(fillInterval.current!)
    }, 100)

    longPressTimer.current = setTimeout(() => {
      if (fillInterval.current) clearInterval(fillInterval.current)
      setIsLongPressing(false)
      setFillProgress(100)
      triggerHaptic("success")
      setCheckedIn(true)
      setShowSuccess(true)
      // 延迟更新数值，让动画更流畅
      setTimeout(() => {
        setStreakDays(prev => prev + 1)
        setMonthlyCheckins(prev => prev + 1)
        setTotalCheckins(prev => prev + 1)
        setHealthPoints(prev => prev + 10)
      }, 300)
      setTimeout(() => {
        setShowSuccess(false)
        setFillProgress(0)
      }, 3000)
    }, 3000)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    if (fillInterval.current) clearInterval(fillInterval.current)
    if (fillProgress < 100) {
      setIsLongPressing(false)
      setFillProgress(0)
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
      if (fillInterval.current) clearInterval(fillInterval.current)
    }
  }, [])

  // 日历计算
  const today = new Date()
  const displayYear = calendarMonth.getFullYear()
  const displayMonth = calendarMonth.getMonth()
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay()
  const isCurrentMonth = displayYear === today.getFullYear() && displayMonth === today.getMonth()
  
  // 模拟历史打卡数据
  const checkedDaysData: Record<string, number[]> = {
    [`${today.getFullYear()}-${today.getMonth()}`]: [1, 2, 3, 5, 6, 7, 8, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24, 25],
    [`${today.getFullYear()}-${today.getMonth() - 1}`]: [1, 2, 4, 5, 6, 9, 10, 11, 12, 15, 16, 17, 18, 22, 23, 24, 25, 26, 29, 30],
  }
  const checkedDays = checkedDaysData[`${displayYear}-${displayMonth}`] || []

  // 补剂详情页
  if (selectedSupplement) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center px-4 py-3 bg-white border-b border-border">
          <button onClick={() => setSelectedSupplement(null)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="flex-1 text-center font-medium text-foreground">营养详情</span>
          <div className="w-7" />
        </div>

        {/* 补剂展示区 */}
        <div className="bg-white px-6 py-8">
          <div className="flex flex-col items-center">
            {/* 药丸图标 - 放大展示 */}
            <div className="w-32 h-32 bg-[#F8F8F8] rounded-2xl flex items-center justify-center mb-6">
              <div className="transform scale-150">
                <PillIcon color={selectedSupplement.color} type={selectedSupplement.type} />
              </div>
            </div>
            
            {/* 分类标签 */}
            <span className="text-2xl font-light text-muted-foreground mb-2">{selectedSupplement.category}</span>
            
            {/* 英文名 */}
            <p className="text-xs text-muted-foreground mb-1">{selectedSupplement.nameEn}</p>
            
            {/* 中文名 */}
            <h1 className="text-xl font-bold text-foreground">{selectedSupplement.name}</h1>
          </div>
        </div>

        {/* 功效卡片 */}
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            主要功效
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{selectedSupplement.benefit}</p>
        </div>

        {/* 营养成分 */}
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            营养成分
          </h3>
          <div className="bg-[#F8F8F8] rounded-xl p-4">
            <p className="text-sm text-foreground">{selectedSupplement.supplement}</p>
          </div>
        </div>

        {/* 服用方法 */}
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            服用方法
          </h3>
          <div className="bg-[#E8FFE8] rounded-xl p-4">
            <p className="text-sm text-foreground">{selectedSupplement.usage}</p>
          </div>
        </div>

        {/* 详细说明 */}
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            详细说明
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{selectedSupplement.desc}</p>
        </div>

        {/* 温馨提示 */}
        <div className="bg-white mt-2 px-4 py-4 mb-6">
          <div className="bg-[#FFF8E6] rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">温馨提示</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                本品为膳食补充剂，不能替代药物。如有疾病请遵医嘱。孕妇、哺乳期妇女及儿童服用前请咨询医生。
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto relative">
{/* 顶部状态栏 */}
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-border">
        <span className="text-base font-medium text-foreground">Morning</span>
      </div>

      {/* 打卡成功弹窗 - 动态效果 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* 背景粒子效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary/30 animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
          
          {/* 主弹窗 */}
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500">
            <div className="relative">
              {/* 光环效果 */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 animate-pulse" />
              
              {/* 主卡片 */}
              <div className="relative bg-white text-foreground px-12 py-8 rounded-3xl shadow-xl border border-primary/20">
                <div className="flex flex-col items-center gap-3">
                  {/* 成功图标 - 带动画 */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#66CDAA] flex items-center justify-center mb-2 animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-in zoom-in-0 duration-300" />
                    </svg>
                  </div>
                  
                  {/* 文字 */}
                  <p className="text-2xl font-bold text-foreground">打卡成功!</p>
                  
                  {/* 健康值增加 - 带闪烁 */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#E8FFE8] rounded-full">
                    <Flame className="w-5 h-5 text-primary fill-primary animate-pulse" />
                    <span className="text-primary font-bold text-lg">+10 健康值</span>
                  </div>
                  
                  {/* 连续天数 */}
                  <p className="text-sm text-muted-foreground mt-1">
                    已连续打卡 <span className="text-primary font-bold">{streakDays + 1}</span> 天
                  </p>
                </div>
                
                {/* 装饰星星 */}
                <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: "3s" }}>✨</div>
                <div className="absolute -bottom-1 -left-1 text-xl animate-bounce" style={{ animationDelay: "0.2s" }}>🎉</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 打卡主区域 */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">每日打卡</h2>
            <p className="text-sm text-muted-foreground">养成坚持服用好习惯</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Flame className={`w-5 h-5 transition-all duration-300 ${checkedIn ? "fill-primary" : ""}`} />
            <span className="font-bold text-lg"><AnimatedNumber value={streakDays} /></span>
            <span className="text-sm">天</span>
          </div>
        </div>

        {/* 打卡按钮 */}
        <div className="flex justify-center mb-6">
          <button
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            disabled={checkedIn}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden transition-transform ${
              isLongPressing ? "scale-95" : checkedIn ? "" : "hover:scale-105 active:scale-95"
            }`}
            style={{
              background: checkedIn 
                ? "linear-gradient(145deg, #E8FFE8 0%, #90EE90 50%, #66CDAA 100%)"
                : "linear-gradient(145deg, #E8FFE8 0%, #90EE90 50%, #66CDAA 100%)",
              boxShadow: isLongPressing
                ? "0 4px 15px rgba(144, 238, 144, 0.5)"
                : "0 8px 30px rgba(144, 238, 144, 0.4)",
            }}
          >
            {fillProgress > 0 && !checkedIn && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-100"
                style={{ height: `${fillProgress}%` }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              {checkedIn ? (
                <>
                  <svg className="w-10 h-10 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white font-bold">已打卡</span>
                </>
              ) : (
                <>
                  <Calendar className="w-8 h-8 text-white mb-1" />
                  <span className="text-white font-bold text-lg">打卡</span>
                  <span className="text-white/80 text-xs">长按3秒</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#FFF8E6] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground"><AnimatedNumber value={monthlyCheckins} /></p>
            <p className="text-xs text-muted-foreground">本月打卡</p>
          </div>
          <div className="bg-[#E8FFE8] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalCheckins} /></p>
            <p className="text-xs text-muted-foreground">累计打卡</p>
          </div>
          <div className="bg-[#FFF0F0] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground"><AnimatedNumber value={healthPoints} /></p>
            <p className="text-xs text-muted-foreground">健康值</p>
          </div>
        </div>
      </div>

      {/* 月度日历 - 支持切换月份 */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-[#F5F5F5] active:scale-95 transition-all">
            <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
          </button>
          <h3 className="font-medium text-foreground">
            {displayYear}年{displayMonth + 1}月
            {isCurrentMonth && <span className="text-xs text-primary ml-2">本月</span>}
          </h3>
          <button 
            onClick={nextMonth} 
            disabled={isCurrentMonth}
            className={`p-1.5 rounded-full transition-all ${isCurrentMonth ? "opacity-30" : "hover:bg-[#F5F5F5] active:scale-95"}`}
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* 打卡统计 */}
        <div className="flex items-center justify-center gap-4 mb-4 py-2 bg-[#F8F8F8] rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{checkedDays.length}</p>
            <p className="text-[10px] text-muted-foreground">已打卡</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{daysInMonth - checkedDays.length}</p>
            <p className="text-[10px] text-muted-foreground">未打卡</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{Math.round(checkedDays.length / daysInMonth * 100)}%</p>
            <p className="text-[10px] text-muted-foreground">完成率</p>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="text-xs text-muted-foreground py-2 font-medium">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="py-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = isCurrentMonth && day === today.getDate()
            const isChecked = checkedDays.includes(day) || (isToday && checkedIn)
            const isFuture = isCurrentMonth && day > today.getDate()
            return (
              <div
                key={day}
                className={`py-2 text-sm rounded-full transition-all ${
                  isFuture
                    ? "text-muted-foreground/40"
                    : isToday
                    ? isChecked
                      ? "bg-primary text-white font-bold shadow-sm"
                      : "bg-primary/20 text-primary font-bold ring-2 ring-primary/30"
                    : isChecked
                    ? "bg-[#E8FFE8] text-primary font-medium"
                    : "text-foreground hover:bg-[#F5F5F5]"
                }`}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {/* 营养方案 */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">我的营养方案</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">共{allSupplements.length}款</span>
          </div>
        </div>
        
        {/* 三个分类介绍卡片 - 暂时隐藏 */}
        {/* <div className="space-y-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-border hover:bg-[#FFF8E6] transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FFD166]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">基础营养补剂</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  涵盖每日必需营养素，适配日常饮食缺口，包括Daily益生菌、膳食纤维、维生素C、维生素B族、维生素D3、维生素E、生物素等，尤其适合饮食不均衡、作息不规律人群
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border hover:bg-[#FFF8E6] transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FFD166]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">针对性调理补剂</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  聚焦细分健康需求，含抗炎抗氧化（C3姜黄素、葡萄籽提取物、番茄红素、叶黄素Pro）、情绪睡眠（GABA、南非醉茄）、美容养护（越橘提取物、玻尿酸水光片）、孕期专属（高活孕期多维）等品类
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border hover:bg-[#FFF8E6] transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FFD166]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">机能养护补剂</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  覆盖骨骼关节、代谢肝胆、循环养护等场景，含复合柠檬酸钙、氨糖、铁、乳蓟提取物、西芹籽精华、藤黄果抗糖素、左旋肉碱、还原型辅酶Q10等，标注服用时间与搭配建议
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* 基础营养类 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              <h4 className="font-medium text-foreground">基础营养类</h4>
            </div>
            <span className="text-[10px] text-muted-foreground">点击查看详情</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {allSupplements.filter(item => 
              ["平衡", "肠道", "免疫", "疲劳", "阳光", "稳态"].includes(item.category)
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSupplement(item)}
                className="bg-[#F8F8F8] rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl font-light text-foreground">{item.category}</span>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <PillIcon color={item.color} type={item.type} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-0.5">{item.nameEn}</p>
                <p className="text-sm font-bold text-foreground mb-2">{item.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{item.benefit}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 针对调理类 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-[#FFD166] rounded-full" />
            <h4 className="font-medium text-foreground">针对调理类</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {allSupplements.filter(item => 
              ["抗氧", "肌肤", "压力", "脑力", "明眸", "睡眠", "水润", "眼睛", "男性", "孕期", "发质", "经期"].includes(item.category)
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSupplement(item)}
                className="bg-[#F8F8F8] rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl font-light text-foreground">{item.category}</span>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <PillIcon color={item.color} type={item.type} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-0.5">{item.nameEn}</p>
                <p className="text-sm font-bold text-foreground mb-2">{item.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{item.benefit}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 机能养护类 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-[#90EE90] rounded-full" />
            <h4 className="font-medium text-foreground">机能养护类</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {allSupplements.filter(item => 
              ["心脑", "气血", "骨骼", "熬夜", "尿酸", "抗糖", "关节", "运动", "心脏"].includes(item.category)
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSupplement(item)}
                className="bg-[#F8F8F8] rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl font-light text-foreground">{item.category}</span>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <PillIcon color={item.color} type={item.type} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-0.5">{item.nameEn}</p>
                <p className="text-sm font-bold text-foreground mb-2">{item.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{item.benefit}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="p-3 bg-[#FFF8E6] rounded-xl flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FFD166]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs">💡</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            会员可解锁全品类适配分析与用量优化建议。点击卡片查看详情，了解每款营养素的功效和服用方法。
          </p>
        </div>
      </div>

      {/* 右侧悬浮按钮 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-border">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">咨询</span>
        </div>
      </div>

      <div className="pb-20" />
      <SharedNav />
    </div>
  )
}
