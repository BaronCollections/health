"use client"
import { useState, useRef } from "react"
import React from "react"

import { ChevronRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { SharedNav } from "./shared-nav"

import { useLocale } from "@/i18n/use-locale"

// 模拟用户报告数据 - 完整内容
const reportData = {
  name: "baron",
  bmi: 48.5,
  bmiDesc: "你的身体质量指数BMI=48.5 kg/m²，属于肥胖，增加了许多慢性病风险，如心脏病和糖尿病。且降低生活质量。均衡饮食 + 合理运动是控制体重的唯一健康有效的方式。",
  totalScore: 49,
  scoreDesc: "*报告结果基于FFQ营养测评和4大维度专业健康评估",
  scores: {
    diet: 57,
    physical: 60,
    mental: 73,
    exercise: 10,
  },
  improvementGoals: ["免疫力", "胃肠道功能", "情绪/压力"],
  primaryGoal: "情绪/压力",
  dailyGoal: {
    title: "换个大水杯喝水吧",
    icon: "💧",
    desc: "多喝水可以降低患肾结石的风险。不爱喝水的你，可以为自己添置一个大容量水杯或者喜欢的杯子，无形之中督促自己多喝水。",
  },
  specialReminders: [
    "痛风或尿酸高人群请避免食用嘌呤较高的海鱼（凤尾鱼、沙丁鱼、金枪鱼及贝类），其他高嘌呤的食物如动物内脏、红肉类和肉汤类，以及酒精，以防加重痛风。",
    "备孕期女性应从准备怀孕前3个月开始每天补充400 ug/mcg 叶酸（我们的孕期维生素中已包含），并持续整个孕期。",
    "备孕期女性建议通过平衡膳食和适量运动来调理体质。使体质数（BMI）达到18.5~23.9kg/m²。每餐刚注意营养师量要适当补充叶酸或者单以二手产品，避免摄入酒精浓度过高的食物。",
    "部分非脂肪抗炎药，例如阿司匹林，可能会增加维生素C的流失，应注意额外补充维生素C。",
  ],
  dietAdvice: [
    { num: "01", title: "增加谷物摄入有助补铁", content: "素食者很易缺铁，建议在饮食中多摄入富含铁的食物，例如谷物类、深色蔬菜、豆类、坚果类。并在每天下午这个体位较好吸收，促进维生素铁吸收。" },
    { num: "02", title: "排卵期应减少摄入豆制品", content: "排卵期过量摄入大豆及豆制品可能影响卵泡破裂最后过程，从而影响受孕几率，应适当控制。" },
    { num: "03", title: "维C缺乏可以通过饮食或补剂补充", content: "建议在饮食中增加维生素C含量高的食物，比如新鲜的蔬果水果，例如橘子、柠檬、土豆、绿叶蔬菜。或者通过摄外补充维生素C片。" },
    { num: "04", title: "一天不要超过三杯美式咖啡", content: "健康成年人每天摄入的咖啡因应控制在400mg以内，约1杯355ml小份浓咖式咖啡。所含咖啡因约150mg。所以一天最好不要超过3小杯。" },
    { num: "05", title: "戒烟可降低多种疾病的风险", content: "全球前6位致死疾病，有4种与吸烟相关，如肺癌、胃癌、呼吸疾病等，戒烟越早，效果越好。为自己和他人的健康戒烟吧。" },
    { num: "06", title: "每周至少食用3次海鱼", content: "多食用富含Omega-3的海鱼（如三文鱼、沙丁鱼），因其不饱和脂肪酸含量丰于淡水鱼，有助于血脂健康及预防心血管疾病。" },
    { num: "07", title: "果汁不如吃新鲜水果", content: "新鲜水果的膳食纤维含量高于果汁，而且果汁中会有更多的游离糖，容易导致糖分摄入过量。所以最好直接食用新鲜水果。" },
  ],
  exerciseAdvice: [
    { num: "01", title: "每周运动时长应不少于150分钟", content: "久坐不动增加胃肠道、心脑血管疾病、脑卒和肥胖病风险。中国居民膳食指南建议每周运动至少150分钟。" },
  ],
  bottomNote: "由于个人的身体状况、生活习惯和营养目标可能会发生变化，建议每3个月重新进行一次评估问卷。",
}

// 改善目标对应的营养药片数据
const nutritionCards = {
  "免疫力": [
    { id: 1, category: "免疫", name: "维生素C", nameEn: "Vitamin C", benefit: "增强免疫细胞活性，提升身体抵抗力", color: "from-[#FFB347] to-[#FFCC80]", type: "round" },
    { id: 2, category: "免疫", name: "锌元素", nameEn: "Zinc", benefit: "促进免疫系统发育，加速伤口愈合", color: "from-[#87CEEB] to-[#B0E0E6]", type: "capsule" },
    { id: 3, category: "阳光", name: "维生素D3", nameEn: "Vitamin D3", benefit: "调节免疫反应，促进钙吸收", color: "from-[#FFD700] to-[#FFF8DC]", type: "softgel" },
  ],
  "胃肠道功能": [
    { id: 4, category: "肠道", name: "益生菌", nameEn: "Probiotics", benefit: "调节肠道菌群平衡，改善消化功能", color: "from-[#90EE90] to-[#98FB98]", type: "capsule" },
    { id: 5, category: "肠道", name: "膳食纤维", nameEn: "Dietary Fiber", benefit: "促进肠道蠕动，预防便秘", color: "from-[#DEB887] to-[#F5DEB3]", type: "oval" },
    { id: 6, category: "肠道", name: "谷氨酰胺", nameEn: "L-Glutamine", benefit: "修复肠道黏膜，保护肠道屏障", color: "from-[#98D8C8] to-[#B8E6D4]", type: "capsule-long" },
  ],
  "情绪/压力": [
    { id: 7, category: "压力", name: "镁元素", nameEn: "Magnesium", benefit: "缓解焦虑紧张，改善睡眠质量", color: "from-[#DDA0DD] to-[#E6E6FA]", type: "round" },
    { id: 8, category: "脑力", name: "B族维生素", nameEn: "Vitamin B Complex", benefit: "支持神经系统，缓解疲劳", color: "from-[#FFE4B5] to-[#FFEFD5]", type: "capsule" },
    { id: 9, category: "稳态", name: "Omega-3", nameEn: "Fish Oil", benefit: "改善情绪稳定，支持大脑健康", color: "from-[#87CEFA] to-[#B0E2FF]", type: "softgel" },
  ],
}

// 药片图标组件
function PillIcon({ color, type }: { color: string; type: string }) {
  switch (type) {
    case "capsule":
      return <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "capsule-long":
      return <div className={`w-5 h-16 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "round":
      return <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
    case "oval":
      return <div className={`w-10 h-6 rounded-full bg-gradient-to-r ${color} shadow-sm`} />
    case "softgel":
      return <div className={`w-8 h-12 rounded-full bg-gradient-to-b ${color} shadow-sm`} style={{ borderRadius: "40%" }} />
    default:
      return <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm`} />
  }
}

export function MorningReport() {
  const router = useRouter()
  const { t } = useLocale()
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<string>(reportData.improvementGoals[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const nutritionSectionRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // 点击改善目标跳转到营养方案
  const scrollToNutritionPlan = (goal: string) => {
    setSelectedGoal(goal)
    nutritionSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 雷达图SVG路径计算
  const radarSize = 180
  const center = radarSize / 2
  const maxRadius = 70

  const getPoint = (angle: number, value: number) => {
    const radius = (value / 100) * maxRadius
    const radian = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    }
  }

  const scores = [
    { label: "饮食", value: reportData.scores.diet, angle: 0 },
    { label: "体质", value: reportData.scores.physical, angle: 90 },
    { label: "心理", value: reportData.scores.mental, angle: 180 },
    { label: "运动", value: reportData.scores.exercise, angle: 270 },
  ]

  const radarPoints = scores.map(s => getPoint(s.angle, s.value))
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  const totalPages = 5

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
      }
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToPage = (index: number) => {
    setCurrentPage(index)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    touchEndX.current = e.clientX
    
    const handleMouseMove = (e: MouseEvent) => {
      touchEndX.current = e.clientX
    }
    
    const handleMouseUp = () => {
      const diff = touchStartX.current - touchEndX.current
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage < totalPages - 1) {
          setCurrentPage(prev => prev + 1)
        } else if (diff < 0 && currentPage > 0) {
          setCurrentPage(prev => prev - 1)
        }
      }
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      {/* 顶部导航 */}
      <div className="flex items-center justify-center px-4 py-3 bg-white border-b border-border">
        <span className="text-base font-medium text-foreground">{t("brand.name")}</span>
      </div>

      {/* 整体可滚动区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 画报卡片滑动区域 */}
        <div 
          ref={containerRef}
          className="min-h-[calc(100vh-140px)] relative overflow-hidden select-none cursor-grab active:cursor-grabbing bg-white"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            className="absolute inset-0 flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {/* 页面1: 封面 - 用户信息、BMI、评分、改善目标 */}
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                {/* 头部标题 */}
                <div className="mb-4">
                  <h1 className="text-lg font-bold text-foreground">
                    {reportData.name}
                    {t("report.cover.ownerSuffix")}
                  </h1>
                  <h2 className="text-lg font-bold text-foreground">{t("report.cover.posterTitle")}</h2>
                </div>

                {/* BMI 指数 */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">{t("report.cover.bmiLabel")}</span>
                    <span className="text-3xl font-bold text-foreground ml-auto">{reportData.bmi}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{reportData.bmiDesc}</p>
                </div>

                {/* 综合得分雷达图 */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-4">{t("report.cover.scoreLabel")}<span className="text-2xl font-bold text-foreground ml-2">{reportData.totalScore}</span><span className="text-sm text-muted-foreground">/100</span></p>
                  <p className="text-[10px] text-muted-foreground mb-4">{reportData.scoreDesc}</p>
                  
                  {/* 雷达图 */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <svg width={radarSize} height={radarSize}>
                        {[20, 40, 60, 80, 100].map((level, i) => {
                          const r = (level / 100) * maxRadius
                          return (
                            <circle key={i} cx={center} cy={center} r={r} fill="none" stroke="#F0F0F0" strokeWidth="1" />
                          )
                        })}
                        {scores.map((s, i) => {
                          const p = getPoint(s.angle, 100)
                          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#F0F0F0" strokeWidth="1" />
                        })}
                        <path d={radarPath} fill="rgba(58, 181, 137, 0.15)" stroke="#3AB589" strokeWidth="2" />
                        {radarPoints.map((p, i) => (
                          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3AB589" />
                        ))}
                        {/* 中心分数 */}
                        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#333">
                          {reportData.totalScore}
                        </text>
                      </svg>
                      {/* 四维标签 */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        饮食 {reportData.scores.diet}
                      </div>
                      <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs text-muted-foreground">
                        体质 {reportData.scores.physical}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        心理 {reportData.scores.mental}
                      </div>
                      <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs text-muted-foreground">
                        运动 {reportData.scores.exercise}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 本次改善目标 - 可点击跳转 */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{t("report.cover.goalsLabel")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {reportData.improvementGoals.map((goal, i) => (
                      <button 
                        key={i}
                        onClick={() => scrollToNutritionPlan(goal)}
                        className="px-4 py-2 bg-[#E8F5E8] rounded-full text-sm text-primary font-medium hover:bg-primary hover:text-white active:scale-95 transition-all"
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 首要目标 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">{t("report.cover.primaryGoalLabel")}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E8] rounded-full text-sm text-primary font-medium">
                    <span className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                    {reportData.primaryGoal}
                  </span>
                </div>

                {/* 滑动提示 */}
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">{t("report.cover.swipeHint")}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto mt-1" />
                </div>
              </div>
            </div>

            {/* 页面2: 每日小目标 + 特殊提醒 */}
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                {/* 每日小目标 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-foreground mb-4">{t("report.dailyGoal.title")}</h3>
                  <div className="flex gap-4">
                    <div className="text-4xl">{reportData.dailyGoal.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-2">{reportData.dailyGoal.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{reportData.dailyGoal.desc}</p>
                    </div>
                  </div>
                </div>

                {/* 特殊提醒 */}
                <div>
                  <h3 className="text-base font-bold text-foreground mb-4">{t("report.specialReminders.title")}</h3>
                  <div className="space-y-4">
                    {reportData.specialReminders.map((reminder, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{reminder}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 页面3: 饮食建议 */}
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <h3 className="text-base font-bold text-foreground mb-4">饮食建议</h3>
                <div className="space-y-5">
                  {reportData.dietAdvice.map((advice, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        <span className="text-primary mr-2">{advice.num}</span>
                        {advice.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{advice.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 页面4: 运动&作息 */}
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4">
                <h3 className="text-base font-bold text-foreground mb-4">运动&作息</h3>
                <div className="space-y-5">
                  {reportData.exerciseAdvice.map((advice, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        <span className="text-primary mr-2">{advice.num}</span>
                        {advice.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{advice.content}</p>
                    </div>
                  ))}
                </div>

                {/* 运动建议图示 */}
                <div className="mt-8">
                  <p className="text-xs text-muted-foreground mb-4">*以上是根据你的营养目标以及饮食、运动、作息情况的综合分析结果，可以帮助你的饮食更加均衡好习惯的养成哦!</p>
                </div>
              </div>
            </div>

            {/* 页面5: 底部提示和行动按钮 */}
            <div className="w-full flex-shrink-0 h-full overflow-y-auto">
              <div className="min-h-full bg-white px-4 py-4 flex flex-col">
                {/* 提示信息 */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-[280px]">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF8F0] flex items-center justify-center">
                      <span className="text-2xl">💡</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reportData.bottomNote}</p>
                  </div>
                </div>

                {/* 底部行动按钮 */}
                <div className="space-y-3 pt-8">
                  <button 
                    onClick={() => router.push("/community")}
                    className="w-full py-3.5 border border-border rounded-full text-foreground font-medium bg-white"
                  >
                    邀请好友测试
                  </button>
                  <button 
                    onClick={() => router.push("/checkin")}
                    className="w-full py-3.5 bg-primary rounded-full text-white font-medium"
                  >
                    查看营养方案
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 页面指示器 */}
        <div className="flex justify-center items-center gap-2 py-3 bg-white">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`rounded-full transition-all duration-300 ${
                currentPage === i 
                  ? "w-6 h-2 bg-primary" 
                  : "w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* 下方营养方案模块 */}
        <div ref={nutritionSectionRef} className="bg-[#F8F8F8] px-4 pt-4 pb-24">
          <h3 className="text-lg font-bold text-foreground mb-2">改善目标营养方案</h3>
          <p className="text-xs text-muted-foreground mb-4">根据你的改善目标，推荐以下营养补充方案</p>
          
          {/* 目标切换标签 */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {reportData.improvementGoals.map((goal, i) => (
              <button
                key={i}
                onClick={() => setSelectedGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedGoal === goal
                    ? "bg-primary text-white"
                    : "bg-white text-foreground hover:bg-[#E8F5E8]"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>

          {/* 营养药片卡片 */}
          <div className="grid grid-cols-2 gap-3">
            {nutritionCards[selectedGoal as keyof typeof nutritionCards]?.map((card) => (
              <button
                key={card.id}
                className="bg-white rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl font-light text-foreground">{card.category}</span>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <PillIcon color={card.color} type={card.type} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-0.5">{card.nameEn}</p>
                <p className="text-sm font-bold text-foreground mb-2">{card.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{card.benefit}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <SharedNav />
    </div>
  )
}
