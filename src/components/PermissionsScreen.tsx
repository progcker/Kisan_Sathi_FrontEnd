import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Camera, Mic, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import type { Language, UserInfo } from '../App';

interface PermissionsScreenProps {
  language: Language;
  userInfo: UserInfo;
  onComplete: () => void;
}

type PermissionStatus = 'pending' | 'granted' | 'denied';

interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
}

const translations = {
  hi: {
    title: 'स्वागत है! अनुमतियां आवश्यक हैं',
    subtitle: 'Kisan Sathi में आपका स्वागत है। बेहतर सेवा के लिए कुछ अनुमतियों की आवश्यकता है',
    cameraTitle: 'कैमरा एक्सेस',
    cameraDesc: 'फसल की तस्वीरें लेने के लिए',
    micTitle: 'माइक्रोफोन एक्सेस',
    micDesc: 'आवाज़ के निर्देशों के लिए',
    allowAll: 'सभी अनुमतियां दें',
    continue: 'जारी रखें',
    granted: 'अनुमति मिली',
    denied: 'अनुमति नहीं मिली',
    pending: 'प्रतीक्षित',
    deniedHelp: 'अनुमति देने के लिए ब्राउज़र सेटिंग्स में जाएं',
    whyNeeded: 'हमें इन अनुमतियों की आवश्यकता क्यों है?',
    cameraWhy: '• फसल की बीमारियों की पहचान करने के लिए',
    micWhy: '• आवाज़ से सवाल पूछने के लिए'
  },
  en: {
    title: 'Welcome! Permissions Required',
    subtitle: 'Welcome to Kisan Sathi. We need some permissions to provide better service',
    cameraTitle: 'Camera Access',
    cameraDesc: 'For taking crop photos',
    micTitle: 'Microphone Access',
    micDesc: 'For voice commands',
    allowAll: 'Allow All Permissions',
    continue: 'Continue',
    granted: 'Granted',
    denied: 'Denied',
    pending: 'Pending',
    deniedHelp: 'Go to browser settings to enable permissions',
    whyNeeded: 'Why do we need these permissions?',
    cameraWhy: '• To identify crop diseases and issues',
    micWhy: '• To ask questions using voice commands'
  },
  ta: {
    title: "வரவேற்பு! அனுமதிகள் தேவை",
    subtitle: "Kisan Sathi இல் வரவேற்கிறோம். சிறந்த சேவைக்கு சில அனுமதிகள் தேவை",
    cameraTitle: "கேமரா அணுகல்",
    cameraDesc: "பயிர் படங்கள் எடுக்க",
    micTitle: "மைக்ரோஃபோன் அணுகல்",
    micDesc: "குரல் கட்டளைகளுக்கு",
    allowAll: "அனைத்து அனுமதிகளையும் அனுமதிக்கவும்",
    continue: "தொடரவும்",
    granted: "அனுமதிக்கப்பட்டது",
    denied: "மறுக்கப்பட்டது",
    pending: "நிலுவையில்",
    deniedHelp: "அனுமதிகளை செயல்படுத்த பிரவுசர் அமைப்புகளுக்குச் செல்லுங்கள்",
    whyNeeded: "இந்த அனுமதிகள் ஏன் தேவை?",
    cameraWhy: "• பயிர் நோய்களை அடையாளம் காண",
    micWhy: "• குரல் கட்டளைகளைப் பயன்படுத்தி கேள்விகள் கேட்க"
  },
  te: {
    title: "స్వాగతం! అనుమతులు అవసరం",
    subtitle: "కిసాన్ సతీకి స్వాగతం. మంచి సేవల కోసం కొన్ని అనుమతులు అవసరం",
    cameraTitle: "కెమెరా యాక్సెస్",
    cameraDesc: "పంట ఫోటోలు తీసుకోవడానికి",
    micTitle: "మైక్రోఫోన్ యాక్సెస్",
    micDesc: "వాయిస్ కమాండ్‌ల కోసం",
    allowAll: "అన్ని అనుమతులు అనుమతించండి",
    continue: "కొనసాగండి",
    granted: "అనుమతించబడింది",
    denied: "అనుమతించబడలేదు",
    pending: "పెండింగ్",
    deniedHelp: "అనుమతులను చేతవసరం చేయడానికి బ్రౌజర్ సెట్టింగ్‌లకు వెళ్లండి",
    whyNeeded: "ఈ అనుమతులు ఎందుకు అవసరం?",
    cameraWhy: "• పంట వ్యాధులను గుర్తించడానికి",
    micWhy: "• వాయిస్ కమాండ్‌లతో ప్రశ్నలు అడగడానికి"
  },
  kn: {
    title: "ಸ್ವಾಗತ! ಅನುಮತಿಗಳು ಅಗತ್ಯ",
    subtitle: "ಕಿಸಾನ್ ಸತ್ಥಿಗೆ ಸ್ವಾಗತ. ಉತ್ತಮ ಸೇವೆಗೆ ಕೆಲವು ಅನುಮತಿಗಳು ಅಗತ್ಯ",
    cameraTitle: "ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ",
    cameraDesc: "ಪಂಧರ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಲು",
    micTitle: "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ",
    micDesc: "ಧ್ವನಿ ಆದೇಶಗಳಿಗೆ",
    allowAll: "ಎಲ್ಲಾ ಅನುಮತಿಗಳನ್ನು ಅನುಮತಿಸಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    granted: "ಅನುಮತಿಸಲ್ಪಟ್ಟಿದೆ",
    denied: "ನಿರಾಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    pending: "ಬಾಕಿಯಿದೆ",
    deniedHelp: "ಅನುಮತಿಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಗೆ ಹೋಗಿ",
    whyNeeded: "ಈ ಅನುಮತಿಗಳು ಏಕೆ ಅಗತ್ಯ?",
    cameraWhy: "• ಪಂಧರ ರೋಗಗಳನ್ನು ಗುರುತಿಸಲು",
    micWhy: "• ಧ್ವನಿ ಆದೇಶಗಳನ್ನು ಬಳಸಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು"
  },
  ml: {
    title: "സ്വാഗതം! അനുമതികൾ ആവശ്യമാണ്",
    subtitle: "കിസാൻ സത്ഥി യിലേക്ക് സ്വാഗതം. മികച്ച സേവനത്തിന് ചില അനുമതികൾ ആവശ്യമാണ്",
    cameraTitle: "കാമറ ആക്സസ്",
    cameraDesc: "പയർച്ച ഫോട്ടോകൾ എടുക്കാൻ",
    micTitle: "മൈക്രോഫോൺ ആക്സസ്",
    micDesc: "ശബ്ദ കമാൻഡുകൾക്ക്",
    allowAll: "എല്ലാ അനുമതികളും അനുവദിക്കുക",
    continue: "തുടരുക",
    granted: "അനുവദിച്ചു",
    denied: "നിഷേധിച്ചു",
    pending: "പെൻഡിങ്",
    deniedHelp: "അനുമതികൾ സജ്ജമാക്കാൻ ബ്രൗസർ സെറ്റിംഗ്സിലേക്ക് പോകുക",
    whyNeeded: "ഈ അനുമതികൾ എന്തിന് ആവശ്യം?",
    cameraWhy: "• പയർച്ച രോഗങ്ങൾ തിരിച്ചറിയാൻ",
    micWhy: "• ശബ്ദ കമാൻഡുകൾ ഉപയോഗിച്ച് ചോദ്യങ്ങൾ ചോദിക്കാൻ"
  },
  bn: {
    title: "স্বাগতম! অনুমতি প্রয়োজন",
    subtitle: "কিসান সাথীতে স্বাগতম। ভালো সেবার জন্য কিছু অনুমতি প্রয়োজন",
    cameraTitle: "ক্যামেরা অ্যাক্সেস",
    cameraDesc: "ফসলের ছবি তোলার জন্য",
    micTitle: "মাইক্রোফোন অ্যাক্সেস",
    micDesc: "কণ্ঠ কমান্ডের জন্য",
    allowAll: "সব অনুমতি অনুমোদন করুন",
    continue: "চালিয়ে যান",
    granted: "অনুমোদিত",
    denied: "প্রত্যাখ্যাত",
    pending: "অপেক্ষমাণ",
    deniedHelp: "অনুমতি সক্রিয় করতে ব্রাউজার সেটিংসে যান",
    whyNeeded: "এই অনুমতিগুলো কেন প্রয়োজন?",
    cameraWhy: "• ফসলের রোগ চিহ্নিত করার জন্য",
    micWhy: "• কণ্ঠ কমান্ড ব্যবহার করে প্রশ্ন করার জন্য"
  },
  gu: {
    title: "સ્વાગત! અનુમતિઓ જરૂરી",
    subtitle: "કિસાન સથીમાં આપનું સ્વાગત છે. વધુ સારી સેવા માટે કેટલીક અનુમતિઓ જરૂરી છે",
    cameraTitle: "કેમેરા ઍક્સેસ",
    cameraDesc: "પાકની તસવીરો લેવા માટે",
    micTitle: "માઇક્રોફોન ઍક્સેસ",
    micDesc: "આવાજના આદેશો માટે",
    allowAll: "બધી અનુમતિઓ આપો",
    continue: "ચાલુ રાખો",
    granted: "મંજૂર",
    denied: "નકારેલ",
    pending: "લોલાયેલ",
    deniedHelp: "અનુમતિઓ સક્રિય કરવા બ્રાઉઝર સેટિંગ્સમાં જાઓ",
    whyNeeded: "આ અનુમતિઓ કેમ જરૂરી છે?",
    cameraWhy: "• પાકની બીમારીઓ ઓળખવા માટે",
    micWhy: "• આવાજના આદેશો વાપરીને પ્રશ્નો પૂછવા માટે"
  },
  mr: {
    title: "स्वागत! परवानग्या आवश्यक",
    subtitle: "किसान साथीमध्ये स्वागत आहे. चांगली सेवा देण्यासाठी काही परवानग्या आवश्यक आहेत",
    cameraTitle: "कॅमेरा ऍक्सेस",
    cameraDesc: "पिकांच्या फोटोंसाठी",
    micTitle: "मायक्रोफोन ऍक्सेस",
    micDesc: "अवाजाच्या सूचनांसाठी",
    allowAll: "सर्व परवानग्या द्या",
    continue: "पुढे जा",
    granted: "मंजूर",
    denied: "नाकारले",
    pending: "प्रलंबित",
    deniedHelp: "परवानग्या सक्रिय करण्यासाठी ब्राउझर सेटिंग्जमध्ये जा",
    whyNeeded: "या परवानग्या का आवश्यक आहेत?",
    cameraWhy: "• पिकांच्या रोगांची ओळख पटवण्यासाठी",
    micWhy: "• अवाजाच्या सूचना वापरून प्रश्न विचारण्यासाठी"
  },
  pa: {
    title: "ਸਵਾਗਤ! ਇਜਾਜ਼ਤਾਂ ਜ਼ਰੂਰੀ ਹਨ",
    subtitle: "ਕਿਸਾਨ ਸਾਥੀ ਵਿੱਚ ਸਵਾਗਤ ਹੈ। ਬਿਹਤਰ ਸੇਵਾ ਲਈ ਕੁਝ ਇਜਾਜ਼ਤਾਂ ਜ਼ਰੂਰੀ ਹਨ",
    cameraTitle: "ਕੈਮਰਾ ਐਕਸੈੱਸ",
    cameraDesc: "ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਲੈਣ ਲਈ",
    micTitle: "ਮਾਈਕ੍ਰੋਫੋਨ ਐਕਸੈੱਸ",
    micDesc: "ਆਵਾਜ਼ ਦੇ ਹੁਕਮਾਂ ਲਈ",
    allowAll: "ਸਭ ਇਜਾਜ਼ਤਾਂ ਦਿਓ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    granted: "ਇਜਾਜ਼ਤ ਦਿੱਤੀ",
    denied: "ਇਜਾਜ਼ਤ ਨਹੀਂ ਦਿੱਤੀ",
    pending: "ਲੋਲਾਇਆ ਹੋਇਆ",
    deniedHelp: "ਇਜਾਜ਼ਤਾਂ ਨੂੰ ਸਕ੍ਰਿਯ ਕਰਨ ਲਈ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਜ਼ ਵਿੱਚ ਜਾਓ",
    whyNeeded: "ਇਹਨਾਂ ਇਜਾਜ਼ਤਾਂ ਦੀ ਲੋੜ ਕਿਉਂ ਹੈ?",
    cameraWhy: "• ਫਸਲ ਦੀਆਂ ਬੀਮਾਰੀਆਂ ਪਛਾਣਨ ਲਈ",
    micWhy: "• ਆਵਾਜ਼ ਨਾਲ ਸਵਾਲ ਪੁੱਛਣ ਲਈ"
  },
  ur: {
    title: "خوش آمدید! اجازتیں درکار ہیں",
    subtitle: "کسان ساتھی میں خوش آمدید۔ بہتر سروس کے لیے کچھ اجازتوں کی ضرورت ہے",
    cameraTitle: "کیمرہ رسائی",
    cameraDesc: "فصل کی تصاویر لینے کے لیے",
    micTitle: "مائیکروفون رسائی",
    micDesc: "آواز کے حکموں کے لیے",
    allowAll: "تمام اجازتیں دیں",
    continue: "جاری رکھیں",
    granted: "اجازت دی گئی",
    denied: "اجازت نہیں دی گئی",
    pending: "منتظر",
    deniedHelp: "اجازتوں کو فعال کرنے کے لیے براؤزر سیٹنگز میں جائیں",
    whyNeeded: "ہمیں ان اجازتوں کی ضرورت کیوں ہے؟",
    cameraWhy: "• فصل کی بیماریوں کی شناخت کے لیے",
    micWhy: "• آواز سے سوالات پوچھنے کے لیے"
  },
  or: {
    title: "ସ୍ୱାଗତ! ଅନୁମତି ଆବଶ୍ୟକ",
    subtitle: "କିସାନ ସଥୀରେ ସ୍ୱାଗତ। ଭଲ ସେବା ପାଇଁ କିଛି ଅନୁମତି ଆବଶ୍ୟକ",
    cameraTitle: "କ୍ୟାମେରା ପ୍ରବେଶ",
    cameraDesc: "ଫସଲର ଛବି ନେବା ପାଇଁ",
    micTitle: "ମାଇକ୍ରୋଫୋନ ପ୍ରବେଶ",
    micDesc: "ଆବାଜ ନିର୍ଦ୍ଦେଶ ପାଇଁ",
    allowAll: "ସମସ୍ତ ଅନୁମତି ଦିଅନ୍ତୁ",
    continue: "ଚାଲୁ ରଖନ୍ତୁ",
    granted: "ଅନୁମତି ଦିଆଗଲା",
    denied: "ଅନୁମତି ନଦିଆଗଲା",
    pending: "ଅପେକ୍ଷାରେ",
    deniedHelp: "ଅନୁମତି ସକ୍ରିୟ କରିବା ପାଇଁ ବ୍ରାଉଜର ସେଟିଂଗ୍‌ରେ ଯାଅନ୍ତୁ",
    whyNeeded: "ଏହି ଅନୁମତିଗୁଡ଼ିକ କାହିଁକି ଆବଶ୍ୟକ?",
    cameraWhy: "• ଫସଲର ରୋଗ ଚିହ୍ନନ୍ତୁ",
    micWhy: "• ଆବାଜରୁ ପ୍ରଶ୍ନ ପଚାରିବା ପାଇଁ"
  },
  as: {
    title: "স্বাগতম! অনুমতি প্ৰয়োজনীয়",
    subtitle: "কিচান চাথীত স্বাগতম। ভাল সেৱাৰ বাবে কিছুমান অনুমতি প্ৰয়োজন",
    cameraTitle: "কেমেৰা প্ৰৱেশ",
    cameraDesc: "শস্যৰ ছবি ল'বলৈ",
    micTitle: "মাইক্ৰঅফ'ন প্ৰৱেশ",
    micDesc: "আৱাজৰ নিৰ্দেশনাৰ বাবে",
    allowAll: "সকলো অনুমতি দিয়ক",
    continue: "অগ্ৰসৰ",
    granted: "অনুমতি দিয়া হ'ল",
    denied: "অনুমতি নিদিয়া হ'ল",
    pending: "প্ৰতীক্ষাত",
    deniedHelp: "অনুমতি চালু কৰিবলৈ ব্ৰাউজাৰ সেটিংত যাওক",
    whyNeeded: "এই অনুমতিসমূহৰ প্ৰয়োজন কিয়?",
    cameraWhy: "• শস্যৰ ৰোগ চিনাক্তকৰণৰ বাবে",
    micWhy: "• আৱাজে প্ৰশ্ন কৰাৰ বাবে"
  },
  bho: {
    title: "स्वागत! अनुमति जरूरी बा",
    subtitle: "किसान साथी में स्वागत बा। बेहतर सेवा खातिर कुछ अनुमति जरूरी बा",
    cameraTitle: "कैमरा एक्सेस",
    cameraDesc: "फसल के फोटो ले के खातिर",
    micTitle: "माइक्रोफोन एक्सेस",
    micDesc: "आवाज के निर्देश खातिर",
    allowAll: "सब अनुमति दिहा",
    continue: "जारी राखा",
    granted: "अनुमति मिलल",
    denied: "अनुमति ना मिलल",
    pending: "प्रतीक्षा में",
    deniedHelp: "अनुमति देब खातिर ब्राउजर सेटिंग में जाईं",
    whyNeeded: "ई अनुमति काहे जरूरी बा?",
    cameraWhy: "• फसल के रोग पहचान खातिर",
    micWhy: "• आवाज से सवाल पूछ खातिर"
  },
  mai: {
    title: "स्वागत! अनुमति जरूरी",
    subtitle: "किसान साथी में स्वागत। बेहतर सेवा खातिर कुछ अनुमति जरूरी",
    cameraTitle: "कैमरा एक्सेस",
    cameraDesc: "फसल के फोटो ले के खातिर",
    micTitle: "माइक्रोफोन एक्सेस",
    micDesc: "आवाज के निर्देश खातिर",
    allowAll: "सब अनुमति दिअ",
    continue: "जारी राखा",
    granted: "अनुमति मिलल",
    denied: "अनुमति ना मिलल",
    pending: "प्रतीक्षा में",
    deniedHelp: "अनुमति देब खातिर ब्राउजर सेटिंग में जाईं",
    whyNeeded: "ई अनुमति काहे जरूरी?",
    cameraWhy: "• फसल के रोग पहचान खातिर",
    micWhy: "• आवाज से सवाल पूछ खातिर"
  },
  mag: {
    title: "स्वागत! अनुमति जरूरी",
    subtitle: "किसान साथी में स्वागत। बेहतर सेवा खातिर कुछ अनुमति जरूरी",
    cameraTitle: "कैमरा एक्सेस",
    cameraDesc: "फसल के फोटो ले के खातिर",
    micTitle: "माइक्रोफोन एक्सेस",
    micDesc: "आवाज के निर्देश खातिर",
    allowAll: "सब अनुमति दा",
    continue: "जारी राखा",
    granted: "अनुमति मिलल",
    denied: "अनुमति ना मिलल",
    pending: "प्रतीक्षा में",
    deniedHelp: "अनुमति देब खातिर ब्राउजर सेटिंग में जाईं",
    whyNeeded: "ई अनुमति काहे जरूरी?",
    cameraWhy: "• फसल के रोग पहचान खातिर",
    micWhy: "• आवाज से सवाल पूछ खातिर"
  },
  sa: {
    title: "स्वागतम्! अनुमतयः आवश्यकाः",
    subtitle: "किसानसाथिम् स्वागतम्। उत्कृष्टसेवायै कतिपयानुमतानां आवश्यकता अस्ति",
    cameraTitle: "कामेरानुप्रवेशः",
    cameraDesc: "फसलचित्राणि ग्रहणाय",
    micTitle: "माइक्रोफोननुप्रवेशः",
    micDesc: "आवाज्ञानिर्देशाय",
    allowAll: "सर्वानुमतानि दातव्यम्",
    continue: "अनुगमनम्",
    granted: "अनुमतिः प्रदत्ता",
    denied: "अनुमतिः न प्रदत्ता",
    pending: "प्रतीक्षमाणम्",
    deniedHelp: "अनुमतिप्रदानेन ब्राउजरसेटिंग्सु गच्छतु",
    whyNeeded: "किमर्थं एतान् अनुमतिप्रयोजनम्?",
    cameraWhy: "• फसलरोगसंज्ञानाय",
    micWhy: "• आवाज्ञाप्रश्नप्रश्नाय"
  },
  sd: {
    title: "خوش آمدی! اجازتيون گهرجي",
    subtitle: "ڪسان ساتھيءَ ۾ خوش آمدی. بهتر سروس لاءِ ڪجھ اجازتيون گهرجي",
    cameraTitle: "ڪيمرا رسائي",
    cameraDesc: "فصل جي تصويرون وٺڻ لاءِ",
    micTitle: "مائڪروفون رسائي",
    micDesc: "آواز جي هدايتن لاءِ",
    allowAll: "سڀ اجازتيون ڏيو",
    continue: "جاري رکجو",
    granted: "اجازت ڏني وئي",
    denied: "اجازت نه ڏني وئي",
    pending: "باقي",
    deniedHelp: "اجازتيون کي فعال ڪرڻ لاءِ برائوزر سيٽنگن ۾ وڃو",
    whyNeeded: "هنن اجازتين جي ضرورت ڇو آهي؟",
    cameraWhy: "• فصل جي بيمارين جي شناخت لاءِ",
    micWhy: "• آواز سان سوال پڇڻ لاءِ"
  },
  ne: {
    title: "स्वागत! अनुमतिहरू आवश्यक छन्",
    subtitle: "किसान साथीमा स्वागत छ। राम्रो सेवाका लागि केही अनुमतिहरू आवश्यक छन्",
    cameraTitle: "क्यामेरा पहुँच",
    cameraDesc: "बालीका फोटोहरू लिन",
    micTitle: "माइक्रोफोन पहुँच",
    micDesc: "आवाज आदेशहरूका लागि",
    allowAll: "सबै अनुमतिहरू दिनुहोस्",
    continue: "जारी राख्नुहोस्",
    granted: "अनुमति दिइयो",
    denied: "अनुमति अस्वीकृत",
    pending: "पेन्डिङ",
    deniedHelp: "अनुमतिहरू सक्षम गर्न ब्राउजर सेटिङहरूमा जानुहोस्",
    whyNeeded: "यी अनुमतिहरू किन आवश्यक छन्?",
    cameraWhy: "• बालीका रोगहरू पहिचान गर्न",
    micWhy: "• आवाज आदेशहरू प्रयोग गरेर प्रश्नहरू सोध्न"
  },
  kok: {
    title: "स्वागत! परवानग्या लागतील",
    subtitle: "किसान साथीमध्ये स्वागत. चांगली सेवा देण्यासाठी काही परवानग्या लागतील",
    cameraTitle: "कॅमेरा ऍक्सेस",
    cameraDesc: "पिकांच्या फोटोंसाठी",
    micTitle: "मायक्रोफोन ऍक्सेस",
    micDesc: "अवाजाच्या सूचनांसाठी",
    allowAll: "सर्व परवानग्या द्या",
    continue: "पुढे जा",
    granted: "मंजूर",
    denied: "नाकारले",
    pending: "प्रलंबित",
    deniedHelp: "परवानग्या सक्रिय करण्यासाठी ब्राउझर सेटिंग्जमध्ये जा",
    whyNeeded: "या परवानग्या का लागतील?",
    cameraWhy: "• पिकांच्या रोगांची ओळख पटवण्यासाठी",
    micWhy: "• अवाजाच्या सूचना वापरून प्रश्न विचारण्यासाठी"
  },
  mni: {
    title: "খুষি আহুঁবা! অনুমতি লাগুম",
    subtitle: "কিচান চাথীত খুষি আহুঁবা। ভাল সেৱাৰ বাবে কিছুমান অনুমতি লাগুম",
    cameraTitle: "কেমেৰা প্ৰৱেশ",
    cameraDesc: "শস্যৰ ছবি ল'বলৈ",
    micTitle: "মাইক্ৰঅফ'ন প্ৰৱেশ",
    micDesc: "আৱাজৰ নিৰ্দেশনাৰ বাবে",
    allowAll: "সকলো অনুমতি দিয়ক",
    continue: "অগ্ৰসৰ",
    granted: "অনুমতি দিয়া হ'ল",
    denied: "অনুমতি নিদিয়া হ'ল",
    pending: "প্ৰতীক্ষাত",
    deniedHelp: "অনুমতি চালু কৰিবলৈ ব্ৰাউজাৰ সেটিংত যাওক",
    whyNeeded: "এই অনুমতিসমূহৰ প্ৰয়োজন কিয়?",
    cameraWhy: "• শস্যৰ ৰোগ চিনাক্তকৰণৰ বাবে",
    micWhy: "• আৱাজে প্ৰশ্ন কৰাৰ বাবে"
  },
  bo: {
    title: "བཀྲ་ཤིས་བདེ་ལེགས། མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    subtitle: "ཀི་སན་ས་ཐི་ལ་གླེང་བ། བརྒྱད་སྐྱོན་གྱི་རྒྱུན་མི་འདུག",
    cameraTitle: "ཀམ་ར་འབྲེལ་བ",
    cameraDesc: "ཟས་ལས་ཀྱི་རྟེན་འབྲེལ་བ",
    micTitle: "མཻ་ཀྲོ་ཕོན་འབྲེལ་བ",
    micDesc: "སྐད་ཆ་འབྲེལ་བ",
    allowAll: "མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    continue: "འགྲོ་བ་སྔོན་པོ",
    granted: "མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    denied: "མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    pending: "བསྒྲུབ་བྱ་སྐབས",
    deniedHelp: "མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    whyNeeded: "འདིར་མཁོ་རྒྱུ་འབྲེལ་བ་རྒྱུན་མི་འདུག",
    cameraWhy: "• ཟས་ལས་ཀྱི་ནད་འབྲེལ་བ",
    micWhy: "• སྐད་ཆ་འབྲེལ་བ"
  },
  ks: {
    title: "خوش آمدی! اجازتيون گهرجي",
    subtitle: "کسان ساتھی میں خوش آمدی. بہتر سروس کے لیے کچھ اجازتوں کی ضرورت ہے",
    cameraTitle: "کیمرہ رسائی",
    cameraDesc: "فصل کی تصاویر لینے کے لیے",
    micTitle: "مائیکروفون رسائی",
    micDesc: "آواز کے حکموں کے لیے",
    allowAll: "تمام اجازتیں دیں",
    continue: "جاری رکھیں",
    granted: "اجازت دی گئی",
    denied: "اجازت نہیں دی گئی",
    pending: "منتظر",
    deniedHelp: "اجازتوں کو فعال کرنے کے لیے براؤزر سیٹنگز میں جائیں",
    whyNeeded: "ہمیں ان اجازتوں کی ضرورت کیوں ہے؟",
    cameraWhy: "• فصل کی بیماریوں کی شناخت کے لیے",
    micWhy: "• آواز سے سوالات پوچھنے کے لیے"
  },
  doi: {
    title: "ਸਵਾਗਤ! ਇਜਾਜ਼ਤਾਂ ਜ਼ਰੂਰੀ ਹਨ",
    subtitle: "ਕਿਸਾਨ ਸਾਥੀ ਵਿੱਚ ਸਵਾਗਤ ਹੈ। ਬਿਹਤਰ ਸੇਵਾ ਲਈ ਕੁਝ ਇਜਾਜ਼ਤਾਂ ਜ਼ਰੂਰੀ ਹਨ",
    cameraTitle: "ਕੈਮਰਾ ਐਕਸੈੱਸ",
    cameraDesc: "ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਲੈਣ ਲਈ",
    micTitle: "ਮਾਈਕ੍ਰੋਫੋਨ ਐਕਸੈੱਸ",
    micDesc: "ਆਵਾਜ਼ ਦੇ ਹੁਕਮਾਂ ਲਈ",
    allowAll: "ਸਭ ਇਜਾਜ਼ਤਾਂ ਦਿਓ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    granted: "ਇਜਾਜ਼ਤ ਦਿੱਤੀ",
    denied: "ਇਜਾਜ਼ਤ ਨਹੀਂ ਦਿੱਤੀ",
    pending: "ਲੋਲਾਇਆ ਹੋਇਆ",
    deniedHelp: "ਇਜਾਜ਼ਤਾਂ ਨੂੰ ਸਕ੍ਰਿਯ ਕਰਨ ਲਈ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਜ਼ ਵਿੱਚ ਜਾਓ",
    whyNeeded: "ਇਹਨਾਂ ਇਜਾਜ਼ਤਾਂ ਦੀ ਲੋੜ ਕਿਉਂ ਹੈ?",
    cameraWhy: "• ਫਸਲ ਦੀਆਂ ਬੀਮਾਰੀਆਂ ਪਛਾਣਨ ਲਈ",
    micWhy: "• ਆਵਾਜ਼ ਨਾਲ ਸਵਾਲ ਪੁੱਛਣ ਲਈ"
  }
};

export default function PermissionsScreen({ language, userInfo, onComplete }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'pending',
    microphone: 'pending'
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  // Detect existing permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

        setPermissions({
          camera: cameraPermission.state === 'granted' ? 'granted' : 'denied',
          microphone: micPermission.state === 'granted' ? 'granted' : 'denied'
        });
      } catch (error) {
        console.warn('Permission query not supported', error);
      }
    };

    checkPermissions();
  }, []);

  const bothGranted = permissions.camera === 'granted' && permissions.microphone === 'granted';

  const requestCameraPermission = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      cameraStream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      return true;
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setPermissions(prev => ({ ...prev, camera: 'denied' }));
      } else if (error.name === 'NotFoundError') {
        console.warn('No camera device found');
        setPermissions(prev => ({ ...prev, camera: 'denied' }));
      } else if (error.name === 'NotSupportedError') {
        console.warn('Camera not supported by browser');
        setPermissions(prev => ({ ...prev, camera: 'denied' }));
      } else {
        console.warn('Camera permission error:', error.message);
        setPermissions(prev => ({ ...prev, camera: 'denied' }));
      }
      return false;
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioStream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      return true;
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      } else if (error.name === 'NotFoundError') {
        console.warn('No microphone device found');
        setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      } else if (error.name === 'NotSupportedError') {
        console.warn('Microphone not supported by browser');
        setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      } else {
        console.warn('Microphone permission error:', error.message);
        setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      }
      return false;
    }
  };

  const requestPermissions = async () => {
    setIsRequesting(true);
    await Promise.all([
      requestCameraPermission(),
      requestMicrophonePermission()
    ]);
    setIsRequesting(false);
  };

  const getPermissionIcon = (status: PermissionStatus) => {
    switch (status) {
      case 'granted':
        return <CheckCircle className="w-4 h-4" style={{ color: '#378632' }} />;
      case 'denied':
        return <XCircle className="w-4 h-4" style={{ color: '#D34C24' }} />;
      default:
        return <AlertCircle className="w-4 h-4" style={{ color: '#F4AE29' }} />;
    }
  };

  const getPermissionStatusText = (status: PermissionStatus) => {
    switch (status) {
      case 'granted':
        return t.granted;
      case 'denied':
        return t.denied;
      default:
        return t.pending;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EAE5D4' }}>
                  <Shield className="w-6 h-6" style={{ color: '#378632' }} />
                </div>
                <h1 className="text-2xl" style={{ color: '#224F27' }}>
                  Kisan Sathi
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mb-2" style={{ color: '#1C1C1C' }}>{t.title}</h2>
                <p className="text-sm" style={{ color: '#707070' }}>{t.subtitle}</p>
              </motion.div>
            </div>

            {/* Permission Cards */}
            <div className="space-y-4 mb-6">
              {/* Camera Permission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAE5D4' }}>
                          <Camera className="w-5 h-5" style={{ color: '#378632' }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm" style={{ color: '#1C1C1C' }}>{t.cameraTitle}</h3>
                          <p className="text-xs" style={{ color: '#707070' }}>{t.cameraDesc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {permissions.camera === 'pending' && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              setIsRequesting(true);
                              await requestCameraPermission();
                              setIsRequesting(false);
                            }}
                            disabled={isRequesting}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ 
                              backgroundColor: '#378632',
                              color: '#FFFFFF',
                              fontSize: '11px'
                            }}
                          >
                            Allow
                          </Button>
                        )}
                        <div className="flex items-center gap-1">
                          {getPermissionIcon(permissions.camera)}
                          <span className="text-xs" style={{ 
                            color: permissions.camera === 'granted' ? '#378632' : 
                                   permissions.camera === 'denied' ? '#D34C24' : '#F4AE29'
                          }}>
                            {getPermissionStatusText(permissions.camera)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Microphone Permission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAE5D4' }}>
                          <Mic className="w-5 h-5" style={{ color: '#378632' }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm" style={{ color: '#1C1C1C' }}>{t.micTitle}</h3>
                          <p className="text-xs" style={{ color: '#707070' }}>{t.micDesc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {permissions.microphone === 'pending' && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              setIsRequesting(true);
                              await requestMicrophonePermission();
                              setIsRequesting(false);
                            }}
                            disabled={isRequesting}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ 
                              backgroundColor: '#378632',
                              color: '#FFFFFF',
                              fontSize: '11px'
                            }}
                          >
                            Allow
                          </Button>
                        )}
                        <div className="flex items-center gap-1">
                          {getPermissionIcon(permissions.microphone)}
                          <span className="text-xs" style={{ 
                            color: permissions.microphone === 'granted' ? '#378632' : 
                                   permissions.microphone === 'denied' ? '#D34C24' : '#F4AE29'
                          }}>
                            {getPermissionStatusText(permissions.microphone)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Why We Need These */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h4 className="text-xs mb-2" style={{ color: '#1C1C1C' }}>{t.whyNeeded}</h4>
              <div className="text-xs space-y-1" style={{ color: '#707070' }}>
                <p>{t.cameraWhy}</p>
                <p>{t.micWhy}</p>
              </div>
            </motion.div>

            {/* Denied Permissions Help */}
            {(permissions.camera === 'denied' || permissions.microphone === 'denied') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg"
                style={{ backgroundColor: '#FEF7F7', borderColor: '#D34C24', border: '1px solid' }}
              >
                <p className="text-xs" style={{ color: '#D34C24' }}>
                  {t.deniedHelp}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {(permissions.camera === 'pending' || permissions.microphone === 'pending') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={requestPermissions}
                    disabled={isRequesting}
                    className="w-full h-12 rounded-xl"
                    style={{ 
                      backgroundColor: '#378632',
                      color: '#FFFFFF'
                    }}
                  >
                    {isRequesting ? 'Requesting...' : t.allowAll}
                  </Button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={onComplete}
                  variant={bothGranted ? "default" : "outline"}
                  className="w-full h-12 rounded-xl"
                  style={{ 
                    backgroundColor: bothGranted ? '#378632' : '#FFFFFF',
                    color: bothGranted ? '#FFFFFF' : '#1C1C1C',
                    borderColor: bothGranted ? '#378632' : '#E3E3E3'
                  }}
                >
                  {t.continue}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}