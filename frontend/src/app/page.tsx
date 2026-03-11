'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          <span className="text-primary">MintBit</span> 薄荷比特
        </h1>
        <p className="text-xl text-gray-500 mb-2">
          AI 驱动的个性化维生素推荐平台
        </p>
        <p className="text-gray-400 mb-12">
          科学问卷 + 体检数据 + 智能分析，为你定制专属营养方案
        </p>

        <Link href="/questionnaire">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-primary text-white rounded-2xl text-lg font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
          >
            开始营养评估
          </motion.button>
        </Link>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl"
      >
        {[
          {
            title: 'AI 智能问卷',
            desc: '对话式问卷，AI实时分析你的健康需求',
            icon: '🧠',
          },
          {
            title: '精准推荐',
            desc: '基于营养学知识图谱，剂量安全有保障',
            icon: '🎯',
          },
          {
            title: '营养画报',
            desc: '可视化健康报告，一键分享你的蜕变',
            icon: '📊',
          },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
