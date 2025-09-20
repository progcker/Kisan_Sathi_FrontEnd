import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, Cloud, HelpCircle, History, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import WeatherPage from './pages/WeatherPage';
import SupportPage from './pages/SupportPage';
import HistoryPage from './pages/HistoryPage';
import VoicePage from './pages/VoicePage';
import TextPage from './pages/TextPage';
import ImagePage from './pages/ImagePage';
import type { Language, UserInfo } from '../App';

export type MainAppPage = 'home' | 'calendar' | 'weather' | 'support' | 'history' | 'voice' | 'text' | 'image';

const translations = {
  hi: { home: "होम", calendar: "कैलेंडर", weather: "मौसम", support: "सहायता", history: "इतिहास", back: "वापस" },
  en: { home: "Home", calendar: "Calendar", weather: "Weather", support: "Support", history: "History", back: "Back" },
  ta: { home: "முகப்பு", calendar: "நாட்காட்டி", weather: "வானிலை", support: "ஆதரவு", history: "வரலாறு", back: "மீண்டும்" },
  te: { home: "హోమ్", calendar: "క్యాలెండర్", weather: "వాతావరణం", support: "మద్దతు", history: "చరిత్ర", back: "వెనక్కి" },
  kn: { home: "ಮುಖಪುಟ", calendar: "ಕ್ಯಾಲೆಂಡರ್", weather: "ಹವಾಮಾನ", support: "ಬೆಂಬಲ", history: "ಇತಿಹಾಸ", back: "ಹಿಂದೆ" },
  ml: { home: "ഹോം", calendar: "കലണ്ടർ", weather: "കാലാവസ്ഥ", support: "പിന്തുണ", history: "ചരിത്രം", back: "തിരികെ" },
  bn: { home: "হোম", calendar: "ক্যালেন্ডার", weather: "আবহাওয়া", support: "সহায়তা", history: "ইতিহাস", back: "ফিরে যান" },
  gu: { home: "હોમ", calendar: "કેલેન્ડર", weather: "હવામાન", support: "સહાય", history: "ઇતિહાસ", back: "પાછા" },
  mr: { home: "मुख्यपृष्ठ", calendar: "कॅलेंडर", weather: "हवामान", support: "मदत", history: "इतिहास", back: "मागे" },
  pa: { home: "ਮੁੱਖ", calendar: "ਕੈਲੰਡਰ", weather: "ਮੌਸਮ", support: "ਸਹਾਇਤਾ", history: "ਇਤਿਹਾਸ", back: "ਵਾਪਸ" },
  ur: { home: "ہوم", calendar: "کیلنڈر", weather: "موسم", support: "مدد", history: "تاریخ", back: "واپس" },
  or: { home: "ମୂଳପୃଷ୍ଠା", calendar: "କ୍ୟାଲେଣ୍ଡର", weather: "ପାଣିପାଗ", support: "ସହାୟତା", history: "ଇତିହାସ", back: "ପଛକୁ" },
  as: { home: "হোম", calendar: "কেলেণ্ডাৰ", weather: "বতৰ", support: "সহায়", history: "ইতিহাস", back: "পিছলৈ" },
  bho: { home: "होम", calendar: "कैलेंडर", weather: "मौसम", support: "सहायता", history: "इतिहास", back: "वापस" },
  mai: { home: "होम", calendar: "कैलेंडर", weather: "मौसम", support: "सहायता", history: "इतिहास", back: "पाछू" },
  mag: { home: "होम", calendar: "कैलेंडर", weather: "मौसम", support: "सहायता", history: "इतिहास", back: "पीछे" },
  sa: { home: "गृहम्", calendar: "पञ्चाङ्गम्", weather: "वातावरणम्", support: "साहाय्यम्", history: "इतिहासः", back: "प्रति" },
  sd: { home: "گهر", calendar: "ڪئلينڊر", weather: "موسم", support: "مدد", history: "تاريخ", back: "واپس" },
  ne: { home: "गृह", calendar: "पात्रो", weather: "मौसम", support: "समर्थन", history: "इतिहास", back: "पछाडि" },
  kok: { home: "घर", calendar: "कॅलेंडर", weather: "हवामान", support: "मदत", history: "इतिहास", back: "फाटीं" },
  mni: { home: "ꯃ मुख्य", calendar: "ꯊꯄꯥꯄꯤ", weather: "ꯅꯣꯡ-ꯆꯤꯡ", support: "ꯃꯇꯦꯡ", history: "ꯏꯇꯤꯍꯥꯁ", back: "ꯍꯟꯖꯤꯜꯂꯛꯎ" },
  bo: { home: "གཙོ་ངོས།", calendar: "ལོ་ཐོ།", weather: "གནམ་གཤིས།", support: "རོགས་སྐྱོར།", history: "ལོ་རྒྱུས།", back: "ཕྱིར་ལོག" },
  ks: { home: "گھر", calendar: "کیلنڈر", weather: "موسم", support: "مدد", history: "تاریخ", back: "واپس" },
  doi: { home: "घर", calendar: "कैलेंडर", weather: "मौसम", support: "मदद", history: "इतिहास", back: "पिच्छें" },
};

interface MainAppProps {
  language: Language;
  userInfo: UserInfo;
}

export default function MainApp({ language, userInfo }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<MainAppPage>('home');
  const t = translations[language.code as keyof typeof translations] || translations.hi;

  const navigateToPage = (page: MainAppPage) => {
    setCurrentPage(page);
  };

  const navigateBack = () => {
    setCurrentPage('home');
  };

  const showBackButton = currentPage !== 'home';
  const showBottomNav = ['home', 'calendar', 'weather', 'support', 'history'].includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage language={language} userInfo={userInfo} onNavigate={navigateToPage} />;
      case 'calendar':
        return <CalendarPage language={language} userInfo={userInfo} />;
      case 'weather':
        return <WeatherPage language={language} userInfo={userInfo} />;
      case 'support':
        return <SupportPage language={language} userInfo={userInfo} />;
      case 'history':
        return <HistoryPage language={language} userInfo={userInfo} />;
      case 'voice':
        return <VoicePage language={language} userInfo={userInfo} />;
      case 'text':
        return <TextPage language={language} userInfo={userInfo} />;
      case 'image':
        return <ImagePage language={language} userInfo={userInfo} />;
      default:
        return <HomePage language={language} userInfo={userInfo} onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#F7F6F2' }}>
      {/* Top Navigation Bar */}
      <div className="h-16 flex items-center px-6" style={{ backgroundColor: '#224F27' }}>
        <AnimatePresence>
          {showBackButton && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mr-3"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateBack}
                className="border-0 hover:bg-white/10 p-2"
                style={{ color: '#FFFFFF' }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t.back}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <h1 className="text-xl" style={{ color: '#FFFFFF' }}>
          Kisan Sathi
        </h1>
      </div>

      <div className={`min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderColor: '#E3E3E3'
            }}
          >
            <div className="flex justify-around items-center py-3 px-2">
              {[
                { page: 'home' as MainAppPage, icon: Home, label: t.home },
                { page: 'calendar' as MainAppPage, icon: Calendar, label: t.calendar },
                { page: 'weather' as MainAppPage, icon: Cloud, label: t.weather },
                { page: 'support' as MainAppPage, icon: HelpCircle, label: t.support },
                { page: 'history' as MainAppPage, icon: History, label: t.history },
              ].map(({ page, icon: Icon, label }) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateToPage(page)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px]"
                  style={{
                    backgroundColor: currentPage === page ? '#EAE5D4' : 'transparent'
                  }}
                >
                  <Icon 
                    className="h-6 w-6 mb-1" 
                    style={{ 
                      color: currentPage === page ? '#378632' : '#A4B6A7'
                    }}
                  />
                  <span 
                    className="text-xs"
                    style={{ 
                      color: currentPage === page ? '#378632' : '#A4B6A7'
                    }}
                  >
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}