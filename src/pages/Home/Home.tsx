import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const features = [
    {
      title: '無視論抽牌',
      description: '自由選擇抽牌數量，獲得靈活的指導',
      icon: '🔮',
      path: '/free-reading',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: '每日抽牌',
      description: '每天一張指導牌，陪伴你的成長之路',
      icon: '📅',
      path: '/daily-card',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: '歷史記錄',
      description: '回顧過往占卜，追蹤心靈成長軌跡',
      icon: '📚',
      path: '/history',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6 font-primary">
          塔羅占卜
        </h1>
        <p className="text-xl text-gray-600 font-secondary max-w-2xl mx-auto">
          探索內心的智慧，發現生命的指引。透過古老的塔羅牌藝術，
          為你的人生旅程點亮明燈。
        </p>
      </motion.header>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link to={feature.path} className="block group">
              <div className="card p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 font-primary">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-secondary">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Start Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card p-8 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4 font-primary">
          開始你的塔羅之旅
        </h2>
        <p className="text-gray-600 mb-6 font-secondary">
          選擇一個功能開始探索，或者先了解塔羅占卜的基本知識
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/free-reading" className="btn-primary">
            立即開始占卜
          </Link>
          <Link to="/daily-card" className="btn-secondary">
            今日運勢
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;