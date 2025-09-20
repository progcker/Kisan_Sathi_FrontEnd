import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Loader, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import type { Language, UserInfo } from '../../App';

const translations = {
  hi: {
    code: 'hi',
    title: 'टेक्स्ट सहायक',
    subtitle: 'अपनी खेती से जुड़े सवाल पूछें',
    placeholder: 'अपनी समस्या यहाँ लिखें... जैसे "मेरी गेहूं की फसल में पत्ते पीले हो रहे हैं"',
    send: 'भेजें',
    typing: 'टाइप कर रहे हैं...',
    thinking: 'सोच रहे हैं...',
    newQuestion: 'नया सवाल पूछें',
    examplesTitle: 'उदाहरण:',
    examples: [
      'मेरी टमाटर की फसल में कीड़े लग गए हैं',
      'धान की खेती के लिए कौन सा खाद बेहतर है',
      'आज बारिश हो रही है, क्या छिड़काव कर सकते हैं',
      'गेहूं की बुआई का सही समय क्या है'
    ],
  },
  en: {
    code: 'en',
    title: 'Text Assistant',
    subtitle: 'Ask your farming questions',
    placeholder: 'Write your problem here... like "My wheat crop leaves are turning yellow"',
    send: 'Send',
    typing: 'Typing...',
    thinking: 'Thinking...',
    newQuestion: 'Ask New Question',
    examplesTitle: 'Examples:',
    examples: [
      'My tomato crop has pest infestation',
      'Which fertilizer is better for rice cultivation',
      'It\'s raining today, can I spray pesticides',
      'What is the right time for wheat sowing'
    ],
  },
  ta: {
    code: 'ta',
    title: 'உரை உதவியாளர்',
    subtitle: 'உங்கள் விவசாய கேள்விகளை கேளுங்கள்',
    placeholder: 'உங்கள் பிரச்சனையை இங்கே எழுதுங்கள்... "என் கோதுமை பயிரில் இலைகள் மஞ்சளாகிவிட்டன" போன்று',
    send: 'அனுப்பு',
    typing: 'தட்டச்சு செய்கிறீர்கள்...',
    thinking: 'யோசிக்கிறது...',
    newQuestion: 'புதிய கேள்வி கேளுங்கள்',
    examplesTitle: 'எடுத்துக்காட்டுகள்:',
    examples: [
      'என் தக்காளி பயிரில் பூச்சிகள் தாக்கியுள்ளன',
      'நெல் சாகுபடிக்கு எந்த உரம் சிறந்தது',
      'இன்று மழை பெய்கிறது, பூச்சிக்கொல்லி தெளிக்கலாமா',
      'கோதுமை விதைப்புக்கான சரியான நேரம் எது'
    ],
  },
  te: {
    code: 'te',
    title: 'టెక్స్ట్ అసిస్టెంట్',
    subtitle: 'మీ వ్యవసాయ ప్రశ్నలను అడగండి',
    placeholder: 'ఇక్కడ మీ సమస్యను వ్రాయండి... "నా గోధుమ పంట ఆకులు పసుపుగా మారుతున్నాయి"',
    send: 'పంపించు',
    typing: 'టైప్ చేస్తోంది...',
    thinking: 'ఆలోచిస్తోంది...',
    newQuestion: 'కొత్త ప్రశ్న అడగండి',
    examplesTitle: 'ఉదాహరణలు:',
    examples: [
      'నా టమోటా పంటకు పురుగులు దాడి చేశారు',
      'అన్నం సాగుకు ఏ ఎరువు ఉత్తమం',
      'నేడు వర్షం వస్తోంది, రసాయనాలు పిచికారీ చేయగలనా?',
      'గోధుమ విత్తనానికి సరైన సమయం ఎప్పుడు'
    ],
  },
  kn: {
    code: 'kn',
    title: 'ಟೆಕ್ಸ್ಟ್ ಸಹಾಯಕ',
    subtitle: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
    placeholder: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಬರೆದು ಹೇಳಿ... "ನನ್ನ ಗೋಧಿ ಬೆಳೆ ಎಲೆಗಳು ಹಳದಿ ಆಗುತ್ತಿವೆ"',
    send: 'ಕಳುಹಿಸಿ',
    typing: 'ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...',
    thinking: 'ಆಲೋಚಿಸುತ್ತಿದೆ...',
    newQuestion: 'ಹೊಸ ಪ್ರಶ್ನೆ ಕೇಳಿ',
    examplesTitle: 'ಉದಾಹರಣೆಗಳು:',
    examples: [
      'ನನ್ನ ಟೊಮೇಟೊ ಬೆಳೆಯಲ್ಲಿ ಕೀಟಗಳು ಹಾವಳಿ ಮಾಡಿವೆ',
      'ಅಕ್ಕಿ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಉತ್ತಮ',
      'ಇಂದು ಮಳೆ ಬರುತ್ತಿದೆ, ಕೀಟನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಬಹುದೇ?',
      'ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಸರಿಯಾದ ಸಮಯ ಯಾವುದು'
    ],
  },
  ml: {
    code: 'ml',
    title: 'ടെക്സ്റ്റ് അസിസ്റ്റന്റ്',
    subtitle: 'നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക',
    placeholder: 'ഇവിടെ നിങ്ങളുടെ പ്രശ്നം എഴുതുക... "എന്റെ ഗോതമ്പ് വിളയുടെ ഇലകൾ മഞ്ഞയായി മാറുന്നു"',
    send: 'അയക്കുക',
    typing: 'ടൈപ്പ് ചെയ്യുന്നു...',
    thinking: 'ചിന്തിക്കുന്നു...',
    newQuestion: 'പുതിയ ചോദ്യം ചോദിക്കുക',
    examplesTitle: 'ഉദാഹരണങ്ങൾ:',
    examples: [
      'എന്റെ തക്കാളി വിളയിൽ കീടങ്ങൾ ആക്രമിച്ചു',
      'അരി കൃഷിക്കുള്ള ഏറ്റവും നല്ല വളം ഏതാണ്',
      'ഇന്ന് മഴ പെയ്യുന്നു, കീടനാശിനി തളിക്കാമോ?',
      'ഗോതമ്പ് വിതയ്ക്കാനുള്ള ശരിയായ സമയം എപ്പോഴാണ്'
    ],
  },
  bn: {
    code: 'bn',
    title: 'টেক্সট সহকারী',
    subtitle: 'আপনার কৃষি সংক্রান্ত প্রশ্ন করুন',
    placeholder: 'এখানে আপনার সমস্যা লিখুন... "আমার গমের ফসলের পাতা হলুদ হয়ে যাচ্ছে"',
    send: 'পাঠান',
    typing: 'টাইপ হচ্ছে...',
    thinking: 'ভাবছে...',
    newQuestion: 'নতুন প্রশ্ন জিজ্ঞাসা করুন',
    examplesTitle: 'উদাহরণ:',
    examples: [
      'আমার টমেটোর ফসলে কীটপতঙ্গের আক্রমণ হয়েছে',
      'ধান চাষের জন্য কোন সার ভালো',
      'আজ বৃষ্টি হচ্ছে, কীটনাশক স্প্রে করতে পারি?',
      'গম বপনের সঠিক সময় কখন'
    ],
  },
  gu: {
    code: 'gu',
    title: 'ટેક્સ્ટ સહાયક',
    subtitle: 'તમારા ખેતી સંબંધિત પ્રશ્નો પૂછો',
    placeholder: 'અહીં તમારી સમસ્યા લખો... "મારી ઘઉંની પાકની પાંદડીઓ પીળી થઈ રહ્યાં છે"',
    send: 'મોકલો',
    typing: 'ટાઇપ કરી રહ્યું છે...',
    thinking: 'વિચાર કરે છે...',
    newQuestion: 'નવો પ્રશ્ન પૂછો',
    examplesTitle: 'ઉદાહરણો:',
    examples: [
      'મારી ટામેટાની પાકમાં જીવાત લાગી છે',
      'ચોખાની ખેતી માટે કયો ખાતર સારો છે',
      'આજે વરસાદ પડી રહ્યો છે, સ્પ્રે કરી શકું?',
      'ઘઉં વાવણીનો યોગ્ય સમય ક્યારે છે'
    ],
  },
  mr: {
    code: 'mr',
    title: 'टेक्स्ट सहाय्यक',
    subtitle: 'आपल्या शेतीच्या प्रश्न विचारा',
    placeholder: 'इथे आपली समस्या लिहा... "माझ्या गव्हाच्या पिकाची पाने पिवळी होत आहेत"',
    send: 'पाठवा',
    typing: 'टाइप करत आहे...',
    thinking: 'विचार करत आहे...',
    newQuestion: 'नवीन प्रश्न विचारा',
    examplesTitle: 'उदाहरणे:',
    examples: [
      'माझ्या टोमॅटो पिकावर कीड लागली आहे',
      'तांदळाच्या शेतीसाठी कोणते खत चांगले',
      'आज पाऊस पडतो आहे, स्प्रे करू शकतो का?',
      'गव्हाची पेरणी करण्याचा योग्य वेळ काय आहे'
    ],
  },
  pa: {
    code: 'pa',
    title: 'ਟੈਕਸਟ ਸਹਾਇਕ',
    subtitle: 'ਆਪਣੇ ਖੇਤੀ ਸਬੰਧੀ ਸਵਾਲ ਪੁੱਛੋ',
    placeholder: 'ਇੱਥੇ ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ... "ਮੇਰੀ ਕਣਕ ਦੀ ਫਸਲ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋ ਰਹੇ ਹਨ"',
    send: 'ਭੇਜੋ',
    typing: 'ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ...',
    thinking: 'ਸੋਚ ਰਿਹਾ ਹੈ...',
    newQuestion: 'ਨਵਾਂ ਸਵਾਲ ਪੁੱਛੋ',
    examplesTitle: 'ਉਦਾਹਰਣਾਂ:',
    examples: [
      'ਮੇਰੀ ਟਮਾਟਰ ਦੀ ਫਸਲ ਵਿੱਚ ਕੀੜੇ ਲੱਗੇ ਹਨ',
      'ਚੌਲਾਂ ਦੀ ਖੇਤੀ ਲਈ ਕਿਹੜੀ ਖਾਦ ਚੰਗੀ ਹੈ',
      'ਅੱਜ ਮੀਂਹ ਪੈ ਰਿਹਾ ਹੈ, ਕੀ ਸਪਰੇਅ ਕਰ ਸਕਦੇ ਹਾਂ?',
      'ਕਣਕ ਦੀ ਬਿਜਾਈ ਦਾ ਸਹੀ ਸਮਾਂ ਕਦੋਂ ਹੈ'
    ],
  },
  ur: {
    code: 'ur',
    title: 'ٹیکسٹ اسسٹنٹ',
    subtitle: 'اپنے زرعی سوالات پوچھیں',
    placeholder: 'اپنی مسئلہ یہاں لکھیں... "میری گندم کی فصل کے پتے پیلے ہو رہے ہیں"',
    send: 'بھیجیں',
    typing: 'ٹائپ کر رہا ہے...',
    thinking: 'سوچ رہا ہے...',
    newQuestion: 'نیا سوال پوچھیں',
    examplesTitle: 'مثالیں:',
    examples: [
      'میری ٹماٹر کی فصل میں کیڑے لگ گئے ہیں',
      'چاول کی کاشت کے لئے کون سی کھاد بہتر ہے',
      'آج بارش ہو رہی ہے، سپرے کر سکتے ہیں؟',
      'گندم کی بوائی کا صحیح وقت کیا ہے'
    ],
  },
  or: {
    code: 'or',
    title: 'ଟେକ୍ସଟ୍ ସହାୟକ',
    subtitle: 'ଆପଣଙ୍କ କୃଷି ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
    placeholder: 'ଏଠାରେ ଆପଣଙ୍କ ସମସ୍ୟା ଲେଖନ୍ତୁ... "ମୋ ଗହମ ଫସଲର ପତ୍ର ହଳଦିଆ ହେଉଛି"',
    send: 'ପଠାନ୍ତୁ',
    typing: 'ଟାଇପ୍ ହେଉଛି...',
    thinking: 'ଚିନ୍ତା କରୁଛି...',
    newQuestion: 'ନୂଆ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
    examplesTitle: 'ଉଦାହରଣ:',
    examples: [
      'ମୋର ଟମାଟୋ ଫସଲରେ କୀଟ ଲାଗିଛି',
      'ଧାନ ଚାଷ ପାଇଁ କେଉଁ ସାର ଭଲ',
      'ଆଜି ବର୍ଷା ହେଉଛି, ସ୍ପ୍ରେ କରିପାରିବି କି?',
      'ଗହମ ବୁଣିବାର ସଠିକ୍ ସମୟ କେବେ'
    ],
  },
  as: {
    code: 'as',
    title: 'টেক্সট সহায়ক',
    subtitle: 'আপোনাৰ কৃষি সম্পৰ্কীয় প্ৰশ্ন সোধক',
    placeholder: 'ইয়াত আপোনাৰ সমস্যা লিখক... "মোৰ ঘেঁহুৰ খেতিৰ পাত হালধীয়া হৈছে"',
    send: 'পঠিয়াওক',
    typing: 'টাইপ হৈছে...',
    thinking: 'ভাবি আছে...',
    newQuestion: 'নতুন প্ৰশ্ন সোধক',
    examplesTitle: 'ഉദാഹരണങ്ങൾ:',
    examples: [
      'মোৰ বিলাহীৰ খেতিত পোক লাগিছে',
      'ধান খেতিৰ বাবে কোনবিধ সাৰ ভাল',
      'আজি বৰষুণ দিছে, স্প্ৰে কৰিব পাৰিমনে?',
      'ঘেঁহু সিঁচাৰ সঠিক সময় কেতিয়া'
    ],
  },
  bho: {
    code: 'bho',
    title: 'टेक्स्ट सहायक',
    subtitle: 'आपन खेती से जुड़ल सवाल पूछीं',
    placeholder: 'आपन समस्या इहाँ लिखीं... "हमार गेहूँ के पत्ता पियर हो रहल बा"',
    send: 'भेजीं',
    typing: 'टाइप करत बा...',
    thinking: 'सोचत बा...',
    newQuestion: 'नया सवाल पूछीं',
    examplesTitle: 'उदाहरण:',
    examples: [
      'हमार टमाटर के फसल में कीड़ा लागल बा',
      'धान के खेती खातिर कवन खाद बढ़िया बा',
      'आज बरखा हो रहल बा, छिड़काव कर सकीला?',
      'गेहूँ के बोआई के सही समय कब बा'
    ],
  },
  mai: {
    code: 'mai',
    title: 'टेक्स्ट सहायक',
    subtitle: 'अहाँक खेती सँ जुड़ल प्रश्न पूछू',
    placeholder: 'आपन समस्या इहाँ लिखू... "हमर गेहूँ के पात पियर भऽ रहल अछि"',
    send: 'भेजू',
    typing: 'टाइप कऽ रहल अछि...',
    thinking: 'सोचि रहल अछि...',
    newQuestion: 'नव प्रश्न पूछू',
    examplesTitle: 'उदाहरण:',
    examples: [
      'हमर टमाटर के फसल में कीट लागल अछि',
      'धानक खेती लेल कोन खाद नीक अछि',
      'आज बरखा भऽ रहल अछि, स्प्रे कऽ सकैत छी?',
      'गेहूँ के बोआई के सही समय कखन अछि'
    ],
  },
  mag: {
    code: 'mag',
    title: 'टेक्स्ट सहायक',
    subtitle: 'तोहार खेती के सवाल पूछऽ',
    placeholder: 'आपन समस्या इहाँ लिखऽ... "हमार गेहूँ के पात पियर हो रहल बा"',
    send: 'भेजऽ',
    typing: 'टाइप करत बा...',
    thinking: 'सोचत बा...',
    newQuestion: 'नया सवाल पूछऽ',
    examplesTitle: 'उदाहरण:',
    examples: [
      'हमार टमाटर के फसल में कीट लागल बा',
      'धान खातिर कउन खाद नीक बा',
      'आज बरखा हो रहल बा, छिड़काव कर सकीला?',
      'गेहूँ के बोआई के सही समय कब बा'
    ],
  },
  sa: {
    code: 'sa',
    title: 'पाठ सहायक',
    subtitle: 'कृषि संबंधित प्रश्न पूछें',
    placeholder: 'अपनी समस्या यहाँ लिखें... "मेरी गेहूँ की फसल के पत्ते पीले हो रहे हैं"',
    send: 'भेजें',
    typing: 'टाइप कर रहे हैं...',
    thinking: 'सोच रहे हैं...',
    newQuestion: 'नया प्रश्न पूछें',
    examplesTitle: 'उदाहरणानि:',
    examples: [
      'मेरी टमाटर की फसल में कीड़े लगे हैं',
      'धान की खेती के लिए कौन सा खाद बेहतर है',
      'आज बारिश हो रही है, क्या छिड़काव कर सकते हैं',
      'गेहूँ की बुआई का सही समय क्या है'
    ],
  },
  sd: {
    code: 'sd',
    title: 'ٽيڪسٽ اسسٽنٽ',
    subtitle: 'پنهنجا زرعي سوال پڇو',
    placeholder: 'پنهنجي مسئلي هتي لکو... "منهنجي ڪڻڪ جي فصل جا پن پيلو ٿي رهيا آهن"',
    send: 'موڪليو',
    typing: 'ٽائپ پيو...',
    thinking: 'سوچي رهيو آهي...',
    newQuestion: 'نئون سوال پڇو',
    examplesTitle: 'مثالون:',
    examples: [
      'منهنجي ٽماٽن جي فصل ۾ ڪيڙا لڳا آهن',
      'چانورن جي پوک لاءِ ڪهڙو ڀاڻ بهتر آهي',
      'اڄ مينهن پئجي رهيو آهي, اسپري ڪري سگهون ٿا؟',
      'ڪڻڪ پوکڻ جو صحيح وقت ڪهڙو آهي'
    ],
  },
  ne: {
    code: 'ne',
    title: 'टेक्स्ट सहायक',
    subtitle: 'आफ्नो कृषि सम्बन्धी प्रश्न सोध्नुहोस्',
    placeholder: 'यहाँ आफ्नो समस्या लेख्नुहोस्... "मेरो गहुँको बालीका पात पहेँलो हुँदैछन्"',
    send: 'पठाउनुहोस्',
    typing: 'टाइप गर्दैछ...',
    thinking: 'सोच्दैछ...',
    newQuestion: 'नयाँ प्रश्न सोध्नुहोस्',
    examplesTitle: 'उदाहरणहरु:',
    examples: [
      'मेरो टमाटर बालीमा कीरा लागेको छ',
      'धान खेतीका लागि कुन मल राम्रो छ',
      'आज वर्षा भइरहेको छ, स्प्रे गर्न सकिन्छ?',
      'गहुँ रोप्नको सही समय कहिले हो'
    ],
  },
  kok: {
    code: 'kok',
    title: 'टेक्स्ट सहाय्यक',
    subtitle: 'तुमच्या शेतीसंबंधी प्रश्न विचारा',
    placeholder: 'इथे तुमची समस्या लिहा... "माझ्या गव्हाच्या पिकाची पाने पिवळी होत आहेत"',
    send: 'पाठवा',
    typing: 'टाइप करत आहे...',
    thinking: 'विचार करत आहे...',
    newQuestion: 'नवीन प्रश्न विचारा',
    examplesTitle: 'उदाहरणे:',
    examples: [
      'माझ्या टोमॅटो पिकात कीटक लागले आहेत',
      'तांदळाच्या शेतीसाठी कोणते खत चांगले',
      'आज पाऊस पडतोय, स्प्रे करू शकतो का?',
      'गव्हाची पेरणी करण्याचा योग्य वेळ काय आहे'
    ],
  },
  mni: {
    code: 'mni',
    title: 'টেক্সট সহায়ক',
    subtitle: 'আপোনার কৃষি সম্পর্কিত প্রশ্ন জিজ্ঞাসা করুন',
    placeholder: 'এখানে আপনার সমস্যা লিখুন... "আমার গমের ফসলের পাতা হলুদ হয়ে যাচ্ছে"',
    send: 'পাঠান',
    typing: 'টাইপ হচ্ছে...',
    thinking: 'ভাবছে...',
    newQuestion: 'নতুন প্রশ্ন জিজ্ঞাসা করুন',
    examplesTitle: 'উদাহরণ:',
    examples: [
      'আমার টমেটোর ফসলে কীটপতঙ্গের আক্রমণ হয়েছে',
      'ধান চাষের জন্য কোন সার ভালো',
      'আজ বৃষ্টি হচ্ছে, কীটনাশক স্প্রে করতে পারি?',
      'গম বপনের সঠিক সময় কখন'
    ],
  },
  bo: {
    code: 'bo',
    title: 'ཡིག་གཟུགས་ལས་རོགས།',
    subtitle: 'ཁྱེད་ཀྱི་ཞིང་ལས་སྐོར་གྱི་དྲི་བ་འདྲི་རོགས།',
    placeholder: 'འདིར་ཁྱེད་ཀྱི་དཀའ་ངལ་བྲིས་རོགས།... "ངའི་གྲོ་ཞིང་གི་ལོ་མ་སེར་པོ་ཆགས་ཀྱི་འདུག"',
    send: 'སྐུར།',
    typing: 'ཡིག་གཏགས་རྒྱག་བཞིན་པ།...',
    thinking: 'བསམ་བློ་གཏོང་བཞིན་པ།...',
    newQuestion: 'དྲི་བ་གསར་པ་འདྲི་རོགས།',
    examplesTitle: 'དཔེར་ན།',
    examples: [
      'ངའི་ཊོ་མ་ཊོའི་ལོ་ཏོག་ལ་འབུ་ཞུགས་འདུག',
      'འབྲས་འདེབས་པར་ལུད་རིགས་གང་བཟང་།',
      'དེ་རིང་ཆར་པ་བབས་ཀྱི་འདུག སྨན་ཆུ་གཏོར་ཆོག་གམ།',
      'གྲོ་འདེབས་པའི་དུས་ཚོད་འོས་འཚམ་གང་ཡིན།'
    ],
  },
  ks: {
    code: 'ks',
    title: 'ٹیکسٹ اسسٹنٹ',
    subtitle: 'اپنے زراعت کے سوالات پوچھیں',
    placeholder: 'یہاں اپنا مسئلہ لکھیں... "میری گندم کی فصل کے پتے پیلے ہو رہے ہیں"',
    send: 'بھیجیں',
    typing: 'ٹائप کر رہا ہے...',
    thinking: 'سوچ رہا ہے...',
    newQuestion: 'نیا سوال پوچھیں',
    examplesTitle: 'مثالیں:',
    examples: [
      'میری ٹماٹر کی فصل میں کیڑے لگ گئے ہیں',
      'چاول کی کاشت کے لئے کون سا کھاد بہتر ہے',
      'آج بارش ہو رہی ہے، سپرے کر سکتے ہیں؟',
      'گندم کی بوائی کا صحیح وقت کیا ہے'
    ],
  },
  doi: {
    code: 'doi',
    title: 'टेक्स्ट सहाय्यक',
    subtitle: 'अपने कृषि संबंधी सवाल पूछो',
    placeholder: 'अपनी समस्या यहाँ लिखें... "मेरी गेहूँ की फसल के पत्ते पीले हो रहे हैं"',
    send: 'भेजो',
    typing: 'टाइप कर रहा है...',
    thinking: 'सोच रहा है...',
    newQuestion: 'नया सवाल पूछो',
    examplesTitle: 'उदाहरण:',
    examples: [
      'मेरी टमाटर की फसल में कीड़े लग गए हैं',
      'धान की खेती के लिए कौन सा खाद बेहतर है',
      'आज बारिश हो रही है, क्या छिड़काव कर सकते हैं',
      'गेहूँ की बुआई का सही समय क्या है'
    ],
  },
};

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface TextPageProps {
  language: Language;
  userInfo: UserInfo;
}

export default function TextPage({ language, userInfo }: TextPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { geminiApi } = await import('../../services/geminiApi');
      return await geminiApi.askQuestion(userMessage, language.code, userInfo.location);
    } catch (error) {
      console.error('AI Response Error:', error);
      const fallbackMessages: Record<string, string> = {
        en: `${userInfo.name}, sorry, there's currently an issue with the AI service. Please try again later. For emergencies, contact your local agricultural expert.`,
      };
      return fallbackMessages[language.code] || fallbackMessages.en;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseContent = await getAIResponse(userMessage.content);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      const history = JSON.parse(localStorage.getItem('krishi-history') || '[]');
      history.push({
        type: 'text',
        query: userMessage.content,
        response: aiResponse.content,
        timestamp: new Date().toISOString(),
        language: language.code,
      });
      localStorage.setItem('krishi-history', JSON.stringify(history));
    } catch (error) {
      setIsLoading(false);
      console.error('Error getting AI response:', error);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-green-800">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </motion.div>

        <Card className="flex flex-col h-[calc(100vh-250px)] bg-white/80 backdrop-blur-sm border-green-200">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">{t.examplesTitle}</p>
                  <div className="grid gap-2 max-w-md mx-auto">
                    {t.examples.map((example, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleExampleClick(example)}
                        className="text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-green-700 text-sm transition-all duration-200"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-600">{t.thinking}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-green-200 p-4">
            <div className="flex space-x-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 min-h-[80px] resize-none border-green-300 focus:border-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}