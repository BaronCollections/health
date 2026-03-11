# MintBit 薄荷比特 - 全量开发任务清单

> 状态说明：`[ ]` 待开发 | `[x]` 已完成 | `[?]` 需要你确认/决定 | `[!]` 阻塞中
>
> 每完成一项打勾，需要你决策的地方标注了 `[?]` 请直接回复选项编号或描述

---

## 0. 项目基础设施

### 0.1 项目骨架
- [x] Git 仓库初始化 (github.com/BaronCollections/health)
- [x] 目录结构搭建 (frontend/backend/poster-service/nginx/sql/scripts)
- [x] docker-compose.yml 编写 (9个服务)
- [x] .env.example 环境变量模板
- [x] .gitignore 配置
- [x] Nginx 反向代理配置
- [x] 一键部署脚本 scripts/deploy.sh
- [x] README.md

### 0.2 后端基础 (Spring Boot)
- [x] pom.xml 依赖配置
- [x] application.yml 配置
- [x] 启动类 HealthApplication.java
- [x] SecurityConfig (Spring Security + JWT)
- [x] CorsConfig
- [x] MinioConfig
- [x] MyBatisPlusConfig (分页 + 自动填充)
- [x] RabbitMQConfig (3个队列: ocr/poster/audit)
- [x] Result 统一返回封装

### 0.3 前端基础 (Next.js)
- [x] package.json 依赖
- [x] TypeScript 配置
- [x] Tailwind 主题 (Life Green #6DB578 色盘)
- [x] 全局样式 (玻璃拟态 glass/glass-card)
- [x] Layout 根布局
- [x] API 请求封装 (Axios + JWT 拦截器)
- [x] cn() 工具函数
- [x] Zustand auth store
- [x] 首页骨架 (Hero + 3特性卡片)

### 0.4 数据库
- [x] init.sql 建表脚本 (11张表 + 索引)

### 0.5 待补充基础设施
- [ ] 后端全局异常处理器 (GlobalExceptionHandler)
- [ ] 后端日志配置 (logback-spring.xml)
- [ ] JWT Token 工具类 (JwtUtil: 生成/验证/刷新)
- [ ] JWT 过滤器 (JwtAuthenticationFilter)
- [ ] MinIO 工具类 (MinioUtil: 上传/下载/预签名URL)
- [ ] Redis 工具类 (RedisUtil)
- [ ] 分页请求/响应 DTO (PageRequest, PageResult)
- [ ] 审计日志 AOP 切面 (AuditLogAspect)
- [ ] 前端 Dockerfile 中 npm ci 需要 package-lock.json → 需先执行 npm install 生成
- [ ] poster-service 的 package-lock.json 同上

### [?] 决策点 0-A：短信验证码服务选择
> 手机号登录需要短信服务，你打算用哪个？
> 1. 阿里云短信 (国内最常用)
> 2. 腾讯云短信
> 3. 开发阶段先用固定验证码 (如 123456)，上线再接
> 4. 其他 (请说明)

### [?] 决策点 0-B：AI API 选择
> 文档中提到 AI 用于问卷对话、文案生成、内容审核等，你打算用：
> 1. Claude API (Anthropic) — 当前 application.yml 默认配置
> 2. OpenAI GPT-4
> 3. 国内模型 (通义千问/文心一言/Moonshot)
> 4. 多模型混合 (核心用 Claude，审核用便宜模型)

---

## 1. 用户系统模块

### 1.1 后端 - 用户认证
- [ ] UserMapper + UserMapper.xml
- [ ] UserService (注册/登录/查询)
- [ ] AuthController 实现
  - [ ] POST /api/auth/sms/send — 发送短信验证码
  - [ ] POST /api/auth/login/phone — 手机号验证码登录(不存在自动注册)
  - [ ] POST /api/auth/refresh — 刷新Token
  - [ ] POST /api/auth/logout — 退出登录(Token加黑名单)
- [ ] 短信验证码存 Redis (5分钟过期, 60秒内不可重发)
- [ ] 登录频率限制 (同一手机号每分钟最多5次)

### 1.2 后端 - 用户信息
- [ ] UserProfileMapper + XML
- [ ] UserController
  - [ ] GET /api/user/profile — 获取个人信息
  - [ ] PUT /api/user/profile — 更新个人信息 (nickname/avatar/gender/birthDate)
  - [ ] PUT /api/user/avatar — 上传头像 (MinIO user-avatars桶)
  - [ ] DELETE /api/user/account — 注销账号 (触发180天软删除)
- [ ] 注销逻辑: 前端1h内消失, 后端180天冷存储, 期满物理擦除

### 1.3 前端 - 登录/注册
- [ ] /login 页面
  - [ ] 手机号输入 + 验证码输入
  - [ ] 发送验证码按钮 (60秒倒计时)
  - [ ] 登录按钮 (调用 API, 存 token)
  - [ ] 隐私政策同意勾选
- [ ] 登录态路由守卫 (middleware.ts)
- [ ] Header 组件 (登录状态显示头像/昵称, 未登录显示登录按钮)

### 1.4 前端 - 个人中心
- [ ] /profile 页面
  - [ ] 用户信息卡片 (头像/昵称/年龄/性别)
  - [ ] 健康评分摘要
  - [ ] 打卡天数统计
  - [ ] 勋章展示区
  - [ ] 历史评估入口
  - [ ] 画报存档入口
  - [ ] 体检报告管理
  - [ ] 设置 & 注销入口

---

## 2. AI 问卷评估模块 (核心)

### 2.1 后端 - 问卷模板
- [ ] QuestionTemplate 实体类
- [ ] 问卷题库 JSON 配置文件 (4套年龄段模板)
  - [ ] 青少年模板 (12-18岁, 8题)
  - [ ] 青年模板 (25-35岁, 12题)
  - [ ] 中年模板 (35-50岁, 12题)
  - [ ] 中老年模板 (50岁+, 10题)
- [ ] 题目分类: basic_info / diet / lifestyle / health_goal / health_condition
- [ ] 条件分支规则 (如: 选"备孕" → 追加叶酸/铁相关题)

### 2.2 后端 - 评估会话
- [ ] AssessmentMapper + XML
- [ ] AssessmentService
  - [ ] createAssessment() — 创建评估, 根据年龄段匹配模板, 返回第一题
  - [ ] submitAnswer() — 提交当前题答案, AI 分析后返回下一题 (含动态分支)
  - [ ] resumeAssessment() — 恢复未完成评估 (查最近 in_progress 记录)
  - [ ] completeAssessment() — 完成评估, 触发推荐引擎
- [ ] AssessmentController 实现
  - [ ] POST /api/assessment/create
  - [ ] POST /api/assessment/{id}/answer
  - [ ] GET /api/assessment/resume
  - [ ] GET /api/assessment/{id} — 获取评估详情
  - [ ] GET /api/assessment/history — 历史评估列表
- [ ] 答案暂存 Redis (每3题同步一次到DB)
- [ ] 评估超时处理 (24h未完成标记 expired)

### 2.3 后端 - AI 对话集成
- [ ] AiService (封装 LLM API 调用)
  - [ ] chat() — 通用对话
  - [ ] generateNextQuestion() — 根据上下文生成下一个问题
  - [ ] reverseQuestion() — "反向提问"环节: 用户问AI健康问题
  - [ ] generateInsight() — 生成个性化解读
- [ ] Prompt 模板管理
  - [ ] 问卷对话 system prompt
  - [ ] 反向提问 system prompt
  - [ ] 文案生成 system prompt
- [ ] AI 调用重试 + 降级策略
- [ ] Token 用量监控

### 2.4 前端 - 问卷页面
- [ ] /questionnaire 页面
  - [ ] 年龄段选择入口 (4个卡片)
  - [ ] AI 聊天式问答 UI
    - [ ] DiagnosticChatBubble 组件 (AI消息 + 打字动效)
    - [ ] OptionCard 组件 (选项卡片, hover scale 1.02)
    - [ ] 文本输入型题目支持
    - [ ] 进度条 (生命绿, 当前题/总题数)
  - [ ] 消息出现动效 (slide-up + fade, 200ms, ease-out-cubic)
  - [ ] 断点续答恢复弹窗 ("欢迎回来，我们继续聊聊你的饮食习惯")
  - [ ] 体检报告上传区域 (在问卷流程中可选步骤)
- [ ] /questionnaire/reverse 反向提问页
  - [ ] 用户自由提问输入框
  - [ ] AI 基于已收集数据回答健康问题
  - [ ] 最多3个问题限制

### [?] 决策点 2-A：问卷题库内容
> 文档中定义了4套年龄段模板，题库 JSON 需要我根据文档内容整理出来吗？
> 1. 是，根据产品文档整理完整题库
> 2. 你自己有整理好的题库数据，稍后提供给我
> 3. 先用少量示例题目跑通流程，后续补充

---

## 3. 体检报告 OCR 模块

### 3.1 后端 - 文件上传
- [ ] HealthReportMapper + XML
- [ ] HealthReportService
  - [ ] upload() — 上传到 MinIO health-reports 桶 (AES-256加密)
  - [ ] generateSignedUrl() — 生成临时访问URL (15分钟有效)
  - [ ] delete() — 软删除
- [ ] HealthReportController
  - [ ] POST /api/assessment/{id}/report/upload
  - [ ] GET /api/assessment/{id}/report/result
  - [ ] GET /api/report/{id}/preview — 预签名URL预览原件

### 3.2 后端 - OCR 解析流水线
- [ ] OcrService (调用 PaddleOCR 服务)
  - [ ] parseReport() — 发送图片到 OCR 服务, 获取原始文本
- [ ] OcrProcessingPipeline (5步闭环)
  - [ ] Step 1: 视觉提取 — 调用 PaddleOCR API
  - [ ] Step 2: 语义结构化 (NER) — 识别【指标名】【数值】【单位】【参考范围】
  - [ ] Step 3: 归一化对齐 — 指标变体映射到标准代码 (如 VitD3 → NUT_D_001)
  - [ ] Step 4: 风险判别 — 对比参考范围判定 Low/Normal/High
  - [ ] Step 5: 权重注入 — 体检数据权重 > 问卷自述
- [ ] 单位纠偏算法 (ng/mL ↔ nmol/L 换算矩阵)
- [ ] 指标别名映射表 (nutrient_aliases)
- [ ] OCR 异步处理 (RabbitMQ ocr队列)
  - [ ] OcrMessageProducer — 上传完成后发送消息
  - [ ] OcrMessageConsumer — 消费消息执行解析

### 3.3 后端 - 人机协同校验
- [ ] OcrVerificationService
  - [ ] detectConflicts() — 检测数值与单位不匹配
  - [ ] getVerificationQuestions() — 生成校验问题 (AI口吻)
  - [ ] applyAutoCorrection() — AI Auto-Pilot 模式自动修正
  - [ ] markAiCorrected() — 标记 [Ai] 修正标识

### 3.4 前端 - 体检报告交互
- [ ] OCRUploadZone 组件
  - [ ] 拖拽上传 + 点击上传
  - [ ] 支持 JPG/PNG/PDF
  - [ ] 上传进度条
  - [ ] 解析状态 (上传中 → 识别中 → 解析中 → 完成)
- [ ] OCR 结果确认页
  - [ ] 双屏对比 UI (左:原始报告局部高清图, 右:AI引导提问)
  - [ ] 指标列表 (指标名/数值/单位/状态标签 Low/Normal/High)
  - [ ] [Ai] 标识 (点击查看修正逻辑)
  - [ ] "授权AI自动修正" 开关

### [?] 决策点 3-A：PaddleOCR 部署方式
> PaddleOCR Docker 镜像较大 (~5GB+), 在服务器资源有限时可能有压力：
> 1. 直接用 Docker 部署 PaddleOCR (当前方案)
> 2. 用阿里云/百度云 OCR API (按量付费, 无需自部署)
> 3. 先用云 API 开发, 后续切换自部署
> 4. 初期不做 OCR, 手动输入体检数据

---

## 4. 智能推荐引擎模块 (核心)

### 4.1 后端 - 营养素知识库
- [ ] NutrientMapper + XML
- [ ] NutrientService
  - [ ] 知识库 CRUD
  - [ ] search() — 按名称/别名/分类搜索
  - [ ] getInteractions() — 获取营养素间交互关系
  - [ ] getDrugConflicts() — 获取药物禁忌
- [ ] NutrientController
  - [ ] GET /api/nutrient/list
  - [ ] GET /api/nutrient/{code}
  - [ ] GET /api/nutrient/interactions
  - [ ] GET /api/nutrient/drug-conflicts?medication=xxx
- [ ] 营养素种子数据 (seed_nutrients.sql)
  - [ ] 维生素D3 (NUT_D_001)
  - [ ] 钙 (NUT_CA_001)
  - [ ] 铁 (NUT_FE_001)
  - [ ] 维生素B12 (NUT_B12_001)
  - [ ] Omega-3 (NUT_O3_001)
  - [ ] 锌 (NUT_ZN_001)
  - [ ] B族复合 (NUT_BCOM_001)
  - [ ] 维生素C (NUT_C_001)
  - [ ] 叶酸 (NUT_FA_001)
  - [ ] 镁 (NUT_MG_001)
  - [ ] (更多根据文档补充)

### 4.2 后端 - 健康指标关联矩阵
- [ ] NutrientHealthMatrix (营养素 ↔ 健康指标 关联)
  - [ ] 数据结构: nutrient_code → [health_tags] → weight
  - [ ] 如: NUT_D_001 → [骨骼健康:0.9, 免疫力:0.7, 情绪:0.5]
- [ ] 年龄段权重调整矩阵
  - [ ] 青少年: 骨骼发育↑, 学习专注↑
  - [ ] 青年: 精力↑, 美容↑, 备孕↑
  - [ ] 中年: 心血管↑, 抗氧化↑
  - [ ] 中老年: 骨质↑, 关节↑, 认知↑

### 4.3 后端 - 推荐算法核心
- [ ] RecommendationEngine (engine/knowledge/)
  - [ ] ScoreCalculator — 评分计算器
    ```
    Base Score = 50
    IF 25-OH-D < 20: Score += 40
    IF "从不晒太阳": Score += 10
    IF age > 50: Score += 5
    IF Score > 80: ★★★★★
    IF 60 < Score ≤ 80: ★★★★☆
    ```
  - [ ] DosageCalculator (engine/dosage/) — 动态剂量计算
    - [ ] 三档剂量: 维持档 / 纠偏档 / 冲击档
    - [ ] AI 微调公式: 推荐量 = 基础值 × 缺口分 × 置信度系数(α) × 饮食系数
  - [ ] ConflictDetector (engine/conflict/) — 全局剂量冲突检查
    - [ ] SKU 原子化成分建模 (拆解为原子成分 JSON)
    - [ ] 碰撞检测: Safe(<0.8×UL) / Caution(0.8~1.0×UL) / Blocking(≥UL)
    - [ ] 智能冲突解决 (优先级矩阵)
      - [ ] 功能目标优先
      - [ ] 复合片保留原则
      - [ ] 药物熔断机制 (Kill-Switch: 如华法林→维K置零)
  - [ ] DataConfidenceCalculator — 数据置信度计算
    - [ ] 体检数据: 0-6月 α=1.0, 6-12月 α=0.5, >12月 α=0
    - [ ] 问卷数据基础权重

### 4.4 后端 - 推荐方案生成
- [ ] RecommendationService
  - [ ] generate() — 综合评估数据 + 知识图谱 + AI分析, 生成完整方案
  - [ ] adjustRecommendation() — 用户手动调整后重算安全检查
  - [ ] calculateSafety() — 剂量安全实时检查 API (<100ms响应)
- [ ] RecommendationController 实现
  - [ ] POST /api/recommendation/generate/{assessmentId}
  - [ ] GET /api/recommendation/{id}
  - [ ] POST /api/recommendation/safety-check
  - [ ] GET /api/recommendation/history

### 4.5 后端 - AI 深度解读
- [ ] AiInsightService
  - [ ] generateDeepAnalysis() — AI 生成个性化深度解读
  - [ ] generateWhyRecommend() — "为什么推荐这个" 解释
  - [ ] generateEmotionalCopy() — 情感化文案 (焦虑管理三段式)
    - [ ] 第一段: 现状钩子 ("你的精力电池仅剩30%")
    - [ ] 第二段: 行动方案 ("坚持30天，精力维度预计提升45%")
    - [ ] 第三段: 科学定调 (参考文献/数据来源)

---

## 5. 营养画报模块

### 5.1 后端 - 画报数据生成
- [ ] PosterDataService
  - [ ] generatePosterData() — 组装画报 JSON
    ```json
    {
      "summary": { "score", "grade", "aiTagline" },
      "radarData": { "immune", "energy", "bone", ... },
      "medicalLinks": [...],
      "recommendationPack": [...],
      "timingSchedule": { "morning", "noon", "evening" },
      "aiDeepAnalysis": "..."
    }
    ```
  - [ ] generateSharePoster() — 调用 poster-service 渲染高清图
- [ ] PosterController 实现
  - [ ] POST /api/poster/generate/{recommendationId}
  - [ ] GET /api/poster/data/{recommendationId}
  - [ ] GET /api/poster/download/{recommendationId}?format=png|pdf
- [ ] 画报异步生成 (RabbitMQ poster队列)
  - [ ] PosterMessageProducer
  - [ ] PosterMessageConsumer — 调用 poster-service 渲染后存 MinIO

### 5.2 Poster Service 完善
- [ ] HTML 画报模板开发
  - [ ] 朋友圈模板 (9:16 竖版)
  - [ ] 小红书模板 (4:5)
  - [ ] PDF A4 报告模板
- [ ] RPP 响应式排版协议 (JSON 驱动弹性排版)
- [ ] 隐形数字水印 (用户ID缩写)
- [ ] 中文字体支持 (思源黑体/阿里巴巴普惠体)

### 5.3 前端 - 推荐方案展示页
- [ ] /recommendation/[id] 页面
  - [ ] AI 洞察看板头部 (玻璃拟态卡片, 淡绿渐变背景)
    - [ ] 主标题: AI 核心结论
    - [ ] 子标题: 数据新鲜度
    - [ ] 背景缓慢流动"生命粒子"动效
  - [ ] 双轨制建议卡片 (科学最优轨 / 用户偏好轨 Toggle)
  - [ ] NutrientCard 组件 (7维可视化标识)
    - [ ] 安全等级 (🟢🟡🟠)
    - [ ] 星级评分 (★★★★★)
    - [ ] 服用时间 (🌅🌞🌙)
    - [ ] 适用人群标签
    - [ ] 警告标识 (⚠️)
    - [ ] 科学依据 (📊)
    - [ ] 用户采纳率 (👥%)
  - [ ] 剂量安全透明舱 (Safety Stacking Bar)
    - [ ] 分段进度条 (深绿:复合片, 浅绿:单项补剂)
    - [ ] UL 红色虚线警戒线
    - [ ] Tooltip 显示计算公式
    - [ ] 超标时"撞击抖动"动效
    - [ ] AI 气泡解释 ("已为你取消单项铁剂，避免120%过载")
  - [ ] 服用时间线 (morning/noon/evening 分组)
  - [ ] 免责声明 (强制展示)

### 5.4 前端 - 营养画报页
- [ ] /poster/[id] 页面
  - [ ] 双层粒子雷达图 (Canvas/WebGL)
    - [ ] 内层灰色: 现状 (粒子稀疏/静态)
    - [ ] 外层绿色: 目标 (高亮粒子/呼吸感扩散)
    - [ ] 粒子密度 = f(得分)
    - [ ] 陀螺仪感应 (晃动手机粒子物理位移) — PC端鼠标跟随
  - [ ] 健康评分数字 (Inter SemiBold, 0→目标分滚动动效)
  - [ ] 改善预告卡片 (点击翻转Flip, 背面显示论文摘要链接)
  - [ ] AI 深度解读区 (可展开/收起)
  - [ ] 证据链 (12px淡灰, 医学文献引用)
  - [ ] 底部动作栏
    - [ ] [生成分享图] → 选择模板弹窗 (朋友圈/小红书)
    - [ ] [下载PDF报告] → "文件封装中"动画
    - [ ] [分享到社区]
  - [ ] 共享元素转场 (推荐页→画报页, 雷达图"无缝飞跃"放大)

### [?] 决策点 5-A：粒子雷达图实现方案
> 双层生命粒子雷达图是整个产品的视觉核心，技术选型：
> 1. Three.js (react-three-fiber) — 3D 粒子效果最佳, 但学习曲线高
> 2. Canvas 2D + 自定义粒子系统 — 中等效果, 性能好, 兼容性强
> 3. SVG + Framer Motion — 简单实现, 效果一般, 适合快速出 MVP
> 4. 先用方案3快速出MVP, 后续升级为方案1

---

## 6. 社区系统模块

### 6.1 后端 - 动态发布
- [ ] CommunityPostMapper + XML
- [ ] CommunityPostService
  - [ ] createPost() — 发布动态, AI 自动打标签, 触发审核队列
  - [ ] getFeed() — 分页获取动态流 (质量分权排序)
  - [ ] getPostDetail() — 动态详情
  - [ ] deletePost() — 软删除
- [ ] CommunityController 实现
  - [ ] POST /api/community/post
  - [ ] GET /api/community/feed?page=&size=&category=
  - [ ] GET /api/community/post/{id}
  - [ ] DELETE /api/community/post/{id}
  - [ ] POST /api/community/upload/image — 上传社区图片

### 6.2 后端 - 互动系统
- [ ] CommunityCommentMapper + XML
- [ ] CommunityLikeMapper + XML
- [ ] InteractionService
  - [ ] like() / unlike() — 点赞/取消 (Redis计数 + DB持久化)
  - [ ] comment() — 评论 (支持 parent_id 嵌套回复)
  - [ ] getComments() — 获取评论列表 (质量分权排序)
- [ ] Controller 接口
  - [ ] POST /api/community/post/{id}/like
  - [ ] DELETE /api/community/post/{id}/like
  - [ ] POST /api/community/post/{id}/comment
  - [ ] GET /api/community/post/{id}/comments

### 6.3 后端 - 内容审核 (AI)
- [ ] ContentModerationService
  - [ ] moderateText() — 文本审核 (广告/黑产/医疗违规)
  - [ ] moderateImage() — 图片审核 (敏感信息检测)
  - [ ] autoRedactPrivacy() — 隐私自动模糊 (体检单姓名/身份证)
  - [ ] gradeContent() — 内容质量评级 (S/A/C)
    - [ ] S级: 有体检对比/科学引用 → 置顶推广
    - [ ] A级: 正向健康生活 → 正常分发
    - [ ] C级: 低质量(短文/模糊/灌水) → 折叠显示
- [ ] 审核队列 (RabbitMQ audit队列)
  - [ ] AuditMessageConsumer — 异步审核

### 6.4 后端 - 质量分权算法
- [ ] QualityScoreService
  - [ ] calculateQualityScore() — 帖子质量分
  - [ ] calculateFeedRank() — 动态流排序分
  - [ ] 公式: 内容质量 × 时效衰减 × 用户可信度 × 标签权重
  - [ ] 带 #体检数据分享 标签权重 +30%

### 6.5 前端 - 社区页面
- [ ] /community 页面
  - [ ] 左侧栏 (发布按钮/分类过滤/我的统计)
  - [ ] 动态流主区域
    - [ ] PostCard 组件 (头像/昵称/内容/图片/标签/点赞评论数)
    - [ ] 无限滚动加载
    - [ ] 分类切换 (热门/打卡/方案分享/画报展/知识)
  - [ ] 发布弹窗
    - [ ] 文字编辑器
    - [ ] 图片上传 (最多9张)
    - [ ] AI 标签建议 (自动识别内容推荐标签)
  - [ ] 帖子详情页 (评论列表, 嵌套回复)

---

## 7. 打卡 & 勋章系统

### 7.1 后端 - 打卡
- [ ] CheckinMapper + XML
- [ ] CheckinService
  - [ ] checkin() — 每日打卡 (记录当天服用营养素)
  - [ ] getStreak() — 获取连续打卡天数
  - [ ] getCalendar() — 获取月度打卡日历
  - [ ] getStats() — 打卡统计 (总天数/最长连续/当前连续)
  - [ ] useReviveCard() — 使用复活卡 (断签补救)
- [ ] CheckinController
  - [ ] POST /api/checkin
  - [ ] GET /api/checkin/calendar?month=2026-03
  - [ ] GET /api/checkin/stats
  - [ ] POST /api/checkin/revive
- [ ] 打卡行为修正画像 (连续21天 → 健康状态改善标记)

### 7.2 后端 - 勋章系统
- [ ] BadgeMapper + XML
- [ ] UserBadgeMapper + XML
- [ ] BadgeService
  - [ ] checkAndAward() — 检查是否达成勋章条件并颁发
  - [ ] getUserBadges() — 获取用户已获得勋章
- [ ] 勋章种子数据 (seed_badges.sql)
  - [ ] 初级觉醒 (连续打卡7天)
  - [ ] 习惯达人 (连续打卡21天)
  - [ ] 百日守护 (连续打卡100天)
  - [ ] 成分党 (发布10篇含科学引用的帖子)
  - [ ] 数据控 (上传3+体检报告)
  - [ ] 首席鼓励师 (获得100+点赞)
  - [ ] 画报艺术家 (分享5+画报)
- [ ] 活力积分系统
  - [ ] 打卡基础积分
  - [ ] 连续打卡倍率 (3天1x, 7天1.2x, 21天1.5x)

### 7.3 前端 - 打卡 & 勋章
- [ ] CheckInCalendar 组件 (月度日历, 打卡日标绿叶)
- [ ] 打卡弹窗 (选择今天服用的营养素, 可选心情)
- [ ] 打卡成功动效 (种子→发芽 Spring 动画 1.5s)
- [ ] 勋章展示柜 (玻璃态+光化学风格)
- [ ] 勋章获得仪式动效 (三阶段)
  - [ ] 觉醒: 背景变暗, 生命粒子磁吸汇聚, 晶体汇聚音效
  - [ ] 凝聚: 粒子碰撞爆发绿色光晕, Spring弹射 (Stiffness:200, Damping:15)
  - [ ] 辉映: 高光扫过Shimmer, 粒子纹理流动, AI定制赞美文案
- [ ] 成就画报 (勋章→社交分享图)

---

## 8. 用户健康画像模块

### 8.1 后端 - 画像系统
- [ ] UserProfileMapper + XML
- [ ] UserProfileService
  - [ ] initProfile() — 首次评估后创建画像
  - [ ] updateFromAssessment() — 评估完成后更新画像
  - [ ] updateFromCheckin() — 打卡行为修正画像
  - [ ] calculateDecay() — 时效性衰减计算
  - [ ] detectLifeStageChange() — 生命周期自动迁移检测
    - [ ] 年龄段自动切换
    - [ ] 备孕→孕期→产后 状态演进
  - [ ] triggerReassessment() — 数据过期主动唤回提醒
- [ ] UserProfileController
  - [ ] GET /api/profile — 获取健康画像
  - [ ] GET /api/profile/timeline — 健康趋势时间线

### 8.2 后端 - 隐私安全
- [ ] DataPrivacyService
  - [ ] exportUserData() — 数据导出 (7天内完成)
  - [ ] softDelete() — 注销软删除 (180天冷存储)
  - [ ] hardDelete() — 物理擦除 (定时任务扫描过期数据)
  - [ ] maskSensitiveData() — 敏感数据脱敏
- [ ] AuditLogService
  - [ ] log() — 记录审计日志 (IP/设备/时间/操作)
  - [ ] query() — 查询审计记录
- [ ] AuditLogAspect (AOP切面, 自动记录敏感操作)
- [ ] 定时任务: 每天扫描180天到期的软删除数据并物理擦除

---

## 9. 全局 UI 组件 & 动效

### 9.1 shadcn/ui 基础组件安装
- [ ] Button
- [ ] Dialog
- [ ] DropdownMenu
- [ ] Tabs
- [ ] Toast
- [ ] Progress
- [ ] Input
- [ ] Card
- [ ] Badge
- [ ] Avatar
- [ ] Skeleton

### 9.2 业务组件开发
- [ ] Header/Navbar (响应式, 登录状态切换)
- [ ] Footer
- [ ] DiagnosticChatBubble (打字动效)
- [ ] OptionCard (hover scale)
- [ ] OCRUploadZone (拖拽上传)
- [ ] HealthRadarChart (Recharts交互式雷达图)
- [ ] NutrientScoreBar (渐变色, 动画)
- [ ] NutrientCard (7维标识)
- [ ] VisualIdentifierGroup (🟢★🌅⚠️📊👥)
- [ ] DosingTimeline (服用时间线)
- [ ] PosterContainer (画报容器)
- [ ] CheckInCalendar (打卡日历)
- [ ] PostCard (社区帖子卡片)
- [ ] BadgeCard (勋章卡片)

### 9.3 全局动效规范
- [ ] 加载态: "光合作用"从下往上绿色光影 (非转圈)
- [ ] 按钮点击: scale(0.98) 微缩
- [ ] 页面转场: fade + slide (300ms)
- [ ] 共享元素转场 (推荐页↔画报页)
- [ ] Skeleton 骨架屏 (全局统一)

### [?] 决策点 9-A：字体选择
> 产品文档建议：
> 1. 思源黑体 (Noto Sans SC) — 免费商用, Google Fonts 直接引入
> 2. 阿里巴巴普惠体 — 免费商用, 需下载部署
> 3. 系统默认字体 (Inter + system-ui) — 当前配置, 最轻量
> 4. 先用方案3, 上线前切换方案1

---

## 10. 测试 & 部署 & 运维

### 10.1 后端测试
- [ ] 单元测试
  - [ ] RecommendationEngine 推荐算法测试
  - [ ] ConflictDetector 剂量冲突检测测试
  - [ ] DosageCalculator 剂量计算测试
  - [ ] OcrProcessingPipeline 解析流水线测试
- [ ] 集成测试
  - [ ] 完整评估→推荐→画报流程测试
  - [ ] 社区发帖→审核→展示流程测试
- [ ] API 接口测试 (Swagger/Postman)

### 10.2 前端测试
- [ ] 组件测试 (关键组件)
- [ ] E2E 测试 (Playwright)
  - [ ] 注册登录流程
  - [ ] 问卷完成流程
  - [ ] 画报查看下载流程

### 10.3 部署
- [ ] 服务器环境准备 (Docker + Docker Compose)
- [ ] SSL 证书配置 (Let's Encrypt / 已有证书)
- [ ] Nginx HTTPS 配置
- [ ] docker compose up -d --build 一键部署验证
- [ ] MinIO Bucket 初始化 (自动创建4个桶)
- [ ] 数据库迁移方案 (Flyway 或手动SQL)

### 10.4 运维
- [ ] 数据备份脚本 (PostgreSQL pg_dump)
- [ ] 日志收集方案
- [ ] 服务健康检查
- [ ] 磁盘/内存监控告警

### [?] 决策点 10-A：服务器信息
> 需要了解你的服务器情况来优化部署方案：
> 1. 服务器配置 (CPU/内存/磁盘/带宽)?
> 2. 域名是否已备案?
> 3. 是否已有 SSL 证书?
> 4. 服务器在国内还是海外? (影响 Docker 镜像拉取速度和 AI API 访问)

---

## 11. 二期预留 (本期不实现, 仅预留接口/字段)

- [ ] 商品 SKU 表预留 (nutrient → product 映射)
- [ ] 订单系统表预留
- [ ] 分佣/推荐人字段预留 (user 表 referrer_id)
- [ ] 微信小程序兼容性 (前端 Tailwind 保持简洁, 可迁移 Taro/UniApp)
- [ ] 营养师咨询预约系统预留
- [ ] 积分兑换商品预留

---

## 统计

| 类别 | 总数 | 已完成 | 待开发 |
|------|------|--------|--------|
| 基础设施 | 36 | 24 | 12 |
| 用户系统 | 18 | 0 | 18 |
| AI问卷 | 26 | 0 | 26 |
| 体检OCR | 20 | 0 | 20 |
| 推荐引擎 | 28 | 0 | 28 |
| 营养画报 | 26 | 0 | 26 |
| 社区系统 | 22 | 0 | 22 |
| 打卡勋章 | 20 | 0 | 20 |
| 用户画像 | 12 | 0 | 12 |
| UI组件 | 18 | 0 | 18 |
| 测试部署 | 14 | 0 | 14 |
| **合计** | **~240** | **24** | **~216** |

| 决策点 | 待确认 |
|--------|--------|
| 0-A | 短信验证码服务 |
| 0-B | AI API 选择 |
| 2-A | 问卷题库内容 |
| 3-A | OCR 部署方式 |
| 5-A | 粒子雷达图方案 |
| 9-A | 字体选择 |
| 10-A | 服务器信息 |
