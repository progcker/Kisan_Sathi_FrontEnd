import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language, UserInfo } from '../../App';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const languageCodeToSpeechLang: { [key: string]: string } = {
  en: 'en-US',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  or: 'or-IN',
  as: 'as-IN',
  bho: 'bho-IN',
  mai: 'mai-IN',
  mag: 'mag-IN',
  sa: 'sa-IN',
  sd: 'sd-IN',
  ne: 'ne-NP',
  kok: 'kok-IN',
};

const translations = {
  hi: {
    title: 'आवाज़ सहायक',
    subtitle: 'अपनी समस्या बोलकर बताएं',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    listening: 'सुन रहे हैं...',
    processing: 'जवाब तैयार कर रहे हैं...',
    playResponse: 'जवाब सुनें',
    instructions: 'माइक बटन दबाकर अपनी खेती से जुड़ी समस्या बताएं',
    mockResponse: 'आपकी फसल में पत्तियों का पीला होना नाइट्रोजन की कमी का संकेत है। प्रति एकड़ 20 किलो यूरिया डालें और नियमित पानी दें।',
    noMicSupport: 'माइक्रोफोन समर्थित नहीं है',
    speechNotSupported: 'भाषा पहचान समर्थित नहीं है',
    recognizing: 'पहचान रहे हैं...',
    noSpeech: 'कृपया बोलें...',
    micPermissionDenied: 'माइक्रोफोन अनुमति अस्वीकृत',
    repeatProblem: 'कृपया अपनी समस्या दोहराएं...',
    youAreSaying: 'आप कह रहे हैं:',
    youSaid: 'आपने कहा:',
    aiSuggestion: 'AI सुझाव:',
    newQuestion: 'नया सवाल पूछें',
    apiError: 'AI से जवाब नहीं मिल सका। कृपया फिर प्रयास करें।',
  },
  en: {
    title: 'Voice Assistant',
    subtitle: 'Tell us your farming problems',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    listening: 'Listening...',
    processing: 'Preparing response...',
    playResponse: 'Play Response',
    instructions: 'Press the mic button and tell us about your farming issues',
    mockResponse: 'The yellowing of leaves in your crop indicates nitrogen deficiency. Apply 20kg urea per acre and water regularly.',
    noMicSupport: 'Microphone not supported',
    speechNotSupported: 'Speech recognition not supported',
    recognizing: 'Recognizing...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI response could not be generated. Please try again.',
  },
  ta: {
    title: 'குரல் உதவியாளர்',
    subtitle: 'உங்கள் விவசாய பிரச்சனைகளை சொல்லுங்கள்',
    startRecording: 'பதிவு தொடங்கு',
    stopRecording: 'பதிவு நிறுத்து',
    listening: 'கேட்கிறது...',
    processing: 'பதில் தயாராகிறது...',
    playResponse: 'பதில் கேளுங்கள்',
    instructions: 'மைக் பட்டனை அழுத்தி உங்கள் விவசாய பிரச்சனைகளை சொல்லுங்கள்',
    mockResponse: 'உங்கள் பயிரில் இலைகள் மஞ்சளாகுவது நைட்ரஜன் குறைபாட்டைக் குறிக்கிறது. ஒரு ஏக்கருக்கு 20 கிலோ யூரியா போட்டு தவறாமல் தண்ணீர் கொடுங்கள்.',
    noMicSupport: 'மைக்ரோஃபோன் ஆதரிக்கப்படவில்லை',
    speechNotSupported: 'குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை',
    recognizing: 'அங்கீகரிக்கிறது...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI பதில் உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  te: {
    title: 'వాయిస్ సహాయకుడు',
    subtitle: 'మీ వ్యవసాయ సమస్యలను చెప్పండి',
    startRecording: 'రికార్డింగ్ ప్రారంభించండి',
    stopRecording: 'రికార్డింగ్ ఆపండి',
    listening: 'వింటున్నాం...',
    processing: 'సమాధానం సిద్ధం చేస్తోంది...',
    playResponse: 'సమాధానం వినండి',
    instructions: 'మైక్ బటన్ నొక్కి మీ వ్యవసాయ సమస్యను చెప్పండి',
    mockResponse: 'మీ పంటలో ఆకులు పసుపు రంగులోకి మారడం నైట్రోజన్ లోపానికి సంకేతం. ప్రతి ఎకరానికి 20 కిలో యూరియా వేసి క్రమం తప్పకుండా నీరు పెట్టండి.',
    noMicSupport: 'మైక్రోఫోన్ సపోర్ట్ చేయదు',
    speechNotSupported: 'స్పీచ్ రికగ్నిషన్ సపోర్ట్ చేయదు',
    recognizing: 'గుర్తిస్తోంది...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI సమాధానం రూపొందించబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
  kn: {
    title: 'ಧ್ವನಿ ಸಹಾಯಕ',
    subtitle: 'ನಿಮ್ಮ ಕೃಷಿ ಸಮಸ್ಯೆಗಳನ್ನು ಹೇಳಿ',
    startRecording: 'ದಾಖಲೆ ಪ್ರಾರಂಭಿಸಿ',
    stopRecording: 'ದಾಖಲೆ ನಿಲ್ಲಿಸಿ',
    listening: 'ಕೆಳಲಾಗುತ್ತಿದೆ...',
    processing: 'ಪ್ರತ್ಯುತ್ತರ ಸಿದ್ಧಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    playResponse: 'ಪ್ರತ್ಯುತ್ತರವನ್ನು ಕೇಳಿ',
    instructions: 'ಮೈಕ್ ಬಟన్ ಒತ್ತಿ ನಿಮ್ಮ ಕೃಷಿ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿ',
    mockResponse: 'ನಿಮ್ಮ ಬೆಳೆಗಳಲ್ಲಿ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು ನೈಟ್ರೋಜನ್ ಕೊರತೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಪ್ರತಿ ಎಕರೆಗೂ 20 ಕೆಜಿ ಯೂರಿಯಾ ಹಾಕಿ, ನಿಯಮಿತವಾಗಿ ನೀರು ಹಾಯಿಸಿ.',
    noMicSupport: 'ಮೈಕ್ರೋಫೋನ್ ಬೆಂಬಲಿಸಲಾಗುವುದಿಲ್ಲ',
    speechNotSupported: 'ಮಾತು ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ',
    recognizing: 'ಗುರುತಿಸುತ್ತಿದೆ...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI ಉತ್ತರವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  },
  ml: {
    title: 'വോയ്സ് അസിസ്റ്റന്റ്',
    subtitle: 'നിങ്ങളുടെ കൃഷി പ്രശ്നങ്ങൾ പറയൂ',
    startRecording: 'റെക്കോർഡിംഗ് ആരംഭിക്കുക',
    stopRecording: 'റെക്കോർഡിംഗ് ിർത്തുക',
    listening: 'കേൾക്കുന്നു...',
    processing: 'മറുപടി തയ്യാറാക്കുന്നു...',
    playResponse: 'മറുപടി കേൾക്കുക',
    instructions: 'മൈക്ക് ബട്ടൺ അമർത്തി നിങ്ങളുടെ കൃഷി പ്രശ്നം പറയൂ',
    mockResponse: 'വിളകളിൽ ഇലകൾ മഞ്ഞനിറത്തിലാകുന്നത് നൈട്രജൻ കുറവിന്റെ സൂചനയാണ്. ഏക്കറിന് 20 കിലോ യൂറിയ വിതറി സ്ഥിരമായി വെള്ളം കൊടുക്കുക.',
    noMicSupport: 'മൈക്രോഫോൺ പിന്തുണയ്‌ക്കുന്നില്ല',
    speechNotSupported: 'സ്പീച്ച് റെക്കഗ്നിഷൻ പിന്തുണയ്‌ക്കുന്നില്ല',
    recognizing: 'തിരിച്ചറിയുന്നു...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI പ്രതികരണം സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
  },
  bn: {
    title: 'ভয়েস সহকারী',
    subtitle: 'আপনার কৃষি সমস্যা বলুন',
    startRecording: 'রেকর্ডিং শুরু করুন',
    stopRecording: 'রেকর্ডিং বন্ধ করুন',
    listening: 'শোনা হচ্ছে...',
    processing: 'উত্তর প্রস্তুত হচ্ছে...',
    playResponse: 'উত্তর শুনুন',
    instructions: 'মাইক বোতাম চাপুন এবং আপনার কৃষি সমস্যা বলুন',
    mockResponse: 'ফসলের পাতাগুলো হলুদ হয়ে যাওয়া নাইট্রোজেনের ঘাটতির লক্ষণ। প্রতি একরে 20 কেজি ইউরিয়া প্রয়োগ করুন এবং নিয়মিত পানি দিন।',
    noMicSupport: 'মাইক্রোফোন সমর্থিত নয়',
    speechNotSupported: 'স্পিচ রিকগনিশন সমর্থিত নয়',
    recognizing: 'চিহ্নিত করা হচ্ছে...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI উত্তর তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  },
  gu: {
    title: 'વોઇસ સહાયક',
    subtitle: 'તમારી ખેતીની સમસ્યા જણાવો',
    startRecording: 'રેકોર્ડિંગ શરૂ કરો',
    stopRecording: 'રેકોર્ડિંગ બંધ કરો',
    listening: 'સાંભળવામાં આવી રહ્યું છે...',
    processing: 'જવાબ તૈયાર થઈ રહ્યો છે...',
    playResponse: 'જવાબ સાંભળો',
    instructions: 'માઇક બટન દબાવી તમારી ખેતીની સમસ્યા જણાવો',
    mockResponse: 'તમારા પાકમાં પાંદડા પીળા થવું નાઇટ્રોજનની અછત દર્શાવે છે. એકર દીઠ 20 કિલો યૂરિયા નાખો અને નિયમિત પાણી આપો.',
    noMicSupport: 'માઇક્રોફોન સપોર્ટેડ નથી',
    speechNotSupported: 'સ્પીચ રિકગ્નિશન સપોર્ટેડ નથી',
    recognizing: 'ઓળખવામાં આવી રહ્યું છે...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI પ્રતિસાદ ઉત્પન્ન કરી શકાયો નથી. કૃપા કરીને ફરી પ્રયાસ કરો।',
  },
  mr: {
    title: 'व्हॉईस असिस्टंट',
    subtitle: 'तुमच्या शेतीच्या समस्या सांगा',
    startRecording: 'रेकॉर्डिंग सुरू करा',
    stopRecording: 'रेकॉर्डिंग थांबवा',
    listening: 'ऐकत आहोत...',
    processing: 'उत्तर तयार करत आहोत...',
    playResponse: 'उत्तर ऐका',
    instructions: 'माइक बटन दाबून तुमची शेती समस्या सांगा',
    mockResponse: 'पिकामध्ये पाने पिवळी होणे हे नायट्रोजनच्या कमतरतेचे लक्षण आहे. प्रति एकर 20 किलो युरिया टाका आणि नियमित पाणी द्या.',
    noMicSupport: 'मायक्रोफोन समर्थित नाही',
    speechNotSupported: 'भाषा ओळख समर्थित नाही',
    recognizing: 'ओळखत आहोत...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI प्रतिसाद व्युत्पन्न होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  pa: {
    title: 'ਆਵਾਜ਼ ਸਹਾਇਕ',
    subtitle: 'ਆਪਣੀ ਖੇਤੀ ਦੀ ਸਮੱਸਿਆ ਦੱਸੋ',
    startRecording: 'ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    stopRecording: 'ਰਿਕਾਰਡਿੰਗ ਰੋਕੋ',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ...',
    processing: 'ਜਵਾਬ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    playResponse: 'ਜਵਾਬ ਸੁਣੋ',
    instructions: 'ਮਾਈਕ ਬਟਨ ਦਬਾ ਕੇ ਆਪਣੀ ਖੇਤੀ ਦੀ ਸਮੱਸਿਆ ਦੱਸੋ',
    mockResponse: 'ਤੁਹਾਡੇ ਫਸਲ ਵਿੱਚ ਪੱਤੇ ਪੀਲੇ ਹੋਣਾ ਨਾਈਟਰੋਜਨ ਦੀ ਘਾਟ ਦਾ ਸੰਕੇਤ ਹੈ। ਪ੍ਰਤੀ ਏਕੜ 20 ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ ਅਤੇ ਨਿਯਮਿਤ ਪਾਣੀ ਦਿਓ।',
    noMicSupport: 'ਮਾਈਕ੍ਰੋਫੋਨ ਸਹਾਇਤਾਪੂਰਣ ਨਹੀਂ',
    speechNotSupported: 'ਭਾਸ਼ਾ ਪਛਾਣ ਸਹਾਇਤਾਪੂਰਣ ਨਹੀਂ',
    recognizing: 'ਪਛਾਣਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI ਜਵਾਬ ਨਹੀਂ ਬਣਾਇਆ ਜਾ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  },
  ur: {
    title: 'وائس اسسٹنٹ',
    subtitle: 'اپنی زرعی مسئلے بتائیں',
    startRecording: 'ریکارڈنگ شروع کریں',
    stopRecording: 'ریکارڈنگ روکیں',
    listening: 'سن رہے ہیں...',
    processing: 'جواب تیار کیا جا رہا ہے...',
    playResponse: 'جواب سنیں',
    instructions: 'مائیک بٹن دبائیں اور اپنی کھیتی کے مسائل بتائیں',
    mockResponse: 'فصل کے پتوں کا پیلا ہونا نائٹروجن کی کمی کی علامت ہے۔ فی ایکڑ 20 کلو یوریا ڈالیں اور باقاعدگی سے پانی دیں۔',
    noMicSupport: 'مائیکروفون سپورٹڈ نہیں ہے',
    speechNotSupported: 'تقریر کی شناخت سپورٹڈ نہیں ہے',
    recognizing: 'شناخت کیا جا رہا ہے...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI جواب پیدا نہیں کیا جا سکا۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  or: {
    title: 'ଭୋଇସ୍ ସହାୟକ',
    subtitle: 'ଆପଣଙ୍କର କୃଷି ସମସ୍ୟା କହନ୍ତୁ',
    startRecording: 'ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ',
    stopRecording: 'ରେକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ',
    listening: 'ଶୁଣୁଛି...',
    processing: 'ଉତ୍ତର ପ୍ରସ୍ତୁତ କରୁଛି...',
    playResponse: 'ଉତ୍ତର ଶୁନନ୍ତୁ',
    instructions: 'ମାଇକ୍ ବଟନ୍ ଦବାଇ କୃଷି ସମସ୍ୟା କହନ୍ତୁ',
    mockResponse: 'ଆପଣଙ୍କର ଫସଲରେ ପତ୍ର ପୀତ ହେବା ନାଇଟ୍ରୋଜେନ ଅଭାବର ଚିହ୍ନ। ପ୍ରତି ଏକରକୁ 20 କିଲୋ ୟୁରିଆ ପକାନ୍ତୁ ଏବଂ ନିୟମିତ ପାଣି ଦିଅନ୍ତୁ।',
    noMicSupport: 'ମାଇକ୍ରୋଫୋନ୍ ସମର୍ଥିତ ନୁହେଁ',
    speechNotSupported: 'ବକ୍ତୃତା ଚିହ୍ନଟ ସମର୍ଥିତ ନୁହେଁ',
    recognizing: 'ଚିହ୍ନଟ କରାଯାଉଛି...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI ପ୍ରତିକ୍ରିୟା ସୃଷ୍ଟି ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  },
  as: {
    title: 'ভইচ সহায়ক',
    subtitle: 'আপোনাৰ কৃষি সমস্যা কওক',
    startRecording: 'ৰেকৰ্ডিং আৰম্ভ কৰক',
    stopRecording: 'ৰেকৰ্ডিং বন্ধ কৰক',
    listening: 'শুনিছে...',
    processing: 'উত্তৰ প্ৰস্তুত কৰা হৈছে...',
    playResponse: 'উত্তৰ শুনক',
    instructions: 'মাইক বুটাম টিপি আপোনাৰ কৃষি সমস্যা কওক',
    mockResponse: 'আপোনাৰ খেতিত পাতবোৰ পোহৰ হোৱা নাইট্ৰজেনৰ অভাৱ সূচায়। প্ৰতিখন একৰত 20 কিলোগ্ৰাম ইউৰিয়া প্ৰয়োগ কৰক আৰু নিয়মীয়াকৈ পানী দিয়ক।',
    noMicSupport: 'মাইক্ৰোফোন সমৰ্থিত নহয়',
    speechNotSupported: 'বক্তৃতা চিনি উঠা সমৰ্থিত নহয়',
    recognizing: 'চিহ্নিত কৰা হৈছে...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AIৰ সঁহাৰি সৃষ্টি কৰিব পৰা নগ’ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
  },
  bho: {
    title: 'आवाज सहायक',
    subtitle: 'अपना खेती के समस्या बताईं',
    startRecording: 'रिकार्डिंग सुरू करीं',
    stopRecording: 'रिकार्डिंग रोक दीं',
    listening: 'सुनीं जात बा...',
    processing: 'जवाब तयार होत बा...',
    playResponse: 'जवाब सुनीं',
    instructions: 'माइक बटन दबा के अपना खेती के समस्या बताईं',
    mockResponse: 'आपन फसल में पत्ता पीयर होखल नाइट्रोजन के कमी देखावत बा। प्रति एकड़ 20 किलो यूरिया डालीं आ नियमित पानी दीं।',
    noMicSupport: 'माइक्रोफोन सपोर्ट नइखे',
    speechNotSupported: 'भासा पहचान सपोर्ट नइखे',
    recognizing: 'पहचानी जात बा...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI से जवाब ना मिल पावल। कृपया फिर से कोशिश करीं।',
  },
  mai: {
    title: 'आवाज सहायक',
    subtitle: 'अपन खेती समस्या बताउ',
    startRecording: 'रिकार्डिंग सुरू करू',
    stopRecording: 'रिकार्डिंग रोकू',
    listening: 'सुनि रहल छी...',
    processing: 'जवाब तैयार भ रहल अछि...',
    playResponse: 'जवाब सुनू',
    instructions: 'माइक बटन दबा क अपन खेती समस्या बताउ',
    mockResponse: 'तोहर फसलक पात पीयर भऽ गेल अछि, ई नाइट्रोजनक कमीक संकेत अछि। प्रति एकड़ 20 किलो यूरिया छिड़कू आ नियमित पानी दिअ।',
    noMicSupport: 'माइक्रोफोन समर्थित नहि अछि',
    speechNotSupported: 'भाषा पहचान समर्थित नहि अछि',
    recognizing: 'पहचानल जाई रहल अछि...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI सँ जवाब नहि भेटल। कृपया पुनः प्रयास करू।',
  },
  mag: {
    title: 'आवाज सहायेक',
    subtitle: 'अपना खेती के समस्या बताईं',
    startRecording: 'रिकार्डिंग सुरू करीं',
    stopRecording: 'रिकार्डिंग रोक दीं',
    listening: 'सुनीं रहल बा...',
    processing: 'जवाब बनावल जात बा...',
    playResponse: 'जवाब सुनीं',
    instructions: 'माइक बटन दबा के खेती के समस्या बताईं',
    mockResponse: 'फसल के पत्ता पियर हो रहल बा ई नाइट्रोजन कमी के निशानी बा। प्रति एकड़ 20 किलो यूरिया डाल के नियमित पानी दीं।',
    noMicSupport: 'माइक्रोफोन सपोर्ट नइखे',
    speechNotSupported: 'भासा पहचान सपोर्ट नइखे',
    recognizing: 'पहचानल जाई रहल बा...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI से जवाब न मिलल ह। कृपया फिर से कोसिस करी।',
  },
  sa: {
    title: 'स्वर सहायकः',
    subtitle: 'भवतः कृषिसम्बन्धिनं समस्या वक्तुं शक्नोति',
    startRecording: 'लेखनं आरभत',
    stopRecording: 'लेखनं स्थगयत',
    listening: 'शृणोति...',
    processing: 'उत्तरं सज्जं क्रियते...',
    playResponse: 'उत्तरं शृणु',
    instructions: 'माइक बटनं नुदित्वा कृषिसम्बन्धिनी समस्या वदतु',
    mockResponse: 'भवतः पत्त्राणि पीतानि सन्ति चेत् नाइट्रोजन-अभावः। प्रति एकरं 20 किलोग्राम् युरिया स्थाप्यं नियमितं च जलं दद्यात्।',
    noMicSupport: 'माइक्रोफोनः न समर्थितः',
    speechNotSupported: 'भाषा-अङ्कनं न समर्थितम्',
    recognizing: 'अङ्क्यते...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI उत्तरं न प्राप्तम्। कृपया पुनः प्रयतस्व।',
  },
  sd: {
    title: 'آواز مددگار',
    subtitle: 'پنهنجي زراعت مسئلا ٻڌايو',
    startRecording: 'ريڪارڊنگ شروع ڪريو',
    stopRecording: 'ريڪارڊנג بند ڪريو',
    listening: ' ٻڌي رهيا آهيون...',
    processing: 'جواب تيار پيو ٿئي...',
    playResponse: 'جواب ٻڌو',
    instructions: 'مائڪ بٽڻ دٻائي پنهنجي زراعت مسئلا ٻڌايو',
    mockResponse: 'فصل ۾ پنن جو پيلو ٿيڻ نائٽروجن جي کوٽ ڏيکاري ٿو۔ في ايڪڙ 20 ڪلو يوريا وڌايو ۽ باقاعدي پاڻي ڏيو۔',
    noMicSupport: 'مائڪروفون سپورٹ ٿيل ناهي',
    speechNotSupported: 'تقرير جي شناخت سپورٹ ٿيل ناهي',
    recognizing: 'شناخت ڪري رهيا آه...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI جواب پيدا نه ٿي سگهيو. مهرباني ڪري ٻيهر ڪوشش ڪريو.',
  },
  ne: {
    title: 'भ्वाइस सहायक',
    subtitle: 'आफ्नो खेती समस्या भन्नुहोस्',
    startRecording: 'रेकर्डिङ सुरु गर्नुहोस्',
    stopRecording: 'रेकर्डिङ रोक्नुहोस्',
    listening: 'सुन्दैछौं...',
    processing: 'उत्तर तयार हुँदैछ...',
    playResponse: 'उत्तर सुन्नुहोस्',
    instructions: 'माइक बटन थिचेर आफ्नो खेती समस्या भन्नुहोस्',
    mockResponse: 'तपाईँको बालीमा पातहरू पहेंलो हुनु नाइट्रोजन अभावको सङ्केत हो। प्रति कठ्ठा 20 किलो युरिया हाल्नुहोस् र नियमित पानी दिनुहोस्।',
    noMicSupport: 'माइक्रोफोन समर्थन छैन',
    speechNotSupported: 'भाषा पहिचान समर्थन छैन',
    recognizing: 'पहिचान गरिँदैछ...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI प्रतिक्रिया उत्पन्न गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
  },
  kok: {
    title: 'व्हॉईस सहाय्यक',
    subtitle: 'तुमची शेती समस्या सांगा',
    startRecording: 'रेकॉर्डिंग सुरू करा',
    stopRecording: 'रेकॉर्डिंग थांबवा',
    listening: 'ऐकत आसा...',
    processing: 'उत्तरे तयार करता...',
    playResponse: 'उत्तर ऐका',
    instructions: 'माइक बटण दाबून तुमची शेती समस्या सांगा',
    mockResponse: 'फसलाची पानं पिवळी होवप म्हणजे नायट्रोजन कमी आसा. प्रति',
    noMicSupport: 'माइक्रोफोन समर्थित नाही',
    speechNotSupported: 'भाषा ओळख समर्थित नाही',
    recognizing: 'ओळखत आहे...',
    noSpeech: 'Please speak...',
    micPermissionDenied: 'Microphone permission denied',
    repeatProblem: 'Please repeat your problem...',
    youAreSaying: 'You are saying:',
    youSaid: 'You said:',
    aiSuggestion: 'AI Suggestion:',
    newQuestion: 'Ask a new question',
    apiError: 'AI प्रतिसाद व्युत्पन्न होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.',
  },
};

interface VoicePageProps {
  language: Language;
  userInfo: UserInfo;
}

export default function VoicePage({ language, userInfo }: VoicePageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError(t.speechNotSupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageCodeToSpeechLang[language.code] || 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript.trim());
      } else {
        setTranscript(interimTranscript);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError(t.noSpeech);
      } else if (event.error === 'not-allowed') {
        setError(t.micPermissionDenied);
      } else {
        setError(t.speechNotSupported);
      }
      setIsRecognizing(false);
    };
    
    recognition.onend = () => {
      setIsRecognizing(false);
    };
    
    return () => {
      recognition.stop();
    };
  }, [language.code]);

  const startRecording = async () => {
    try {
      setError('');
      setTranscript('');
      setResponse('');
      setHasResponse(false);
      
      // Check if speech recognition is available
      if (!recognitionRef.current) {
        setError(t.speechNotSupported);
        return;
      }
      
      // Request microphone access for audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // Audio blob can be used for additional processing if needed
      };

      // Start both audio recording and speech recognition
      mediaRecorder.start();
      recognitionRef.current.start();
      
      setIsRecording(true);
      setIsRecognizing(true);
    } catch (err) {
      console.error('Recording error:', err);
      setError(t.noMicSupport);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
      setIsRecognizing(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }
  };

  const processVoiceQuery = async () => {
    if (!transcript.trim()) {
      setError(t.repeatProblem);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get AI response using Gemini API
      const { geminiApi } = await import('../../services/geminiApi');
      const aiResponse = await geminiApi.processVoiceQuery(transcript, language.code, userInfo.location);
      
      setResponse(aiResponse);
      setHasResponse(true);
      setIsProcessing(false);

      // Save to history
      const history = JSON.parse(localStorage.getItem('krishi-history') || '[]');
      history.push({
        type: 'voice',
        query: transcript,
        response: aiResponse,
        timestamp: new Date().toISOString(),
        language: language.code,
      });
      localStorage.setItem('krishi-history', JSON.stringify(history));
      
    } catch (error) {
      console.error('Voice processing error:', error);
      setError(t.apiError);
      setHasResponse(false);
      setIsProcessing(false);
    }
  };

  const playResponse = () => {
    // In a real app, this would use text-to-speech
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = languageCodeToSpeechLang[language.code] || 'en-US';
    speechSynthesis.speak(utterance);
  };

  const resetSession = () => {
    setTranscript('');
    setResponse('');
    setHasResponse(false);
    setIsProcessing(false);
    setError('');
    setIsRecognizing(false);
  };

  // Auto-process voice query when we have a transcript and user stops recording
  useEffect(() => {
    if (transcript && !isRecording && !isProcessing && !hasResponse) {
      processVoiceQuery();
    }
  }, [transcript, isRecording, isProcessing, hasResponse]);

  useEffect(() => {
    if (isRecording && !isRecognizing && transcript) {
      stopRecording();
    }
  }, [isRecording, isRecognizing, transcript]);

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-blue-800">{t.title}</h1>
          <p className="text-blue-600">{t.subtitle}</p>
        </motion.div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {!hasResponse && !isProcessing && !transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600">{t.instructions}</p>
          </motion.div>
        )}

        {/* Recording Interface */}
        <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm border-blue-200">
          <div className="text-center">
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
            >
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-24 h-24 rounded-full ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white shadow-lg`}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-gray-600"
            >
              {isRecording ? (isRecognizing ? t.recognizing : t.listening) : t.startRecording}
            </motion.p>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [10, 30, 10],
                        backgroundColor: ['#3b82f6', '#ef4444', '#3b82f6'],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-2 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Real-time transcript display */}
        {isRecognizing && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-sm text-blue-800 mb-2">{t.youAreSaying}</h3>
              <p className="text-blue-700">{transcript}</p>
            </Card>
          </motion.div>
        )}

        {/* Processing State */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-center">
                  <Loader className="h-6 w-6 text-yellow-600 animate-spin mr-3" />
                  <p className="text-yellow-800">{t.processing}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {hasResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {transcript && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="text-sm text-blue-800 mb-2">{t.youSaid}</h3>
                  <p className="text-blue-700">{transcript}</p>
                </Card>
              )}

              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-green-800">{t.aiSuggestion}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={playResponse}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t.playResponse}
                  </Button>
                </div>
                <p className="text-green-700">{response}</p>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={resetSession}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  {t.newQuestion}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
