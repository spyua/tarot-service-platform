import { motion } from 'framer-motion';
import { pageTransition } from '@/utils/animations';

export default function History() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">歷史記錄</h1>
        <p className="text-gray-600 mb-8">查看您的占卜歷史和身心靈成長歷程</p>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-500">歷史記錄功能即將推出...</p>
        </div>
      </div>
    </motion.div>
  );
}
