"use client"

import type React from "react"
import Link from "next/link"
import {
  Heart,
  Hash,
  Sparkles,
  Users,
  Moon,
  Dumbbell,
  Brain,
  Droplets,
  Coffee,
  MessageCircle,
  Send,
  MoreHorizontal,
  Share2,
  Trophy,
  Zap,
  X,
  Download,
} from "lucide-react"
import { useState, useEffect } from "react"
import { SharedNav } from "./shared-nav"
import { SharedHeader } from "./shared-header"

const statusTags = [
  { tag: "深夜模式", icon: Moon, count: 3420, message: "今晚有 {count} 位伙伴和你一起在修复身体" },
  { tag: "健身中", icon: Dumbbell, count: 8912, message: "此刻有 {count} 人正在挥洒汗水" },
  { tag: "深度工作", icon: Brain, count: 5631, message: "{count} 位伙伴正在专注中" },
  { tag: "冥想时刻", icon: Sparkles, count: 2104, message: "{count} 人正在与你一起呼吸" },
  { tag: "补水打卡", icon: Droplets, count: 12580, message: "已有 {count} 人完成今日补水目标" },
  { tag: "早起咖啡", icon: Coffee, count: 6743, message: "{count} 位早起的鸟儿正在享受咖啡" },
]

const userPosts = [
  {
    id: 1,
    username: "小林",
    avatar: "林",
    time: "3分钟前",
    content: "今天完成了5公里晨跑，感觉状态超好！坚持第21天",
    tags: ["#健身中", "#早起"],
    likes: 128,
    comments: 23,
    shape: "circle",
  },
  {
    id: 2,
    username: "Echo",
    avatar: "E",
    time: "15分钟前",
    content: "深夜冥想打卡，终于能静下心来了。推荐大家试试4-7-8呼吸法",
    tags: ["#深夜模式", "#冥想时刻"],
    likes: 89,
    comments: 12,
    shape: "square",
  },
  {
    id: 3,
    username: "阿杰",
    avatar: "杰",
    time: "32分钟前",
    content: "连续工作4小时后的番茄钟休息，眼睛看向窗外的绿植，深呼吸三次",
    tags: ["#深度工作"],
    likes: 256,
    comments: 41,
    shape: "triangle",
  },
  {
    id: 4,
    username: "薇薇",
    avatar: "薇",
    time: "1小时前",
    content: "今日饮水量达标！2.5L 皮肤状态明显变好了",
    tags: ["#补水打卡"],
    likes: 342,
    comments: 56,
    shape: "diamond",
  },
]

export function CommunityStatus() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [hearts, setHearts] = useState<{ id: number; x: number; postId: number }[]>([])
  const [expandedComments, setExpandedComments] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [todayCheckIns, setTodayCheckIns] = useState(42891)
  const [selectedTag, setSelectedTag] = useState<(typeof statusTags)[0] | null>(null)
  const [showBattleReport, setShowBattleReport] = useState(false)
  const [battleStats] = useState({
    weeklyStreak: 7,
    beatPercent: 90,
    totalPoints: 2450,
    rank: 128,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayCheckIns((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) return

    setLikedPosts([...likedPosts, postId])

    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 60 - 30,
      postId,
    }))
    setHearts([...hearts, ...newHearts])

    setTimeout(() => {
      setHearts((h) => h.filter((heart) => heart.postId !== postId))
    }, 1500)
  }

  const toggleComments = (postId: number) => {
    setExpandedComments(expandedComments === postId ? null : postId)
  }

  const handleTagClick = (tag: (typeof statusTags)[0]) => {
    setSelectedTag(tag)
  }

  const handleShare = () => {
    // 模拟唤起微信分享
    if (navigator.share) {
      navigator.share({
        title: "我的健康战报",
        text: `我的本周坚持率击败了${battleStats.beatPercent}%的同龄人！`,
        url: window.location.href,
      })
    } else {
      alert("已复制分享链接到剪贴板")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <SharedHeader
        subtitle="今日V了么"
        title="此刻我们一起"
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBattleReport(true)}
              className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
            >
              <Trophy className="w-4 h-4 text-white" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-klein-blue rounded-full shadow-lg shadow-klein-blue/30">
              <Users className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white tabular-nums">{todayCheckIns.toLocaleString()}</span>
            </div>
          </div>
        }
      />

      {/* Status Tags - Horizontal Scroll */}
      <section className="px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-klein-blue" />
          <span className="text-sm font-medium text-muted-foreground">热门状态</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {statusTags.map((item, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(item)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-klein-blue/5 to-klein-blue/10 rounded-full border border-klein-blue/10 transition-all hover:scale-105 hover:shadow-md hover:shadow-klein-blue/10 active:scale-95"
            >
              <item.icon className="w-4 h-4 text-klein-blue" strokeWidth={1.5} />
              <span className="text-sm font-medium text-klein-blue whitespace-nowrap">#{item.tag}</span>
              <span className="text-xs text-klein-blue/60">{(item.count / 1000).toFixed(1)}k</span>
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-gray-100" />

      <section className="flex-1 px-6 py-6 space-y-4 overflow-y-auto pb-32">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-klein-blue" />
          <span className="text-sm font-medium text-muted-foreground">动态广场</span>
        </div>

        {userPosts.map((post) => (
          <div
            key={post.id}
            className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:shadow-klein-blue/10"
          >
            {/* Geometric shape accent */}
            <div className="absolute top-4 right-4 opacity-50">
              {post.shape === "circle" && <div className="w-6 h-6 rounded-full bg-klein-blue/20" />}
              {post.shape === "square" && <div className="w-6 h-6 rounded-lg bg-klein-blue/20 rotate-12" />}
              {post.shape === "triangle" && (
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-klein-blue/20" />
              )}
              {post.shape === "diamond" && <div className="w-5 h-5 bg-klein-blue/20 rotate-45 rounded-sm" />}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-klein-blue/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-klein-blue">{post.avatar}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{post.username}</p>
                <p className="text-xs text-muted-foreground">{post.time}</p>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs text-klein-blue bg-klein-blue/5 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-50 relative">
              {/* Like Button */}
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  likedPosts.includes(post.id) ? "bg-klein-blue/10 text-klein-blue" : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    likedPosts.includes(post.id) ? "fill-klein-blue text-klein-blue scale-110" : ""
                  }`}
                  strokeWidth={1.5}
                />
                <span className="tabular-nums">{likedPosts.includes(post.id) ? post.likes + 1 : post.likes}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => toggleComments(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  expandedComments === post.id ? "bg-klein-blue/10 text-klein-blue" : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                <span className="tabular-nums">{post.comments}</span>
              </button>

              {hearts
                .filter((h) => h.postId === post.id)
                .map((heart) => (
                  <div
                    key={heart.id}
                    className="absolute bottom-6 left-4 animate-float-up pointer-events-none"
                    style={{ transform: `translateX(${heart.x}px)` }}
                  >
                    <Heart className="w-4 h-4 text-klein-blue fill-klein-blue" />
                  </div>
                ))}
            </div>

            {/* Comment Input - Expandable */}
            {expandedComments === post.id && (
              <div className="mt-4 pt-4 border-t border-gray-50 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1 text-sm px-4 py-2.5 bg-gray-50 rounded-full outline-none focus:ring-2 focus:ring-klein-blue/20 transition-all"
                  />
                  <button className="p-2.5 bg-klein-blue text-white rounded-full hover:bg-klein-blue/90 transition-colors active:scale-95">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {selectedTag && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
          onClick={() => setSelectedTag(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-klein-blue/10 flex items-center justify-center">
                  <selectedTag.icon className="w-6 h-6 text-klein-blue" />
                </div>
                <span className="text-lg font-bold text-klein-blue">#{selectedTag.tag}</span>
              </div>
              <button
                onClick={() => setSelectedTag(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-klein-blue/5 to-klein-blue/10 rounded-2xl p-6 mb-6">
              <p className="text-center text-lg font-medium text-foreground leading-relaxed">
                {selectedTag.message.replace("{count}", selectedTag.count.toLocaleString())}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-klein-blue">
              <Users className="w-5 h-5" />
              <span className="text-2xl font-bold tabular-nums">{selectedTag.count.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">人在线</span>
            </div>

            <button
              className="w-full mt-6 py-3 bg-klein-blue text-white rounded-full font-medium active:scale-95 transition-transform"
              onClick={() => setSelectedTag(null)}
            >
              加入 #{selectedTag.tag}
            </button>
          </div>
        </div>
      )}

      {showBattleReport && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
          onClick={() => setShowBattleReport(false)}
        >
          <div
            className="bg-gradient-to-br from-klein-blue to-blue-900 rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-70">本周战报</span>
              <button
                onClick={() => setShowBattleReport(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 高光时刻 */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">击败了 {battleStats.beatPercent}% 的同龄人</h2>
              <p className="text-white/70 text-sm">你的本周坚持率超越了绝大多数人</p>
            </div>

            {/* 数据卡片 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold">{battleStats.weeklyStreak}</p>
                <p className="text-xs opacity-70">连续打卡天数</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-2xl font-bold">{battleStats.totalPoints}</p>
                <p className="text-xs opacity-70">累计能量值</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 text-center mb-6">
              <p className="text-sm opacity-70 mb-1">全站排名</p>
              <p className="text-3xl font-bold">
                <span className="text-yellow-400">#</span>
                {battleStats.rank}
              </p>
            </div>

            {/* 分享按钮 */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-white/10 rounded-full font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Download className="w-4 h-4" />
                保存图片
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-white rounded-full font-medium text-klein-blue flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Share2 className="w-4 h-4" />
                分享战报
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <SharedNav />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.5);
          }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
}: { icon: React.ElementType; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-4">
      <div className={`p-2 rounded-full ${active ? "bg-klein-blue/10" : ""}`}>
        <Icon className={`w-5 h-5 ${active ? "text-klein-blue" : "text-gray-400"}`} strokeWidth={1.5} />
      </div>
      <span className={`text-xs font-medium ${active ? "text-klein-blue" : "text-gray-400"}`}>{label}</span>
    </Link>
  )
}
