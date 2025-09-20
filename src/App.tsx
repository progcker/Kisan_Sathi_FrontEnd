import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSelection from './components/LanguageSelection';
import UserInfoForm from './components/UserInfoForm';
import WelcomeScreen from './components/WelcomeScreen';
import PermissionsScreen from './components/PermissionsScreen';
import MainApp from './components/MainApp';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type UserInfo = {
  name: string;
  location: string;
};

export type AppStep = 'permissions' | 'language' | 'userInfo' | 'welcome' | 'main';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('permissions');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Check if user has completed onboarding
  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishi-language');
    const savedUserInfo = localStorage.getItem('krishi-userInfo');
    const onboardingComplete = localStorage.getItem('krishi-onboarding-complete');
    const permissionsChecked = localStorage.getItem('krishi-permissions-checked');

    if (onboardingComplete && savedLanguage && savedUserInfo && permissionsChecked) {
      setSelectedLanguage(JSON.parse(savedLanguage));
      setUserInfo(JSON.parse(savedUserInfo));
      setCurrentStep('main');
    }
  }, []);

  const handlePermissionsComplete = () => {
    localStorage.setItem('krishi-permissions-checked', 'true');
    setCurrentStep('language');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem('krishi-language', JSON.stringify(language));
    setCurrentStep('userInfo');
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    localStorage.setItem('krishi-userInfo', JSON.stringify(info));
    setCurrentStep('welcome');
  };

  const handleSkipUserInfo = () => {
    const defaultInfo = { name: '', location: 'India' };
    setUserInfo(defaultInfo);
    localStorage.setItem('krishi-userInfo', JSON.stringify(defaultInfo));
    setCurrentStep('welcome');
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('krishi-onboarding-complete', 'true');
    setCurrentStep('main');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F6F2' }}>
      <AnimatePresence mode="wait">
        {currentStep === 'permissions' && (
          <motion.div
            key="permissions"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
          >
            <PermissionsScreen
              language={{ code: 'en', name: 'English', nativeName: 'English' }}
              userInfo={{ name: '', location: '' }}
              onComplete={handlePermissionsComplete}
            />
          </motion.div>
        )}

        {currentStep === 'language' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <LanguageSelection onLanguageSelect={handleLanguageSelect} />
          </motion.div>
        )}

        {currentStep === 'userInfo' && selectedLanguage && (
          <motion.div
            key="userInfo"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <UserInfoForm
              language={selectedLanguage}
              onSubmit={handleUserInfoSubmit}
              onSkip={handleSkipUserInfo}
            />
          </motion.div>
        )}

        {currentStep === 'welcome' && selectedLanguage && userInfo && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <WelcomeScreen
              language={selectedLanguage}
              userInfo={userInfo}
              onComplete={handleWelcomeComplete}
            />
          </motion.div>
        )}



        {currentStep === 'main' && selectedLanguage && userInfo && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MainApp language={selectedLanguage} userInfo={userInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;