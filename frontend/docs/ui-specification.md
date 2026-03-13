# AI 健康 App UI 技术规范 v2.0

> 本文档用于 Cursor AI 代码生成参考，请严格遵循以下规范。

---

## 1. 设计理念

### 1.1 核心原则
- **极简主义**: 减少视觉噪音，每个元素必须有存在价值
- **呼吸感**: 充足留白，界面需要透气
- **品牌统一**: Klein Blue (#3366FF) 作为唯一强调色
- **微交互**: 细腻动画和触觉反馈提升体验
- **Apple Health 美学**: 高端简洁，无边框设计

### 1.2 设计语言
- 不使用传统边框，通过阴影和背景色区分层级
- 大量使用圆角，营造柔和亲切感
- 胶囊形状作为核心视觉元素（按钮、药丸、标签）

---

## 2. 色彩系统

### 2.1 主色调
```css
/* 品牌蓝色系 */
--klein-blue: #3366FF;        /* 主品牌色 - 按钮、强调、图标 */
--klein-blue-light: #5588FF;  /* 浅蓝 - 渐变、高光 */
--klein-blue-soft: #6699FF;   /* 柔蓝 - 次要强调 */

/* 背景色系 */
--background: #FAFBFD;        /* 页面背景 - 带微蓝调的白 */
--card: #FFFFFF;              /* 卡片背景 - 纯白 */
--card-gradient-start: #EEF4FF;  /* 卡片渐变起点 */
--card-gradient-end: #E8F0FF;    /* 卡片渐变终点 */

/* 文字色系 */
--text-primary: #2D3748;      /* 主标题 */
--text-secondary: #4A5568;    /* 副标题 */
--text-muted: #94A3B8;        /* 描述/辅助文字 */
--text-placeholder: #CBD5E1;  /* 输入框占位符 */

/* 边框/分隔线 */
--border: #E2E8F0;            /* 轻微边框 */
--divider: #F1F5F9;           /* 分隔线 */
```

### 2.2 胶囊药丸颜色 (双色设计)
```css
/* 每个胶囊上半部分颜色，下半部分统一为 #FFFFFF */
--pill-mint: #6DD5C7;         /* 薄荷绿 */
--pill-coral: #FF8A8A;        /* 珊瑚粉 */
--pill-lemon: #FFD93D;        /* 柠檬黄 */
--pill-matcha: #A8E6CF;       /* 抹茶绿 */
--pill-lavender: #C4B5FD;     /* 薰衣草紫 */
--pill-sky: #6699FF;          /* 天空蓝 */
--pill-sakura: #FFB5BA;       /* 樱花粉 */
--pill-azure: #87CEEB;        /* 浅蓝 */
```

### 2.3 状态色
```css
--success: #10B981;           /* 成功状态 */
--warning: #F59E0B;           /* 警告状态 */
--error: #EF4444;             /* 错误状态 */
--info: #3366FF;              /* 信息提示 */
```

---

## 3. 字体规范

### 3.1 字体栈
```css
font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
```

### 3.2 字号/字重/行高
| 用途 | 类名 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| 大标题 H1 | `text-3xl font-bold` | 30px | 700 | 1.2 |
| 页面标题 H2 | `text-2xl font-bold` | 24px | 700 | 1.3 |
| 卡片标题 H3 | `text-lg font-semibold` | 18px | 600 | 1.4 |
| 正文 | `text-base` | 16px | 400 | 1.5 |
| 小正文 | `text-sm` | 14px | 400 | 1.5 |
| 辅助文字 | `text-xs text-muted-foreground` | 12px | 400 | 1.4 |
| 标签/徽章 | `text-xs font-medium` | 12px | 500 | 1.2 |

### 3.3 使用规则
- 数字使用 `tabular-nums` 类保持等宽对齐
- 重要数据使用 `font-bold` + 品牌色
- 中文标点不使用全角

---

## 4. 间距系统

### 4.1 基础单位: 4px
```
4px  = 0.25rem = p-1
8px  = 0.5rem  = p-2
12px = 0.75rem = p-3
16px = 1rem    = p-4
20px = 1.25rem = p-5
24px = 1.5rem  = p-6
32px = 2rem    = p-8
48px = 3rem    = p-12
```

### 4.2 页面级间距
```css
/* 页面水平边距 */
padding-inline: 24px; /* px-6 */

/* 页面顶部安全区 */
padding-top: 56px; /* pt-14, 适配刘海屏 */

/* 底部导航预留 */
padding-bottom: 112px; /* pb-28 */
```

### 4.3 组件间距
```css
/* 卡片内边距 */
padding: 16px - 24px; /* p-4 至 p-6 */

/* 卡片间隙 */
gap: 12px - 16px; /* gap-3 至 gap-4 */

/* 列表项间隙 */
gap: 8px - 12px; /* gap-2 至 gap-3 */
```

---

## 5. 圆角规范

| 元素 | Tailwind 类 | 像素值 |
|------|-------------|--------|
| 页面级卡片 | `rounded-3xl` | 24px |
| 中型卡片 | `rounded-2xl` | 16px |
| 小型元素 | `rounded-xl` | 12px |
| 按钮/标签 | `rounded-full` | 9999px |
| 输入框 | `rounded-2xl` | 16px |

---

## 6. 阴影系统

### 6.1 阴影层级
```css
/* Level 1: 轻微阴影 - 静态卡片 */
.shadow-card {
  box-shadow: 0 2px 8px rgba(51, 102, 255, 0.05);
}

/* Level 2: 中度阴影 - 悬浮/激活状态 */
.shadow-card-hover {
  box-shadow: 0 8px 24px rgba(51, 102, 255, 0.12);
}

/* Level 3: 重度阴影 - 浮动元素/弹窗 */
.shadow-elevated {
  box-shadow: 0 12px 40px rgba(51, 102, 255, 0.2);
}

/* 底部导航栏阴影 */
.shadow-nav {
  box-shadow: 0 -4px 24px rgba(148, 163, 184, 0.15);
}
```

### 6.2 3D 球形阴影 (卡按钮专用)
```css
.shadow-ball {
  box-shadow: 
    0 8px 30px rgba(51, 102, 255, 0.45),
    0 4px 12px rgba(51, 102, 255, 0.3),
    inset 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.shadow-ball-active {
  box-shadow: 
    0 10px 35px rgba(51, 102, 255, 0.55),
    0 5px 18px rgba(51, 102, 255, 0.4),
    inset 0 -6px 15px rgba(0, 0, 0, 0.2);
}
```

---

## 7. 核心组件规范

### 7.1 底部导航栏 (SharedNav)

**结构:**
```
┌─────────────────────────────────────┐
│  [问] [区]      (卡球)        [画]  │
└─────────────────────────────────────┘
```

**样式参数:**
```tsx
// 容器
className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto"

// 导航条
className="bg-white rounded-full shadow-lg"
style={{
  height: "64px",
  margin: "0 24px 16px",
  padding: "0 24px"
}}

// 导航项
<div className="flex flex-col items-center gap-0.5">
  <div className="p-2 rounded-xl transition-colors">
    <Icon className="w-5 h-5" strokeWidth={1.5} />
  </div>
  <span className="text-xs font-medium">标签</span>
</div>

// 激活状态
className="bg-[#3366ff]/10 text-[#3366ff]"

// 未激活状态
className="text-slate-400"
```

### 7.2 卡按钮 (中央打卡球)

**样式参数:**
```tsx
// 尺寸
width: 64px;
height: 64px;
border-radius: 50%;

// 3D 球形渐变
background: radial-gradient(
  circle at 35% 30%,
  #6699ff 0%,
  #3366FF 45%,
  #2255dd 100%
);

// 高光层
<div 
  className="absolute top-1.5 left-3 w-6 h-4 rounded-full"
  style={{
    background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
    filter: "blur(1px)"
  }}
/>

// 悬浮动画
animation: float 3s ease-in-out infinite;
```

**交互逻辑:**
```tsx
// 单击: 无操作 (仅首页有效)
// 长按 5 秒:
//   1. 触发震动反馈
//   2. 每 500ms 发射一个胶囊
//   3. 中央圆圈填充进度从 0% → 100%
//   4. 完成后显示成功弹窗 + 积分
```

### 7.3 呼吸圆圈 (中央主视觉)

**结构 (由外到内):**
```tsx
// Layer 1: 最外层边框环
<div className="absolute w-72 h-72 rounded-full border border-[#3366ff]/8" />

// Layer 2: 脉冲光晕
<div 
  className="absolute w-64 h-64 rounded-full animate-pulse-glow"
  style={{
    background: "radial-gradient(circle, rgba(51,102,255,0.06) 0%, transparent 70%)"
  }}
/>

// Layer 3: 渐变环
<div 
  className="absolute w-56 h-56 rounded-full"
  style={{
    background: "radial-gradient(circle, rgba(51,102,255,0.1) 0%, transparent 80%)"
  }}
/>

// Layer 4: 内层渐变
<div 
  className="absolute w-48 h-48 rounded-full"
  style={{
    background: "linear-gradient(180deg, rgba(51,102,255,0.12) 0%, rgba(51,102,255,0.06) 100%)"
  }}
/>

// Layer 5: 核心圆 (144px)
<div 
  className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center"
  style={{
    background: "linear-gradient(145deg, #5588ff 0%, #3366ff 50%, #2255ee 100%)",
    boxShadow: "0 4px 20px rgba(51, 102, 255, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.2)"
  }}
>
  <Pill className="w-8 h-8 text-white" />
  <span className="text-base font-semibold text-white">每日</span>
  <span className="text-xs text-white/85">营养摄入</span>
</div>
```

### 7.4 数据卡片

**样式参数:**
```tsx
<button 
  className="flex-1 max-w-[140px] bg-gradient-to-br from-[#eef4ff] to-[#e8f0ff] rounded-2xl p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3366ff]/10 active:translate-y-0 border border-[#3366ff]/5"
>
  <p className="text-xs text-[#3366ff]/70 font-medium">标签</p>
  <p className="text-3xl font-bold text-[#3366ff] mt-1">数值</p>
  <p className="text-xs text-[#3366ff]/50 mt-0.5">单位</p>
</button>
```

### 7.5 胶囊药丸

**SVG 结构:**
```tsx
<div className="relative w-3 h-7 overflow-hidden rounded-full"
  style={{ boxShadow: `0 4px 12px ${color}40` }}
>
  {/* 上半部分 - 彩色 */}
  <div 
    className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
    style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}ee 100%)` }}
  />
  
  {/* 下半部分 - 白色 */}
  <div 
    className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-full"
    style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}
  />
  
  {/* 高光 */}
  <div 
    className="absolute top-0.5 left-0.5 w-1 h-2 rounded-full opacity-70"
    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, transparent 100%)" }}
  />
</div>
```

### 7.6 页面头部 (SharedHeader)

**结构:**
```tsx
<header className="px-6 pt-14 pb-4">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-[#3366ff] text-sm font-medium">{subtitle}</p>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </div>
    <div className="flex items-center gap-3">
      {rightContent}
      <Link href="/pricing" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-5 h-5 text-gray-600" />
      </Link>
    </div>
  </div>
</header>
```

### 7.7 快捷选项芯片

**样式:**
```tsx
<button className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
  isActive 
    ? "bg-[#3366ff] text-white shadow-lg shadow-[#3366ff]/30"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
}`}>
  <Icon className="w-4 h-4" />
  <span className="text-sm font-medium">{label}</span>
</button>
```

---

## 8. 动画规范

### 8.1 基础过渡
```css
/* 快速交互 (按钮点击) */
transition: all 0.15s ease;

/* 标准过渡 (状态变化) */
transition: all 0.2s ease;

/* 平滑过渡 (页面元素) */
transition: all 0.3s ease;
```

### 8.2 关键帧动画

**悬浮漂浮 (float)**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
animation: float 3s ease-in-out infinite;
```

**脉冲呼吸 (pulse-glow)**
```css
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
    box-shadow: 0 0 0 0 rgba(51, 102, 255, 0.4);
  }
  50% {
    transform: scale(1.08);
    opacity: 0.15;
    box-shadow: 0 0 40px 20px rgba(51, 102, 255, 0.2);
  }
}
animation: pulse-glow 2.5s ease-in-out infinite;
```

**胶囊飞行 (pill-fly-up)**
```css
@keyframes pill-fly-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  70% {
    opacity: 1;
    transform: translateY(var(--fly-distance, -400px)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(var(--fly-distance, -400px)) scale(0.5);
  }
}
animation: pill-fly-up 2s ease-out forwards;
```

**进入动画 (配合 tailwindcss-animate)**
```tsx
className="animate-in zoom-in-95 duration-300"
className="animate-in slide-in-from-bottom-4 duration-500"
className="animate-in fade-in duration-200"
```

---

## 9. 交互规范

### 9.1 触觉反馈 (Haptic)
```typescript
const triggerHaptic = (type: "light" | "medium" | "heavy" | "success") => {
  if ("vibrate" in navigator) {
    switch (type) {
      case "light": navigator.vibrate(10); break;
      case "medium": navigator.vibrate(20); break;
      case "heavy": navigator.vibrate(30); break;
      case "success": navigator.vibrate([30, 50, 30, 50, 50]); break;
    }
  }
};
```

### 9.2 按钮状态
```css
/* 默认 */
transform: scale(1);

/* 悬浮 */
transform: scale(1.02) translateY(-2px);
box-shadow: 增强;

/* 按下 */
transform: scale(0.95);

/* 禁用 */
opacity: 0.5;
cursor: not-allowed;
```

### 9.3 长按打卡流程
```
1. 用户长按卡按钮
   ↓ 触发 medium 震动
2. 每 500ms 发射一个胶囊 (随机颜色)
   ↓ 每次发射触发 light 震动
3. 胶囊飞向中央呼吸圆圈
4. 圆圈内部填充进度从 0% → 100% (5秒)
5. 5秒后:
   ↓ 触发 success 震动
   ↓ 显示成功弹窗
   ↓ 显示获得积分 (+10~50)
6. 3秒后弹窗自动消失
```

---

## 10. 页面结构

### 10.1 首页 (/)
```
┌─────────────────────────────────────┐
│ 早上好                    [头像]    │
│ 你好, Baron                         │
├─────────────────────────────────────┤
│     [累计打卡 42天]  [今日打卡]      │
├─────────────────────────────────────┤
│                                     │
│         ╭─────────────╮            │
│        ╱  ○ 呼吸光晕   ╲           │
│       │   ┌───────┐    │           │
│       │   │  💊   │    │           │
│       │   │ 每日  │    │           │
│       │   │营养摄入│    │           │
│       │   └───────┘    │           │
│        ╲              ╱            │
│         ╰─────────────╯            │
│                                     │
├─────────────────────────────────────┤
│  [问] [区]    ◉卡     [画]          │
└─────────────────────────────────────┘
```

### 10.2 对话页 (/chat)
```
┌─────────────────────────────────────┐
│ ← [返回]   AI 健康助手    [头像]    │
├───────────────────────────────────┤
│                                     │
│                    用户消息 (右对齐) │
│ AI消息 (左对齐，灰色卡片带蓝色左边框)│
│                                     │
│ ┌─ 动态思考卡片 ─────────────┐      │
│ │ 🧠 正在分析中...           │      │
│ │ ████████░░░░░ 进度条       │      │
│ └────────────────────────────┘      │
│                                     │
├─────────────────────────────────────┤
│ [失眠] [焦虑] [疲劳] [心悸] [补充剂] │
│ ┌────────────────────────┐  [发送] │
│ │ 输入你的健康问题...      │        │
│ └────────────────────────┘         │
├─────────────────────────────────────┤
│  [问] [区]    ◉卡     [画]          │
└─────────────────────────────────────┘
```

### 10.3 社区页 (/community)
```
┌─────────────────────────────────────┐
│ 今日V了么          [🏆] [42,891人]  │
│ 此刻我们一起                [头像]  │
├─────────────────────────────────────┤
│ # 热门状态                          │
│ [#深夜模式] [#健身中] [#深度工作]→  │
├─────────────────────────────────────┤
│ ✨ 动态广场                         │
│ ┌────────────────────────────────┐ │
│ │ [头像] 小林        3分钟前  ··· │ │
│ │ 今天完成了5公里晨跑...          │ │
│ │ [#健身中] [#早起]               │ │
│ │ ♡ 128   💬 23                   │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ ...更多动态卡片...              │ │
│ └────────────────────────────────┘ │
├─────────────────────────────────────┤
│  [问] [区]    ◉卡     [画]          │
└─────────────────────────────────────┘
```

### 10.4 画像页 (/report)
```
┌─────────────────────────────────────┐
│ ← [返回]    健康报告       [头像]   │
├─────────────────────────────────────┤
│  Bento Grid:                        │
│  ┌──────────────────────────────┐  │
│  │      📊 雷达图 (综合健康指数)  │  │
│  └──────────────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ ⚠️ 缺乏提醒  │ │ 📈 趋势     │   │
│  │ B12 偏低    │ │ +12%       │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ 🌙 7.5h    │ │ ❤️ 68       │   │
│  │ 平均睡眠    │ │ 静息心率    │   │
│  └─────────────┘ └─────────────┘   │
│  ┌──────────────────────────────┐  │
│  │ 🧠 AI 健康洞察                 │  │
│  │ "今夜，你的身体正在悄然修复..."│  │
│  └──────────────────────────────┘  │
├─────────────────────────────────────┤
│  [问] [区]    ◉卡     [画]          │
└─────────────────────────────────────┘
```

### 10.5 我的页 (/pricing)
```
┌─────────────────────────────────────┐
│ ← [返回]                   [头像]   │
│ 我的                                │
│ 选择适合你的计划                     │
├─────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ 周卡                     ¥18/周 │ │
│ │ ✓ AI 健康分析                   │ │
│ │ ✓ 每日营养追踪                  │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ 月卡                     ¥58/月 │ │
│ │ ✓ 所有周卡权益                  │ │
│ │ ✓ 个性化建议                    │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ 👑 社区挚爱                     │ │
│ │ 年卡                    ¥398/年 │ │
│ │ ✓ 所有月卡权益                  │ │
│ │ ✓ 专属 Klein Blue 药盒         │ │
│ └────────────────────────────────┘ │
├─────────────────────────────────────┤
│        [ 立即订阅 ]                 │
└─────────────────────────────────────┘
```

---

## 11. 图标规范

### 11.1 图标库
使用 `lucide-react`，统一样式:
```tsx
<Icon className="w-5 h-5" strokeWidth={1.5} />
```

### 11.2 常用图标映射
| 功能 | 图标 | 导入 |
|------|------|------|
| 返回 | ChevronLeft / ArrowLeft | `lucide-react` |
| 用户/头像 | User | `lucide-react` |
| 消息/聊天 | MessageSquare / MessageCircle | `lucide-react` |
| 社区 | Users | `lucide-react` |
| 画像/报告 | Sparkles | `lucide-react` |
| 药丸 | Pill | `lucide-react` |
| 大脑/AI | Brain | `lucide-react` |
| 心形 | Heart | `lucide-react` |
| 发送 | Send | `lucide-react` |
| 睡眠 | Moon | `lucide-react` |
| 能量 | Zap | `lucide-react` |
| 成功 | Check | `lucide-react` |
| 警告 | AlertTriangle | `lucide-react` |
| 奖杯 | Trophy | `lucide-react` |
| 分享 | Share2 | `lucide-react` |

---

## 12. 响应式设计

### 12.1 断点
| 断点 | 宽度 | 应用场景 |
|------|------|----------|
| 默认 | < 640px | 移动端优先设计 |
| sm | ≥ 640px | 大屏手机 |
| md | ≥ 768px | 平板 |

### 12.2 最大宽度
```tsx
className="max-w-md mx-auto" // 最大 448px，居中显示
```

---

## 13. 无障碍规范

- 所有可点击元素使用 `<button>` 或 `<Link>`
- 图标按钮必须有 `aria-label`
- 颜色对比度 ≥ 4.5:1
- 支持 `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

---

## 14. 代码生成检查清单

创建新页面时，确保包含:

- [ ] `"use client"` 指令 (如有客户端交互)
- [ ] 导入 `SharedNav` 组件
- [ ] 导入 `SharedHeader` 组件 (如需要)
- [ ] 设置 `max-w-md mx-auto` 容器
- [ ] 设置 `pb-28` 底部留白
- [ ] 使用 Klein Blue `#3366FF` 作为强调色
- [ ] 使用 `rounded-2xl` 或 `rounded-3xl` 圆角
- [ ] 添加合适的阴影层级
- [ ] 添加过渡动画 `transition-all duration-200`
- [ ] 图标使用 `strokeWidth={1.5}`

---

## 15. CSS 变量完整清单

```css
:root {
  /* 品牌色 */
  --klein-blue: #3366ff;
  --klein-blue-light: #5588ff;
  --klein-blue-soft: #6699ff;
  
  /* 背景 */
  --background: #fafbfd;
  --card: #ffffff;
  
  /* 文字 */
  --foreground: #2d3748;
  --muted-foreground: #94a3b8;
  
  /* 边框 */
  --border: #e2e8f0;
  
  /* 圆角 */
  --radius: 1rem;
}
```

---

> 文档版本: 2.0
> 最后更新: 2026-01-16
> 适用于: Cursor AI 代码生成
