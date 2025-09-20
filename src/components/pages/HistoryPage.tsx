import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Mic, MessageSquare, Image, Search, Filter, Trash2, Download, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language, UserInfo } from '../../App';

const translations = {
  hi: {
    title: 'इतिहास',
    subtitle: 'आपकी पिछली खोजें और सुझाव',
    searchPlaceholder: 'इतिहास में खोजें...',
    filterBy: 'फिल्टर करें',
    allTypes: 'सभी प्रकार',
    voice: 'आवाज़',
    text: 'टेक्स्ट',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ़ करें',
    exportHistory: 'इतिहास डाउनलोड करें',
    noHistory: 'कोई इतिहास नहीं मिला',
    noResults: 'खोज परिणाम नहीं मिले',
    confirmClear: 'क्या आप सभी इतिहास साफ़ करना चाहते हैं?',
    itemsFound: 'आइटम मिले',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'कल',
    thisWeek: 'इस सप्ताह',
    older: 'पुराने',
    cancel: 'रद्द करें',
    confirm: 'हाँ, साफ़ करें',
    noResultsMessage: 'अलग फिल्टर या खोज शब्द का प्रयास करें',
    noHistoryMessage: 'AI के साथ बातचीत शुरू करें और यहाँ इतिहास दिखेगा',
    questionLabel: 'सवाल',
    answerLabel: 'जवाब',
    languageLabel: 'भाषा',
  },
  en: {
    title: 'History',
    subtitle: 'Your previous searches and suggestions',
    searchPlaceholder: 'Search in history...',
    filterBy: 'Filter by',
    allTypes: 'All Types',
    voice: 'Voice',
    text: 'Text',
    image: 'Photo',
    clearHistory: 'Clear History',
    exportHistory: 'Export History',
    noHistory: 'No history found',
    noResults: 'No search results found',
    confirmClear: 'Do you want to clear all history?',
    itemsFound: 'items found',
    offlineAvailable: 'Available offline',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    older: 'Older',
    cancel: 'Cancel',
    confirm: 'Yes, clear',
    noResultsMessage: 'Try a different filter or search term',
    noHistoryMessage: 'Start interacting with the AI and your history will appear here',
    questionLabel: 'Question',
    answerLabel: 'Answer',
    languageLabel: 'Language',
  },
  ta: {
    title: 'வரலாறு',
    subtitle: 'உங்கள் முந்தைய தேடல்கள் மற்றும் பரிந்துரைகள்',
    searchPlaceholder: 'வரலாற்றில் தேடுங்கள்...',
    filterBy: 'வடிகட்டு',
    allTypes: 'அனைத்து வகைகள்',
    voice: 'குரல்',
    text: 'உரை',
    image: 'புகைப்படம்',
    clearHistory: 'வரலாற்றை அழிக்கவும்',
    exportHistory: 'வரலாற்றை பதிவிறக்கவும்',
    noHistory: 'வரலாறு இல்லை',
    noResults: 'தேடல் முடிவுகள் கிடைக்கவில்லை',
    confirmClear: 'அனைத்து வரலாற்றையும் அழிக்க விரும்புகிறீர்களா?',
    itemsFound: 'உருப்படிகள் கண்டறியப்பட்டன',
    offlineAvailable: 'ஆஃப்லைனில் கிடைக்கும்',
    today: 'இன்று',
    yesterday: 'நேற்று',
    thisWeek: 'இந்த வாரம்',
    older: 'பழையது',
    cancel: 'ரத்துசெய்',
    confirm: 'ஆம், அழிக்கவும்',
    noResultsMessage: 'வேறு வடிப்பான் அல்லது தேடல் சொல்லை முயற்சிக்கவும்',
    noHistoryMessage: 'AI உடன் தொடர்பு கொள்ளத் தொடங்குங்கள், உங்கள் வரலாறு இங்கே தோன்றும்',
    questionLabel: 'கேள்வி',
    answerLabel: 'பதில்',
    languageLabel: 'மொழி',
  },
  te: {
    title: 'చరిత్ర',
    subtitle: 'మీ గత శోధనలు మరియు సూచనలు',
    searchPlaceholder: 'చరిత్రలో శోధించండి...',
    filterBy: 'ఫిల్టర్ చేయి',
    allTypes: 'అన్ని రకాల',
    voice: 'వాయిస్',
    text: 'టెక్స్ట్',
    image: 'ఫోటో',
    clearHistory: 'చరిత్రను క్లియర్ చేయండి',
    exportHistory: 'చరిత్రను డౌన్‌లోడ్ చేయండి',
    noHistory: 'చరిత్ర కనబడలేదు',
    noResults: 'శోధన ఫలితాలు లేవు',
    confirmClear: 'మీరు మొత్తం చరిత్రను క్లియర్ చేయాలనుకుంటున్నారా?',
    itemsFound: 'అంశాలు కనుగొనబడ్డాయి',
    offlineAvailable: 'ఆఫ్లైన్‌లో అందుబాటులో ఉంది',
    today: 'ఈ రోజు',
    yesterday: 'నిన్న',
    thisWeek: 'ఈ వారం',
    older: 'పాతవి',
    cancel: 'రద్దు చేయి',
    confirm: 'అవును, క్లియర్ చేయి',
    noResultsMessage: 'వేరే ఫిల్టర్ లేదా శోధన పదాన్ని ప్రయత్నించండి',
    noHistoryMessage: 'AIతో సంభాషణ ప్రారంభించండి మరియు మీ చరిత్ర ఇక్కడ కనిపిస్తుంది',
    questionLabel: 'ప్రశ్న',
    answerLabel: 'సమాధానం',
    languageLabel: 'భాష',
  },
  kn: {
    title: 'ಇತಿಹಾಸ',
    subtitle: 'ನಿಮ್ಮ ಹಿಂದಿನ ಹುಡುಕಾಟಗಳು ಮತ್ತು ಸಲಹೆಗಳು',
    searchPlaceholder: 'ಇತಿಹಾಸದಲ್ಲಿ ಹುಡುಕಿ...',
    filterBy: 'ಫಿಲ್ಟರ್ ಮಾಡಿ',
    allTypes: 'ಎಲ್ಲಾ ವಿಧಗಳು',
    voice: 'ಧ್ವನಿ',
    text: 'ಪಠ್ಯ',
    image: 'ಫೋಟೋ',
    clearHistory: 'ಇತಿಹಾಸವನ್ನು ಅಳಿಸಿ',
    exportHistory: 'ಇತಿಹಾಸವನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    noHistory: 'ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ',
    noResults: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು ಲಭ್ಯವಿಲ್ಲ',
    confirmClear: 'ಎಲ್ಲಾ ಇತಿಹಾಸವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?',
    itemsFound: 'ಅಂಶಗಳು ಕಂಡುಬಂದಿವೆ',
    offlineAvailable: 'ಆಫ್ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯ',
    today: 'ಇಂದು',
    yesterday: 'ನಿನ್ನೆ',
    thisWeek: 'ಈ ವಾರ',
    older: 'ಹಳೆಯವು',
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirm: 'ಹೌದು, ಅಳಿಸಿ',
    noResultsMessage: 'ಬೇರೆ ಫಿಲ್ಟರ್ ಅಥವಾ ಹುಡುಕಾಟ ಪದವನ್ನು ಪ್ರಯತ್ನಿಸಿ',
    noHistoryMessage: 'AI ಜೊತೆ ಸಂವಹನ ಪ್ರಾರಂಭಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಇತಿಹಾಸ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ',
    questionLabel: 'ಪ್ರಶ್ನೆ',
    answerLabel: 'ಉತ್ತರ',
    languageLabel: 'ಭಾಷೆ',
  },
  ml: {
    title: 'ചരിത്രം',
    subtitle: 'നിങ്ങളുടെ മുൻകാല തിരയലുകളും നിർദ്ദേശങ്ങളും',
    searchPlaceholder: 'ചരിത്രത്തിൽ തിരയുക...',
    filterBy: 'ഫിൽറ്റർ ചെയ്യുക',
    allTypes: 'എല്ലാ തരങ്ങളും',
    voice: 'ശബ്ദം',
    text: 'ടെക്സ്റ്റ്',
    image: 'ഫോട്ടോ',
    clearHistory: 'ചരിത്രം മായ്ക്കുക',
    exportHistory: 'ചരിത്രം ഡൗൺലോഡ് ചെയ്യുക',
    noHistory: 'ചരിത്രം കണ്ടെത്തിയില്ല',
    noResults: 'തിരച്ചിൽ ഫലങ്ങൾ കണ്ടെത്തിയില്ല',
    confirmClear: 'എല്ലാ ചരിത്രവും മായ്ക്കണോ?',
    itemsFound: 'ഇനങ്ങൾ കണ്ടെത്തി',
    offlineAvailable: 'ഓഫ്‌ലൈൻ ലഭ്യമാണ്',
    today: 'ഇന്ന്',
    yesterday: 'ഇന്നലെ',
    thisWeek: 'ഈ ആഴ്ച',
    older: 'പഴയത്',
    cancel: 'റദ്ദാക്കുക',
    confirm: 'അതെ, മായ്ക്കുക',
    noResultsMessage: 'മറ്റൊരു ഫിൽട്ടർ അല്ലെങ്കിൽ തിരയൽ പദം ശ്രമിക്കുക',
    noHistoryMessage: 'AI യുമായി സംവദിക്കാൻ ആരംഭിക്കുക, നിങ്ങളുടെ ചരിത്രം ഇവിടെ ദൃശ്യമാകും',
    questionLabel: 'ചോദ്യം',
    answerLabel: 'ഉത്തരം',
    languageLabel: 'ഭാഷ',
  },
  bn: {
    title: 'ইতিহাস',
    subtitle: 'আপনার পূর্ববর্তী অনুসন্ধান এবং প্রস্তাবনা',
    searchPlaceholder: 'ইতিহাসে অনুসন্ধান করুন...',
    filterBy: 'ফিল্টার করুন',
    allTypes: 'সব ধরণ',
    voice: 'ভয়েস',
    text: 'টেক্সট',
    image: 'ফটো',
    clearHistory: 'ইতিহাস মুছুন',
    exportHistory: 'ইতিহাস ডাউনলোড করুন',
    noHistory: 'কোনও ইতিহাস পাওয়া যায়নি',
    noResults: 'অনুসন্ধানের ফলাফল পাওয়া যায়নি',
    confirmClear: 'আপনি কি সমস্ত ইতিহাস মুছতে চান?',
    itemsFound: 'আইটেম পাওয়া গেছে',
    offlineAvailable: 'অফলাইনে উপলব্ধ',
    today: 'আজ',
    yesterday: 'গতকাল',
    thisWeek: 'এই সপ্তাহে',
    older: 'পুরোনো',
    cancel: 'বাতিল করুন',
    confirm: 'হ্যাঁ, মুছুন',
    noResultsMessage: 'অন্য ফিল্টার বা অনুসন্ধানের শব্দ চেষ্টা করুন',
    noHistoryMessage: 'AI এর সাথে কথা বলা শুরু করুন এবং আপনার ইতিহাস এখানে দেখা যাবে',
    questionLabel: 'প্রশ্ন',
    answerLabel: 'উত্তর',
    languageLabel: 'ভাষা',
  },
  gu: {
    title: 'ઇતિહાસ',
    subtitle: 'તમારા અગાઉના શોધ અને સૂચનો',
    searchPlaceholder: 'ઇતિહાસમાં શોધો...',
    filterBy: 'ફિલ્ટર દ્વારા',
    allTypes: 'બધા પ્રકાર',
    voice: 'આવાજ',
    text: 'લખાણ',
    image: 'ફોટો',
    clearHistory: 'ઇતિહાસ સાફ કરો',
    exportHistory: 'ઇતિહાસ ડાઉનલોડ કરો',
    noHistory: 'કોઈ ઇતિહાસ મળ્યો નથી',
    noResults: 'કોઈ શોધ પરિણામ મળ્યા નથી',
    confirmClear: 'શું તમે તમામ ઇતિહાસ સાફ કરવા માંગો છો?',
    itemsFound: 'આઇટમ્સ મળ્યાં',
    offlineAvailable: 'ઑફલાઇન ઉપલબ્ધ',
    today: 'આજે',
    yesterday: 'ગઇકાલે',
    thisWeek: 'આ અઠવાડિયે',
    older: 'જૂના',
    cancel: 'રદ કરો',
    confirm: 'હા, સાફ કરો',
    noResultsMessage: 'અલગ ફિલ્ટર અથવા શોધ શબ્દનો પ્રયાસ કરો',
    noHistoryMessage: 'AI સાથે વાર્તાલાપ શરૂ કરો અને તમારો ઇતિહાસ અહીં દેખાશે',
    questionLabel: 'પ્રશ્ન',
    answerLabel: 'જવાબ',
    languageLabel: 'ભાષા',
  },
  mr: {
    title: 'इतिहास',
    subtitle: 'आपले मागील शोध आणि सूचना',
    searchPlaceholder: 'इतिहासात शोधा...',
    filterBy: 'फिल्टर करा',
    allTypes: 'सर्व प्रकार',
    voice: 'आवाज',
    text: 'मजकूर',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करा',
    exportHistory: 'इतिहास डाउनलोड करा',
    noHistory: 'इतिहास आढळला नाही',
    noResults: 'शोध परिणाम आढळले नाहीत',
    confirmClear: 'आपण सर्व इतिहास साफ करू इच्छिता?',
    itemsFound: 'आयटम आढळले',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'काल',
    thisWeek: 'या आठवड्यात',
    older: 'जुने',
    cancel: 'रद्द करा',
    confirm: 'होय, साफ करा',
    noResultsMessage: 'वेगळा फिल्टर किंवा शोध शब्द वापरून पहा',
    noHistoryMessage: 'AI शी संवाद साधा आणि आपला इतिहास येथे दिसेल',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',
    languageLabel: 'भाषा',
  },
  pa: {
    title: 'ਇਤਿਹਾਸ',
    subtitle: 'ਤੁਹਾਡੇ ਪਿਛਲੇ ਖੋਜ ਅਤੇ ਸੁਝਾਅ',
    searchPlaceholder: 'ਇਤਿਹਾਸ ਵਿੱਚ ਖੋਜੋ...',
    filterBy: 'ਫਿਲਟਰ ਕਰੋ',
    allTypes: 'ਸਾਰੇ ਕਿਸਮਾਂ',
    voice: 'ਆਵਾਜ਼',
    text: 'ਟੈਕਸਟ',
    image: 'ਫੋਟੋ',
    clearHistory: 'ਇਤਿਹਾਸ ਸਾਫ ਕਰੋ',
    exportHistory: 'ਇਤਿਹਾਸ ਡਾਊਨਲੋਡ ਕਰੋ',
    noHistory: 'ਕੋਈ ਇਤਿਹਾਸ ਨਹੀਂ ਮਿਲਿਆ',
    noResults: 'ਕੋਈ ਖੋਜ ਨਤੀਜੇ ਨਹੀਂ ਮਿਲੇ',
    confirmClear: 'ਕੀ ਤੁਸੀਂ ਸਾਰਾ ਇਤਿਹਾਸ ਸਾਫ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
    itemsFound: 'ਆਈਟਮ ਮਿਲੇ',
    offlineAvailable: 'ਆਫਲਾਈਨ ਉਪਲਬਧ',
    today: 'ਅੱਜ',
    yesterday: 'ਕੱਲ੍ਹ',
    thisWeek: 'ਇਸ ਹਫ਼ਤੇ',
    older: 'ਪੁਰਾਣੇ',
    cancel: 'ਰੱਦ ਕਰੋ',
    confirm: 'ਹਾਂ, ਸਾਫ ਕਰੋ',
    noResultsMessage: 'ਇੱਕ ਵੱਖਰਾ ਫਿਲਟਰ ਜਾਂ ਖੋਜ ਸ਼ਬਦ ਅਜ਼ਮਾਓ',
    noHistoryMessage: 'AI ਨਾਲ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਤੁਹਾਡਾ ਇਤਿਹਾਸ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ',
    questionLabel: 'ਸਵਾਲ',
    answerLabel: 'ਜਵਾਬ',
    languageLabel: 'ਭਾਸ਼ਾ',
  },
  ur: {
    title: 'تاریخ',
    subtitle: 'آپ کی پچھلی تلاشیں اور تجاویز',
    searchPlaceholder: 'تاریخ میں تلاش کریں...',
    filterBy: 'فلٹر کریں',
    allTypes: 'تمام اقسام',
    voice: 'آواز',
    text: 'متن',
    image: 'تصویر',
    clearHistory: 'تاریخ صاف کریں',
    exportHistory: 'تاریخ ڈاؤن لوڈ کریں',
    noHistory: 'کوئی تاریخ نہیں ملی',
    noResults: 'کوئی تلاش کے نتائج نہیں ملے',
    confirmClear: 'کیا آپ تمام تاریخ صاف کرنا چاہتے ہیں؟',
    itemsFound: 'اشیاء مل گئیں',
    offlineAvailable: 'آف لائن دستیاب',
    today: 'آج',
    yesterday: 'کل',
    thisWeek: 'اس ہفتے',
    older: 'پرانا',
    cancel: 'منسوخ کریں',
    confirm: 'ہاں، صاف کریں',
    noResultsMessage: 'ایک مختلف فلٹر یا تلاش کی اصطلاح آزمائیں',
    noHistoryMessage: 'AI کے ساتھ بات چیت شروع کریں اور آپ کی تاریخ یہاں ظاہر ہوگی',
    questionLabel: 'سوال',
    answerLabel: 'جواب',
    languageLabel: 'زبان',
  },
  or: {
    title: 'ଇତିହାସ',
    subtitle: 'ଆପଣଙ୍କ ପୂର୍ବ ଖୋଜ ଏବଂ ପ୍ରସ୍ତାବ',
    searchPlaceholder: 'ଇତିହାସରେ ଖୋଜନ୍ତୁ...',
    filterBy: 'ଫିଲ୍ଟର କରନ୍ତୁ',
    allTypes: 'ସମସ୍ତ ପ୍ରକାର',
    voice: 'ସ୍ୱର',
    text: 'ଟେକ୍ସଟ୍',
    image: 'ଫଟୋ',
    clearHistory: 'ଇତିହାସ ସଫା କରନ୍ତୁ',
    exportHistory: 'ଇତିହାସ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    noHistory: 'କୌଣସି ଇତିହାସ ମିଳିଲା ନାହିଁ',
    noResults: 'କୌଣସି ଖୋଜ ପରିଣାମ ମିଳିଲା ନାହିଁ',
    confirmClear: 'ଆପଣ ସମସ୍ତ ଇତିହାସ ସଫା କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
    itemsFound: 'ଆଇଟମ୍ ମିଳିଲା',
    offlineAvailable: 'ଅଫଲାଇନ୍ ଉପଲବ୍ଧ',
    today: 'ଆଜି',
    yesterday: 'ଗତକାଲି',
    thisWeek: 'ଏହି ସପ୍ତାହ',
    older: 'ପୁରୁଣା',
    cancel: 'ବାତିଲ କରନ୍ତୁ',
    confirm: 'ହଁ, ସଫା କରନ୍ତୁ',
    noResultsMessage: 'ଏକ ଭିନ୍ନ ଫିଲ୍ଟର୍ କିମ୍ବା ସର୍ଚ୍ଚ୍ ଶବ୍ଦ ଚେଷ୍ଟା କରନ୍ତୁ',
    noHistoryMessage: 'AI ସହିତ କଥାବାର୍ତ୍ତା ଆରମ୍ଭ କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ଇତିହାସ ଏଠାରେ ଦେଖାଯିବ',
    questionLabel: 'ପ୍ରଶ୍ନ',
    answerLabel: 'ଉତ୍ତର',
    languageLabel: 'ଭାଷା',
  },
  as: {
    title: 'ইতিহাস',
    subtitle: 'আপোনাৰ পূৰ্বৰ সন্ধান আৰু পৰামৰ্শ',
    searchPlaceholder: 'ইতিহাসত সন্ধান কৰক...',
    filterBy: 'ফিল্টাৰ কৰক',
    allTypes: 'সকলো ধৰণ',
    voice: 'শব্দ',
    text: 'পাঠ্য',
    image: 'ফটো',
    clearHistory: 'ইতিহাস পৰিষ্কাৰ কৰক',
    exportHistory: 'ইতিহাস ডাউনলোড কৰক',
    noHistory: 'কোনো ইতিহাস পোৱা নগল',
    noResults: 'কোনো সন্ধানৰ ফলাফল পোৱা নগল',
    confirmClear: 'আপুনি সকলো ইতিহাস পৰিষ্কাৰ কৰিব বিচাৰে নে?',
    itemsFound: 'আইটেম পোৱা গ’ল',
    offlineAvailable: 'অফলাইনত উপলব্ধ',
    today: 'আজি',
    yesterday: 'কালি',
    thisWeek: 'এই সপ্তাহ',
    older: 'পুৰণা',
    cancel: 'বাতিল কৰক',
    confirm: 'হয়, পৰিষ্কাৰ কৰক',
    noResultsMessage: 'ಬೇರೆ ফিল্টাৰ বা সন্ধান শব্দ চেষ্টা কৰক',
    noHistoryMessage: 'AI ৰ সৈতে আলোচনা আৰম্ভ কৰক আৰু আপোনাৰ ইতিহাস ইয়াত দেখা যাব',
    questionLabel: 'প্ৰশ্ন',
    answerLabel: 'উত্তৰ',
    languageLabel: 'ভাষা',
  },
  bho: {
    title: 'इतिहास',
    subtitle: 'तोहार पहिले के खोज आ सुझाव',
    searchPlaceholder: 'इतिहास में खोजा...',
    filterBy: 'फिल्टर करा',
    allTypes: 'सब प्रकार',
    voice: 'आवाज',
    text: 'टेक्स्ट',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करा',
    exportHistory: 'इतिहास डाउनलोड करा',
    noHistory: 'कोनो इतिहास नइखे मिलल',
    noResults: 'कोनो खोज परिणाम नइखे मिलल',
    confirmClear: 'का तू सब इतिहास साफ करना चाहत बाड़ू?',
    itemsFound: 'आइटम मिलल',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'काल्हि',
    thisWeek: 'ई हप्ता',
    older: 'पुरान',
    cancel: 'रद्द करा',
    confirm: 'हाँ, साफ करा',
    noResultsMessage: 'दोसर फिल्टर भा खोज शब्द आजमाईं',
    noHistoryMessage: 'AI से बतियावल शुरू करीं आ इतिहास इहाँ लउकी',
    questionLabel: 'सवाल',
    answerLabel: 'जवाब',
    languageLabel: 'भाषा',
  },
  mai: {
    title: 'इतिहास',
    subtitle: 'अहाँक पूर्व खोज आ सुझाव',
    searchPlaceholder: 'इतिहासमेँ खोजू...',
    filterBy: 'फिल्टर करू',
    allTypes: 'सभ प्रकार',
    voice: 'आवाज़',
    text: 'पाठ',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करू',
    exportHistory: 'इतिहास डाउनलोड करू',
    noHistory: 'कोनो इतिहास नहि भेटल',
    noResults: 'कोनो खोज परिणाम नहि भेटल',
    confirmClear: 'की अहाँ सभ इतिहास साफ करबाक चाहैत छी?',
    itemsFound: 'आइटम भेटल',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आइ',
    yesterday: 'काल्हि',
    thisWeek: 'ई सप्ताह',
    older: 'पुरान',
    cancel: 'रद्द करू',
    confirm: 'हँ, साफ करू',
    noResultsMessage: 'दोसर फिल्टर वा खोज शब्द प्रयास करू',
    noHistoryMessage: 'AI सँ गपशप शुरू करू आ अहाँक इतिहास एतय देखायत',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',
    languageLabel: 'भाषा',
  },
  mag: {
    title: 'इतिहास',
    subtitle: 'तोहार पहिलका खोज आ सुझाव',
    searchPlaceholder: 'इतिहासमे खोजू...',
    filterBy: 'फिल्टर करू',
    allTypes: 'सभ प्रकार',
    voice: 'आवाज',
    text: 'पाठ',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करू',
    exportHistory: 'इतिहास डाउनलोड करू',
    noHistory: 'कोनो इतिहास नहि भेटल',
    noResults: 'कोनो खोज परिणाम नहि भेटल',
    confirmClear: 'की अहाँ सभ इतिहास साफ करबाक चाहैत छी?',
    itemsFound: 'आइटम भेटल',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आइ',
    yesterday: 'काल्हि',
    thisWeek: 'ई सप्ताह',
    older: 'पुरान',
    cancel: 'रद्द करऽ',
    confirm: 'हँ, साफ करऽ',
    noResultsMessage: 'दोसर फिल्टर या खोज शब्द के कोशिश करऽ',
    noHistoryMessage: 'AI से बतियावे लगऽ आ तोहार इतिहास हियाँ लउकी',
    questionLabel: 'सवाल',
    answerLabel: 'जवाब',
    languageLabel: 'भाषा',
  },
  sa: {
    title: 'इतिहासः',
    subtitle: 'भवतः पूर्वसन्धानाः च सुझावाः',
    searchPlaceholder: 'इतिहासे अन्वेषणं कुरुत...',
    filterBy: 'फिल्टर करें',
    allTypes: 'सर्वे प्रकाराः',
    voice: 'स्वरः',
    text: 'पाठः',
    image: 'चित्रम्',
    clearHistory: 'इतिहासं शुद्धं कुरुत',
    exportHistory: 'इतिहासं डाउनलोड् कुरुत',
    noHistory: 'इतिहासः न लब्धः',
    noResults: 'अन्वेषणफलानि न लब्धानि',
    confirmClear: 'किं भवतः सर्वं इतिहासं शुद्धं कर्तुम् इच्छति?',
    itemsFound: 'पदार्थाः लब्धाः',
    offlineAvailable: 'ऑफलाइन उपलभ्यते',
    today: 'अद्य',
    yesterday: 'ह्यः',
    thisWeek: 'अस्य सप्ताहस्य',
    older: 'पुरातनम्',
    cancel: 'रद्दं कुरुत',
    confirm: 'आम्, शुद्धं कुरुत',
    noResultsMessage: 'अन्यं फिल्टरं वा अन्वेषणपदं प्रयतस्व',
    noHistoryMessage: 'AI सह सम्भाषणं आरभस्व तव इतिहासः अत्र दृश्यते',
    questionLabel: 'प्रश्नः',
    answerLabel: 'उत्तरम्',
    languageLabel: 'भाषा',
  },
  sd: {
    title: 'تاريخ',
    subtitle: 'توهان جون اڳيون ڳولا ۽ تجويزون',
    searchPlaceholder: 'تاريخ ۾ ڳوليو...',
    filterBy: 'فلٽر ڪريو',
    allTypes: 'سڀ قسم',
    voice: 'آواز',
    text: 'لکڻ',
    image: 'تصوير',
    clearHistory: 'تاريخ صاف ڪريو',
    exportHistory: 'تاريخ ڊائونلوڊ ڪريو',
    noHistory: 'ڪو تاريخ نه مليو',
    noResults: 'ڪابه ڳولا نتيجا نه مليا',
    confirmClear: 'ڇا توهان سڀ تاريخ صاف ڪرڻ چاهيو ٿا؟',
    itemsFound: 'شيون مليون',
    offlineAvailable: 'آف لائن موجود',
    today: 'اڄ',
    yesterday: 'ڪالهه',
    thisWeek: 'هن هفتي',
    older: 'پراڻو',
    cancel: 'منسوخ ڪريو',
    confirm: 'ها، صاف ڪريو',
    noResultsMessage: 'هڪ مختلف فلٽر يا ڳولا جي اصطلاح جي ڪوشش ڪريو',
    noHistoryMessage: 'AI سان ڳالهه ٻولهه شروع ڪريو ۽ توهان جي تاريخ هتي ظاهر ٿيندي',
    questionLabel: 'سوال',
    answerLabel: 'جواب',
    languageLabel: 'ٻولي',
  },
  ne: {
    title: 'इतिहास',
    subtitle: 'तपाईंका अघिल्ला खोजहरू र सुझावहरू',
    searchPlaceholder: 'इतिहासमा खोज्नुहोस्...',
    filterBy: 'फिल्टर गर्नुहोस्',
    allTypes: 'सबै प्रकार',
    voice: 'ध्वनि',
    text: 'पाठ',
    image: 'फोटो',
    clearHistory: 'इतिहास मेटाउनुहोस्',
    exportHistory: 'इतिहास डाउनलोड गर्नुहोस्',
    noHistory: 'कुनै इतिहास भेटिएन',
    noResults: 'कुनै खोज परिणाम भेटिएन',
    confirmClear: 'के तपाईं सम्पूर्ण इतिहास मेटाउन चाहनुहुन्छ?',
    itemsFound: 'वस्तु भेटियो',
    offlineAvailable: 'अफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'हिजो',
    thisWeek: 'यो हप्ता',
    older: 'पुरानो',
    cancel: 'रद्द गर्नुहोस्',
    confirm: 'हो, मेटाउनुहोस्',
    noResultsMessage: 'फरक फिल्टर वा खोज शब्द प्रयास गर्नुहोस्',
    noHistoryMessage: 'AI सँग अन्तरक्रिया सुरु गर्नुहोस् र तपाईंको इतिहास यहाँ देखा पर्नेछ',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',
    languageLabel: 'भाषा',
  },
  kok: {
    title: 'इतिहास',
    subtitle: 'तुमका पयलीचे शोध आ सुचना',
    searchPlaceholder: 'इतिहासांत शोधा...',
    filterBy: 'फिल्टर करात',
    allTypes: 'सगळे प्रकार',
    voice: 'आवाज',
    text: 'मजकूर',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करात',
    exportHistory: 'इतिहास डाउनलोड करात',
    noHistory: 'इतिहास मेळो ना',
    noResults: 'शोध परिणाम मेळो ना',
    confirmClear: 'तुमका सगळो इतिहास साफ करपाचो आसा का?',
    itemsFound: 'आयटम मेळो',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'काल',
    thisWeek: 'या आठवड्यात',
    older: 'पुराय',
    cancel: 'रद्द करात',
    confirm: 'होय, साफ करात',
    noResultsMessage: 'वेगळो फिल्टर वा शोध शब्द प्रयत्न करात',
    noHistoryMessage: 'AI कडेन संवाद सुरू करात आनी तुमचो इतिहास हांगा दिसतलो',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',
    languageLabel: 'भास',
  },
  mni: {
    title: 'পুৱারী',
    subtitle: 'অদোমগী হৌখিবা থৌরাং অমসুং পাওতাক',
    searchPlaceholder: 'পুৱারীদা থি...',
    filterBy: 'ফিল্টার তৌ',
    allTypes: 'মখল পুম্নমক',
    voice: 'খোল',
    text: 'ৱাহৈ',
    image: 'লাই',
    clearHistory: 'পুৱারী মুথৎপ',
    exportHistory: 'পুৱারী ডাউনলোড তৌ',
    noHistory: 'পুৱারী লৈতে',
    noResults: 'থিবা ফল লৈতে',
    confirmClear: 'অদোম পুম্নমক পুৱারী মুথৎপা পাম্ব্রা?',
    itemsFound: 'পোৎ লৈরে',
    offlineAvailable: 'অফলাইনদা ফংই',
    today: 'ঙসি',
    yesterday: 'ঙরাং',
    thisWeek: 'চয়োল অসি',
    older: 'অরিবা',
    cancel: 'তোঙান',
    confirm: 'হোই, মুথৎপ',
    noResultsMessage: 'তোঙানবা ফিল্টার বা থিবা ৱাহৈ শীজিন্নবীয়ু',
    noHistoryMessage: 'AIগা ৱারী শান্নবা হৌবীয়ু অমসুং অদোমগী পুৱারী মফম অসিদা উগনি',
    questionLabel: 'ৱাহং',
    answerLabel: 'পাউখুম',
    languageLabel: 'লোল',
  },
  bo: {
    title: 'ལོ་རྒྱུས།',
    subtitle: 'ཁྱེད་ཀྱི་སྔོན་གྱི་འཚོལ་ཞིབ་དང་བསམ་འཆར།',
    searchPlaceholder: 'ལོ་རྒྱུས་ནང་འཚོལ།...',
    filterBy: 'འཚག་བ།',
    allTypes: 'རིགས་ཚང་མ།',
    voice: 'སྐད།',
    text: 'ཡི་གེ།',
    image: 'པར།',
    clearHistory: 'ལོ་རྒྱུས་སུབས།',
    exportHistory: 'ལོ་རྒྱུས་ཕབ་ལེན།',
    noHistory: 'ལོ་རྒྱུས་མི་འདུག',
    noResults: 'འཚོལ་ཞིབ་གྲུབ་འབྲས་མི་འདུག',
    confirmClear: 'ཁྱེད་ཀྱིས་ལོ་རྒྱུས་ཚང་མ་སུབ་དགོས་སམ།',
    itemsFound: 'རྣམ་གྲངས་རྙེད་སོང།',
    offlineAvailable: 'অফলাইনལ་ཡོད།',
    today: 'དེ་རིང་།',
    yesterday: 'ཁ་སང་།',
    thisWeek: 'བདུན་ཕྲག་འདི།',
    older: 'རྙིང་པ།',
    cancel: 'རྩིས་མེད།',
    confirm: 'ඔව්, මකන්න',
    noResultsMessage: 'වෙනත් පෙරහනක් හෝ සෙවුම් පදයක් උත්සාහ කරන්න',
    noHistoryMessage: 'AI සමග කතාබහ අරඹන්න, ඔබේ ඉතිහාසය මෙතැනින් පෙනෙනු ඇත',
    questionLabel: 'དྲི་བ།',
    answerLabel: 'ལན།',
    languageLabel: 'སྐད་ཡིག',
  },
  ks: {
    title: 'تاریخ',
    subtitle: 'تُہندِ پَتیمَن تلاش تہ مشورہ',
    searchPlaceholder: 'تاریخ منز تلاش کر...',
    filterBy: 'فلٹر كریو',
    allTypes: 'سارے قسم',
    voice: 'آواز',
    text: 'متن',
    image: 'تصویر',
    clearHistory: 'تاریخ صاف كریو',
    exportHistory: 'تاریخ ڈاؤنلوڈ كریو',
    noHistory: 'كہین تاریخ نہ مل',
    noResults: 'كہین تلاش نتیجہ نہ مل',
    confirmClear: 'تُਸੀਂ ساری تاریخ صاف كرنا چھُہ؟',
    itemsFound: 'آئٹم ملن',
    offlineAvailable: 'آف لائن دستیاب',
    today: 'اَز',
    yesterday: 'کَل',
    thisWeek: 'یِم ہفتہ',
    older: 'پُران',
    cancel: 'منسوخ كریو',
    confirm: 'ہاں، صاف كریو',
    noResultsMessage: 'مختلف فلٹر یا تلاش لفظ کوشش كریو',
    noHistoryMessage: 'AI سٟتۍ کتھ باتھ شروع كریو تہ تُہند تاریخ یتھ نظر ییہ',
    questionLabel: 'سوال',
    answerLabel: 'جواب',
    languageLabel: 'زبان',
  },
  doi: {
    title: 'इतिहास',
    subtitle: 'थुआडे पाछले खोज ते सुझाव',
    searchPlaceholder: 'इतिहास विच खोजो...',
    filterBy: 'फिल्टर करो',
    allTypes: 'सारे प्रकार',
    voice: 'आवाज',
    text: 'पाठ',
    image: 'फोटो',
    clearHistory: 'इतिहास साफ करो',
    exportHistory: 'इतिहास डाउनलोड करो',
    noHistory: 'कोई इतिहास नीं मिल्या',
    noResults: 'कोई खोज नतीजे नीं मिले',
    confirmClear: 'की तुसीं सारा इतिहास साफ करना चौंदे ओ?',
    itemsFound: 'आइटम मिले',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    today: 'आज',
    yesterday: 'कले',
    thisWeek: 'इस हफ्ते',
    older: 'पुराने',
    cancel: 'रद्द करो',
    confirm: 'हां, साफ करो',
    noResultsMessage: 'दुए फिल्टर जां खोज शब्द दी कोशिश करो',
    noHistoryMessage: 'AI कन्नै गल्लबात शुरू करो ते तुंदा इतिहास इत्थे दिसग',
    questionLabel: 'सवाल',
    answerLabel: 'जवाब',
    languageLabel: 'भाषा',
  },
};

interface HistoryItem {
  type: 'voice' | 'text' | 'image';
  query: string;
  response: string;
  timestamp: string;
  language: string;
}

interface HistoryPageProps {
  language: Language;
  userInfo: UserInfo;
}

export default function HistoryPage({ language, userInfo }: HistoryPageProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [historyItems, searchTerm, filterType]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('krishi-history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setHistoryItems(history.reverse());
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const filterHistory = () => {
    let filtered = historyItems;
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.query.toLowerCase().includes(searchLower) ||
        item.response.toLowerCase().includes(searchLower)
      );
    }
    setFilteredItems(filtered);
  };

  const clearHistory = () => {
    localStorage.removeItem('krishi-history');
    setHistoryItems([]);
    setFilteredItems([]);
    setShowClearConfirm(false);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(historyItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krishi-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateOnly.getTime() === today.getTime()) return t.today;
    if (dateOnly.getTime() === yesterday.getTime()) return t.yesterday;

    const diffTime = today.getTime() - dateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return t.thisWeek;
    
    return date.toLocaleDateString(language.code, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'text': return <MessageSquare className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voice': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-green-100 text-green-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedItems = filteredItems.reduce((groups, item) => {
    const dateGroup = formatDate(item.timestamp);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-amber-800">{t.title}</h1>
          <p className="text-amber-600">{t.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="pl-10 border-amber-300 focus:border-amber-500"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 border-amber-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.filterBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allTypes}</SelectItem>
                  <SelectItem value="voice">{t.voice}</SelectItem>
                  <SelectItem value="text">{t.text}</SelectItem>
                  <SelectItem value="image">{t.image}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportHistory}
                  disabled={historyItems.length === 0}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.exportHistory}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={historyItems.length === 0}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.clearHistory}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-200">
              <div className="text-sm text-amber-700">
                {filteredItems.length} {t.itemsFound}
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                📱 {t.offlineAvailable}
              </Badge>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-red-50 border-red-200">
                <Trash2 className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="flex items-center justify-between">
                    <span>{t.confirmClear}</span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowClearConfirm(false)}
                        className="border-gray-300"
                      >
                        {t.cancel}
                      </Button>
                      <Button
                        size="sm"
                        onClick={clearHistory}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {t.confirm}
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {Object.keys(groupedItems).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-12 text-center bg-gray-50 border-gray-200">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg mb-2 text-gray-800">
                  {searchTerm || filterType !== 'all' ? t.noResults : t.noHistory}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterType !== 'all'
                    ? t.noResultsMessage
                    : t.noHistoryMessage
                  }
                </p>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([dateGroup, items], groupIndex) => (
                <motion.div
                  key={dateGroup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <h3 className="text-lg mb-4 text-amber-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {dateGroup}
                  </h3>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-start space-x-4">
                            <Badge className={`${getTypeColor(item.type)} px-3 py-1`}>
                              <div className="flex items-center space-x-1">
                                {getTypeIcon(item.type)}
                                <span className="capitalize">{item.type}</span>
                              </div>
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="mb-3">
                                <h4 className="text-sm text-gray-600 mb-1">{t.questionLabel}:</h4>
                                <p className="text-amber-800 break-words">{item.query}</p>
                              </div>
                              <div>
                                <h4 className="text-sm text-gray-600 mb-1">{t.answerLabel}:</h4>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                  <p className="text-amber-700 text-sm whitespace-pre-wrap break-words">
                                    {item.response.substring(0, 300)}
                                    {item.response.length > 300 && '...'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                <span>
                                  {new Date(item.timestamp).toLocaleString(language.code, { hour12: true, timeStyle: 'short', dateStyle: 'short' })}
                                </span>
                                <span>{t.languageLabel}: {item.language}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}