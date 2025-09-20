import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, MessageSquare, Image, Sparkles, Sun, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language, UserInfo } from '../../App';
import type { MainAppPage } from '../MainApp';

const translations = {
  hi: {
    greeting: 'किसान साथी आपका हार्दिक स्वागत करता है',
    subtitle: 'आपकी खेती की यात्रा में आपका साथी',
    voiceTitle: 'बोलकर पूछें',
    voiceDesc: 'अपनी समस्या बोलकर बताएं',
    textTitle: 'लिखकर पूछें',
    textDesc: 'लिखकर सवाल पूछें',
    imageTitle: 'फोटो से जानें',
    imageDesc: 'फसल की तस्वीर भेजें',
    quickReminder: 'आज का काम',
    reminderText: 'सुबह खेत की जांच करना न भूलें!',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
  },
  en: {
    greeting: 'Kisan Sathi warmly welcomes you',
    subtitle: 'Your companion in the farming journey',
    voiceTitle: 'Voice Assistant',
    voiceDesc: 'Tell us your problem by speaking',
    textTitle: 'Text Query',
    textDesc: 'Ask questions by typing',
    imageTitle: 'Image Analysis',
    imageDesc: 'Send crop photos',
    quickReminder: "Today's Task",
    reminderText: "Don't forget to check your fields this morning!",
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
  },
  ta: {
    greeting: 'கிசான் சாத்தி உங்களை அன்புடன் வரவேற்கிறது',
    subtitle: 'உங்கள் விவசாய பயணத்தில் உங்கள் துணை',
    voiceTitle: 'குரல் உதவி',
    voiceDesc: 'உங்கள் பிரச்சனையை சொல்லுங்கள்',
    textTitle: 'உரை கேள்வி',
    textDesc: 'தட்டச்சு செய்து கேள்விகள் கேளுங்கள்',
    imageTitle: 'பட பகுப்பாய்வு',
    imageDesc: 'பயிர் புகைப்படங்களை அனுப்புங்கள்',
    quickReminder: 'இன்றைய பணி',
    reminderText: 'இன்று காலையில் உங்கள் வயல்��ளை சரிபார்க்க மறக்காதீர்கள்!',
    goodMorning: 'காலை வணக்கம்',
    goodAfternoon: 'மதிய வணக்கம்',
    goodEvening: 'மாலை வணக்கம்',
  },
  te: {
    greeting: 'కిసాన్ సాథి మిమ్మల్ని హృదయపూర్వకంగా స్వాగతిస్తోంది',
    subtitle: 'మీ వ్యవసాయ ప్రయాణంలో మీ తోడుడు',
    voiceTitle: 'వాయిస్ అసిస్టెంట్',
    voiceDesc: 'మీ సమస్యను చెప్పండి',
    textTitle: 'టెక్స్ట్ ప్రశ్న',
    textDesc: 'టైప్ చేసి ప్రశ్నలు అడగండి',
    imageTitle: 'చిత్ర విశ్లేషణ',
    imageDesc: 'పంటల ఫొటోలు పంపండి',
    quickReminder: 'ఈ రోజు పని',
    reminderText: 'ఈ ఉదయం పొలాలను తనిఖీ చేయడం మర్చిపోవద్దు!',
    goodMorning: 'శుభోదయం',
    goodAfternoon: 'నమస్కారం',
    goodEvening: 'శుభ సాయంత్రం',
  },
  bn: {
    greeting: 'কিসান সাথী আপনাকে আন্তরিকভাবে স্বাগত জানায়',
    subtitle: 'আপনার কৃষি যাত্রার সঙ্গী',
    voiceTitle: 'ভয়েস অ্যাসিস্ট্যান্ট',
    voiceDesc: 'আপনার সমস্যা বলুন',
    textTitle: 'টেক্সট প্রশ্ন',
    textDesc: 'লিখে প্রশ্ন করুন',
    imageTitle: 'ছবি বিশ্লেষণ',
    imageDesc: 'ফসলের ছবি পাঠান',
    quickReminder: 'আজকের কাজ',
    reminderText: 'আজ সকালে ক্ষেত পরীক্ষা করতে ভুলবেন না!',
    goodMorning: 'সুপ্রভাত',
    goodAfternoon: 'নমস্কার',
    goodEvening: 'শুভ সন্ধ্যা',
  },
  kn: {
    greeting: 'ಕಿಸಾನ್ ಸಾಥಿ ನಿಮ್ಮನ್ನು ಹೃತ್ಪೂರ್ವಕವಾಗಿ ಸ್ವಾಗತಿಸುತ್ತದೆ',
    subtitle: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣದಲ್ಲಿ ನಿಮ್ಮ ಸಂಗಾತಿ',
    voiceTitle: 'ಧ್ವನಿ ಸಹಾಯಕ',
    voiceDesc: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ',
    textTitle: 'ಪಠ್ಯ ಪ್ರಶ್ನೆ',
    textDesc: 'ಟೈಪ್ ಮಾಡಿ ಪ್ರಶ್ನೆ ಕೇಳಿ',
    imageTitle: 'ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ',
    imageDesc: 'ಬೆಳೆ ಫೋಟೋಗ��ನ್ನು ಕಳುಹಿಸಿ',
    quickReminder: 'ಇಂದಿನ ಕೆಲಸ',
    reminderText: 'ಈ ಬೆಳಗ್ಗೆ ಹೊಲ ಪರಿಶೀಲಿಸಲು ಮರೆತಿರಬೇಡಿ!',
    goodMorning: 'ಶುಭೋದಯ',
    goodAfternoon: 'ನಮಸ್ಕಾರ',
    goodEvening: 'ಶುಭ ಸಂಜೆ',
  },
  ml: {
    greeting: 'കിസാൻ സാഥി നിങ്ങളെ ഹൃദയപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു',
    subtitle: 'നിങ്ങളുടെ കൃഷി യാത്രയിൽ നിങ്ങളുടെ കൂട്ടുകാരൻ',
    voiceTitle: 'വോയിസ് അസിസ്റ്റന്റ്',
    voiceDesc: 'നിങ്ങളുടെ പ്രശ്നം പറയൂ',
    textTitle: 'ടെക്സ്റ്റ് ചോദ്യം',
    textDesc: 'ടൈപ്പ് ചെയ്ത് ചോദിക്കൂ',
    imageTitle: 'ചിത്ര വിശകലനം',
    imageDesc: 'വിളകളുടെ ഫോട്ടോ അയയ്ക്കൂ',
    quickReminder: 'ഇന്നത്തെ ജോലി',
    reminderText: 'ഇന്ന് രാവിലെ വയൽ പരിശോധിക്കാൻ മറക്കരുത്!',
    goodMorning: 'സുപ്രഭാതം',
    goodAfternoon: 'നമസ്കാരം',
    goodEvening: 'ശുഭ സായാഹ്നം',
  },
  gu: {
    greeting: 'કિસાન સાથી તમારું હાર્દિક સ્વાગત કરે છે',
    subtitle: 'તમારા ખેતીના સફરમાં તમારો સાથી',
    voiceTitle: 'વોઇસ આસિસ્ટન્ટ',
    voiceDesc: 'તમારી સમસ્યા બોલીને જણાવો',
    textTitle: 'ટેક્સ્ટ પ્રશ્ન',
    textDesc: 'લખીને પ્રશ્ન પૂછો',
    imageTitle: 'ઇમેજ વિશ્લેષણ',
    imageDesc: 'પાકના ફોટા મોકલો',
    quickReminder: 'આજનું કાર્ય',
    reminderText: 'આજે સવારે ખેતર ચકાસવાનું ભૂલશો નહીં!',
    goodMorning: 'સુપ્રભાત',
    goodAfternoon: 'નમસ્કાર',
    goodEvening: 'શુભ સાંજ',
  },
  mr: {
    greeting: 'किसान साथी तुमचे मनःपूर्वक स्वागत करते',
    subtitle: 'तुमच्या शेतीच्या प्रवासात तुमचा सोबती',
    voiceTitle: 'व्हॉइस असिस्टंट',
    voiceDesc: 'तुमची समस्या सांगा',
    textTitle: 'टेक्स्ट प्रश्न',
    textDesc: 'लिहून प्रश्न विचारा',
    imageTitle: 'प्रतिमा विश्लेषण',
    imageDesc: 'पिकांचे फोटो पाठवा',
    quickReminder: 'आजचे काम',
    reminderText: 'आज सकाळी शेत तपासायला विसरू नका!',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्याकाळ',
  },
  pa: {
    greeting: 'ਕਿਸਾਨ ਸਾਥੀ ਤੁਹਾਡਾ ਤਹਿ ਦਿਲੋਂ ਸੁਆਗਤ ਕਰਦੀ ਹੈ',
    subtitle: 'ਤੁਹਾਡੇ ਖੇਤੀ ਯਾਤਰਾ ਵਿੱਚ ਤੁਹਾਡੀ ਸਾਥੀ',
    voiceTitle: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ',
    voiceDesc: 'ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ',
    textTitle: 'ਟੈਕਸਟ ਸਵਾਲ',
    textDesc: 'ਲਿਖ ਕੇ ਸਵਾਲ ਪੁੱਛੋ',
    imageTitle: 'ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ',
    imageDesc: 'ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਭੇਜੋ',
    quickReminder: 'ਅੱਜ ਦਾ ਕੰਮ',
    reminderText: 'ਅੱਜ ਸਵੇਰੇ ਖੇਤ ਦੀ ਜਾਂਚ ਕਰਨਾ ਨਾ ਭੁੱਲੋ!',
    goodMorning: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    goodAfternoon: 'ਨਮਸਕਾਰ',
    goodEvening: 'ਸ਼ੁਭ ਸ਼ਾਮ',
  },
  ur: {
    greeting: 'کسان ساتھی آپ کا پُر خلوص استقبال کرتا ہے',
    subtitle: 'آپ کی کاشتکاری کے سفر میں آپ کا ساتھی',
    voiceTitle: 'صوتی معاون',
    voiceDesc: 'اپنی مسئلہ بتائیں',
    textTitle: 'متن سوال',
    textDesc: 'لکھ کر سوال کریں',
    imageTitle: 'تصویر کا تجزیہ',
    imageDesc: 'فصل کی تصاویر بھیجیں',
    quickReminder: 'آج کا کام',
    reminderText: 'آج صبح کھیت کی جانچ کرنا نہ بھولیں!',
    goodMorning: 'صبح بخیر',
    goodAfternoon: 'نمستے',
    goodEvening: 'شب بخیر',
  },
  or: {
    greeting: 'କିସାନ ସାଥି ଆପଣଙ୍କୁ ହୃଦୟପୂର୍ବକ ସ୍ବାଗତ କରେ',
    subtitle: 'ଆପଣଙ୍କ କୃଷି ଯାତ୍ରାରେ ସହଭାଗୀ',
    voiceTitle: 'ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ',
    voiceDesc: 'ଆପଣଙ୍କ ସମସ୍ୟା କହନ୍ତୁ',
    textTitle: 'ଟେକ୍ସଟ୍ ପ୍ରଶ୍ନ',
    textDesc: 'ଲେଖି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
    imageTitle: 'ପ୍ରତିଛବି ବିଶ୍ଳେଷଣ',
    imageDesc: 'ଚାଷ ପଦାର୍ଥର ଫଟୋ ପଠାନ୍ତୁ',
    quickReminder: 'ଆଜିର କାମ',
    reminderText: 'ଆଜି ସକାଳେ ମାଳିକାନା ଯାଞ୍ଚ କରିବାକୁ ଭୁଲିବେ ନାହିଁ!',
    goodMorning: 'ଶୁଭ ସକାଳ',
    goodAfternoon: 'ନମସ୍କାର',
    goodEvening: 'ଶୁଭ ସନ୍ଧ୍ୟା',
  },
  as: {
    greeting: 'কিছান সাথী আপোনাক হৃদয়পূৰ্বক স্বাগতম জনাইছে',
    subtitle: 'আপোনাৰ কৃষি যাত্ৰাৰ সংগী',
    voiceTitle: 'ভইচ এচিষ্টেণ্ট',
    voiceDesc: 'আপোনাৰ সমস্যা কওক',
    textTitle: 'টেক্সট প্রশ্ন',
    textDesc: 'লিখি প্ৰশ্ন কৰক',
    imageTitle: 'ছবি বিশ্লেষণ',
    imageDesc: 'ফচলৰ ফটো পঠিওৱক',
    quickReminder: 'আজিৰ কাম',
    reminderText: 'আজিৰ পুৱা খেতি পৰীক্ষা কৰিবলৈ নাপাহৰিব!',
    goodMorning: 'শুভ প্ৰভাত',
    goodAfternoon: 'নমস্কাৰ',
    goodEvening: 'শুভ সন্ধ্যা',
  },
  bho: {
    greeting: 'किसान साथी तोहार हार्दिक स्वागत करेला',
    subtitle: 'खेती के सफर में तोहार साथी',
    voiceTitle: 'बोल के पूछीं',
    voiceDesc: 'अपना समस्या बोल के बताव',
    textTitle: 'लिख के पूछीं',
    textDesc: 'लिख के सवाल पूछऽ',
    imageTitle: 'फोटो से जानीं',
    imageDesc: 'फसल के फोटो भेजऽ',
    quickReminder: 'आज के काम',
    reminderText: 'सुबह खेत देखे के मत भुलऽ!',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
  },
  mai: {
    greeting: 'किसान साथी अहाँक हार्दिक स्वागत करैत अछि',
    subtitle: 'अहाँक खेती यात्रा में अहाँक साथी',
    voiceTitle: 'बाजि कऽ पुछू',
    voiceDesc: 'अपन समस्या कहू',
    textTitle: 'लिखि कऽ पुछू',
    textDesc: 'लिखि सवाल पुछू',
    imageTitle: 'फोटो सँ जानू',
    imageDesc: 'फसलक फोटो पठाबू',
    quickReminder: 'आजुक काज',
    reminderText: 'काल्हि सबेर खेत जाँच करबाक नहि बिसरू!',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शु��� संध्याकाल',
  },
  magahi: {
    greeting: 'किसान साथी तोहार हार्दिक स्वागत करेला',
    subtitle: 'खेती के सफर में तोहार साथी',
    voiceTitle: 'बोल के पूछऽ',
    voiceDesc: 'अपना समस्या बोल के बताव',
    textTitle: 'लिख के पूछऽ',
    textDesc: 'लिख के सवाल पूछऽ',
    imageTitle: 'फोटो से जानऽ',
    imageDesc: 'फसल के फोटो भेजऽ',
    quickReminder: 'आज के काम',
    reminderText: 'सुबह खेत देखे के मत भुलऽ!',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
  },
  sa: {
    greeting: 'कृषकसखा भवतः हार्दिकं स्वागतं करोति',
    subtitle: 'कृषेः यात्रायां भवतः सहचरः',
    voiceTitle: 'ध्वनिना पृच्छतु',
    voiceDesc: 'स्वीयं समस्या वक्तुम्',
    textTitle: 'लेखनेन पृच्छतु',
    textDesc: 'लिखित्वा प्रश्नं पृच्छतु',
    imageTitle: 'चित्रेण जानातु',
    imageDesc: 'कृषेः चित्रं प्रेषयतु',
    quickReminder: 'अद्यतनं कार्यम्',
    reminderText: 'प्रातःकाले क्षेत्रस्य निरीक्षणं न विस्मरन्तु!',
    goodMorning: 'सुप्रभातम्',
    goodAfternoon: 'नमस्कारः',
    goodEvening: 'शुभसन्ध्या',
  },
  sd: {
    greeting: 'کسان ساتھی توھان جو دل سان استقبال ڪري ٿو',
    subtitle: 'توهان جي زرعي سفر ۾ ساٿي',
    voiceTitle: 'آواز اسسٽنٽ',
    voiceDesc: 'پنهنجي مسئلي کي ٻڌايو',
    textTitle: 'متن سوال',
    textDesc: 'لکندي سوال پڇو',
    imageTitle: 'تصوير تجزيو',
    imageDesc: 'فصل جون تصويرون موڪليو',
    quickReminder: 'اڄ جو ڪم',
    reminderText: 'صبح جو پنهنجا ٻيا نه وساريو!',
    goodMorning: 'صبح بخير',
    goodAfternoon: 'نمازڪار',
    goodEvening: 'شام جو سلام',
  },
  ne: {
    greeting: 'किसान साथी तपाईंलाई हार्दिक स्वागत गर्दछ',
    subtitle: 'तपाईंको खेतीको यात्रामा साथी',
    voiceTitle: 'भ्वाइस सहायक',
    voiceDesc: 'तपाईंको समस्या बोल्नुस्',
    textTitle: 'पाठ प्रश्न',
    textDesc: 'टाइप गरेर प्रश्न सोध्नुस्',
    imageTitle: 'छवि विश्लेषण',
    imageDesc: 'बालीका तस्वीर पठाउनुस्',
    quickReminder: 'आजको काम',
    reminderText: 'आज बिहान खेत जाँच्न नबिर्सनुस्!',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ साँझ',
  },
  kok: {
    greeting: 'किसान साथी तुमका हार्दिक स्वागत करता',
    subtitle: 'तुमच्या शेतीच्या प्रवासात तुमचा सोबती',
    voiceTitle: 'आवाज सहाय्यक',
    voiceDesc: 'तुमची समस्या सांग',
    textTitle: 'मजकूर प्रश्न',
    textDesc: 'लिहून प्रश्न विचार',
    imageTitle: 'प्रतिमा विश्लेषण',
    imageDesc: 'पिकांचे फोटो धाड',
    quickReminder: 'आयजेर काम',
    reminderText: 'आज सकाळी शेती तपासायल विसरू नाका!',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्याकाळ',
  },
  mni: {
    greeting: 'ꯀꯤꯁꯥꯟ ꯁꯥꯊꯤ নংগো ওইনা স্বাগতম তৌরে',
    subtitle: 'অদোমগী লুইরামগী যাত্রাদা অদোমগী মশক',
    voiceTitle: 'খেল লৌ',
    voiceDesc: 'অদোমগী সমস্যাদু হায়বিয়ু',
    textTitle: 'টেক্সট প্রশ্ন',
    textDesc: 'শরুকনা প্রস্ন হায়বিয়ু',
    imageTitle: 'ছবি বিশ্লেষণ',
    imageDesc: 'ফরলগী ফোতো পঠিয়ু',
    quickReminder: 'নাতাগী থবক',
    reminderText: 'চংবা মপান লুইরাম শিনবা নাপাোরো!',
    goodMorning: 'শুভ প্রভাত',
    goodAfternoon: 'নমস্কার',
    goodEvening: 'শুভ সন্ধ্যা',
  },
  bo: {
    greeting: 'ཀི་སཱན་ས་ཐི གིས་ཁྱེད་ལ་སྤྱི་བོར་དགའ་བསུ་ཞུ་ཡོད།',
    subtitle: 'ཁྱེད་ཀྱི་ཞིང་ལས་འགྲུབ་ལམ་ལ་ཁྱེད་ཀྱི་ཆེད་གྲོགས།',
    voiceTitle: 'སྐད་ཆའི་ལས་རོགས།',
    voiceDesc: 'ཁྱེད་ཀྱི་དཀའ་ངལ་གསལ་བསྒྲགས་འབད།',
    textTitle: 'ཡིག་འབྲི་བ།',
    textDesc: 'འབྲི་ནས་དྲི་བ་འདྲི་དགོས།',
    imageTitle: 'པར་རིས་དབྱེ་ཞིབ།',
    imageDesc: 'སྲོག་འབྲུག་གི་པར་གཏོང་།',
    quickReminder: 'དེ་རིང་གི་ལས་འགན།',
    reminderText: 'དགུང་དགུང་ཞིང་འབྲེལ་ཞିབ་བཤེར་མ་བརྗེད།',
    goodMorning: 'ཞོགས་ཕྱིན་བདེ་ལེགས།',
    goodAfternoon: 'ཉིན་གུང་བདེ་ལེགས།',
    goodEvening: 'དགོང་མོ་བདེ་ལེགས།',
  },
  ks: {
    greeting: 'کسان ساتھی توہند خیرمقدم کران',
    subtitle: 'توہند کھیتی سفرس منز ساتھی',
    voiceTitle: 'آواز اسسٹنٹ',
    voiceDesc: 'پننۍ مسلہ کھیو',
    textTitle: 'متن سوال',
    textDesc: 'لکھن س سوال کھیو',
    imageTitle: 'تصویر تجزیہ',
    imageDesc: 'فصل تصویرن ژار',
    quickReminder: 'اَز کا کام',
    reminderText: 'سوبح خئت چیک کرن مٲ نہ بھلویو!',
    goodMorning: 'صبح بخیر',
    goodAfternoon: 'نمस्कार',
    goodEvening: 'شام بخیر',
  },
  doi: {
    greeting: 'किसान साथी तुहाडा दिलों स्वागत करदा ऐ',
    subtitle: 'तुहाडी खेती दे सफर विच तुहाडा साथी',
    voiceTitle: 'आवाज सहायक',
    voiceDesc: 'अपनी समस्या दस्सो',
    textTitle: 'लिखियो सवाल',
    textDesc: 'लिख के प्रश्न पुछो',
    imageTitle: 'फोटो विश्लेषण',
    imageDesc: 'फसल दी फोटो भेजो',
    quickReminder: 'अज दा काम',
    reminderText: 'अज सबेरे खेत देखणा न पुल्लो!',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ सांझ',
  },
};

interface HomePageProps {
  language: Language;
  userInfo: UserInfo;
  onNavigate: (page: MainAppPage) => void;
}

export default function HomePage({ language, userInfo, onNavigate }: HomePageProps) {
  const [greeting, setGreeting] = useState('');
  const [showReminder, setShowReminder] = useState(true);
  
  const t = translations[language.code as keyof typeof translations] || translations.hi;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t.goodMorning);
    } else if (hour < 17) {
      setGreeting(t.goodAfternoon);
    } else {
      setGreeting(t.goodEvening);
    }

    const lastReminderDate = localStorage.getItem('krishi-last-reminder');
    const today = new Date().toDateString();
    if (lastReminderDate === today) {
      setShowReminder(false);
    }
  }, [t]);

  const dismissReminder = () => {
    setShowReminder(false);
    localStorage.setItem('krishi-last-reminder', new Date().toDateString());
  };

  const aiFeatures = [
    {
      id: 'voice',
      title: t.voiceTitle,
      description: t.voiceDesc,
      icon: Mic,
      color: 'from-blue-400 to-blue-600',
      page: 'voice' as MainAppPage,
    },
    {
      id: 'text',
      title: t.textTitle,
      description: t.textDesc,
      icon: MessageSquare,
      color: 'from-green-400 to-green-600',
      page: 'text' as MainAppPage,
    },
    {
      id: 'image',
      title: t.imageTitle,
      description: t.imageDesc,
      icon: Image,
      color: 'from-purple-400 to-purple-600',
      page: 'image' as MainAppPage,
    },
  ];

  return (
    <div className="min-h-screen p-6 pt-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: '#EAE5D4' }}
            >
              <Leaf className="h-6 w-6" style={{ color: '#378632' }} />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F4AE29' }}
            >
              <Sun className="h-6 w-6" style={{ color: '#FFFFFF' }} />
            </motion.div>
          </div>
          
          <h1 className="text-2xl mb-3" style={{ color: '#224F27' }}>
            {greeting}{userInfo.name ? `, ${userInfo.name}` : ''}!
          </h1>
          
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl mb-2" style={{ color: '#378632' }}
          >
            {t.greeting}
          </motion.h2>
          
          <p style={{ color: '#707070' }}>{t.subtitle}</p>
        </motion.div>

        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <Alert className="border-2" style={{ backgroundColor: '#EAE5D4', borderColor: '#F4AE29' }}>
              <Sparkles className="h-4 w-4" style={{ color: '#F4AE29' }} />
              <AlertDescription style={{ color: '#1C1C1C' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{t.quickReminder}:</strong> {t.reminderText}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissReminder}
                    className="border-0 p-2"
                    style={{ color: '#707070' }}
                  >
                    ✕
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Voice Button - Large Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('voice')}
            className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ backgroundColor: '#378632' }}
          >
            <Mic className="h-16 w-16" style={{ color: '#FFFFFF' }} />
          </motion.button>
        </motion.div>

        {/* Camera and Text Buttons - Side by Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 gap-6 max-w-md mx-auto"
        >
          {/* Upload Image Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => onNavigate('image')}
              className="w-full p-6 rounded-2xl transition-all duration-300 border-2"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#E3E3E3'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#378632';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E3E3E3';
              }}
            >
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto mb-3" style={{ color: '#1C1C1C' }} />
                <h3 className="text-sm" style={{ color: '#1C1C1C' }}>{aiFeatures[2].title}</h3>
              </div>
            </button>
          </motion.div>

          {/* Type Query Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => onNavigate('text')}
              className="w-full p-6 rounded-2xl transition-all duration-300 border-2"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#E3E3E3'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#378632';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E3E3E3';
              }}
            >
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: '#1C1C1C' }} />
                <h3 className="text-sm" style={{ color: '#1C1C1C' }}>{aiFeatures[1].title}</h3>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}