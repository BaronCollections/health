"use client"
import { useState, useRef, useEffect } from "react"
import React from "react"

import { Heart, MessageCircle, Share2, MoreHorizontal, ImageIcon, Plus, ChevronRight, ArrowLeft, X, Download } from "lucide-react"
import { SharedNav } from "./shared-nav"

import { useLocale } from "@/i18n/use-locale"

// 评论数据类型
type Comment = {
  id: number
  user: { name: string; avatar: string }
  content: string
  time: string
  likes: number
  liked: boolean
  replyTo?: { name: string; id: number }
  replies?: Comment[]
}

type Post = {
  id: number
  user: { name: string; avatar: string }
  time: string
  content: string
  images: string[]
  likes: number
  comments: number
  liked: boolean
  commentList: Comment[]
  tags?: string[]
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: { name: "健康达人小王", avatar: "W" },
    time: "2小时前",
    content: "坚持服用益生菌第30天了，肠胃明显感觉舒服了很多，推荐大家试试！",
    images: [],
    likes: 128,
    comments: 23,
    liked: false,
    commentList: [
      {
        id: 101,
        user: { name: "营养师Lisa", avatar: "L" },
        content: "益生菌确实对肠道健康很有帮助，坚持下去会有更好的效果！",
        time: "1小时前",
        likes: 12,
        liked: false,
        replies: [
          {
            id: 102,
            user: { name: "健康达人小王", avatar: "W" },
            content: "谢谢Lisa老师的鼓励！",
            time: "50分钟前",
            likes: 3,
            liked: false,
            replyTo: { name: "营养师Lisa", id: 101 },
          },
        ],
      },
      {
        id: 103,
        user: { name: "小明", avatar: "M" },
        content: "请问是哪个牌子的益生菌呀？",
        time: "30分钟前",
        likes: 5,
        liked: false,
      },
    ],
  },
  {
    id: 2,
    user: { name: "营养师Lisa", avatar: "L" },
    time: "5小时前",
    content: "今天给大家分享一下关于维生素D的小知识：\n\n1. 维D不足会影响钙吸收\n2. 每天晒太阳15分钟有帮助\n3. 深海鱼类是天然来源",
    images: [],
    likes: 256,
    comments: 45,
    liked: true,
    commentList: [
      {
        id: 201,
        user: { name: "运动爱好者", avatar: "Y" },
        content: "学到了！原来晒太阳也能补充维D",
        time: "4小时前",
        likes: 28,
        liked: false,
      },
    ],
  },
  {
    id: 3,
    user: { name: "运动爱好者", avatar: "Y" },
    time: "昨天",
    content: "健身+补剂=事半功倍！今天打卡第100天",
    images: [],
    likes: 89,
    comments: 12,
    liked: false,
    commentList: [],
  },
]

const circles = [
  { name: "营养知识圈", members: 12580, color: "from-[#90EE90] to-[#66CDAA]" },
  { name: "打卡互助圈", members: 8960, color: "from-[#E8D5B7] to-[#D4B896]" },
  { name: "健身达人圈", members: 6230, color: "from-[#A8C5DA] to-[#8FB0C9]" },
]

const allCircles = [
  { name: "营养知识圈", members: 12580, color: "from-[#90EE90] to-[#66CDAA]", desc: "分享营养知识，一起健康饮食" },
  { name: "打卡互助圈", members: 8960, color: "from-[#E8D5B7] to-[#D4B896]", desc: "互相监督，坚持打卡不掉队" },
  { name: "健身达人圈", members: 6230, color: "from-[#A8C5DA] to-[#8FB0C9]", desc: "健身爱好者的聚集地" },
  { name: "减脂交流圈", members: 5680, color: "from-[#E8C5D0] to-[#D4A8B8]", desc: "科学减脂，分享心得" },
  { name: "早睡早起圈", members: 4320, color: "from-[#C5C5E8] to-[#A8A8D4]", desc: "养成良好作息习惯" },
  { name: "素食主义圈", members: 3150, color: "from-[#B8E0D2] to-[#95C9B8]", desc: "探索健康素食生活" },
]

const posts = initialPosts; // Declare the posts variable

export function MorningCommunity() {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState<"recommended" | "circles">("recommended")
  const [postsState, setPostsState] = useState<Post[]>(initialPosts)
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [postSuccess, setPostSuccess] = useState(false)
  const [selectedPostTags, setSelectedPostTags] = useState<string[]>([])
  const [showAllCircles, setShowAllCircles] = useState(false)
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null)
  const [sharePost, setSharePost] = useState<Post | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)
  
  // 评论相关状态 - 改为卡片内展示
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [replyTo, setReplyTo] = useState<{ postId: number; commentId: number; userName: string } | null>(null)
  
  // 帖子菜单状态
  const [menuPostId, setMenuPostId] = useState<number | null>(null)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [editContent, setEditContent] = useState("")
  const [commentPost, setCommentPost] = useState<Post | null>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)
  
  // 浮动按钮拖拽状态
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const fabStartPos = useRef({ x: 0, y: 0 })
  
  // 图片预览状态
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // 下拉刷新状态
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // 发帖图片
  const [postImages, setPostImages] = useState<string[]>([])
  
  // 重置FAB位置
  useEffect(() => {
    setFabPosition({ x: 0, y: 0 })
  }, [activeTab])
  
  const toggleLike = (postId: number) => {
    setPostsState((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleShare = (post: Post) => {
    setSharePost(post)
  }

const toggleExpandComments = (postId: number) => {
    setExpandedCommentPostId(prev => prev === postId ? null : postId)
    setReplyTo(null)
    setCommentText("")
  }

  const handleSubmitComment = (postId: number) => {
    if (!commentText.trim()) return
    
    const newComment: Comment = {
      id: Date.now(),
      user: { name: "我", avatar: "我" },
      content: commentText,
      time: "刚刚",
      likes: 0,
      liked: false,
      replyTo: replyTo && replyTo.postId === postId ? { name: replyTo.userName, id: replyTo.commentId } : undefined,
    }

    setPostsState(prev => prev.map(post => {
      if (post.id !== postId) return post
      
      let updatedCommentList = [...post.commentList]
      
      if (replyTo && replyTo.postId === postId) {
        updatedCommentList = updatedCommentList.map(comment => {
          if (comment.id === replyTo.commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            }
          }
          return comment
        })
      } else {
        updatedCommentList.push(newComment)
      }
      
      return {
        ...post,
        comments: post.comments + 1,
        commentList: updatedCommentList,
      }
    }))

setCommentText("")
  setReplyTo(null)
  setExpandedCommentPostId(null) // 评论完成后收起输入框
  }

  const toggleCommentLike = (postId: number, commentId: number) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies),
          }
        }
        return comment
      })
    }

    setPostsState(prev => prev.map(post => {
      if (post.id !== postId) return post
      return {
        ...post,
        commentList: updateComments(post.commentList),
      }
    }))
  }

  const handleSaveEdit = () => {
    if (!editPost || !editContent.trim()) return
    setPostsState(prev => prev.map(post => 
      post.id === editPost.id ? { ...post, content: editContent } : post
    ))
    setEditPost(null)
    setEditContent("")
  }

  const handleSaveImage = async () => {
    if (!shareCardRef.current) return
    setShareLoading(true)
    
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })
      
      const link = document.createElement("a")
      link.download = `morning-share-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Save image failed:", error)
    } finally {
      setShareLoading(false)
    }
  }

  const togglePostTag = (tagName: string) => {
    setSelectedPostTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  const handlePost = () => {
    if (!newPostContent.trim()) return
    
    // 生成带标签的内容
    const tagsText = selectedPostTags.length > 0 
      ? selectedPostTags.map(t => `#${t}`).join(' ') + '\n\n'
      : ''
    
    const newPost: Post = {
      id: Date.now(),
      user: { name: "我", avatar: "我" },
      time: "刚刚",
      content: tagsText + newPostContent,
      images: postImages,
      likes: 0,
      comments: 0,
      liked: false,
      commentList: [],
      tags: selectedPostTags,
    }
    
    setPostsState((prev) => [newPost, ...prev])
    setPostSuccess(true)
    
    setTimeout(() => {
      setPostSuccess(false)
      setShowPostModal(false)
      setNewPostContent("")
      setSelectedPostTags([])
      setPostImages([])
    }, 1500)
  }

  const handleEditPost = (post: Post) => {
    setEditPost(post)
    setEditContent(post.content)
  }

  const handleDeletePost = (postId: number) => {
    setPostsState(prev => prev.filter(post => post.id !== postId))
  }

  const handleReply = (postId: number, commentId: number, userName: string) => {
    setReplyTo({ postId, commentId, userName })
    commentInputRef.current?.focus()
  }

  // FAB拖拽处理
  const handleFabTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    fabStartPos.current = { ...fabPosition }
  }

  const handleFabTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - dragStartPos.current.x
    const deltaY = e.touches[0].clientY - dragStartPos.current.y
    setFabPosition({
      x: fabStartPos.current.x + deltaX,
      y: fabStartPos.current.y + deltaY,
    })
  }

  const handleFabTouchEnd = () => {
    setIsDragging(false)
  }

  const handleFabMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    fabStartPos.current = { ...fabPosition }
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y
      setFabPosition({
        x: fabStartPos.current.x + deltaX,
        y: fabStartPos.current.y + deltaY,
      })
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const newImages = Array.from(files).slice(0, 9 - postImages.length).map(file => URL.createObjectURL(file))
        setPostImages(prev => [...prev, ...newImages].slice(0, 9))
      }
    }
    input.click()
  }

  const removeImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index))
  }

  // 模拟下拉刷新
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto relative">
      {/* 顶部状态栏 */}
      <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-border">
        <span className="text-base font-medium text-foreground">{t("brand.name")}</span>
      </div>

      {/* Tab导航 */}
      <div className="bg-white px-4">
        <div className="flex gap-6">
          {([
            { key: "recommended", label: t("community.tab.recommended") },
            { key: "circles", label: t("community.tab.circles") },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                if (tab.key === "circles") setSelectedCircle(null)
              }}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 打卡圈Tab内容 */}
      {activeTab === "circles" && (
        <div className="bg-white px-4 py-4">
{/* 热门圈子标签 */}
          <div className="mb-4">
            <h3 className="font-medium text-foreground mb-3">{t("community.hotCircles")}</h3>
            <div className="flex flex-wrap gap-2">
              {allCircles.map((circle, i) => {
                const tagColors = [
                  { bg: "bg-[#F0F7F4]", text: "text-[#5A8A7A]", activeBg: "bg-[#5A8A7A]" },
                  { bg: "bg-[#F5F3F0]", text: "text-[#8B7D6B]", activeBg: "bg-[#8B7D6B]" },
                  { bg: "bg-[#F0F4F7]", text: "text-[#6B8296]", activeBg: "bg-[#6B8296]" },
                  { bg: "bg-[#F7F0F2]", text: "text-[#96747D]", activeBg: "bg-[#96747D]" },
                  { bg: "bg-[#F3F0F7]", text: "text-[#7D7196]", activeBg: "bg-[#7D7196]" },
                  { bg: "bg-[#F0F7F5]", text: "text-[#5A9688]", activeBg: "bg-[#5A9688]" },
                ]
                const color = tagColors[i % tagColors.length]
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCircle(selectedCircle === circle.name ? null : circle.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCircle === circle.name
                        ? `${color.activeBg} text-white shadow-md`
                        : `${color.bg} ${color.text} hover:shadow-sm`
                    }`}
                  >
                    #{circle.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 选中圈子的详情卡片 */}
          {selectedCircle && (
            <div className="mb-4">
              {allCircles.filter(c => c.name === selectedCircle).map((circle, i) => (
                <div key={i} className="bg-[#F8F8F8] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center`}>
                      <span className="text-white text-2xl font-bold">{circle.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-lg">{circle.name}</p>
                      <p className="text-sm text-muted-foreground">{circle.members.toLocaleString()}人已加入</p>
                    </div>
                    <button className="px-5 py-2 bg-primary rounded-full text-sm font-medium text-white">
                      {t("community.join")}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{circle.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 全部圈子列表 */}
          <div>
            <h3 className="font-medium text-foreground mb-3">
              {selectedCircle ? `#${selectedCircle}${t("community.circleFeedSuffix")}` : t("community.allCircles")}
            </h3>
            {!selectedCircle ? (
              <div className="space-y-3">
                {allCircles.map((circle, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCircle(circle.name)}
                    className="w-full flex items-center gap-3 p-3 bg-[#F8F8F8] rounded-xl text-left card-hover"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xl font-bold">{circle.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{circle.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{circle.desc}</p>
                      <p className="text-xs text-muted-foreground mt-1">{circle.members.toLocaleString()}人</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <>
                {postsState.filter(p => p.tags?.includes(selectedCircle!)).length > 0 ? (
                  <div className="space-y-3">
                    {postsState.filter(p => p.tags?.includes(selectedCircle!)).map((post) => (
                      <div key={post.id} className="bg-[#F8F8F8] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#66CDAA] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{post.user.avatar}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{post.user.name}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-line">{post.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm font-medium">{t("community.emptyTitle")}</p>
                    <p className="text-xs mt-1">{t("community.emptyBody")}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

{/* 下拉刷新指示器 */}
      {isRefreshing && (
        <div className="flex items-center justify-center py-4 bg-white mt-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">刷新中...</span>
        </div>
      )}

      {/* 帖子列表 */}
      {activeTab === "recommended" && (
        <div className="flex-1 mt-2 space-y-2">
        {postsState.map((post) => (
          <div key={post.id} className="bg-white px-4 py-4">
            {/* 用户信息 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#66CDAA] flex items-center justify-center">
                  <span className="text-white font-bold">{post.user.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{post.user.name}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setMenuPostId(menuPostId === post.id ? null : post.id)}
                  className="p-1"
                >
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </button>
                
                {/* 下拉菜单 */}
                {menuPostId === post.id && (
                  <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-foreground hover:bg-[#F8F8F8] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      删除
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 内容 */}
            <p className="text-sm text-foreground whitespace-pre-line mb-3">{post.content}</p>

            {/* 图片 - 点击可预览 */}
            {post.images.length > 0 && (
              <div className={`grid gap-1.5 mb-3 ${
                post.images.length === 1 ? "grid-cols-1 max-w-[200px]" :
                post.images.length === 2 ? "grid-cols-2 max-w-[280px]" :
                post.images.length === 4 ? "grid-cols-2 max-w-[280px]" :
                "grid-cols-3 max-w-[320px]"
              }`}>
                {post.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => img.startsWith("blob:") || img.startsWith("http") ? setPreviewImage(img) : null}
                    className="aspect-square bg-[#F8F8F8] rounded-md overflow-hidden cursor-zoom-in"
                  >
                    {img.startsWith("blob:") || img.startsWith("http") ? (
                      <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 互动栏 */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">{post.time}</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5"
                >
                  <Heart
                    className={`w-5 h-5 ${post.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                  />
                  <span className={`text-sm ${post.liked ? "text-red-500" : "text-muted-foreground"}`}>
                    {post.likes}
                  </span>
                </button>
                <button 
                  onClick={() => toggleExpandComments(post.id)}
                  className="flex items-center gap-1.5"
                >
                  <MessageCircle className={`w-5 h-5 ${expandedCommentPostId === post.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm ${expandedCommentPostId === post.id ? "text-primary" : "text-muted-foreground"}`}>{post.comments}</span>
                </button>
                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5"
                >
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">分享</span>
                </button>
              </div>
            </div>

            {/* 卡片内评论区 - 微信风格 */}
            {expandedCommentPostId === post.id && (
              <div className="mt-3 bg-[#F5F5F5] rounded-lg overflow-hidden">
                {/* 评论列表 */}
                {post.commentList.length > 0 && (
                  <div className="p-3 space-y-2">
                    {post.commentList.map((comment) => (
                      <div key={comment.id}>
                        {/* 主评论 */}
                        <div className="flex items-start gap-1">
                          <button 
                            onClick={() => handleReply(post.id, comment.id, comment.user.name)}
                            className="text-xs text-primary font-medium shrink-0"
                          >
                            {comment.user.name}
                          </button>
                          <span className="text-xs text-foreground">：{comment.content}</span>
                          <button 
                            onClick={() => toggleCommentLike(post.id, comment.id)}
                            className="ml-auto shrink-0"
                          >
                            <Heart className={`w-3.5 h-3.5 ${comment.liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          </button>
                        </div>
                        
                        {/* 回复 */}
                        {comment.replies && comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-1 ml-4 mt-1">
                            <button 
                              onClick={() => handleReply(post.id, comment.id, reply.user.name)}
                              className="text-xs text-primary font-medium shrink-0"
                            >
                              {reply.user.name}
                            </button>
                            <span className="text-xs text-muted-foreground shrink-0">回复</span>
                            <span className="text-xs text-primary font-medium shrink-0">@{reply.replyTo?.name}</span>
                            <span className="text-xs text-foreground">：{reply.content}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 输入框 */}
                <div className="p-2 bg-white border-t border-border">
                  {replyTo && replyTo.postId === post.id && (
                    <div className="flex items-center justify-between mb-2 px-2 py-1 bg-primary/10 rounded text-xs">
                      <span className="text-primary">回复 @{replyTo.userName}</span>
                      <button onClick={() => setReplyTo(null)}>
                        <X className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyTo?.postId === post.id || expandedCommentPostId === post.id ? commentText : ""}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={replyTo && replyTo.postId === post.id ? `回复 @${replyTo.userName}` : "写评论..."}
                      className="flex-1 px-3 py-2 bg-[#F5F5F5] rounded-full text-xs outline-none focus:ring-1 focus:ring-primary/30"
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitComment(post.id)}
                    />
                    <button
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={!commentText.trim()}
                      className="px-3 py-2 bg-primary text-white rounded-full text-xs font-medium disabled:opacity-40"
                    >
                      发送
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* 发帖按钮 - 可拖拽 */}
      <button 
        ref={fabRef}
        onClick={() => !isDragging && setShowPostModal(true)}
        onTouchStart={handleFabTouchStart}
        onTouchMove={handleFabTouchMove}
        onTouchEnd={handleFabTouchEnd}
        onMouseDown={handleFabMouseDown}
        style={{
          transform: `translate(${fabPosition.x}px, ${fabPosition.y}px)`,
        }}
        className="fixed right-4 bottom-24 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform touch-none select-none"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* 发帖弹窗 - 微信朋友圈风格 */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-white max-w-md mx-auto flex flex-col animate-in slide-in-from-bottom duration-300">
          {postSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground">发布成功</p>
            </div>
          ) : (
            <>
              {/* 顶部导航栏 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
                <button 
                  onClick={() => {
                    setShowPostModal(false)
                    setPostImages([])
                    setSelectedPostTags([])
                    setNewPostContent("")
                  }} 
                  className="text-muted-foreground text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newPostContent.trim() && postImages.length === 0}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    newPostContent.trim() || postImages.length > 0
                      ? "bg-primary text-white" 
                      : "bg-[#E8E8E8] text-muted-foreground"
                  }`}
                >
                  发表
                </button>
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 overflow-y-auto">
                {/* 用户头像和输入区 */}
                <div className="flex gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#66CDAA] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">我</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="这一刻的想法..."
                      className="w-full min-h-[120px] resize-none outline-none text-foreground text-[15px] leading-relaxed placeholder:text-muted-foreground"
                      autoFocus
                    />
                  </div>
                </div>
                
                {/* 图片预览区 */}
                {postImages.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-3 gap-1.5">
                      {postImages.map((img, i) => (
                        <div key={i} className="relative aspect-square">
                          <img 
                            src={img || "/placeholder.svg"} 
                            alt="" 
                            className="w-full h-full object-cover rounded-md"
                            crossOrigin="anonymous"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {postImages.length < 9 && (
                        <button
                          onClick={handleImageUpload}
                          className="aspect-square bg-[#F5F5F5] rounded-md flex items-center justify-center"
                        >
                          <Plus className="w-8 h-8 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 话题标签选择 */}
                <div className="px-4 py-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2.5">添加话题</p>
                  <div className="flex flex-wrap gap-2">
                    {allCircles.map((circle, i) => (
                      <button
                        key={i}
                        onClick={() => togglePostTag(circle.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedPostTags.includes(circle.name)
                            ? "bg-primary text-white"
                            : "bg-[#F5F5F5] text-foreground hover:bg-[#EBEBEB]"
                        }`}
                      >
                        #{circle.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 底部工具栏 */}
              <div className="border-t border-border bg-white safe-area-inset-bottom">
                <div className="flex items-center gap-6 px-4 py-3">
                  <button 
                    onClick={handleImageUpload}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <div className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm">照片</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 编辑帖子弹窗 */}
      {editPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditPost(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-medium text-foreground">编辑帖子</span>
              <button onClick={() => setEditPost(null)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-32 p-3 bg-[#F8F8F8] rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20"
                placeholder="编辑内容..."
              />
            </div>
            <div className="p-4 pt-0 flex gap-3">
              <button
                onClick={() => setEditPost(null)}
                className="flex-1 py-3 bg-[#F8F8F8] rounded-xl text-sm font-medium text-foreground"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
                className="flex-1 py-3 bg-primary rounded-xl text-sm font-medium text-white disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分享卡片弹窗 */}
      {sharePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSharePost(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setSharePost(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            {/* 分享卡片内容 */}
            <div ref={shareCardRef} className="bg-white">
              {/* 顶部渐变背景 */}
              <div className="bg-gradient-to-br from-primary to-[#66CDAA] px-6 pt-6 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{sharePost.user.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{sharePost.user.name}</p>
                    <p className="text-xs text-white/70">{sharePost.time}</p>
                  </div>
                </div>
              </div>
              
              {/* 内容区域 */}
              <div className="px-6 py-5 -mt-4 bg-white rounded-t-2xl relative">
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line mb-4">
                  {sharePost.content}
                </p>
                
                {/* 互动数据 */}
                <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {sharePost.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> {sharePost.comments}
                  </span>
                </div>
                
                {/* 底部品牌 */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{t("brand.name")}</p>
                      <p className="text-[10px] text-muted-foreground">{t("community.shareTagline")}</p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-[#F8F8F8] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mx-auto">
                        <span className="text-primary text-xs font-bold">扫码</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="p-4 bg-[#F8F8F8] flex gap-3">
              <button
                onClick={handleSaveImage}
                disabled={shareLoading}
                className="flex-1 py-3 bg-primary rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {shareLoading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    保存图片
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全部圈子列表 */}
      {showAllCircles && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center px-4 py-3 border-b border-border">
            <button onClick={() => setShowAllCircles(false)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="flex-1 text-center font-medium text-foreground">全部圈子</span>
            <div className="w-7" />
          </div>
          <div className="p-4 space-y-3 overflow-y-auto" style={{ height: "calc(100vh - 56px)" }}>
            {allCircles.map((circle, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F8F8] rounded-xl">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xl font-bold">{circle.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{circle.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{circle.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{circle.members.toLocaleString()}人已加入</p>
                </div>
                <button className="px-4 py-1.5 bg-primary rounded-full text-xs font-medium text-white flex-shrink-0">
                  加入
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

{/* 图片预览弹窗 */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img 
            src={previewImage || "/placeholder.svg"} 
            alt="" 
            className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-90 duration-200"
            crossOrigin="anonymous"
          />
        </div>
      )}

<div className="pb-20" />
<SharedNav />
</div>
)
}
