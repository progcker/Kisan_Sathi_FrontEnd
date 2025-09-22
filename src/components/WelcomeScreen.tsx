import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Language, UserInfo } from '../App';

const translations = {
  hi: {
    namaste: 'नमस्ते',
    welcome: 'स्वागत है',
    subtitle: 'किसान साथी आपका हार्दिक स्वागत करता है',
    description: 'आपकी खेती को बेहतर बनाने के लिए हम यहाँ हैं',
    continueButton: 'शुरू करें',
  },
  en: {
    namaste: 'Namaste',
    welcome: 'Welcome',
    subtitle: 'Kisan Sathi warmly welcomes you',
    description: 'We are here to make your farming better',
    continueButton: 'Get Started',
  },
  ta: {
    namaste: 'வணக்கம்',
    welcome: 'வரவேற்பு',
    subtitle: 'கிசான் சாத்தி உங்களை அன்புடன் வரவேற்கிறது',
    description: 'உங்கள் விவசாயத்தை சிறப்பாக்க நாங்கள் இங்கே இருக்கிறோம்',
    continueButton: 'தொடங்குங்கள்',
  },
  te: {
  namaste: 'నమస్తే',
  welcome: 'స్వాగతం',
  subtitle: 'కిసాన్ సాథీ మిమ్మల్ని హృదయపూర్వకంగా స్వాగతిస్తుంది',
  description: 'మీ వ్యవసాయాన్ని మెరుగుపరచడానికి మేము ఇక్కడ ఉన్నాము',
  continueButton: 'ప్రారంభించండి',
},
kn: {
  namaste: 'ನಮಸ್ಕಾರ',
  welcome: 'ಸ್ವಾಗತ',
  subtitle: 'किसान साथी ನಿಮ್ಮನ್ನು ಹೃತ್ಪೂರ್ವಕವಾಗಿ ಸ್ವಾಗತಿಸುತ್ತದೆ',
  description: 'ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ನಾವು ಇಲ್ಲಿದ್ದೇವೆ',
  continueButton: 'ಪ್ರಾರಂಭಿಸಿ',
},
ml: {
  namaste: 'നമസ്തേ',
  welcome: 'സ്വാഗതം',
  subtitle: 'കിസാൻ സാഥീ നിങ്ങളെ ഹൃദയപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു',
  description: 'നിങ്ങളുടെ കൃഷി മെച്ചപ്പെടുത്താൻ ഞങ്ങൾ ഇവിടെ ഉണ്ട്',
  continueButton: 'തുടങ്ങുക',
},
bn: {
  namaste: 'নমস্তে',
  welcome: 'স্বাগতম',
  subtitle: 'কিসান সাথী আপনাকে আন্তরিকভাবে স্বাগত জানায়',
  description: 'আপনার চাষাবাদ আরও উন্নত করতে আমরা এখানে আছি',
  continueButton: 'শুরু করুন',
},
gu: {
  namaste: 'નમસ્તે',
  welcome: 'સ્વાગત છે',
  subtitle: 'કિસાન સાથી આપનું હાર્દિક સ્વાગત કરે છે',
  description: 'તમારી ખેતીને સુધારવા અમે અહીં છીએ',
  continueButton: 'શરૂ કરો',
},
mr: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत आहे',
  subtitle: 'किसान साथी तुमचे हार्दिक स्वागत करते',
  description: 'तुमच्या शेतीला अधिक चांगले करण्यासाठी आम्ही येथे आहोत',
  continueButton: 'सुरू करा',
},
pa: {
  namaste: 'ਨਮਸਤੇ',
  welcome: 'ਸਵਾਗਤ ਹੈ',
  subtitle: 'ਕਿਸਾਨ ਸਾਥੀ ਤੁਹਾਡਾ ਤਹਿ-ਦਿਲੋਂ ਸਵਾਗਤ ਕਰਦਾ ਹੈ',
  description: 'ਤੁਹਾਡੀ ਖੇਤੀ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਅਸੀਂ ਇੱਥੇ ਹਾਂ',
  continueButton: 'ਸ਼ੁਰੂ ਕਰੋ',
},
ur: {
  namaste: 'نمستے',
  welcome: 'خوش آمدید',
  subtitle: 'کسان ساتھی آپ کو دل سے خوش آمدید کہتا ہے',
  description: 'ہم آپ کی کھیتی کو بہتر بنانے کے لیے یہاں ہیں',
  continueButton: 'شروع کریں',
},
or: {
  namaste: 'ନମସ୍ତେ',
  welcome: 'ସ୍ୱାଗତ',
  subtitle: 'କିସାନ ସାଥୀ ଆପଣଙ୍କୁ ହୃଦୟପୂର୍ବକ ସ୍ୱାଗତ କରେ',
  description: 'ଆପଣଙ୍କ ଚାଷକୁ ଉନ୍ନତ କରିବା ପାଇଁ ଆମେ ଏଠାରେ ଅଛୁ',
  continueButton: 'ଆରମ୍ଭ କରନ୍ତୁ',
},
as: {
  namaste: 'নমস্কাৰ',
  welcome: 'স্বাগতম',
  subtitle: 'কিসান সাথী আপোনাক আন্তরিকভাৱে স্বাগতম জনাইছে',
  description: 'আপোনাৰ খেতি উন্নত কৰিবলৈ আমি ইয়াত আছো',
  continueButton: 'আৰম্ভ কৰক',
},
bho: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत बा',
  subtitle: 'किसान साथी रउरा के दिल से स्वागत करेला',
  description: 'रउरा खेती के बेहतर बनावे खातिर हमनी इहाँ बानी',
  continueButton: 'शुरू करीं',
},
mai: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत अछि',
  subtitle: 'किसान साथी अहाँक हार्दिक स्वागत करैत अछि',
  description: 'अहाँक खेतीकेँ नीक करबाक लेल हम एतए छी',
  continueButton: 'शुरू करू',
},
mag: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत ह',
  subtitle: 'किसान साथी तोरा हार्दिक स्वागत कर रहल छ',
  description: 'तोहर खेती बेहतर करऽ खातिर हम एतऽ छी',
  continueButton: 'शुरू कर',
},
sa: {
  namaste: 'नमस्ते',
  welcome: 'स्वागतम्',
  subtitle: 'किसान साथी भवतः हृदयेन स्वागतं करोति',
  description: 'भवतः कृषिं उत्तमां कर्तुं वयं अत्र स्मः',
  continueButton: 'आरभत',
},
sd: {
  namaste: 'نمستے',
  welcome: 'ڀليڪار',
  subtitle: 'کسان ساتھی توھانجو دل سان ڀليڪار ڪري ٿو',
  description: 'اسان ھتي آھيون توھانجي زراعت بھتر ڪرڻ لاءِ',
  continueButton: 'شروع ڪيو',
},
ne: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत छ',
  subtitle: 'किसान साथी तपाईंलाई हार्दिक स्वागत गर्दछ',
  description: 'तपाईंको खेतीलाई अझ राम्रो बनाउन हामी यहाँ छौं',
  continueButton: 'सुरु गर्नुहोस्',
},
kok: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत',
  subtitle: 'किसान साथी तुमका हृदयापासून स्वागत करता',
  description: 'तुमची शेती चांगली करपाक आमी हांगा आसा',
  continueButton: 'सुरू करात',
},
mni: {
  namaste: 'নমস্তে',
  welcome: 'ꯁꯋꯥꯒꯦꯠ',
  subtitle: 'কিসান সাথী ꯑꯃꯁꯤꯡ ꯍꯤꯡꯗꯤ ꯑꯣꯏꯁꯤ ꯁꯋꯥꯒꯦꯠ ꯇꯧꯕꯥ',
  description: 'ꯑꯃꯁꯤꯡ ꯀꯔꯤꯁꯤ ꯄꯥꯔꯤꯕꯥ ꯍꯥꯏꯔꯦꯡꯁꯤ ꯑꯃꯁꯤ ꯍꯥꯏ',
  continueButton: 'ꯁ꯭ꯇꯔꯥꯗꯔ',
},
bo: {
  namaste: 'བཀྲ་ཤིས་',
  welcome: 'འབྱོར་བའི་ཞུགས་སྒུག',
  subtitle: 'ཀི་སཱན་ས་ཐི་ཁྱེད་ལ་བཀའ་ཕབ་བྱེད་རོགས།',
  description: 'ཁྱེད་ཀྱི་རྒྱུ་འབྲས་གོང་འཕེལ་གཏོང་དགོས་པས་ང་ཚོ་འདིར་ཡོད།',
  continueButton: 'འགོ་བཙུགས།',
},
ks: {
  namaste: 'نمستے',
  welcome: 'خوش آمد',
  subtitle: 'کسان ساتھی تہند ہردے سان خوش آمد کَرن وُچھ',
  description: 'اسی تہند زراعت بہتر بنون ہِنز یتھ آو',
  continueButton: 'شروع کَرِو',
},
doi: {
  namaste: 'नमस्ते',
  welcome: 'स्वागत ऐ',
  subtitle: 'किसान साथी तुंदा दिलो स्वागत करदा ऐ',
  description: 'तुंदी खेती नूं वधिया बनाण वास्ते असां इत्थे आं',
  continueButton: 'शुरू करो',
},

  // Default to Hindi for other languages
};

interface WelcomeScreenProps {
  language: Language;
  userInfo: UserInfo;
  onComplete: () => void;
}

export default function WelcomeScreen({ language, userInfo, onComplete }: WelcomeScreenProps) {
  const t = translations[language.code as keyof typeof translations] || translations.hi;

  useEffect(() => {
    // Auto continue after 4 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F6F2' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="text-center max-w-lg"
      >
        {/* Farmer Image */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4" style={{ borderColor: '#378632' }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1623211268529-69c56e303312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDF8fHx8MTc1Nzg1ODc5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Indian Farmer"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4AE29' }}>
              <Sparkles className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 6, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-2 -left-2"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#378632' }}>
              <Heart className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Greeting Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ color: '#224F27' }}>
            {t.namaste} 🙏
          </h1>
          
          {userInfo.name && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-2xl sm:text-3xl mb-3" style={{ color: '#378632' }}
            >
              {userInfo.name}!
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-lg sm:text-xl mb-2" style={{ color: '#1C1C1C' }}
          >
            {t.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-base mb-10" style={{ color: '#707070' }}
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Button
            onClick={onComplete}
            className="px-8 py-3 text-lg rounded-full border-0 transform hover:scale-105 transition-all duration-200"
            style={{ 
              backgroundColor: '#378632',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A6B28';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#378632';
            }}
          >
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {t.continueButton}
            </motion.span>
          </Button>
        </motion.div>

        {/* Language and Location Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-8 text-sm space-y-2" style={{ color: '#707070' }}
        >
          <p>{language.nativeName}</p>
          <p>{userInfo.location}</p>
        </motion.div>

        {/* Auto-advance indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="mt-8"
        >
          <div className="w-24 h-1 rounded-full mx-auto overflow-hidden" style={{ backgroundColor: '#EAE5D4' }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-full rounded-full"
              style={{ backgroundColor: '#378632' }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: '#707070' }}>Starting in a moment...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}