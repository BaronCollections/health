"use client"
import { ChevronRight, ChevronDown, Check } from "lucide-react"
import { SharedNav } from "./shared-nav"
import { useState } from "react"

// 补剂数据
const categories = [
  { id: "recommended", name: "推荐配方", tag: "热门" },
  { id: "custom", name: "自选补剂" },
]

const supplementCategories = [
  "激活", "私密", "肠道", "代谢", "呼吸", "润肤", "纤体", "心脏", "睡眠", "平衡", "关节", "水润", "运动", "口腔"
]

const supplements = [
  { name: "NMN 15000", price: "-74%", image: "from-white to-gray-100", type: "capsule", category: "激活", tag: "抗衰养也" },
  { name: "辅酶Q10", price: "+6%", image: "from-pink-300 to-pink-400", type: "pill", category: "激活" },
  { name: "FEMME益生菌", price: "", image: "from-white to-gray-100", type: "capsule", category: "私密" },
  { name: "私密", price: "", image: "from-pink-200 to-pink-300", type: "oval", category: "私密" },
  { name: "DUOCAP+益生菌", price: "-24%", image: "from-green-200 to-green-300", type: "capsule", category: "肠道" },
  { name: "绿咖啡豆提取物", price: "", image: "from-green-400 to-green-500", type: "pill", category: "代谢" },
  { name: "呼吸", price: "-23%", image: "from-blue-200 to-blue-300", type: "oval", category: "呼吸" },
  { name: "润肤", price: "", image: "from-pink-100 to-pink-200", type: "round", category: "润肤" },
  { name: "辣椒素提取物", price: "", image: "from-red-400 to-red-500", type: "pill", category: "纤体" },
  { name: "海藻提取物", price: "", image: "from-amber-300 to-amber-400", type: "round", category: "纤体" },
  { name: "睡眠", price: "", image: "from-purple-200 to-purple-300", type: "capsule", category: "睡眠" },
  { name: "平衡", price: "", image: "from-white to-gray-100", type: "oval", category: "平衡" },
  { name: "GABA", price: "", image: "from-white to-gray-100", type: "capsule", category: "睡眠" },
  { name: "Daily益生菌", price: "", image: "from-white to-gray-100", type: "capsule", category: "肠道" },
  { name: "关节", price: "+9%", image: "from-amber-200 to-amber-300", type: "capsule", category: "关节" },
  { name: "水润", price: "", image: "from-orange-300 to-orange-400", type: "round", category: "水润" },
  { name: "运动", price: "-38%", image: "from-yellow-300 to-yellow-400", type: "round", category: "运动" },
  { name: "口腔", price: "", image: "from-green-300 to-green-400", type: "pill", category: "口腔" },
  { name: "左旋肉碱", price: "", image: "from-white to-gray-100", type: "capsule", category: "运动" },
  { name: "还原型辅酶Q10", price: "", image: "from-amber-400 to-amber-500", type: "capsule", category: "心脏" },
  { name: "西芹籽精华", price: "-9%", image: "from-green-200 to-green-300", type: "capsule", category: "代谢" },
]

function SupplementPill({ color, type, size = "normal" }: { color: string; type: string; size?: string }) {
  const sizeClass = size === "small" ? "scale-75" : ""
  
  if (type === "round") {
    return <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${color} shadow-sm ${sizeClass}`} />
  }
  if (type === "oval") {
    return <div className={`w-12 h-6 rounded-full bg-gradient-to-r ${color} shadow-sm border border-gray-200 ${sizeClass}`} />
  }
  if (type === "capsule") {
    return <div className={`w-6 h-14 rounded-full bg-gradient-to-b ${color} shadow-sm ${sizeClass}`} />
  }
  // pill (default)
  return <div className={`w-5 h-12 rounded-full bg-gradient-to-b ${color} shadow-sm ${sizeClass}`} />
}

export function MorningProduct() {
  const [selectedCategory, setSelectedCategory] = useState("激活")
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelect = (name: string) => {
    setSelected(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-20">
        <span className="text-base font-medium text-foreground">Morning</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">去结算</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* 定制营养包头部 */}
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">定制营养包</h1>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm text-muted-foreground">首包含运费</span>
          <span className="text-2xl font-bold text-foreground">65</span>
          <span className="text-sm text-muted-foreground">元/1000g</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">总包82%的专有配方</span>
          <button className="px-3 py-1 bg-primary rounded-full text-xs font-medium text-foreground">
            重置配方
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">2024年07月22</p>
      </div>

      {/* 推荐配方区域 */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-foreground">推荐配方</h2>
            <span className="text-xs text-muted-foreground">-74%</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-center gap-3 min-w-fit">
            <SupplementPill color="from-white to-gray-100" type="capsule" size="small" />
            <div>
              <p className="text-sm font-medium text-foreground">NMN 15000</p>
              <p className="text-xs text-primary">抗衰养也</p>
            </div>
          </div>
        </div>
      </div>

      {/* 自选补剂区域 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-foreground">自选补剂</h2>
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground">身材</span>
            <span className="text-muted-foreground">好肤</span>
            <span className="text-muted-foreground">补铁</span>
            <span className="text-muted-foreground">核心</span>
          </div>
        </div>

        {/* 分类标签 - 带渐变遮罩 */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 pr-8">
            {supplementCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#F5F5F5] text-muted-foreground hover:bg-[#EBEBEB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* 右侧渐变遮罩 */}
          <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* 补剂网格 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {supplements.map((sup, i) => (
            <button
              key={i}
              onClick={() => toggleSelect(sup.name)}
              className={`relative bg-white rounded-xl border p-3 text-left transition-all active:scale-[0.98] ${
                selected.includes(sup.name) 
                  ? "border-primary bg-[#E8FFE8] shadow-sm" 
                  : "border-border hover:border-primary/30 hover:bg-[#FAFFF8]"
              }`}
            >
              {/* 选中标记 */}
              {selected.includes(sup.name) && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              {/* 价格标签 */}
              {sup.price && (
                <span className={`absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  sup.price.startsWith("-") 
                    ? "text-white bg-primary" 
                    : "text-muted-foreground bg-[#F5F5F5]"
                }`}>
                  {sup.price}
                </span>
              )}

              {/* 补剂图片 */}
              <div className="flex justify-center py-3">
                <SupplementPill color={sup.image} type={sup.type} />
              </div>

              {/* 补剂名称 */}
              <p className="text-xs text-center text-foreground font-medium mt-2">{sup.name}</p>
              
              {/* 标签 */}
              {sup.tag && (
                <p className="text-[10px] text-center text-primary mt-1">{sup.tag}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 底部间距 */}
      <div className="pb-20" />

      <SharedNav />
    </div>
  )
}
