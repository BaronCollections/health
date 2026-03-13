"use client"
import { useState } from "react"
import { Users, Search, Edit3, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronRight, X, ImageIcon as ImageIcon } from "lucide-react"
import { SharedNav } from "./shared-nav"

interface Post {
  id: string
  author: { name: string; avatar: string }
  circle: string
  time: string
  content: string
  images: string[]
  likes: number
  comments: number
  liked: boolean
  saved: boolean
}

export function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState("")
  
  const categories = ["全部", "营养打卡圈", "运动打卡圈", "作息打卡圈", "儿童健康圈"]
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: { name: "小柠檬", avatar: "L" },
      circle: "营养打卡圈",
      time: "09:15",
      content: "今天完成营养打卡第7天！搭配了蔬菜沙拉和鸡蛋，维生素满满～",
      images: [],
      likes: 28,
      comments: 5,
      liked: false,
      saved: false,
    },
    {
      id: "2",
      author: { name: "健康达人", avatar: "H" },
      circle: "运动打卡圈",
      time: "08:30",
      content: "早起跑步5公里，感觉一整天都精神满满！坚持运动真的会让人心情变好～",
      images: [],
      likes: 45,
      comments: 12,
      liked: true,
      saved: false,
    },
  ])

  const handleLike = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const handleSave = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, saved: !post.saved }
      }
      return post
    }))
  }

  const handlePost = () => {
    if (!postContent.trim()) return
    const newPost: Post = {
      id: Date.now().toString(),
      author: { name: "我", avatar: "M" },
      circle: "全部可见",
      time: "刚刚",
      content: postContent,
      images: [],
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
    }
    setPosts([newPost, ...posts])
    setPostContent("")
    setShowPostModal(false)
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col max-w-md mx-auto relative pb-20">
      {/* 顶部导航区 */}
      <div className="sticky top-0 z-20 bg-white border-b border-border">
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">健康社区</h1>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索打卡圈/内容"
                className="w-full h-9 pl-9 pr-4 rounded-full bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          
          <button 
            onClick={() => setShowPostModal(true)}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Edit3 className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* 分类导航 */}
        <div className="px-5 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-2 text-base transition-colors relative ${
                  activeCategory === cat 
                    ? "text-primary font-medium" 
                    : "text-foreground"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 社区内容列表 */}
      <div className="flex-1 px-5 py-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-border">
            {/* 头像区 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{post.author.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{post.author.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-primary">{post.circle}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
              </div>
              <button className="p-1">
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* 内容区 */}
            <p className="text-base text-foreground leading-relaxed mb-3">{post.content}</p>

            {/* 互动区 */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5"
              >
                <Heart className={`w-5 h-5 ${post.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${post.liked ? "text-red-500" : "text-muted-foreground"}`}>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={() => handleSave(post.id)}>
                <Bookmark className={`w-5 h-5 ${post.saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 专属打卡圈入口 */}
      <div className="px-5 pb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">专属打卡圈</h3>
            <p className="text-sm text-muted-foreground">加入圈子，和同好一起打卡</p>
          </div>
          <button className="flex items-center gap-1 text-primary text-sm font-medium">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 发圈弹窗 */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <button onClick={() => setShowPostModal(false)}>
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
            <span className="font-semibold text-foreground">发布动态</span>
            <button 
              onClick={handlePost}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                postContent.trim() 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}
            >
              发布
            </button>
          </div>
          
          <div className="flex-1 p-5">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="分享你的打卡动态吧～"
              className="w-full h-32 text-base placeholder:text-muted-foreground resize-none focus:outline-none"
            />
          </div>
          
          <div className="px-5 py-4 border-t border-border flex items-center gap-4">
            <button className="flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-5 h-5" /> 图片
            </button>
            <button className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" /> 全部可见
            </button>
          </div>
        </div>
      )}

      <SharedNav />
    </div>
  )
}
