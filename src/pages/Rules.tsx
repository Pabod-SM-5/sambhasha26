import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RulesHeader from '../components/rules/RulesHeader';
import RulesTabs from '../components/rules/RulesTabs';
import AgeCategories from '../components/rules/AgeCategories';
import GeneralRules from '../components/rules/GeneralRules';
import ContactInfo from '../components/rules/ContactInfo';
import DownloadGuidelines from '../components/rules/DownloadGuidelines';

export default function Rules() {
  const [activeTab, setActiveTab] = useState<'rules' | 'downloads'>('rules');

  return (
    <div className="space-y-8">
      {/* Header */}
      <RulesHeader />

      {/* Tabs */}
      <RulesTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'rules' ? (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Age Categories Grid */}
            <AgeCategories />

            {/* General Rules List */}
            <GeneralRules />

            {/* Contact Info */}
            <ContactInfo />
          </motion.div>
        ) : (
          <DownloadGuidelines />
        )}
      </AnimatePresence>
    </div>
  );
}

