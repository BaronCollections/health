"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

// 完整题库数据 (来自 question_bank.json)
const questionBank = {
  meta: {
    name: "FFQ Question Bank",
    version: "1.0.0",
  },
  scoring: {
    dimensionWeightsDefault: {
      lifestyle: 0.3,
      diet: 0.35,
      health: 0.25,
      goal: 0.1,
    },
    multiSelectScoringRule: { mode: "min" },
  },
  questions: [
    {
      id: "B01",
      dimension: "basic",
      type: "single_choice",
      title: "你的性别是？",
      options: [
        { label: "男", value: "male", score: null, tags: ["male"] },
        { label: "女", value: "female", score: null, tags: ["female"] },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "B02",
      dimension: "basic",
      type: "single_choice",
      title: "你的年龄是？",
      options: [
        { label: "3岁以下", value: "age_0_3", score: null, tags: ["child"] },
        { label: "4-12岁", value: "age_4_12", score: null, tags: ["child"] },
        { label: "13-17岁", value: "age_13_17", score: null, tags: ["teen"] },
        { label: "18-35岁", value: "age_18_35", score: null, tags: ["adult"] },
        { label: "36-59岁", value: "age_36_59", score: null, tags: ["adult"] },
        { label: "60-70岁", value: "age_60_70", score: null, tags: ["senior"] },
        { label: "70岁以上", value: "age_70_plus", score: null, tags: ["senior"] },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "B03",
      dimension: "basic",
      type: "group_input",
      title: "你的身高（cm）和体重（kg）是？",
      fields: [
        { key: "heightCm", label: "身高(cm)", inputType: "number", min: 100, max: 250, required: true },
        { key: "weightKg", label: "体重(kg)", inputType: "number", min: 20, max: 200, required: true },
      ],
      required: true,
      showIf: [],
    },
    {
      id: "B04",
      dimension: "basic",
      type: "single_choice",
      title: "你所在的地域是？",
      options: [
        { label: "北方（京津冀/东北/西北）", value: "north", score: null },
        { label: "南方（江浙沪/华南/西南）", value: "south", score: null },
        { label: "中部（豫鄂湘皖）", value: "central", score: null },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "B05",
      dimension: "basic",
      type: "single_choice",
      title: "你目前的生理阶段是？",
      options: [
        { label: "普通阶段", value: "female_general", score: null, tags: ["female_general"] },
        { label: "备孕中", value: "female_preconception", score: null, tags: ["female_preconception"] },
        { label: "孕期", value: "female_pregnant", score: null, tags: ["female_pregnant"] },
        { label: "哺乳期", value: "female_lactation", score: null, tags: ["female_lactation"] },
        { label: "更年期", value: "female_menopause", score: null, tags: ["female_menopause"] },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["female"] }],
    },
    // 生活习惯维度
    {
      id: "L01",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你平均每天的睡眠时长是？",
      options: [
        { label: "小于6小时", value: "lt6", score: 1 },
        { label: "6-7小时", value: "6_7", score: 3 },
        { label: "7-8小时", value: "7_8", score: 5 },
        { label: "大于8小时", value: "gt8", score: 4 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "L02",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你入睡及夜间睡眠情况是？",
      options: [
        { label: "难入睡+频繁夜醒", value: "bad_both", score: 1 },
        { label: "难入睡/频繁夜醒", value: "bad_one", score: 2 },
        { label: "入睡顺利，偶夜醒", value: "ok_some", score: 4 },
        { label: "入睡顺利，一觉到天亮", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "L03",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你吸烟/饮酒习惯是？",
      options: [
        { label: "经常吸烟+饮酒", value: "often_both", score: 1 },
        { label: "吸烟/饮酒其一", value: "often_one", score: 2 },
        { label: "偶尔吸烟/饮酒", value: "sometimes", score: 3 },
        { label: "从不", value: "never", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ noneTags: ["child", "teen"] }],
    },
    {
      id: "L04",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你每周运动频率及强度是？",
      options: [
        { label: "几乎不运动", value: "none", score: 1 },
        { label: "1-2次，轻度（散步）", value: "light_1_2", score: 2 },
        { label: "3-4次，中度（慢跑/瑜伽）", value: "mid_3_4", score: 4 },
        { label: "5次以上，中高强度（健身/球类）", value: "high_5plus", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "L05",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你每天久坐（含电子设备）时长是？",
      options: [
        { label: "大于8小时", value: "gt8", score: 1 },
        { label: "6-8小时", value: "6_8", score: 2 },
        { label: "4-6小时", value: "4_6", score: 3 },
        { label: "小于4小时", value: "lt4", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "L06",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你近期记忆力及骨骼状况是？",
      options: [
        { label: "记忆力明显衰退+频繁骨痛", value: "bad_both", score: 1 },
        { label: "记忆力减退/骨痛其一", value: "bad_one", score: 2 },
        { label: "记忆力正常，偶骨痛", value: "ok_some", score: 4 },
        { label: "记忆力正常，无骨痛", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["senior"] }],
    },
    {
      id: "L07",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你近期是否有跌倒风险？",
      options: [
        { label: "近3个月跌倒过", value: "fell", score: 1 },
        { label: "走路不稳，易绊倒", value: "unstable", score: 2 },
        { label: "走路平稳，偶尔大意", value: "ok", score: 4 },
        { label: "走路稳健，无风险", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["senior"] }],
    },
    {
      id: "L08",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你的经期及经前不适情况是？",
      options: [
        { label: "经期紊乱+严重经前不适", value: "bad_both", score: 1 },
        { label: "经期紊乱/严重经前不适其一", value: "bad_one", score: 2 },
        { label: "经期规律，轻微经前不适", value: "ok_some", score: 4 },
        { label: "经期规律，无不适", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["female"] }, { anyTags: ["female_general", "female_menopause"] }],
    },
    {
      id: "L09",
      dimension: "lifestyle",
      type: "single_choice",
      title: "你每天户外活动及零食摄入情况是？",
      options: [
        { label: "小于1小时户外活动+频繁吃零食", value: "bad_both", score: 1 },
        { label: "小于1小时户外活动/频繁吃零食其一", value: "bad_one", score: 2 },
        { label: "1-2小时户外活动，偶尔吃零食", value: "ok", score: 4 },
        { label: "大于2小时户外活动，少吃/不吃零食", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ anyTags: ["child", "teen"] }],
    },
    // 饮食习惯维度
    {
      id: "E01",
      dimension: "diet",
      type: "single_choice",
      title: "你每天主食（米饭/面条/杂粮）摄入量是？",
      options: [
        { label: "小于1碗", value: "lt1", score: 1 },
        { label: "1-2碗", value: "1_2", score: 3 },
        { label: "2-3碗", value: "2_3", score: 4 },
        { label: "大于3碗", value: "gt3", score: 2 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E02",
      dimension: "diet",
      type: "single_choice",
      title: "你每天蔬菜摄入量及种类是？",
      options: [
        { label: "几乎不吃", value: "none", score: 1 },
        { label: "1种，少量", value: "low_1", score: 2 },
        { label: "2-3种，适量", value: "mid_2_3", score: 4 },
        { label: "3种以上，充足", value: "high_3plus", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E03",
      dimension: "diet",
      type: "single_choice",
      title: "你每天水果摄入量及种类是？",
      options: [
        { label: "几乎不吃", value: "none", score: 1 },
        { label: "1种，少量", value: "low_1", score: 2 },
        { label: "2种，适量", value: "mid_2", score: 4 },
        { label: "2种以上，充足", value: "high_2plus", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E04",
      dimension: "diet",
      type: "single_choice",
      title: "你每周肉蛋（瘦肉/鸡蛋/鱼虾）摄入量是？",
      options: [
        { label: "小于2次", value: "lt2", score: 1 },
        { label: "2-4次", value: "2_4", score: 3 },
        { label: "5-6次", value: "5_6", score: 4 },
        { label: "每天1次及以上", value: "daily", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E05",
      dimension: "diet",
      type: "single_choice",
      title: "你每天奶制品（牛奶/酸奶/奶酪）摄入量是？",
      options: [
        { label: "几乎不喝", value: "none", score: 1 },
        { label: "小于200ml", value: "lt200", score: 2 },
        { label: "200-300ml", value: "200_300", score: 5 },
        { label: "大于300ml", value: "gt300", score: 4 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E06",
      dimension: "diet",
      type: "single_choice",
      title: "你家孩子辅食/正餐挑食、偏食情况是？",
      options: [
        { label: "严重挑食，仅吃少数几种", value: "severe", score: 1 },
        { label: "轻微挑食，部分食物不吃", value: "mild", score: 2 },
        { label: "基本不挑食，偶尔抗拒", value: "ok", score: 4 },
        { label: "不挑食，饮食均衡", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["child"] }],
    },
    {
      id: "E07",
      dimension: "diet",
      type: "single_choice",
      title: "你的咀嚼能力及每日饮水量是？",
      options: [
        { label: "咀嚼困难+小于800ml饮水量", value: "bad_both", score: 1 },
        { label: "咀嚼一般/小于800ml饮水量其一", value: "bad_one", score: 2 },
        { label: "咀嚼正常，800-1500ml饮水量", value: "ok", score: 4 },
        { label: "咀嚼正常，大于1500ml饮水量", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["senior"] }],
    },
    {
      id: "E08",
      dimension: "diet",
      type: "single_choice",
      title: "你的饮食口味偏好是？",
      description: "（高血压/糖尿病等人群可做联动风险提示）",
      options: [
        { label: "重油重盐重糖", value: "heavy_all", score: 1 },
        { label: "偏油/偏咸/偏甜其一", value: "heavy_one", score: 2 },
        { label: "清淡，偶尔偏重", value: "light_sometimes", score: 4 },
        { label: "长期清淡", value: "light_always", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "E09",
      dimension: "diet",
      type: "single_choice",
      title: "你是否规律补充叶酸/铁剂？",
      options: [
        { label: "从不补充", value: "never", score: 1 },
        { label: "偶尔补充", value: "rare", score: 2 },
        { label: "间断规律补充", value: "sometimes", score: 4 },
        { label: "每天规律补充", value: "daily", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["female"] }, { anyTags: ["female_preconception", "female_pregnant", "female_lactation"] }],
    },
    // 身体状况维度
    {
      id: "H01",
      dimension: "health",
      type: "multi_choice",
      title: "你是否有以下基础疾病？（可多选）",
      description: "多选计分：取最低分。",
      options: [
        { label: "无基础疾病", value: "none", score: 5 },
        { label: "高血压", value: "hypertension", score: 2 },
        { label: "糖尿病", value: "diabetes", score: 2 },
        { label: "高血脂", value: "hyperlipidemia", score: 2 },
        { label: "其他慢性病", value: "other_chronic", score: 3 },
      ],
      required: true,
      autoNext: false,
      showIf: [],
    },
    {
      id: "H02",
      dimension: "health",
      type: "single_choice",
      title: "你近期是否有疲劳、头晕、眼干等不适症状？",
      options: [
        { label: "频繁出现", value: "often", score: 1 },
        { label: "偶尔出现", value: "sometimes", score: 3 },
        { label: "极少出现", value: "rare", score: 4 },
        { label: "从未出现", value: "never", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "H03",
      dimension: "health",
      type: "single_choice",
      title: "孩子近期生长发育及免疫力情况是？",
      options: [
        { label: "生长缓慢+每月感冒大于等于2次", value: "bad_both", score: 1 },
        { label: "生长缓慢/每月感冒大于等于2次其一", value: "bad_one", score: 2 },
        { label: "生长正常，每月感冒1次", value: "ok", score: 4 },
        { label: "生长正常，极少感冒", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["child"] }],
    },
    {
      id: "H04",
      dimension: "health",
      type: "single_choice",
      title: "你近期视力/听力及慢性病控制情况是？",
      options: [
        { label: "视力/听力明显退化+慢性病控制差", value: "bad_both", score: 1 },
        { label: "其一退化/控制一般", value: "bad_one", score: 2 },
        { label: "轻微退化，控制良好", value: "ok", score: 4 },
        { label: "无退化，控制稳定", value: "good", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [{ allTags: ["senior"] }],
    },
    {
      id: "H05",
      dimension: "health",
      type: "single_choice",
      title: "你是否正在服用药物或营养补充剂？",
      description: "用于后续药物相互作用提示",
      options: [
        { label: "长期服用药物", value: "drug_long", score: 2 },
        { label: "长期服用补剂", value: "supp_long", score: 3 },
        { label: "偶尔服用", value: "sometimes", score: 4 },
        { label: "从不服用", value: "never", score: 5 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    {
      id: "H06",
      dimension: "health",
      type: "single_choice",
      title: "你过往是否有重大疾病史？",
      options: [
        { label: "有", value: "yes", score: 2 },
        { label: "无", value: "no", score: 5 },
        { label: "记不清", value: "unknown", score: 3 },
      ],
      required: true,
      autoNext: true,
      showIf: [],
    },
    // 健康目标维度
    {
      id: "G01",
      dimension: "goal",
      type: "multi_choice",
      title: "你核心的健康目标是？",
      description: "可多选；用于建议匹配优先级。",
      options: [
        { label: "改善睡眠", value: "sleep", score: null },
        { label: "提升免疫力", value: "immunity", score: null },
        { label: "体重管理", value: "weight", score: null },
        { label: "皮肤状态优化", value: "skin", score: null },
        { label: "促进生长发育", value: "growth", score: null, showForTags: ["child"] },
        { label: "增强体质", value: "strength", score: null, showForTags: ["child"] },
        { label: "维护骨骼健康", value: "bone", score: null, showForTags: ["senior"] },
        { label: "改善记忆力", value: "memory", score: null, showForTags: ["senior"] },
        { label: "备孕调理", value: "preconception", score: null, showForTags: ["female"] },
        { label: "经期护理", value: "menstrual", score: null, showForTags: ["female"] },
      ],
      required: true,
      autoNext: false,
      showIf: [],
    },
  ],
}

const STORAGE_KEY = "ffq_questionnaire_cache"

export function QuestionnaireFlow() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, number>>>({})
  const [userTags, setUserTags] = useState<string[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState(questionBank.questions)
  const [groupInputValues, setGroupInputValues] = useState<Record<string, number>>({})
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)

  // 从缓存恢复
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        const data = JSON.parse(cached)
        const cacheAge = Date.now() - (data.timestamp || 0)
        // 7天有效期
        if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
          setAnswers(data.answers || {})
          setUserTags(data.userTags || [])
          setCurrentIndex(data.currentIndex || 0)
          setBmi(data.bmi || null)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (e) {
        console.error("Failed to parse cache", e)
      }
    }
  }, [])

  // 保存到缓存
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers,
        userTags,
        currentIndex,
        bmi,
        timestamp: Date.now(),
      }))
    }
  }, [answers, userTags, currentIndex, bmi])

  // 根据userTags过滤题目
  useEffect(() => {
    const filtered = questionBank.questions.filter((q) => {
      if (!q.showIf || q.showIf.length === 0) return true
      
      return q.showIf.some((condition: { allTags?: string[]; anyTags?: string[]; noneTags?: string[] }) => {
        if (condition.allTags) {
          return condition.allTags.every((tag: string) => userTags.includes(tag))
        }
        if (condition.anyTags) {
          return condition.anyTags.some((tag: string) => userTags.includes(tag))
        }
        if (condition.noneTags) {
          return !condition.noneTags.some((tag: string) => userTags.includes(tag))
        }
        return true
      })
    })
    setFilteredQuestions(filtered)
  }, [userTags])

  const currentQuestion = filteredQuestions[currentIndex]
  const progress = filteredQuestions.length > 0 
    ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100) 
    : 0

  const handleSingleSelect = (value: string, option: { tags?: string[] }) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    
    // 更新userTags
    if (option.tags && option.tags.length > 0) {
      setUserTags((prev) => {
        const newTags = [...prev]
        option.tags?.forEach((tag: string) => {
          if (!newTags.includes(tag)) {
            newTags.push(tag)
          }
        })
        return newTags
      })
    }
    
    if (currentQuestion.autoNext) {
      setTimeout(() => {
        if (currentIndex < filteredQuestions.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setMultiSelected([])
        } else {
          handleSubmit()
        }
      }, 300)
    }
  }

  const handleMultiSelect = (value: string) => {
    // "无" 选项互斥逻辑
    if (value === "none") {
      setMultiSelected(["none"])
      return
    }
    
    let newSelected = multiSelected.filter((v) => v !== "none")
    
    if (newSelected.includes(value)) {
      newSelected = newSelected.filter((v) => v !== value)
    } else {
      newSelected.push(value)
    }
    
    setMultiSelected(newSelected)
  }

  const handleMultiNext = () => {
    if (multiSelected.length === 0) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: multiSelected }))
    
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setMultiSelected([])
    } else {
      handleSubmit()
    }
  }

  const handleGroupInput = () => {
    const q = currentQuestion as { fields?: { key: string; min?: number; max?: number }[] }
    if (!q.fields) return
    
    const isValid = q.fields.every((field) => {
      const val = groupInputValues[field.key]
      return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
    })
    
    if (!isValid) return
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...groupInputValues } }))
    
    // 计算BMI
    if (currentQuestion.id === "B03") {
      const h = groupInputValues.heightCm
      const w = groupInputValues.weightKg
      if (h && w) {
        const calculatedBmi = Math.round((w / ((h / 100) ** 2)) * 100) / 100
        setBmi(calculatedBmi)
      }
    }
    
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setGroupInputValues({})
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setMultiSelected([])
      setGroupInputValues({})
    } else {
      router.back()
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // 计算分数
    const scores = calculateScores()
    
    // 存储结果
    localStorage.setItem("ffq_result", JSON.stringify({
      answers,
      userTags,
      bmi,
      scores,
      timestamp: Date.now(),
    }))
    
    // 清除问卷缓存
    localStorage.removeItem(STORAGE_KEY)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setShowComplete(true)
      
      setTimeout(() => {
        router.push("/report")
      }, 2000)
    }, 1500)
  }

  const calculateScores = () => {
    const dimensionScores: Record<string, number> = {
      lifestyle: 0,
      diet: 0,
      health: 0,
      goal: 0,
    }
    const dimensionMax: Record<string, number> = {
      lifestyle: 0,
      diet: 0,
      health: 0,
      goal: 0,
    }
    
    filteredQuestions.forEach((q) => {
      if (q.dimension === "basic" || q.dimension === "goal") return
      
      const answer = answers[q.id]
      if (!answer) return
      
      // 计算该维度最大分
      const maxScore = q.options?.reduce((max: number, o: { score?: number | null }) => Math.max(max, o.score || 0), 0) || 5
      dimensionMax[q.dimension] = (dimensionMax[q.dimension] || 0) + maxScore
      
      if (q.type === "single_choice") {
        const option = q.options?.find((o: { value: string }) => o.value === answer)
        if (option?.score) {
          dimensionScores[q.dimension] = (dimensionScores[q.dimension] || 0) + option.score
        }
      } else if (q.type === "multi_choice" && Array.isArray(answer)) {
        // 多选取最低分
        const scores = answer.map((v) => {
          const option = q.options?.find((o: { value: string }) => o.value === v)
          return option?.score || 3
        })
        dimensionScores[q.dimension] = (dimensionScores[q.dimension] || 0) + Math.min(...scores)
      }
    })
    
    // 归一化分数
    const dimensionNormalized: Record<string, number> = {}
    for (const dim of Object.keys(dimensionScores)) {
      if (dimensionMax[dim] > 0) {
        dimensionNormalized[dim] = Math.round((dimensionScores[dim] / dimensionMax[dim]) * 100)
      } else {
        dimensionNormalized[dim] = 0
      }
    }
    
    // 计算综合分
    const weights = questionBank.scoring.dimensionWeightsDefault
    const totalScore = Math.round(
      (dimensionNormalized.lifestyle || 0) * weights.lifestyle +
      (dimensionNormalized.diet || 0) * weights.diet +
      (dimensionNormalized.health || 0) * weights.health +
      (dimensionNormalized.goal || 0) * weights.goal
    )
    
    return {
      dimensionScores,
      dimensionMax,
      dimensionNormalized,
      totalScore: Math.min(100, Math.max(0, totalScore)),
      level: totalScore >= 80 ? "high" : totalScore >= 60 ? "mid" : "low",
    }
  }

  // 过滤G01的选项（根据userTags）
  const getFilteredOptions = (question: typeof currentQuestion) => {
    if (!question.options) return []
    
    return question.options.filter((opt) => {
      if (!("showForTags" in opt) || !opt.showForTags) return true
      return opt.showForTags.some((tag: string) => userTags.includes(tag))
    })
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        
        {/* 进度条 - 带动画效果 */}
        <div className="h-1.5 bg-muted mx-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-[#66CDAA] transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* 闪光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        {/* 进度文字 */}
        <div className="flex justify-between px-4 mt-1">
          <span className="text-[10px] text-muted-foreground">{currentIndex + 1}/{filteredQuestions.length}</span>
          <span className="text-[10px] text-primary font-medium">{progress}%</span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 px-5 py-8">
        {/* 问题标题 */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {currentQuestion.title}
        </h1>
        
        {currentQuestion.description && (
          <p className="text-sm text-muted-foreground mb-6">
            {currentQuestion.description}
          </p>
        )}

        {/* 选项区 */}
        <div className="mt-6 space-y-3">
          {currentQuestion.type === "single_choice" && currentQuestion.options?.map((option: { value: string; label: string; tags?: string[] }, index: number) => (
            <button
              key={option.value}
              onClick={() => handleSingleSelect(option.value, option)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                answers[currentQuestion.id] === option.value
                  ? "border-primary bg-[#E8FFE8] shadow-sm"
                  : "border-border bg-white hover:border-primary/50 hover:bg-[#FAFFF8]"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  answers[currentQuestion.id] === option.value ? "text-primary" : "text-foreground"
                }`}>
                  {option.label}
                </span>
                {answers[currentQuestion.id] === option.value && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}

          {currentQuestion.type === "multi_choice" && (
            <>
              {getFilteredOptions(currentQuestion).map((option: { value: string; label: string }) => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    multiSelected.includes(option.value)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-white hover:border-primary/50"
                  }`}
                >
                  <span className={`font-medium ${
                    multiSelected.includes(option.value) ? "text-primary" : "text-foreground"
                  }`}>
                    {option.label}
                  </span>
                  {multiSelected.includes(option.value) && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
              
              {/* 下一步按钮 */}
              <button
                onClick={handleMultiNext}
                disabled={multiSelected.length === 0}
                className={`w-full py-4 rounded-xl font-medium mt-6 transition-all ${
                  multiSelected.length > 0
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                下一步
              </button>
            </>
          )}

          {currentQuestion.type === "group_input" && (
            <div className="space-y-4">
              {(currentQuestion as { fields?: { key: string; label: string; min?: number; max?: number }[] }).fields?.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground w-20">{field.label}</label>
                  <input
                    type="number"
                    value={groupInputValues[field.key] || ""}
                    onChange={(e) => setGroupInputValues(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    min={field.min}
                    max={field.max}
                    className="flex-1 p-4 rounded-xl border-2 border-border bg-white text-lg font-medium text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
              
              <button
                onClick={handleGroupInput}
                disabled={!(currentQuestion as { fields?: { key: string; min?: number; max?: number }[] }).fields?.every((field) => {
                  const val = groupInputValues[field.key]
                  return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
                })}
                className={`w-full py-4 rounded-xl font-medium mt-4 transition-all ${
                  (currentQuestion as { fields?: { key: string; min?: number; max?: number }[] }).fields?.every((field) => {
                    const val = groupInputValues[field.key]
                    return val !== undefined && val >= (field.min || 0) && val <= (field.max || 999)
                  })
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                下一步
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 提交中/完成弹窗 */}
      {(isSubmitting || showComplete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 mx-6 text-center animate-in zoom-in-95 duration-200">
            {isSubmitting ? (
              <>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">正在生成报告...</p>
                <p className="text-sm text-muted-foreground mt-2">AI正在分析您的健康数据</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium text-foreground">评估完成</p>
                <p className="text-sm text-muted-foreground mt-2">即将跳转到您的专属报告</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
