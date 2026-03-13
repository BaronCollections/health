"use client"
import { useState, useRef } from "react"
import React from "react"
import { ArrowLeft, Coins, ChevronRight, CreditCard, Truck, Package, Star, RotateCcw, Gift, Headphones, Heart, Building2, FileText, HelpCircle, Briefcase, MessageCircle, X, Check, Camera, ImageIcon, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { SharedNav } from "./shared-nav"

export function MorningProfile() {
  const router = useRouter()
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [serviceType, setServiceType] = useState("")
  const [copied, setCopied] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [tempAvatar, setTempAvatar] = useState<string | null>(null)
  const [showBenefitsPage, setShowBenefitsPage] = useState(false)
  const [joinSuccess, setJoinSuccess] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponSuccess, setCouponSuccess] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [nickname, setNickname] = useState("幸福的前列腺")
  const [birthday, setBirthday] = useState("1995-06-15")
  const [location, setLocation] = useState("浙江 杭州")
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleCouponRedeem = () => {
    if (!couponCode.trim()) return
    setCouponSuccess(true)
    setTimeout(() => {
      setCouponSuccess(false)
      setShowCouponModal(false)
      setCouponCode("")
    }, 2000)
  }

  const handleServiceClick = (name: string) => {
    if (name === "商务合作") {
      navigator.clipboard.writeText("morningperson@yeah.net")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }
    if (name === "优惠券") {
      setShowCouponModal(true)
      return
    }
    setServiceType(name)
    setShowServiceModal(true)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempAvatar(reader.result as string)
        setShowAvatarModal(false)
        // 进入预览确认页面
        setTimeout(() => setShowAvatarPreview(true), 100)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmAvatar = () => {
    setAvatar(tempAvatar)
    setShowAvatarPreview(false)
    setTempAvatar(null)
  }

  const cancelAvatarPreview = () => {
    setShowAvatarPreview(false)
    setTempAvatar(null)
  }

  const handleJoinMember = () => {
    setJoinSuccess(true)
    setTimeout(() => {
      setJoinSuccess(false)
      setShowBenefitsPage(false)
    }, 2000)
  }

  const startEditField = (field: string, currentValue: string) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const saveEditField = () => {
    if (editingField === "nickname") {
      setNickname(tempValue)
    } else if (editingField === "birthday") {
      setBirthday(tempValue)
    } else if (editingField === "location") {
      setLocation(tempValue)
    }
    setEditingField(null)
    setTempValue("")
  }

  const cancelEditField = () => {
    setEditingField(null)
    setTempValue("")
  }

  // 个人资料编辑页 - 统一浅色主题
  if (showProfileEdit) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center px-4 py-3 bg-white border-b border-border">
          <button onClick={() => setShowProfileEdit(false)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="flex-1 text-center font-medium text-foreground">个人资料</span>
          <div className="w-7" />
        </div>

        {/* 资料列表 */}
        <div className="flex-1 mt-2">
          <div className="bg-white">
            {/* 头像 */}
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-border"
            >
              <span className="text-foreground">头像</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt="头像" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-xl">:)</span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>

            {/* 名字 */}
            <button 
              onClick={() => startEditField("nickname", nickname)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-border"
            >
              <span className="text-foreground">名字</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{nickname}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>

            {/* 出生年月 */}
            <button 
              onClick={() => startEditField("birthday", birthday)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-border"
            >
              <span className="text-foreground">出生年月</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{birthday}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>

            {/* 常居地 */}
            <button 
              onClick={() => startEditField("location", location)}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <span className="text-foreground">常居地</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{location}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>

        {/* 编辑字段弹窗 */}
        {editingField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={cancelEditField} />
            <div className="relative bg-white rounded-xl w-[85%] max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-foreground font-medium">
                  {editingField === "nickname" && "修改名字"}
                  {editingField === "birthday" && "修改出生年月"}
                  {editingField === "location" && "修改常居地"}
                </span>
              </div>
              <div className="p-4">
                {editingField === "birthday" ? (
                  <input
                    type="date"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                ) : (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={editingField === "nickname" ? "请输入名字" : "请输入常居地"}
                    className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                )}
              </div>
              <div className="flex border-t border-border">
                <button 
                  onClick={cancelEditField}
                  className="flex-1 py-3 text-muted-foreground border-r border-border"
                >
                  取消
                </button>
                <button 
                  onClick={saveEditField}
                  className="flex-1 py-3 text-primary font-medium"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 更换头像弹窗 */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAvatarModal(false)} />
            <div className="relative bg-white rounded-2xl w-[85%] max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              {/* 当前头像预览 */}
              <div className="flex flex-col items-center py-5 bg-gradient-to-b from-primary/5 to-white">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white shadow-lg">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt="当前头像" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-3xl">:)</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">更换头像</span>
              </div>
              {/* 选项 */}
              <div className="border-t border-border">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-4 flex items-center justify-center gap-3 border-b border-border hover:bg-gray-50 active:bg-gray-100"
                >
                  <Camera className="w-5 h-5 text-primary" />
                  <span className="text-foreground">拍照</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 flex items-center justify-center gap-3 border-b border-border hover:bg-gray-50 active:bg-gray-100"
                >
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <span className="text-foreground">从相册选择</span>
                </button>
                <button 
                  onClick={() => setShowAvatarModal(false)}
                  className="w-full py-4 text-center text-muted-foreground hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
              <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*"
                capture="environment"
                className="hidden" 
                onChange={handleAvatarChange}
              />
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        )}

        {/* 头像预览确认页 */}
        {showAvatarPreview && tempAvatar && (
          <div className="fixed inset-0 z-50 bg-[#F5F5F5] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border">
              <button onClick={cancelAvatarPreview} className="text-muted-foreground text-sm">
                取消
              </button>
              <span className="text-foreground font-medium">预览</span>
              <button onClick={confirmAvatar} className="text-primary font-medium text-sm">
                使用
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <img src={tempAvatar || "/placeholder.svg"} alt="预览头像" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="pb-8 text-center">
              <p className="text-muted-foreground text-sm">头像将会裁剪为圆形</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 权益详情页
  if (showBenefitsPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <button onClick={() => setShowBenefitsPage(false)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="flex-1 text-center font-medium text-foreground">会员权益</span>
          <div className="w-7" />
        </div>

        <div className="flex-1 px-5 py-6 space-y-4">
          {/* 标题区 */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">Morning会员专属权益</h1>
            <p className="text-sm text-muted-foreground mt-2">
              健康值可兑换服务、解锁高阶功能，助力科学健康管理
            </p>
          </div>

          {/* 核心权益卡片 */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex items-start gap-3">
              <Coins className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">健康值福利</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  入会即得200健康值，每日打卡额外加赠10健康值，可兑换报告深度解读、专属打卡勋章
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">报告高阶权限</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  解锁个人报告历史趋势对比、营养缺口AI解决方案，提供定制化改善建议
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">社群与打卡特权</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  加入专属会员打卡圈，优先展示动态，解锁自定义打卡项上限，连续打卡勋章升级特权
                </p>
              </div>
            </div>
          </div>

          {/* 健康值说明卡 */}
          <div className="bg-[#E8FFE8] rounded-xl p-5">
            <h3 className="font-bold text-primary mb-2">健康值规则</h3>
            <p className="text-sm text-foreground leading-relaxed">
              健康值长期有效，可通过入会、打卡、分享动态获取，后续将上线更多兑换权益，持续更新
            </p>
          </div>

          {/* 底部行动区 */}
          <div className="pt-4">
            <button 
              onClick={handleJoinMember}
              className="w-4/5 mx-auto block py-3 bg-primary hover:bg-[#7DD97D] transition-colors duration-200 rounded-lg font-bold text-white"
            >
              立即入会
            </button>
          </div>

          {/* 底部引导文案 */}
          <div className="flex items-center justify-center gap-2 pt-4 animate-pulse">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-primary font-bold">和Morning一起，解锁科学健康新生活</span>
          </div>
        </div>

        {/* 入会成功弹窗 */}
        {joinSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white rounded-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">入会成功</p>
                <p className="text-sm text-muted-foreground mt-1">200健康值已到账</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto relative">
{/* 顶部状态栏 */}
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-border">
        <span className="text-base font-medium text-foreground">Morning</span>
      </div>

      {/* 用户信息区 */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 头像 - 点击进入个人资料页 */}
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="relative"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar || "/placeholder.svg"} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">:)</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-[8px] text-foreground px-1.5 py-0.5 rounded-full">
                会员
              </div>
            </button>
            <div>
              <p className="font-medium text-foreground">{nickname}</p>
              <p className="text-xs text-muted-foreground">立即成为会员</p>
            </div>
          </div>
          {/* 健康值 */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">健康值</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-4 h-4 bg-primary rounded-full" />
              <span className="font-bold text-foreground">80</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* 会员横幅 */}
        <button 
          onClick={() => setShowBenefitsPage(true)}
          className="w-full mt-4 bg-gradient-to-r from-primary to-[#7DD97D] rounded-xl px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <span className="text-primary text-xs font-bold">V</span>
            </div>
            <span className="text-sm font-medium text-foreground">成为会员</span>
            <span className="text-xs text-foreground/80">入会立得 200 健康值</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">查看权益</span>
            <ChevronRight className="w-4 h-4 text-foreground" />
          </div>
        </button>
      </div>

{/* 功能入口 */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Heart, name: "健康伙伴", badge: "1v1" },
            { icon: CreditCard, name: "卡路里管家" },
            { icon: Package, name: "健康商店" },
            { icon: Gift, name: "礼券卡包" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-150"
            >
              <div className="w-12 h-12 bg-[#E8FFE8] rounded-xl flex items-center justify-center relative hover:bg-[#D0F5D0] hover:-translate-y-0.5 transition-all duration-200">
                <item.icon className="w-6 h-6 text-primary" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-[8px] text-white px-1 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 邀请有礼 & 打卡 */}
      <div className="mt-2 px-4 flex gap-3">
        {/* 邀请有礼 */}
        <div className="flex-1 bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-foreground">邀请有礼</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">每邀1位好友下单：</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">30</span>
            <span className="text-sm text-foreground">健康值</span>
          </div>
          <button 
            onClick={() => router.push("/community")}
            className="mt-3 px-4 py-1.5 border border-foreground rounded-full text-xs font-medium text-foreground"
          >
            去邀请
          </button>
        </div>

        {/* 打卡获健康值 */}
        <div className="flex-1 bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-primary rounded-full" />
            <span className="text-sm font-medium text-foreground">打卡获健康值</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">养成坚持服用好习惯</p>
          <button 
            onClick={() => router.push("/checkin")}
            className="px-4 py-1.5 border border-foreground rounded-full text-xs font-medium text-foreground"
          >
            去打卡
          </button>
        </div>
      </div>

      {/* 设置 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h3 className="font-medium text-foreground mb-4">设置</h3>
        <div className="space-y-0">
          {/* 深色模式开关 */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              <span className="text-sm text-foreground">深色模式</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? "bg-primary" : "bg-[#E5E5E5]"}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground py-2">深色模式功能开发中，敬请期待</p>
        </div>
      </div>

      {/* 更多服务 */}
      <div className="bg-white mt-2 px-4 py-4">
        <h3 className="font-medium text-foreground mb-4">更多服务</h3>
        <div className="space-y-0">
          {[
            { icon: Gift, name: "优惠券", desc: "使用优惠码兑换", action: "兑换" },
            { icon: Headphones, name: "联系客服", desc: "9:00 - 17:00" },
            { icon: Users, name: "入群", desc: "群号: 1928288" },
            { icon: FileText, name: "服用说明" },
            { icon: HelpCircle, name: "用户须知" },
            { icon: Briefcase, name: "商务合作", desc: "morningperson@yeah.net", action: "复制" },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => handleServiceClick(item.name)}
              className="flex items-center justify-between py-3 border-b border-border last:border-0 w-full text-left active:bg-[#F5F5F5] transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.desc && <span className="text-xs text-muted-foreground">{item.desc}</span>}
                {item.name === "商务合作" ? (
                  copied ? (
                    <span className="text-xs text-primary flex items-center gap-1">
                      <Check className="w-3 h-3" /> 已复制
                    </span>
                  ) : (
                    <span className="text-xs text-primary">{item.action}</span>
                  )
                ) : item.action ? (
                  <span className="text-xs text-primary">{item.action}</span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧悬浮按钮 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <button 
          onClick={() => handleServiceClick("联系客服")}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-border">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">咨询</span>
        </button>
      </div>

      {/* 更换头像弹窗 - 仿微信样式 */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAvatarModal(false)} />
          <div className="relative bg-white rounded-2xl w-[85%] max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* 当前头像预览 */}
            <div className="flex flex-col items-center py-5 bg-gradient-to-b from-primary/5 to-white">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden mb-3 border-2 border-white shadow-lg">
                {avatar ? (
                  <img src={avatar || "/placeholder.svg"} alt="当前头像" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">:)</span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">更换头像</span>
            </div>

            {/* 选项 */}
            <div className="border-t border-border">
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-4 flex items-center justify-center gap-3 border-b border-border hover:bg-gray-50 active:bg-gray-100"
              >
                <Camera className="w-5 h-5 text-primary" />
                <span className="text-foreground">拍照</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 flex items-center justify-center gap-3 border-b border-border hover:bg-gray-50 active:bg-gray-100"
              >
                <ImageIcon className="w-5 h-5 text-primary" />
                <span className="text-foreground">从相册选择</span>
              </button>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-4 text-center text-muted-foreground hover:bg-gray-50"
              >
                取消
              </button>
            </div>

            {/* 隐藏的文件输入 */}
            <input 
              ref={cameraInputRef}
              type="file" 
              accept="image/*"
              capture="environment"
              className="hidden" 
              onChange={handleAvatarChange}
            />
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      )}

      {/* 头像预览确认页 - 仿微信 */}
      {showAvatarPreview && tempAvatar && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80">
            <button onClick={cancelAvatarPreview} className="text-white text-sm">
              取消
            </button>
            <span className="text-white font-medium">预览</span>
            <button onClick={confirmAvatar} className="text-primary font-medium text-sm">
              使用
            </button>
          </div>
          
          {/* 头像预览区 */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20">
              <img src={tempAvatar || "/placeholder.svg"} alt="预览头像" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* 底部提示 */}
          <div className="pb-8 text-center">
            <p className="text-white/60 text-sm">头像将会裁剪为圆形</p>
          </div>
        </div>
      )}

      {/* 优惠码兑换弹窗 */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCouponModal(false)} />
          <div className="relative bg-white rounded-2xl w-[85%] max-w-sm p-6 animate-in zoom-in-95 duration-200">
            {couponSuccess ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground">兑换成功</p>
                <p className="text-sm text-muted-foreground mt-1">优惠券已添加到您的账户</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowCouponModal(false)}
                  className="absolute right-4 top-4"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">优惠码兑换</h3>
                  <p className="text-sm text-muted-foreground mt-1">请输入您的优惠码</p>
                </div>

                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="请输入优惠码"
                  className="w-full px-4 py-3 border border-border rounded-lg text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mb-4"
                />

                <button 
                  onClick={handleCouponRedeem}
                  disabled={!couponCode.trim()}
                  className={`w-full py-3 rounded-full font-medium text-white ${couponCode.trim() ? "bg-primary" : "bg-gray-300"}`}
                >
                  立即兑换
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 服务弹窗 */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowServiceModal(false)} />
          <div className="relative bg-white rounded-2xl w-[80%] max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowServiceModal(false)}
              className="absolute right-4 top-4"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {serviceType === "联系客服" && <Headphones className="w-8 h-8 text-primary" />}
                {serviceType === "优惠券" && <Gift className="w-8 h-8 text-primary" />}
                {serviceType === "入群" && <Users className="w-8 h-8 text-primary" />}
                {serviceType === "企业服务" && <Building2 className="w-8 h-8 text-primary" />}
                {serviceType === "服用说明" && <FileText className="w-8 h-8 text-primary" />}
                {serviceType === "用户须知" && <HelpCircle className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">{serviceType}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {serviceType === "联系客服" && "客服工作时间: 9:00 - 17:00"}
                {serviceType === "优惠券" && "请输入优惠码进行兑换"}
                {serviceType === "入群" && "加入健康交流群，群号: 1928288"}
                {serviceType === "企业服务" && "企业定制健康方案"}
                {serviceType === "服用说明" && "查看产品服用指南"}
                {serviceType === "用户须知" && "了解使用须知和注意事项"}
              </p>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="w-full py-3 bg-primary rounded-full font-medium text-white"
              >
                {serviceType === "联系客服" ? "立即咨询" : "确定"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部间距 */}
      <div className="pb-20" />

      <SharedNav />
    </div>
  )
}
