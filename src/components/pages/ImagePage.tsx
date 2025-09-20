import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Camera, Upload, Loader, X, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import type { Language, UserInfo } from '../../App';

const translations = {
  hi: {
    title: 'फोटो विश्लेषण',
    subtitle: 'अपनी फसल की तस्वीर भेजकर समाधान पाएं',
    uploadButton: 'फोटो अपलोड करें',
    cameraButton: 'कैमरा खोलें',
    analyzing: 'तस्वीर का विश्लेषण हो रहा है...',
    instructions: 'अपनी फसल, पत्तियों, या समस्या की साफ तस्वीर अपलोड करें',
    removeImage: 'तस्वीर हटाएं',
    analyze: 'विश्लेषण करें',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नई फोटो अपलोड करें',
    examples: [
      'पत्तियों पर धब्बे',
      'कीट क्षति',
      'फसल रोग',
      'पोषक तत्वों की कमी'
    ],
    examplesTitle: 'आप इन समस्याओं की फोटो भेज सकते हैं:',
    apiError: 'AI विश्लेषण विफल रहा, नमूना प्रतिक्रिया दिखाई जा रही है',
  },
  en: {
    title: 'Photo Analysis',
    subtitle: 'Get solutions by sending your crop photos',
    uploadButton: 'Upload Photo',
    cameraButton: 'Open Camera',
    analyzing: 'Analyzing photo...',
    instructions: 'Upload a clear photo of your crop, leaves, or problem area',
    removeImage: 'Remove Image',
    analyze: 'Analyze',
    results: 'Analysis Results',
    newPhoto: 'Upload New Photo',
    examples: [
      'Leaf spots',
      'Pest damage',
      'Crop disease',
      'Nutrient deficiency'
    ],
    examplesTitle: 'You can send photos of these problems:',
    apiError: 'AI analysis failed, showing sample response',
  },
  ta: {
    title: 'புகைப்பட பகுப்பாய்வு',
    subtitle: 'உங்கள் பயிர் புகைப்படங்களை அனுப்பி தீர்வுகளைப் பெறுங்கள்',
    uploadButton: 'புகைப்படம் பதிவேற்று',
    cameraButton: 'கேமராவைத் திறக்கவும்',
    analyzing: 'புகைப்படம் பகுப்பாய்வு செய்யப்படுகிறது...',
    instructions: 'உங்கள் பயிர், இலைகள் அல்லது பிரச்சனை பகுதியின் தெளிவான புகைப்படத்தை பதிவேற்றவும்',
    removeImage: 'படத்தை அகற்று',
    analyze: 'பகுப்பாய்வு',
    results: 'பகுப்பாய்வு முடிவுகள்',
    newPhoto: 'புதிய புகைப்படம் பதிவேற்று',
    examples: [
      'இலை புள்ளிகள்',
      'பூச்சி சேதம்',
      'பயிர் நோய்',
      'ஊட்டச்சத்து குறைபாடு'
    ],
    examplesTitle: 'இந்த பிரச்சனைகளின் புகைப்படங்களை நீங்கள் அனுப்பலாம்:',
    apiError: 'AI பகுப்பாய்வு தோல்வியடைந்தது, மாதிரி பதில் காட்டப்படுகிறது',
  },
  te: {
    title: 'ఫోటో విశ్లేషణ',
    subtitle: 'మీ పంట ఫోటోలు పంపి పరిష్కారాలు పొందండి',
    uploadButton: 'ఫోటోను అప్‌లోడ్ చేయండి',
    cameraButton: 'కెమెరా ఓపెన్ చేయండి',
    analyzing: 'ఫోటో విశ్లేషణ జరుగుతోంది...',
    instructions: 'మీ పంట, ఆకులు లేదా సమస్య ప్రాంతం యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి',
    removeImage: 'ఫోటో తొలగించండి',
    analyze: 'విశ్లేషించండి',
    results: 'విశ్లేషణ ఫలితాలు',
    newPhoto: 'కొత్త ఫోటో అప్‌లోడ్ చేయండి',
    examples: ['ఆకుల మచ్చలు', 'కీటక నష్టం', 'పంట వ్యాధి', 'పోషక లోపం'],
    examplesTitle: 'మీరు ఈ సమస్యల ఫోటోలను పంపవచ్చు:',
    apiError: 'AI విశ్లేషణ విఫలమైంది, నమూనా ప్రతిస్పందన చూపబడుతోంది',
  },
  kn: {
    title: 'ಫೋಟೋ ವಿಶ್ಲೇಷಣೆ',
    subtitle: 'ನಿಮ್ಮ ಬೆಳೆಗಳ ಫೋಟೋಗಳನ್ನು ಕಳುಹಿಸಿ ಪರಿಹಾರಗಳನ್ನು ಪಡೆಯಿರಿ',
    uploadButton: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    cameraButton: 'ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ',
    analyzing: 'ಫೋಟೋ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
    instructions: 'ನಿಮ್ಮ ಬೆಳೆ, ಎಲೆಗಳು ಅಥವಾ ಸಮಸ್ಯಾ ಪ್ರದೇಶದ ಸ್ಪಷ್ಟವಾದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    removeImage: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ',
    analyze: 'ವಿಶ್ಲೇಷಿಸಿ',
    results: 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು',
    newPhoto: 'ಹೊಸ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    examples: ['ಎಲೆ ಕಲೆಗಳು', 'ಕೀಟ ಹಾನಿ', 'ಬೆಳೆ ರೋಗ', 'ಪೋಷಕಾಂಶ ಕೊರತೆ'],
    examplesTitle: 'ನೀವು ಈ ಸಮಸ್ಯೆಗಳ ಫೋಟೋಗಳನ್ನು ಕಳುಹಿಸಬಹುದು:',
    apiError: 'AI ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ, ಮಾದರಿ ಪ್ರತಿಕ್ರಿಯೆ ತೋರಿಸಲಾಗುತ್ತಿದೆ',
  },
   ml: {
    title: 'ഫോട്ടോ വിശകലനം',
    subtitle: 'നിങ്ങളുടെ വിളയുടെ ഫോട്ടോകൾ അയച്ച് പരിഹാരങ്ങൾ നേടുക',
    uploadButton: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    cameraButton: 'ക്യാമറ തുറക്കുക',
    analyzing: 'ഫോട്ടോ വിശകലനം നടക്കുന്നു...',
    instructions: 'നിങ്ങളുടെ വിള, ഇലകൾ അല്ലെങ്കിൽ പ്രശ്ന മേഖലയുടെ വ്യക്തമായ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    removeImage: 'ഫോട്ടോ നീക്കുക',
    analyze: 'വിശകലനം',
    results: 'വിശകലന ഫലങ്ങൾ',
    newPhoto: 'പുതിയ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    examples: ['ഇല പാടുകൾ', 'കീടനാശം', 'വിള രോഗം', 'പോഷക കുറവ്'],
    examplesTitle: 'ഈ പ്രശ്നങ്ങളുടെ ഫോട്ടോകൾ നിങ്ങൾക്ക് അയക്കാം:',
    apiError: 'AI വിശകലനം പരാജയപ്പെട്ടു, സാമ്പിൾ പ്രതികരണം കാണിക്കുന്നു',
  },
  bn: {
    title: 'ছবির বিশ্লেষণ',
    subtitle: 'আপনার ফসলের ছবি পাঠিয়ে সমাধান পান',
    uploadButton: 'ছবি আপলোড করুন',
    cameraButton: 'ক্যামেরা খুলুন',
    analyzing: 'ছবি বিশ্লেষণ চলছে...',
    instructions: 'আপনার ফসল, পাতা বা সমস্যার এলাকার একটি পরিষ্কার ছবি আপলোড করুন',
    removeImage: 'ছবি মুছুন',
    analyze: 'বিশ্লেষণ করুন',
    results: 'বিশ্লেষণের ফলাফল',
    newPhoto: 'নতুন ছবি আপলোড করুন',
    examples: ['পাতার দাগ', 'পোকামাকড়ের ক্ষতি', 'ফসলের রোগ', 'পুষ্টির ঘাটতি'],
    examplesTitle: 'আপনি এই সমস্যাগুলির ছবি পাঠাতে পারেন:',
    apiError: 'AI বিশ্লেষণ ব্যর্থ হয়েছে, নমুনা প্রতিক্রিয়া দেখানো হচ্ছে',
  },
  gu: {
    title: 'ફોટો વિશ્લેષણ',
    subtitle: 'તમારા પાકના ફોટા મોકલીને ઉકેલો મેળવો',
    uploadButton: 'ફોટો અપલોડ કરો',
    cameraButton: 'કેમેરો ખોલો',
    analyzing: 'ફોટોનું વિશ્લેષણ થઈ રહ્યું છે...',
    instructions: 'તમારા પાક, પાન અથવા સમસ્યા વિસ્તારનો સ્પષ્ટ ફોટો અપલોડ કરો',
    removeImage: 'ફોટો કાઢી નાખો',
    analyze: 'વિશ્લેષણ કરો',
    results: 'વિશ્લેષણના પરિણામો',
    newPhoto: 'નવો ફોટો અપલોડ કરો',
    examples: ['પાન પર ડાઘ', 'જંતુ નુકસાન', 'પાકની બિમારી', 'પોષક તત્વોની કમી'],
    examplesTitle: 'તમે આ સમસ્યાઓના ફોટા મોકલી શકો છો:',
    apiError: 'AI વિશ્લેષણ નિષ્ફળ ગયું, નમૂના પ્રતિસાદ બતાવવામાં આવી રહ્યો છે',
  },
  mr: {
    title: 'फोटो विश्लेषण',
    subtitle: 'तुमच्या पिकांचे फोटो पाठवून उपाय मिळवा',
    uploadButton: 'फोटो अपलोड करा',
    cameraButton: 'कॅमेरा उघडा',
    analyzing: 'फोटो विश्लेषण चालू आहे...',
    instructions: 'तुमच्या पिकाचा, पानांचा किंवा समस्येच्या भागाचा स्पष्ट फोटो अपलोड करा',
    removeImage: 'फोटो काढा',
    analyze: 'विश्लेषण करा',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नवीन फोटो अपलोड करा',
    examples: ['पानांवरील डाग', 'किडींचे नुकसान', 'पिकांचा रोग', 'पोषक तत्वांची कमतरता'],
    examplesTitle: 'तुम्ही या समस्यांचे फोटो पाठवू शकता:',
    apiError: 'AI विश्लेषण अयशस्वी झाले, नमुना प्रतिसाद दर्शवित आहे',
  },
  pa: {
    title: 'ਫੋਟੋ ਵਿਸ਼ਲੇਸ਼ਣ',
    subtitle: 'ਆਪਣੀ ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਭੇਜ ਕੇ ਹੱਲ ਪ੍ਰਾਪਤ ਕਰੋ',
    uploadButton: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    cameraButton: 'ਕੈਮਰਾ ਖੋਲ੍ਹੋ',
    analyzing: 'ਫੋਟੋ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
    instructions: 'ਆਪਣੀ ਫਸਲ, ਪੱਤਿਆਂ ਜਾਂ ਸਮੱਸਿਆ ਵਾਲੇ ਖੇਤਰ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ',
    removeImage: 'ਫੋਟੋ ਹਟਾਓ',
    analyze: 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    results: 'ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਨਤੀਜੇ',
    newPhoto: 'ਨਵੀਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    examples: ['ਪੱਤਿਆਂ ਦੇ ਦਾਗ', 'ਕੀੜਿਆਂ ਦਾ ਨੁਕਸਾਨ', 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ', 'ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਘਾਟ'],
    examplesTitle: 'ਤੁਸੀਂ ਇਹਨਾਂ ਸਮੱਸਿਆਵਾਂ ਦੀਆਂ ਤਸਵੀਰਾਂ ਭੇਜ ਸਕਦੇ ਹੋ:',
    apiError: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਅਸਫਲ ਰਿਹਾ, ਨਮੂਨਾ ਜਵਾਬ ਦਿਖਾਇਆ ਜਾ ਰਿਹਾ ਹੈ',
  },
  ur: {
    title: 'تصویر کا تجزیہ',
    subtitle: 'اپنی فصل کی تصاویر بھیج کر حل حاصل کریں',
    uploadButton: 'تصویر اپ لوڈ کریں',
    cameraButton: 'کیمرہ کھولیں',
    analyzing: 'تصویر کا تجزیہ جاری ہے...',
    instructions: 'اپنی فصل، پتوں یا مسئلے والے حصے کی واضح تصویر اپ لوڈ کریں',
    removeImage: 'تصویر ہٹائیں',
    analyze: 'تجزیہ کریں',
    results: 'تجزیے کے نتائج',
    newPhoto: 'نئی تصویر اپ لوڈ کریں',
    examples: ['پتوں پر دھبے', 'کیڑوں کا نقصان', 'فصل کی بیماری', 'غذائیت کی کمی'],
    examplesTitle: 'آپ ان مسائل کی تصاویر بھیج سکتے ہیں:',
    apiError: 'AI تجزیہ ناکام ہوگیا، نمونہ جواب دکھایا جارہا ہے',
  },
  or: {
    title: 'ଫଟୋ ବିଶ୍ଳେଷଣ',
    subtitle: 'ଆପଣଙ୍କ ଫସଳର ଫଟୋ ପଠାଇ ସମାଧାନ ପାଆନ୍ତୁ',
    uploadButton: 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    cameraButton: 'କ୍ୟାମେରା ଖୋଲନ୍ତୁ',
    analyzing: 'ଫଟୋ ବିଶ୍ଳେଷଣ ହେଉଛି...',
    instructions: 'ଆପଣଙ୍କ ଫସଳ, ପତ୍ର କିମ୍ବା ସମସ୍ୟା ଅଞ୍ଚଳର ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    removeImage: 'ଫଟୋ ବିଲୋପ କରନ୍ତୁ',
    analyze: 'ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
    results: 'ବିଶ୍ଳେଷଣ ପରିଣାମ',
    newPhoto: 'ନୂତନ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    examples: ['ପତ୍ର ଦାଗ', 'କୀଟକ୍ଷତି', 'ଫସଳ ରୋଗ', 'ପୋଷକ ତ୍ରୁଟି'],
    examplesTitle: 'ଆପଣ ଏହି ସମସ୍ୟାଗୁଡିକର ଫଟୋ ପଠାଇପାରିବେ:',
    apiError: 'AI ବିଶ୍ଳେଷଣ ବିଫଳ ହେଲା, ନମୁନା ପ୍ରତିକ୍ରିୟା ଦେଖାଯାଉଛି',
  },
  as: {
    title: 'ফটো বিশ্লেষণ',
    subtitle: 'আপোনাৰ খেতিৰ ফটো পঠিয়াই সমাধান লাভ কৰক',
    uploadButton: 'ফটো আপল’ড কৰক',
    cameraButton: 'কেমেৰা খোলক',
    analyzing: 'ফটো বিশ্লেষণ হৈ আছে...',
    instructions: 'আপোনাৰ খেতি, পাত বা সমস্যাৰ এলেকাৰ স্পষ্ট ফটো আপল’ড কৰক',
    removeImage: 'ফটো আঁতৰাওক',
    analyze: 'বিশ্লেষণ কৰক',
    results: 'বিশ্লেষণৰ ফলাফল',
    newPhoto: 'নতুন ফটো আপল’ড কৰক',
    examples: ['পাতৰ দাগ', 'পোকৰ ক্ষতি', 'খেতিৰ ৰোগ', 'প’ষ্টিকৰ ঘাটতি'],
    examplesTitle: 'আপুনি এই সমস্যাবোৰৰ ফটো পঠিয়াব পাৰে:',
    apiError: 'AI বিশ্লেষণ విఫలమైంది, నమూనా ప్రతిస్పందన చూపబడుతోంది',
  },
  bho: {
    title: 'फोटो विश्लेषण',
    subtitle: 'आपन फसल के फोटो भेजके उपाय पाईं',
    uploadButton: 'फोटो अपलोड करीं',
    cameraButton: 'कैमरा खोलीं',
    analyzing: 'फोटो विश्लेषण हो रहल बा...',
    instructions: 'आपन फसल, पत्ते आ समस्या वाला जगह के साफ फोटो अपलोड करीं',
    removeImage: 'फोटो हटाईं',
    analyze: 'विश्लेषण करीं',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नया फोटो अपलोड करीं',
    examples: ['पत्ते पर दाग', 'कीड़ा नुकसान', 'फसल रोग', 'पोषक तत्व कमी'],
    examplesTitle: 'रउआँ एह समस्या के फोटो भेज सकत बानी:',
    apiError: 'AI विश्लेषण फेल हो गईल, सैंपल जबाब देखावल जा रहल बा',
  },
  mai: {
    title: 'फोटो विश्लेषण',
    subtitle: 'अपन फसलक फोटो पठाए कऽ समाधान पाउ',
    uploadButton: 'फोटो अपलोड करू',
    cameraButton: 'कैमरा खोलू',
    analyzing: 'फोटो विश्लेषण भऽ रहल अछि...',
    instructions: 'अपन फसल, पात आ समस्या क्षेत्रक साफ फोटो अपलोड करू',
    removeImage: 'फोटो हटाउ',
    analyze: 'विश्लेषण करू',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नव फोटो अपलोड करू',
    examples: ['पात पर दाग', 'कीट क्षति', 'फसल रोग', 'पोषक तत्वक कमी'],
    examplesTitle: 'अहाँ ई समस्याक फोटो पठा सकैत छी:',
    apiError: 'AI विश्लेषण असफल भेल, नमूना प्रतिक्रिया देखाओल जा रहल अछि',
  },
  mag: {
    title: 'फोटो विश्लेषण',
    subtitle: 'अपन फसल के फोटो भेजके उपाय पाई',
    uploadButton: 'फोटो अपलोड करी',
    cameraButton: 'कैमरा खोल',
    analyzing: 'फोटो विश्लेषण हो रहल हऽ...',
    instructions: 'अपन फसल, पत्ता या समस्या वाला जगह के साफ फोटो अपलोड करी',
    removeImage: 'फोटो हटाई',
    analyze: 'विश्लेषण करी',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नवा फोटो अपलोड करी',
    examples: ['पत्ता पर दाग', 'कीड़ा नुकसान', 'फसल रोग', 'पोषक तत्व कमी'],
    examplesTitle: 'तू ई समस्या के फोटो भेज सकल ह:',
    apiError: 'AI विश्लेषण असफल भेल, नमूना प्रतिक्रिया देखाओल जा रहल अछि',
  },
  sa: {
    title: 'चित्रविश्लेषणम्',
    subtitle: 'भवतः कृषेः चित्रं प्रेष्य समाधानं लभध्वम्',
    uploadButton: 'चित्रम् अपलोड कुरुत',
    cameraButton: 'कॅमेरा उद्घाटयत',
    analyzing: 'चित्रस्य विश्लेषणं प्रवर्तमानम्...',
    instructions: 'कृषेः पत्रं वा समस्याक्षेत्रस्य स्पष्टं चित्रं अपलोड कुरुत',
    removeImage: 'चित्रं निष्कासयत',
    analyze: 'विश्लेषयत',
    results: 'विश्लेषणफलम्',
    newPhoto: 'नूतनं चित्रम् अपलोड कुरुत',
    examples: ['पत्रेषु कलङ्कः', 'कीटक्षतिः', 'कृषिरोगः', 'पोषकतत्त्वहानिः'],
    examplesTitle: 'भवन्तः एतासां समस्यानां चित्राणि प्रेषयितुं शक्नुवन्ति:',
    apiError: 'AI विश्लेषणं सफलं न जातम्, प्रतिरूपं उत्तरं प्रदर्श्यते',
  },
  sd: {
    title: 'فٽو تجزيو',
    subtitle: 'پنهنجي فصل جون تصويرون موڪلي حل حاصل ڪريو',
    uploadButton: 'فٽو اپلوڊ ڪريو',
    cameraButton: 'ڪيمرا کوليو',
    analyzing: 'فٽو تجزيو ٿي رهيو آهي...',
    instructions: 'پنهنجي فصل، پنن يا مسئلي واري علائقي جي صاف تصوير اپلوڊ ڪريو',
    removeImage: 'فٽو هٽايو',
    analyze: 'تجزيو ڪريو',
    results: 'تجزئي جا نتيجا',
    newPhoto: 'نئون فٽو اپلوڊ ڪريو',
    examples: ['پنن تي داغ', 'جراثيم جو نقصان', 'فصل جي بيماري', 'غذائي کوٽ'],
    examplesTitle: 'توهان انهن مسئلن جون تصويرون موڪلي سگهو ٿا:',
    apiError: 'AI تجزيو ناڪام ٿيو، نموني جو جواب ڏيکاريو پيو وڃي',
  },
  ne: {
    title: 'फोटो विश्लेषण',
    subtitle: 'तपाईंको बालीको फोटो पठाएर समाधान पाउनुहोस्',
    uploadButton: 'फोटो अपलोड गर्नुहोस्',
    cameraButton: 'क्यामेरा खोल्नुहोस्',
    analyzing: 'फोटो विश्लेषण भइरहेको छ...',
    instructions: 'तपाईंको बाली, पात वा समस्याग्रस्त क्षेत्रको स्पष्ट फोटो अपलोड गर्नुहोस्',
    removeImage: 'फोटो हटाउनुहोस्',
    analyze: 'विश्लेषण गर्नुहोस्',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नयाँ फोटो अपलोड गर्नुहोस्',
    examples: ['पातमा दाग', 'कीरा क्षति', 'बाली रोग', 'पोषक तत्व कमी'],
    examplesTitle: 'तपाईं यी समस्याहरूको फोटो पठाउन सक्नुहुन्छ:',
    apiError: 'AI विश्लेषण असफल भयो, नमूना प्रतिक्रिया देखाइँदैछ',
  },
  kok: {
    title: 'फोटो विश्लेषण',
    subtitle: 'तुमच्या पिकांचे फोटो पाठवून उपाय मिळवा',
    uploadButton: 'फोटो अपलोड करा',
    cameraButton: 'कॅमेरा उघडा',
    analyzing: 'फोटो विश्लेषण चालू...',
    instructions: 'तुमच्या पिकांचे, पानांचे किंवा समस्येच्या भागाचे स्पष्ट फोटो अपलोड करा',
    removeImage: 'फोटो काढून टाका',
    analyze: 'विश्लेषण करा',
    results: 'विश्लेषण परिणाम',
    newPhoto: 'नवीन फोटो अपलोड करा',
    examples: ['पानांवरील डाग', 'किड्यांचे नुकसान', 'पिकांचा रोग', 'पोषक तत्वांची कमतरता'],
    examplesTitle: 'तुम्ही या समस्यांचे फोटो पाठवू शकता:',
    apiError: 'AI विश्लेषण अयशस्वी झाले, नमुना प्रतिसाद दर्शवित आहे',
  },
  mni: {
    title: 'ফটো বিশ্লেষণ',
    subtitle: 'নঙোইগী লুয়াগী ফটো পিবিয়ুংগা হায়দোক লৈউ',
    uploadButton: 'ফটো আপলোড তৌ',
    cameraButton: 'কেমেরা হাংদোক',
    analyzing: 'ফটো বিশ্লেষণ তৌরি...',
    instructions: 'অদোমগী লুয়াগী, লাফা নয়বা সমস্যাগী স্থানগী ফটো আপলোড তৌ',
    removeImage: 'ফটো লোইরো',
    analyze: 'বিশ্লেষণ তৌ',
    results: 'বিশ্লেষণ ফল',
    newPhoto: 'অরোইবা ফটো আপলোড তৌ',
    examples: ['লাফাগী দাগ', 'ইসিংবা মাকপু ওইবা', 'লুয়াগী অসুখ', 'পুষ্টিগী ওইবা মায়েকপা'],
    examplesTitle: 'নঙোইনা অসিগী সমস্যাগী ফটো পিবিয়ুংগা হায়দোক লৈউ:',
    apiError: 'AI বিশ্লেষণ अयशस्वी झाले, नमुना प्रतिसाद दर्शवित आहे',
  },
};

interface ImagePageProps {
  language: Language;
  userInfo: UserInfo;
}

export default function ImagePage({ language, userInfo }: ImagePageProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      
      setError('');
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = (reader.result as string).split(',')[1];
        
        const { geminiApi } = await import('../../services/geminiApi');
        const aiResponse = await geminiApi.analyzeImage(imageData, language.code, userInfo.location);
        
        setAnalysisResult(aiResponse);
        setIsAnalyzing(false);

        const history = JSON.parse(localStorage.getItem('krishi-history') || '[]');
        history.push({
          type: 'image',
          query: selectedImage.name,
          response: aiResponse,
          timestamp: new Date().toISOString(),
          language: language.code,
        });
        localStorage.setItem('krishi-history', JSON.stringify(history));
      };
      reader.readAsDataURL(selectedImage);

    } catch (error) {
      console.error('Image analysis error:', error);
      setIsAnalyzing(false);
      setError(t.apiError);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-purple-800">{t.title}</h1>
          <p className="text-purple-600">{t.subtitle}</p>
        </motion.div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {!imagePreview && !analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200 border-dashed">
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-gray-600 mb-6">{t.instructions}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {t.uploadButton}
                  </Button>

                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {t.cameraButton}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">{t.examplesTitle}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {t.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </motion.div>
        )}

        <AnimatePresence>
          {imagePreview && !analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Uploaded crop"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white border-red-300 text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        {t.analyzing}
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5 mr-2" />
                        {t.analyze}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader className="h-8 w-8 text-purple-600" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-lg text-purple-800 mb-2">{t.analyzing}</h3>
                  <p className="text-purple-600">AI is analyzing your crop photo...</p>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-purple-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {imagePreview && (
                <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200">
                  <img
                    src={imagePreview}
                    alt="Analyzed crop"
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                </Card>
              )}

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-lg mb-4 text-green-800 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  {t.results}
                </h3>
                
                <div className="prose prose-sm max-w-none text-green-700">
                  <pre className="whitespace-pre-wrap font-sans">{analysisResult}</pre>
                </div>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={resetAnalysis}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {t.newPhoto}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}