import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  PaintBrushIcon, 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon,
  TrashIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { pageTransition } from '@/utils/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { storageService } from '@/services/StorageService';
import { dataManagementService } from '@/services/DataManagementService';
import { UserPreferences, Language, Theme } from '@/types';

import Switch from '@/components/common/Switch';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    storageService.getUserPreferences()
  );
  const [dataStats, setDataStats] = useState(dataManagementService.getDataStatistics());
  const [isLoading, setIsLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Update data statistics when component mounts
  useEffect(() => {
    setDataStats(dataManagementService.getDataStatistics());
  }, []);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle preference changes
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    storageService.saveUserPreferences(updatedPreferences);

    // Apply language change immediately
    if (key === 'language') {
      setLanguage(value as Language);
    }

    // Apply theme change immediately
    if (key === 'theme') {
      setTheme(value as Theme);
    }
  };

  // Handle data export
  const handleExport = async (type: 'all' | 'readings' | 'dailyCards' | 'preferences') => {
    setIsLoading(true);
    try {
      let data: string;
      let filename: string;

      switch (type) {
        case 'all':
          data = await dataManagementService.exportAllData();
          filename = `tarot-backup-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'readings':
          data = await dataManagementService.exportData('readings');
          filename = `tarot-readings-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'dailyCards':
          data = await dataManagementService.exportData('dailyCards');
          filename = `tarot-daily-cards-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'preferences':
          data = await dataManagementService.exportData('preferences');
          filename = `tarot-preferences-${new Date().toISOString().split('T')[0]}.json`;
          break;
      }

      dataManagementService.downloadAsFile(data, filename);
      showNotification('success', t('settings.export') + ' ' + t('common.success'));
    } catch (error) {
      showNotification('error', t('settings.export') + ' ' + t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const success = await dataManagementService.importFromFile(file);
      if (success) {
        showNotification('success', t('settings.import.success'));
        setDataStats(dataManagementService.getDataStatistics());
        // Refresh preferences
        setPreferences(storageService.getUserPreferences());
      } else {
        showNotification('error', t('settings.import.error'));
      }
    } catch (error) {
      showNotification('error', t('settings.import.error'));
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle data clearing
  const handleClear = async (type: string) => {
    setIsLoading(true);
    try {
      let success = false;

      switch (type) {
        case 'all':
          success = await dataManagementService.clearAllData();
          break;
        case 'readings':
          success = await dataManagementService.clearData('readings');
          break;
        case 'dailyCards':
          success = await dataManagementService.clearData('dailyCards');
          break;
      }

      if (success) {
        showNotification('success', t('settings.clear.success'));
        setDataStats(dataManagementService.getDataStatistics());
        if (type === 'all') {
          // Refresh preferences after clearing all data
          setPreferences(storageService.getUserPreferences());
        }
      } else {
        showNotification('error', t('settings.clear.error'));
      }
    } catch (error) {
      showNotification('error', t('settings.clear.error'));
    } finally {
      setIsLoading(false);
      setShowClearModal(null);
    }
  };

  // Language options
  const languageOptions = [
    { value: 'zh-TW', label: t('language.zh-TW') },
    { value: 'en', label: t('language.en') }
  ];

  // Theme options
  const themeOptions = [
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
    { value: 'auto', label: t('settings.theme.auto') }
  ];

  // Settings sections
  const sections: SettingsSection[] = [
    {
      id: 'appearance',
      title: t('settings.appearance'),
      icon: PaintBrushIcon,
      content: (
        <div className="space-y-6">
          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.language')}
              </label>
            </div>
            <div className="w-32">
              <Select
                options={languageOptions}
                value={preferences.language}
                onChange={(value) => handlePreferenceChange('language', value)}
              />
            </div>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.theme')}
              </label>
            </div>
            <div className="w-32">
              <Select
                options={themeOptions}
                value={preferences.theme}
                onChange={(value) => handlePreferenceChange('theme', value)}
              />
            </div>
          </div>

          {/* Animations Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.animations')}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('settings.animations.description')}
              </p>
            </div>
            <Switch
              checked={preferences.animations}
              onChange={(checked) => handlePreferenceChange('animations', checked)}
            />
          </div>

          {/* Notifications Setting */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.notifications')}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('settings.notifications.description')}
              </p>
            </div>
            <Switch
              checked={preferences.notifications}
              onChange={(checked) => handlePreferenceChange('notifications', checked)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'data',
      title: t('settings.dataManagement'),
      icon: DocumentArrowDownIcon,
      content: (
        <div className="space-y-6">
          {/* Data Statistics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.dataStatistics')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {dataStats.totalReadings}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.totalReadings')}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {dataStats.totalDailyCards}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.totalDailyCards')}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {dataStats.storageSize} KB
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.storageSize')}
                </div>
              </div>
            </div>
          </div>

          {/* Export Data */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.export')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('all')}
                disabled={isLoading}
                className="justify-start"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {t('settings.export.all')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('readings')}
                disabled={isLoading}
                className="justify-start"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {t('settings.export.readings')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('dailyCards')}
                disabled={isLoading}
                className="justify-start"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {t('settings.export.dailyCards')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('preferences')}
                disabled={isLoading}
                className="justify-start"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {t('settings.export.preferences')}
              </Button>
            </div>
          </div>

          {/* Import Data */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.import')}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t('settings.import.description')}
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="justify-start"
              >
                <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                {t('settings.import.selectFile')}
              </Button>
            </div>
          </div>

          {/* Clear Data */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('settings.clear')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearModal('readings')}
                disabled={isLoading}
                className="justify-start text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {t('settings.clear.readings')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearModal('dailyCards')}
                disabled={isLoading}
                className="justify-start text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {t('settings.clear.dailyCards')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearModal('all')}
                disabled={isLoading}
                className="justify-start text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {t('settings.clear.all')}
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'about',
      title: t('settings.about'),
      icon: InformationCircleIcon,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.version')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              1.0.0
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.developer')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tarot Team
            </span>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              探索內心的智慧，發現生命的指引。透過古老的塔羅牌藝術，為你的人生旅程點亮明燈。
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CogIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            mb-6 p-4 rounded-lg border
            ${notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
            }
          `}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              {section.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal
        isOpen={!!showClearModal}
        onClose={() => setShowClearModal(null)}
        title={t('settings.clear.confirm')}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                {t('settings.clear.warning')}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowClearModal(null)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => showClearModal && handleClear(showClearModal)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isLoading ? t('common.loading') : t('common.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
