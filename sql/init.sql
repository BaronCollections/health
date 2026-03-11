-- MintBit Health Database Schema

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255),
    nickname VARCHAR(50),
    avatar VARCHAR(500),
    gender VARCHAR(10),
    birth_date DATE,
    age_group VARCHAR(20),
    email VARCHAR(100),
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 评估记录表
CREATE TABLE IF NOT EXISTS assessment (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    age_group VARCHAR(20),
    status VARCHAR(20) DEFAULT 'in_progress',  -- in_progress, completed, expired
    answers JSONB,
    ocr_data JSONB,
    health_score INT,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 体检报告表
CREATE TABLE IF NOT EXISTS health_report (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    assessment_id BIGINT REFERENCES assessment(id),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(200),
    ocr_status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    ocr_result JSONB,
    normalized_data JSONB,  -- 归一化后的结构化数据
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 营养素知识库
CREATE TABLE IF NOT EXISTS nutrient (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,       -- e.g. NUT_D_001
    name VARCHAR(100) NOT NULL,             -- e.g. 维生素D
    aliases JSONB,                          -- ["VitD3", "25-OH-D", "总维生素D"]
    category VARCHAR(50),                   -- vitamin, mineral, omega, etc.
    unit VARCHAR(20),                       -- mg, mcg, IU
    rda DECIMAL(10,2),                      -- 推荐每日摄入量
    ul DECIMAL(10,2),                       -- 最高耐受量
    maintenance_dose DECIMAL(10,2),         -- 维持档剂量
    correction_dose DECIMAL(10,2),          -- 纠偏档剂量
    impact_dose DECIMAL(10,2),             -- 冲击档剂量
    health_tags JSONB,                      -- 关联的健康标签
    contraindications JSONB,                -- 禁忌（药物交互）
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 推荐方案表
CREATE TABLE IF NOT EXISTS recommendation (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    assessment_id BIGINT REFERENCES assessment(id),
    supplements JSONB,        -- 推荐营养素列表
    safety_check JSONB,       -- 剂量冲突检查结果
    ai_insight JSONB,         -- AI 解读
    poster_url VARCHAR(500),
    poster_data JSONB,        -- 画报渲染数据
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 社区动态表
CREATE TABLE IF NOT EXISTS community_post (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    content TEXT,
    images JSONB,
    tags JSONB,
    type VARCHAR(30),          -- daily, checkin, poster_share, achievement
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved',  -- pending, approved, rejected
    quality_score DECIMAL(5,2) DEFAULT 0,   -- 质量分权算法分数
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 评论表
CREATE TABLE IF NOT EXISTS community_comment (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_post(id),
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    parent_id BIGINT,
    content TEXT NOT NULL,
    deleted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 点赞表
CREATE TABLE IF NOT EXISTS community_like (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_post(id),
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- 打卡记录表
CREATE TABLE IF NOT EXISTS checkin_record (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    checkin_date DATE NOT NULL,
    supplements JSONB,        -- 当天服用的营养素
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checkin_date)
);

-- 勋章表
CREATE TABLE IF NOT EXISTS badge (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(50),      -- streak, milestone, social, special
    requirement JSONB,         -- 获取条件
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户勋章关联表
CREATE TABLE IF NOT EXISTS user_badge (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(id),
    badge_id BIGINT NOT NULL REFERENCES badge(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- 用户画像表
CREATE TABLE IF NOT EXISTS user_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES sys_user(id),
    health_tags JSONB,          -- 健康标签体系
    risk_factors JSONB,         -- 风险因子
    life_stage VARCHAR(50),     -- 生命阶段：teen, young_adult, middle_age, senior, pregnant...
    consecutive_checkins INT DEFAULT 0,
    total_assessments INT DEFAULT 0,
    latest_assessment_id BIGINT,
    data_confidence JSONB,      -- 各指标置信度系数
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    detail JSONB,
    ip_address VARCHAR(50),
    device_info VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_assessment_user ON assessment(user_id);
CREATE INDEX idx_recommendation_user ON recommendation(user_id);
CREATE INDEX idx_community_post_user ON community_post(user_id);
CREATE INDEX idx_community_post_status ON community_post(status, created_at DESC);
CREATE INDEX idx_checkin_user_date ON checkin_record(user_id, checkin_date);
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);
