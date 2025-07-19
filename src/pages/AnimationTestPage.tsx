import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../components/animations/AnimationContext';
import { 
  pageTransitionVariants, 
  fadeTransitionVariants,
  slideTransitionVariants,
  scaleTransitionVariants,
  mysticalTransitionVariants
} from '../components/animations/pageTransitions';
import AnimatedContainer from '../components/animations/AnimatedContainer';

const AnimationTestPage: React.FC = () => {
  const { 
    animationsEnabled, 
    setAnimationsEnabled, 
    animationSpeed, 
    setAnimationSpeed 
  } = useAnimation();
  
  const [transitionType, setTransitionType] = useState<'page' | 'fade' | 'slide' | 'scale' | 'mystical'>('page');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');
  const [showContent, setShowContent] = useState(true);
  
  // Toggle content to demonstrate transitions
  const toggleContent = () => {
    setShowContent(false);
    setTimeout(() => setShowContent(true), 500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif text-purple-900 mb-3">動畫系統測試頁面</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          這個頁面展示了塔羅牌應用程式的動畫系統，包括頁面轉場、卡片動畫和響應式動畫設定。
        </p>
      </header>
      
      {/* Animation settings */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-serif text-purple-900 mb-4">動畫設定</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enable/disable animations */}
          <div>
            <h3 className="text-lg font-medium text-purple-800 mb-2">動畫開關</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                />
                <div className={`block w-14 h-8 rounded-full ${animationsEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${animationsEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-gray-700">
                {animationsEnabled ? '動畫已啟用' : '動畫已停用'}
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              停用動畫可以提高性能並減少視覺干擾。
            </p>
          </div>
          
          {/* Animation speed */}
          <div>
            <h3 className="text-lg font-medium text-purple-800 mb-2">動畫速度</h3>
            <div className="flex items-center space-x-2">
              <button 
                className={`px-4 py-2 rounded-md ${animationSpeed === 'slow' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAnimationSpeed('slow')}
              >
                慢速
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${animationSpeed === 'normal' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAnimationSpeed('normal')}
              >
                正常
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${animationSpeed === 'fast' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAnimationSpeed('fast')}
              >
                快速
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              調整動畫速度以符合您的偏好。
            </p>
          </div>
        </div>
      </div>
      
      {/* Page transition demo */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-serif text-purple-900 mb-4">頁面轉場動畫</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Transition type */}
          <div>
            <h3 className="text-lg font-medium text-purple-800 mb-2">轉場類型</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className={`px-3 py-2 rounded-md ${transitionType === 'page' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTransitionType('page')}
              >
                標準頁面轉場
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${transitionType === 'fade' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTransitionType('fade')}
              >
                淡入淡出
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${transitionType === 'slide' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTransitionType('slide')}
              >
                滑動
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${transitionType === 'scale' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTransitionType('scale')}
              >
                縮放
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${transitionType === 'mystical' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTransitionType('mystical')}
              >
                神秘效果
              </button>
            </div>
          </div>
          
          {/* Slide direction (only for slide transition) */}
          {transitionType === 'slide' && (
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-2">滑動方向</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className={`px-3 py-2 rounded-md ${slideDirection === 'left' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setSlideDirection('left')}
                >
                  ← 左側
                </button>
                <button 
                  className={`px-3 py-2 rounded-md ${slideDirection === 'right' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setSlideDirection('right')}
                >
                  右側 →
                </button>
                <button 
                  className={`px-3 py-2 rounded-md ${slideDirection === 'up' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setSlideDirection('up')}
                >
                  ↑ 上方
                </button>
                <button 
                  className={`px-3 py-2 rounded-md ${slideDirection === 'down' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setSlideDirection('down')}
                >
                  下方 ↓
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Demo button */}
        <div className="flex justify-center mb-6">
          <button 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={toggleContent}
          >
            播放轉場動畫
          </button>
        </div>
        
        {/* Demo content */}
        <div className="h-80 bg-purple-50 rounded-lg overflow-hidden relative">
          {showContent && (
            <AnimatedContainer
              transitionType={transitionType}
              slideDirection={slideDirection}
              className="h-full w-full p-6"
            >
              <div className="grid grid-cols-3 gap-4 h-full">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    className="bg-white rounded-lg shadow p-4 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">✨</div>
                      <div className="text-purple-800 font-medium">項目 {item}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedContainer>
          )}
        </div>
      </div>
      
      {/* Card animation demo */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-serif text-purple-900 mb-4">卡片動畫示例</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flip animation */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-purple-800 mb-4">翻牌動畫</h3>
            <motion.div 
              className="w-40 h-60 bg-purple-600 rounded-lg cursor-pointer perspective-1000"
              initial={false}
              animate={{ rotateY: [0, 180, 0] }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <div className="relative w-full h-full">
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <div className="text-white text-xl">正面</div>
                </div>
                
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center" style={{ transform: 'rotateY(180deg)' }}>
                  <div className="text-white text-xl">背面</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Draw animation */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-purple-800 mb-4">抽牌動畫</h3>
            <motion.div 
              className="w-40 h-60 bg-purple-600 rounded-lg cursor-pointer"
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">抽牌</div>
              </div>
            </motion.div>
          </div>
          
          {/* Hover animation */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-purple-800 mb-4">懸停動畫</h3>
            <motion.div 
              className="w-40 h-60 bg-purple-600 rounded-lg cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">懸停效果</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>塔羅占卜網頁應用程式 © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AnimationTestPage;