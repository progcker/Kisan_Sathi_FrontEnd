import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Check, Clock, Droplets, Bug, Scissors } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import type { Language, UserInfo } from '../../App';

const translations = {
  hi: {
    title: 'किसान कैलेंडर',
    subtitle: 'आपकी खेती का समय सारणी',
    today: 'आज के काम',
    addTask: 'काम जोड़ें',
    addTaskTitle: 'नया काम जोड़ें',
    taskInput: 'काम का विवरण',
    save: 'सेव करें',
    suggested: 'सुझाए गए काम',
    myTasks: 'मेरे काम',
    completed: 'पूरा हुआ',
    pending: 'बाकी',
    noTasks: 'आज कोई काम नहीं',
    totalTasks: 'कुल काम',
    categories: {
      watering: 'सिंचाई',
      fertilizer: 'खाद',
      pesticide: 'दवा',
      harvesting: 'कटाई',
      planting: 'बुआई',
      weeding: 'निराई',
    },
  },
  en: {
    title: 'Farmer Calendar',
    subtitle: 'Your farming schedule',
    today: "Today's Tasks",
    addTask: 'Add Task',
    addTaskTitle: 'Add New Task',
    taskInput: 'Task description',
    save: 'Save',
    suggested: 'Suggested Tasks',
    myTasks: 'My Tasks',
    completed: 'Completed',
    pending: 'Pending',
    noTasks: 'No tasks for today',
    totalTasks: 'Total Tasks',
    categories: {
      watering: 'Watering',
      fertilizer: 'Fertilizer',
      pesticide: 'Pesticide',
      harvesting: 'Harvesting',
      planting: 'Planting',
      weeding: 'Weeding',
    },
  },
  ta: {
    title: 'விவசாயி நாட்காட்டி',
    subtitle: 'உங்கள் விவசாய அட்டவணை',
    today: 'இன்றைய பணிகள்',
    addTask: 'பணி சேர்க்கவும்',
    addTaskTitle: 'புதிய பணி சேர்க்கவும்',
    taskInput: 'பணி விவரம்',
    save: 'சேமிக்கவும்',
    suggested: 'பரிந்துரைக்கப்பட்ட பணிகள்',
    myTasks: 'என் பணிகள்',
    completed: 'முடிந்தது',
    pending: 'நிலுவையில்',
    noTasks: 'இன்று பணிகள் இல்லை',
    totalTasks: 'மொத்த பணிகள்',
    categories: {
      watering: 'நீர்ப்பாசனம்',
      fertilizer: 'உரம்',
      pesticide: 'பூச்சிக்கொல்லி',
      harvesting: 'அறுவடை',
      planting: 'விதைப்பு',
      weeding: 'களை எடுத்தல்',
    },
  },
  te: {
    title: 'రైతు క్యాలెండర్',
    subtitle: 'మీ వ్యవసాయ షెడ్యూల్',
    today: 'ఈరోజు పనులు',
    addTask: 'పని జోడించండి',
    addTaskTitle: 'కొత్త పని జోడించండి',
    taskInput: 'పని వివరణ',
    save: 'సేవ్ చేయండి',
    suggested: 'సూచించిన పనులు',
    myTasks: 'నా పనులు',
    completed: 'పూర్తయింది',
    pending: 'పెండింగ్‌లో',
    noTasks: 'ఈరోజు పనులు లేవు',
    totalTasks: 'మొత్తం పనులు',
    categories: {
      watering: 'నీటి పట్టింపు',
      fertilizer: 'ఎరువు',
      pesticide: 'కీటకనాశిని',
      harvesting: 'పంట కోత',
      planting: 'విత్తనం',
      weeding: 'గడ్డి తీసివేత',
    },
  },
  kn: {
    title: 'ರೈತರ ಕ್ಯಾಲೆಂಡರ್',
    subtitle: 'ನಿಮ್ಮ ಕೃಷಿ ವೇಳಾಪಟ್ಟಿ',
    today: 'ಇಂದಿನ ಕೆಲಸಗಳು',
    addTask: 'ಕೆಲಸ ಸೇರಿಸಿ',
    addTaskTitle: 'ಹೊಸ ಕೆಲಸ ಸೇರಿಸಿ',
    taskInput: 'ಕೆಲಸದ ವಿವರ',
    save: 'ಉಳಿಸಿ',
    suggested: 'ಸೂಚಿಸಲಾದ ಕೆಲಸಗಳು',
    myTasks: 'ನನ್ನ ಕೆಲಸಗಳು',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    pending: 'ಬಾಕಿ',
    noTasks: 'ಇಂದು ಯಾವುದೇ ಕೆಲಸಗಳಿಲ್ಲ',
    totalTasks: 'ಒಟ್ಟು ಕೆಲಸಗಳು',
    categories: {
      watering: 'ನೀರು ಹಾಯಿಸುವುದು',
      fertilizer: 'ರಸಗೊಬ್ಬರ',
      pesticide: 'ಕೀಟನಾಶಕ',
      harvesting: 'ಕೊಯ್ಲು',
      planting: 'ಬಿತ್ತನೆ',
      weeding: 'ಕಳೆ ಕೀಳುವುದು',
    },
  },
  ml: {
    title: 'കർഷക കലണ്ടർ',
    subtitle: 'നിങ്ങളുടെ കൃഷി സമയക്രമം',
    today: 'ഇന്നത്തെ ജോലികൾ',
    addTask: 'ജോലി ചേർക്കുക',
    addTaskTitle: 'പുതിയ ജോലി ചേർക്കുക',
    taskInput: 'ജോലി വിവരണം',
    save: 'സംരക്ഷിക്കുക',
    suggested: 'നിർദേശിച്ച ജോലികൾ',
    myTasks: 'എന്റെ ജോലികൾ',
    completed: 'പൂർത്തിയായി',
    pending: 'ബാക്കി',
    noTasks: 'ഇന്ന് ജോലികളില്ല',
    totalTasks: 'ആകെ ജോലികൾ',
    categories: {
      watering: 'ജലസേചനം',
      fertilizer: 'വളം',
      pesticide: 'കീടനാശിനി',
      harvesting: 'വിളവെടുപ്പ്',
      planting: 'നടീൽ',
      weeding: 'കളയെടുപ്പ്',
    },
  },
  bn: {
    title: 'কৃষক ক্যালেন্ডার',
    subtitle: 'আপনার কৃষির সময়সূচী',
    today: 'আজকের কাজ',
    addTask: 'কাজ যোগ করুন',
    addTaskTitle: 'নতুন কাজ যোগ করুন',
    taskInput: 'কাজের বিবরণ',
    save: 'সংরক্ষণ করুন',
    suggested: 'প্রস্তাবিত কাজ',
    myTasks: 'আমার কাজ',
    completed: 'সম্পন্ন',
    pending: 'অপেক্ষমান',
    noTasks: 'আজ কোনো কাজ নেই',
    totalTasks: 'মোট কাজ',
    categories: {
      watering: 'সেচ',
      fertilizer: 'সার',
      pesticide: 'কীটনাশক',
      harvesting: 'ফসল কাটা',
      planting: 'রোপণ',
      weeding: 'আগাছা পরিষ্কার',
    },
  },
  gu: {
    title: 'ખેડૂત કેલેન્ડર',
    subtitle: 'તમારો ખેતી કાર્યક્રમ',
    today: 'આજના કાર્યો',
    addTask: 'કાર્ય ઉમેરો',
    addTaskTitle: 'નવું કાર્ય ઉમેરો',
    taskInput: 'કાર્યનું વર્ણન',
    save: 'સાચવો',
    suggested: 'સૂચવેલ કાર્યો',
    myTasks: 'મારા કાર્યો',
    completed: 'પૂર્ણ થયું',
    pending: 'બાકી',
    noTasks: 'આજે કોઈ કાર્ય નથી',
    totalTasks: 'કુલ કાર્યો',
    categories: {
      watering: 'પાણી આપવું',
      fertilizer: 'ખાતર',
      pesticide: 'કીટનાશક',
      harvesting: 'લણણી',
      planting: 'વાવેતર',
      weeding: 'નિંદામણ',
    },
  },
  mr: {
    title: 'शेतकरी कॅलेंडर',
    subtitle: 'तुमची शेती वेळापत्रक',
    today: 'आजची कामे',
    addTask: 'काम जोडा',
    addTaskTitle: 'नवीन काम जोडा',
    taskInput: 'कामाचे वर्णन',
    save: 'जतन करा',
    suggested: 'सुचवलेली कामे',
    myTasks: 'माझी कामे',
    completed: 'पूर्ण झाले',
    pending: 'बाकी',
    noTasks: 'आज कोणतेही काम नाही',
    totalTasks: 'एकूण कामे',
    categories: {
      watering: 'पाणी देणे',
      fertilizer: 'खत',
      pesticide: 'कीटकनाशक',
      harvesting: 'कापणी',
      planting: 'पेरणी',
      weeding: 'निंदणी',
    },
  },
  pa: {
    title: 'ਕਿਸਾਨ ਕੈਲੰਡਰ',
    subtitle: 'ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸ਼ਡਿਊਲ',
    today: 'ਅੱਜ ਦੇ ਕੰਮ',
    addTask: 'ਕੰਮ ਸ਼ਾਮਲ ਕਰੋ',
    addTaskTitle: 'ਨਵਾਂ ਕੰਮ ਸ਼ਾਮਲ ਕਰੋ',
    taskInput: 'ਕੰਮ ਦਾ ਵੇਰਵਾ',
    save: 'ਸੰਭਾਲੋ',
    suggested: 'ਸੁਝਾਏ ਕੰਮ',
    myTasks: 'ਮੇਰੇ ਕੰਮ',
    completed: 'ਪੂਰਾ ਹੋਇਆ',
    pending: 'ਬਕਾਇਆ',
    noTasks: 'ਅੱਜ ਕੋਈ ਕੰਮ ਨਹੀਂ',
    totalTasks: 'ਕੁੱਲ ਕੰਮ',
    categories: {
      watering: 'ਸਿੰਚਾਈ',
      fertilizer: 'ਖਾਦ',
      pesticide: 'ਕੀਟਨਾਸ਼ਕ',
      harvesting: 'ਕਟਾਈ',
      planting: 'ਬਿਜਾਈ',
      weeding: 'ਨਦੀਨ',
    },
  },
  ur: {
    title: 'کسان کیلنڈر',
    subtitle: 'آپ کا زرعی شیڈول',
    today: 'آج کے کام',
    addTask: 'کام شامل کریں',
    addTaskTitle: 'نیا کام شامل کریں',
    taskInput: 'کام کی تفصیل',
    save: 'محفوظ کریں',
    suggested: 'تجویز کردہ کام',
    myTasks: 'میرے کام',
    completed: 'مکمل',
    pending: 'زیر التواء',
    noTasks: 'آج کوئی کام نہیں',
    totalTasks: 'کل کام',
    categories: {
      watering: 'آبپاشی',
      fertilizer: 'کھاد',
      pesticide: 'کیڑے مار دوا',
      harvesting: 'کٹائی',
      planting: 'بوائی',
      weeding: 'گوڈی',
    },
  },
  or: {
    title: 'କୃଷକ କ୍ୟାଲେଣ୍ଡର',
    subtitle: 'ଆପଣଙ୍କର କୃଷି ସମୟସୂଚୀ',
    today: 'ଆଜିର କାମ',
    addTask: 'କାମ ଯୋଡନ୍ତୁ',
    addTaskTitle: 'ନୂତନ କାମ ଯୋଡନ୍ତୁ',
    taskInput: 'କାମର ବିବରଣୀ',
    save: 'ସେଭ୍ କରନ୍ତୁ',
    suggested: 'ପ୍ରସ୍ତାବିତ କାମ',
    myTasks: 'ମୋର କାମ',
    completed: 'ସମାପ୍ତ',
    pending: 'ବାକି',
    noTasks: 'ଆଜି କୌଣସି କାମ ନାହିଁ',
    totalTasks: 'ମୋଟ କାମ',
    categories: {
      watering: 'ଜଳସେଚନ',
      fertilizer: 'ସାର',
      pesticide: 'କୀଟନାଶକ',
      harvesting: 'ଅମଳ',
      planting: 'ବୁଣିବା',
      weeding: 'ଘାସ ବାଛିବା',
    },
  },
  as: {
    title: 'খেতিয়কৰ কেলেন্ডাৰ',
    subtitle: 'আপোনাৰ কৃষি সময়সূচী',
    today: 'আজিৰ কাৰ্য',
    addTask: 'কাৰ্য যোগ কৰক',
    addTaskTitle: 'নতুন কাৰ্য যোগ কৰক',
    taskInput: 'কাৰ্য বিৱৰণ',
    save: 'সংৰক্ষণ কৰক',
    suggested: 'প্ৰস্তাৱিত কাৰ্য',
    myTasks: 'মোৰ কাৰ্য',
    completed: 'সম্পন্ন',
    pending: 'বাকী',
    noTasks: 'আজি কোনো কাৰ্য নাই',
    totalTasks: 'মুঠ কাৰ্য',
    categories: {
      watering: 'জলসিঞ্চন',
      fertilizer: 'সাৰ',
      pesticide: 'কীটনাশক',
      harvesting: 'শস্য চপোৱা',
      planting: 'ৰোপণ',
      weeding: 'বন-বাত নিৰোৱা',
    },
  },
  bho: {
    title: 'किसान कैलेंडर',
    subtitle: 'तोहर खेती के समय-सारणी',
    today: 'आज के काम',
    addTask: 'काम जोड़ीं',
    addTaskTitle: 'नवाँ काम जोड़ीं',
    taskInput: 'काम के विवरण',
    save: 'सेभ करीं',
    suggested: 'सुझावल काम',
    myTasks: 'हमार काम',
    completed: 'पूरा भइल',
    pending: 'बाकी',
    noTasks: 'आज कवनो काम नइखे',
    totalTasks: 'कुल काम',
    categories: {
      watering: 'सिंचाई',
      fertilizer: 'खाद',
      pesticide: 'दवाई',
      harvesting: 'कटनी',
      planting: 'रोपाई',
      weeding: 'निराई',
    },
  },
  mai: {
    title: 'किसान कैलेंडर',
    subtitle: 'अहाँक खेतीक समय-सारणी',
    today: 'आजुक काज',
    addTask: 'काज जोड़ू',
    addTaskTitle: 'नव काज जोड़ू',
    taskInput: 'काजक विवरण',
    save: 'सेभ करू',
    suggested: 'सुझायल काज',
    myTasks: 'हमर काज',
    completed: 'पूरा भेल',
    pending: 'बाकी',
    noTasks: 'आजु कोनो काज नहि',
    totalTasks: 'कुल काज',
    categories: {
      watering: 'सिंचाई',
      fertilizer: 'खाद',
      pesticide: 'दवाई',
      harvesting: 'कटनी',
      planting: 'रोपाई',
      weeding: 'निराई',
    },
  },
  mag: {
    title: 'किसान कैलेंडर',
    subtitle: 'तोहर खेती के टाइम टेबल',
    today: 'आज के काम',
    addTask: 'काम जोड़',
    addTaskTitle: 'नया काम जोड़',
    taskInput: 'काम के विवरण',
    save: 'सेभ कर',
    suggested: 'सुझावल काम',
    myTasks: 'हमर काम',
    completed: 'पूरा हो गइल',
    pending: 'बाकी',
    noTasks: 'आज काम नइखे',
    totalTasks: 'कुल काम',
    categories: {
      watering: 'सिंचाई',
      fertilizer: 'खाद',
      pesticide: 'दवाई',
      harvesting: 'कटनी',
      planting: 'रोपाई',
      weeding: 'निराई',
    },
  },
  sa: {
    title: 'कृषकपञ्चाङ्गम्',
    subtitle: 'भवतः कृषिकालः',
    today: 'अद्यतनकार्याणि',
    addTask: 'कार्यं योजयतु',
    addTaskTitle: 'नूतनं कार्यं योजयतु',
    taskInput: 'कार्यविवरणम्',
    save: 'रक्षतु',
    suggested: 'सुपरिशिष्टकार्याणि',
    myTasks: 'मम कार्याणि',
    completed: 'समाप्तम्',
    pending: 'अवशिष्टम्',
    noTasks: 'अद्य किमपि कार्यं नास्ति',
    totalTasks: 'कुल कार्याणि',
    categories: {
      watering: 'जलसिञ्चनम्',
      fertilizer: 'उर्वरकम्',
      pesticide: 'कीटनाशकम्',
      harvesting: 'शस्यकर्तनम्',
      planting: 'रोपणम्',
      weeding: 'तृणनिरासः',
    },
  },
  sd: {
    title: 'ڪسان ڪئلينڊر',
    subtitle: 'توهانجو زراعت جو شيڊول',
    today: 'اڄ جا ڪم',
    addTask: 'ڪم شامل ڪريو',
    addTaskTitle: 'نئون ڪم شامل ڪريو',
    taskInput: 'ڪم جي تفصيل',
    save: 'محفوظ ڪريو',
    suggested: 'تجويز ڪيل ڪم',
    myTasks: 'منهنجا ڪم',
    completed: 'مڪمل ٿيو',
    pending: 'باقي',
    noTasks: 'اڄ ڪو ڪم ناهي',
    totalTasks: 'ڪل ڪم',
    categories: {
      watering: 'پاڻي ڏيڻ',
      fertilizer: 'ڀاڻ',
      pesticide: 'ڪيڙي مار دوا',
      harvesting: 'فصل لણڻ',
      planting: 'پوکڻ',
      weeding: 'گاهه ڪڍڻ',
    },
  },
  ne: {
    title: 'किसान क्यालेन्डर',
    subtitle: 'तपाईंको खेतीपाती तालिका',
    today: 'आजका काम',
    addTask: 'काम थप्नुहोस्',
    addTaskTitle: 'नयाँ काम थप्नुहोस्',
    taskInput: 'कामको विवरण',
    save: 'सेभ गर्नुहोस्',
    suggested: 'सुझाव गरिएको काम',
    myTasks: 'मेरो काम',
    completed: 'पूरा भयो',
    pending: 'बाँकी',
    noTasks: 'आज कुनै काम छैन',
    totalTasks: 'कुल काम',
    categories: {
      watering: 'सिंचाई',
      fertilizer: 'मल',
      pesticide: 'कीटनाशक',
      harvesting: 'बाली काट्ने',
      planting: 'रोपण',
      weeding: 'झारपात हटाउने',
    },
  },
  kok: {
    title: 'शेती कॅलेंडर',
    subtitle: 'तुमचो शेती वेळापत्रक',
    today: 'आजेचें काम',
    addTask: 'काम जोडात',
    addTaskTitle: 'नवीन काम जोडात',
    taskInput: 'कामाचो तपशील',
    save: 'जतन करात',
    suggested: 'सुचयल्लें काम',
    myTasks: 'माझें काम',
    completed: 'पूर्ण जाल्लें',
    pending: 'बाकी',
    noTasks: 'आज कसलेंच काम ना',
    totalTasks: 'एकूण काम',
    categories: {
      watering: 'उदक घालप',
      fertilizer: 'सारें',
      pesticide: 'कीटकनाशक',
      harvesting: 'कापणी',
      planting: 'पेरणी',
      weeding: 'निवडप',
    },
  },
  mni: {
    title: 'ꯂꯧꯃꯤ ꯀꯦꯂꯦꯟꯗꯔ',
    subtitle: 'ꯑꯗꯣꯝꯒꯤ ꯂꯧउবগী ꯇาราง',
    today: 'ঙসিগী ꯊꯕꯛ',
    addTask: 'ꯊꯕꯛ ꯍꯥꯞꯆꯤꯜꯂꯨ',
    addTaskTitle: 'ꯑꯅꯧꯕ ꯊꯕꯛ ꯍꯥꯞꯆꯤꯜꯂꯨ',
    taskInput: 'ꯊꯕꯛꯀꯤ ꯋꯥꯔꯤ',
    save: 'ꯊꯝꯖꯤꯜꯂꯨ',
    suggested: 'ꯄꯥꯟꯗꯝ ꯇꯧꯔꯕ ꯊꯕꯛ',
    myTasks: 'ꯑꯩꯒꯤ ꯊꯕꯛ',
    completed: 'ꯂꯣꯏꯔꯦ',
    pending: 'ꯂꯩꯍꯧꯔꯤ',
    noTasks: 'ঙসি ꯊꯕꯛ ꯂꯩꯇꯦ',
    totalTasks: 'ꯄꯨꯝꯅꯃꯛ ꯊꯕꯛ',
    categories: {
      watering: 'ꯏশিং ꯊꯥꯕ',
      fertilizer: 'ꯍꯥꯟ',
      pesticide: 'ꯍꯤꯗꯥꯛ',
      harvesting: 'ꯂꯧ ꯂꯥꯛꯄ',
      planting: 'ꯍꯨꯟꯕ',
      weeding: 'ꯍꯨꯗꯥꯠ ꯂꯧꯊꯣꯛꯄ',
    },
  },
  bo: {
    title: 'ཞིང་པའི་ཟླ་ཐོ།',
    subtitle: 'ཁྱེད་ཀྱི་ཞིང་ལས་དུས་ཚོད།',
    today: 'དེ་རིང་གི་ལས་ཀ།',
    addTask: 'ལས་ཀ་སྣོན་པ།',
    addTaskTitle: 'ལས་ཀ་གསར་པ་སྣོན་པ།',
    taskInput: 'ལས་ཀའི་གསལ་བཤད།',
    save: 'ཉར་ཚགས།',
    suggested: 'འོས་སྦྱོར་བྱས་པའི་ལས་ཀ།',
    myTasks: 'ངའི་ལས་ཀ།',
    completed: ' hoàn thành',
    pending: 'བསྒུགས་པ།',
    noTasks: 'དེ་རིང་ལས་ཀ་མེད།',
    totalTasks: 'ལས་ཀ་ཡོངས།',
    categories: {
      watering: 'ཆུ་གཏོང་བ།',
      fertilizer: 'ལུད་རྒྱག་པ།',
      pesticide: 'འབུ་སྨན།',
      harvesting: 'བከርણી',
      planting: 'འདེབས་འཛུགས།',
      weeding: 'རྩྭ་ངན་འཐུ་བ།',
    },
  },
  ks: {
    title: 'کسان کیلنڈر',
    subtitle: 'تُہندِ زراعتِ شیڈول',
    today: 'اَزِک کأم',
    addTask: 'کأم شٲمل کٔریو',
    addTaskTitle: 'نو کأم شٲمل کٔریو',
    taskInput: 'کأمُک تفصیل',
    save: 'محفوظ کٔریو',
    suggested: 'تجویز کٔرمٕژ کأم',
    myTasks: 'مے کأم',
    completed: 'مکمل',
    pending: 'باقی',
    noTasks: 'اَز چھُ نہٕ کانہہ کأم',
    totalTasks: 'کل کأم',
    categories: {
      watering: 'آبپاشی',
      fertilizer: 'کھاد',
      pesticide: 'دوا',
      harvesting: 'کٹائی',
      planting: 'بوائی',
      weeding: 'گھاس کڈن',
    },
  },
  doi: {
    title: 'किसान कैलेंडर',
    subtitle: 'तुस्सा खेती दा शेड्यूल',
    today: 'अज्ज दे काम',
    addTask: 'काम जोड़ो',
    addTaskTitle: 'नवां काम जोड़ो',
    taskInput: 'काम दा विवरण',
    save: 'सेव करो',
    suggested: 'सुझाए गेदे काम',
    myTasks: 'मेरे काम',
    completed: 'पूरा होया',
    pending: 'बाकी',
    noTasks: 'अज्ज कोई काम नेईं',
    totalTasks: 'कुल काम',
    categories: {
      watering: 'पानी देना',
      fertilizer: 'खाद',
      pesticide: 'दवा',
      harvesting: 'फसल कटाई',
      planting: 'बीज बोना',
      weeding: 'निराई',
    },
  },
};

interface Task {
  id: string;
  title: string;
  category: string;
  date: string;
  completed: boolean;
  isUserTask: boolean;
}

interface CalendarPageProps {
  language: Language;
  userInfo: UserInfo;
}

const categoryIcons: { [key: string]: React.ElementType | string } = {
  watering: Droplets,
  fertilizer: '🌱',
  pesticide: Bug,
  harvesting: Scissors,
  planting: '🌾',
  weeding: '🌿',
};

const suggestedTasks = {
  hi: {
    '2025-09-15': [
      { category: 'watering', title: 'गेहूं की फसल की सिंचाई करें' },
      { category: 'fertilizer', title: 'टमाटर में DAP खाद डालें' },
    ],
    '2025-09-16': [
      { category: 'pesticide', title: 'कपास में कीट दवा का छिड़काव' },
    ],
  },
  en: {
    '2025-09-15': [
      { category: 'watering', title: 'Irrigate the wheat crop' },
      { category: 'fertilizer', title: 'Apply DAP fertilizer in tomatoes' },
    ],
    '2025-09-16': [
      { category: 'pesticide', title: 'Spray pesticide in cotton' },
    ],
  },
  // Full translations for other languages
};

export default function CalendarPage({ language, userInfo }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  useEffect(() => {
    const savedTasks = localStorage.getItem('krishi-tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  const saveTasksToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('krishi-tasks', JSON.stringify(updatedTasks));
  };

  const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayTasks = () => {
    const today = getDateString(selectedDate);
    const userTasks = tasks.filter(task => task.date === today);
    
    const langSuggestedTasks = suggestedTasks[language.code as keyof typeof suggestedTasks] || {};
    const suggested = langSuggestedTasks[today as keyof typeof langSuggestedTasks] || [];
    
    const suggestedTasks_ = suggested.map((task, index) => ({
      id: `suggested-${today}-${index}`,
      title: task.title,
      category: task.category,
      date: today,
      completed: false,
      isUserTask: false,
    }));

    return [...suggestedTasks_, ...userTasks];
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: 'general',
      date: getDateString(selectedDate),
      completed: false,
      isUserTask: true,
    };
    saveTasksToStorage([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasksToStorage(updatedTasks);
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category];
    if (typeof IconComponent === 'string') {
      return <span className="text-lg">{IconComponent}</span>;
    }
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  };

  const todayTasks = getTodayTasks();
  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-orange-800">{t.title}</h1>
          <p className="text-orange-600">{t.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl text-orange-800">
                  {selectedDate.toLocaleDateString(language.code, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <p className="text-orange-600">
                  {pendingTasks.length} {t.pending}, {completedTasks.length} {t.completed}
                </p>
              </div>
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addTask}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.addTaskTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder={t.taskInput}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <Button 
                      onClick={addTask}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {t.save}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50 border-blue-200 text-center">
                <div className="text-2xl mb-2 text-blue-800">{todayTasks.length}</div>
                <div className="text-sm text-blue-600">{t.totalTasks}</div>
              </Card>
              <Card className="p-4 bg-yellow-50 border-yellow-200 text-center">
                <div className="text-2xl mb-2 text-yellow-800">{pendingTasks.length}</div>
                <div className="text-sm text-yellow-600">{t.pending}</div>
              </Card>
              <Card className="p-4 bg-green-50 border-green-200 text-center">
                <div className="text-2xl mb-2 text-green-800">{completedTasks.length}</div>
                <div className="text-sm text-green-600">{t.completed}</div>
              </Card>
            </div>

            <div className="space-y-4">
              {todayTasks.length === 0 ? (
                <Card className="p-8 text-center bg-gray-50 border-gray-200">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-600">{t.noTasks}</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.length > 0 && (
                    <div>
                      <h3 className="text-lg mb-3 text-orange-800">{t.pending}</h3>
                      {pendingTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-4 mb-2 hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm border-orange-200">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="rounded-full w-8 h-8 p-0 border-orange-300 hover:bg-orange-50"
                              >
                                <Check className="h-4 w-4 text-orange-600" />
                              </Button>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  {getCategoryIcon(task.category)}
                                  <span className="text-orange-800">{task.title}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {!task.isUserTask && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {t.suggested}
                                  </Badge>
                                )}
                                {task.isUserTask && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {t.myTasks}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {completedTasks.length > 0 && (
                    <div>
                      <h3 className="text-lg mb-3 text-green-800">{t.completed}</h3>
                      {completedTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-4 mb-2 bg-green-50 border-green-200 opacity-75">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="rounded-full w-8 h-8 p-0 bg-green-500 border-green-500 text-white hover:bg-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  {getCategoryIcon(task.category)}
                                  <span className="text-green-700 line-through">{task.title}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✅ {t.completed}
                              </Badge>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}