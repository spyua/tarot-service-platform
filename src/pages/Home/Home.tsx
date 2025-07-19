import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROUTES } from '@/router';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home.feature.freeReading.title'),
      description: t('home.feature.freeReading.description'),
      icon: '🔮',
      path: ROUTES.FREE_READING,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: t('home.feature.dailyCard.title'),
      description: t('home.feature.dailyCard.description'),
      icon: '📅',
      path: ROUTES.DAILY_CARD,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('home.feature.history.title'),
      description: t('home.feature.history.description'),
      icon: '📚',
      path: ROUTES.HISTORY,
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
        className="text-center mb-16 py-12"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl mb-6"
        >
          ✨🔮✨
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-6 font-primary">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 font-secondary max-w-2xl mx-auto">
          {t('home.subtitle')}
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
              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
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
        className="bg-white rounded-xl shadow-md p-8 text-center mb-16"
      >
        <h2 className="text-2xl font-semibold mb-4 font-primary">
          {t('home.quickStart.title')}
        </h2>
        <p className="text-gray-600 mb-6 font-secondary">
          {t('home.quickStart.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={ROUTES.FREE_READING} 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            {t('home.quickStart.startReading')}
          </Link>
          <Link 
            to={ROUTES.DAILY_CARD} 
            className="bg-accent-100 hover:bg-accent-200 text-accent-600 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            {t('home.quickStart.dailyFortune')}
          </Link>
        </div>
      </motion.section>

      {/* Tarot Introduction Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-8 mb-16"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4 font-primary">
              {t('home.title')} - {t('nav.freeReading')}
            </h2>
            <p className="text-gray-600 mb-4 font-secondary">
              {t('home.tarotIntro.description1')}
            </p>
            <p className="text-gray-600 mb-4 font-secondary">
              {t('home.tarotIntro.description2')}
            </p>
            <Link 
              to={ROUTES.FREE_READING} 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('home.tarotIntro.cta')}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute top-0 left-0 w-40 h-56 bg-gradient-to-br from-primary-100 to-primary-300 rounded-lg shadow-lg flex items-center justify-center text-4xl transform -rotate-6"
              >
                🌙
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  y: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute top-10 right-0 w-40 h-56 bg-gradient-to-br from-accent-100 to-accent-300 rounded-lg shadow-lg flex items-center justify-center text-4xl transform rotate-6"
              >
                ⭐
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Daily Card Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl shadow-md p-8"
      >
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4 font-primary">
              {t('home.title')} - {t('nav.dailyCard')}
            </h2>
            <p className="text-gray-600 mb-4 font-secondary">
              {t('home.dailyCard.description1')}
            </p>
            <p className="text-gray-600 mb-4 font-secondary">
              {t('home.dailyCard.description2')}
            </p>
            <Link 
              to={ROUTES.DAILY_CARD} 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('home.dailyCard.cta')}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-40 h-56 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg shadow-lg flex items-center justify-center text-4xl"
            >
              🌞
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;