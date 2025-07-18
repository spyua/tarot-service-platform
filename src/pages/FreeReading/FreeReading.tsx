import React from 'react';
import { motion } from 'framer-motion';

const FreeReading: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 font-primary">無視論抽牌</h1>
        <p className="text-gray-600 font-secondary">
          此功能將在後續任務中實現
        </p>
      </div>
    </motion.div>
  );
};

export default FreeReading;