import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import type { Language, UserInfo } from '../App';

const translations = {
  hi: {
    title: 'अपनी जानकारी दें',
    subtitle: 'हमें आपके बारे में बताएं ताकि हम बेहतर सेवा दे सकें',
    nameLabel: 'आपका नाम',
    namePlaceholder: 'अपना नाम दर्ज करें',
    locationLabel: 'आपका स्थान',
    locationPlaceholder: 'अपना शहर/गांव दर्ज करें',
    continueButton: 'आगे बढ़ें',
    skipButton: 'छोड़ें',
  },
  en: {
    title: 'Tell Us About Yourself',
    subtitle: 'Help us serve you better by sharing your information',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    locationLabel: 'Your Location',
    locationPlaceholder: 'Enter your city/village',
    continueButton: 'Continue',
    skipButton: 'Skip',
  },
  ta: {
    title: 'உங்களைப் பற்றி எங்களுக்குச் சொல்லுங்கள்',
    subtitle: 'உங்கள் தகவலைப் பகிர்ந்து எங்களுக்கு சிறந்த சேவை செய்ய உதவுங்கள்',
    nameLabel: 'உங்கள் பெயர்',
    namePlaceholder: 'உங்கள் பெயரை உள்ளிடுங்கள்',
    locationLabel: 'உங்கள் இடம்',
    locationPlaceholder: 'உங்கள் நகரம்/கிராமத்தை உள்ளிடுங்கள்',
    continueButton: 'தொடரவும்',
    skipButton: 'தவிர்க்கவும்',
  },
  te: {
  title: 'మీ గురించి మాకు చెప్పండి',
  subtitle: 'మీ సమాచారాన్ని పంచుకోవడం ద్వారా మేము మీకు మెరుగైన సేవ చేయగలము',
  nameLabel: 'మీ పేరు',
  namePlaceholder: 'మీ పేరు నమోదు చేయండి',
  locationLabel: 'మీ ప్రదేశం',
  locationPlaceholder: 'మీ నగరం/గ్రామం నమోదు చేయండి',
  continueButton: 'కొనసాగించండి',
  skipButton: 'దాటవేయి',
},
kn: {
  title: 'ನಿಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ',
  subtitle: 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಂಡು ನಮಗೆ ಉತ್ತಮ ಸೇವೆ ಮಾಡಲು ಸಹಕರಿಸಿ',
  nameLabel: 'ನಿಮ್ಮ ಹೆಸರು',
  namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
  locationLabel: 'ನಿಮ್ಮ ಸ್ಥಳ',
  locationPlaceholder: 'ನಿಮ್ಮ ನಗರ/ಗ್ರಾಮವನ್ನು ನಮೂದಿಸಿ',
  continueButton: 'ಮುಂದುವರಿಸಿ',
  skipButton: 'ಬಿಟ್ಟುಬಿಡಿ',
},
ml: {
  title: 'നിങ്ങളെക്കുറിച്ച് ഞങ്ങളോട് പറയൂ',
  subtitle: 'നിങ്ങളുടെ വിവരങ്ങൾ പങ്കുവച്ച് ഞങ്ങൾക്ക് മികച്ച സേവനം നൽകാൻ സഹായിക്കുക',
  nameLabel: 'നിങ്ങളുടെ പേര്',
  namePlaceholder: 'നിങ്ങളുടെ പേര് നൽകുക',
  locationLabel: 'നിങ്ങളുടെ സ്ഥലം',
  locationPlaceholder: 'നിങ്ങളുടെ നഗരം/ഗ്രാമം നൽകുക',
  continueButton: 'തുടരുക',
  skipButton: 'വിട്ടേക്കുക',
},
bn: {
  title: 'আপনার সম্পর্কে আমাদের বলুন',
  subtitle: 'আপনার তথ্য শেয়ার করে আমাদের আপনাকে আরও ভালো সেবা করতে সাহায্য করুন',
  nameLabel: 'আপনার নাম',
  namePlaceholder: 'আপনার নাম লিখুন',
  locationLabel: 'আপনার অবস্থান',
  locationPlaceholder: 'আপনার শহর/গ্রাম লিখুন',
  continueButton: 'চালিয়ে যান',
  skipButton: 'এড়িয়ে যান',
},
gu: {
  title: 'તમારા વિશે અમને કહો',
  subtitle: 'તમારી માહિતી શેર કરીને અમને તમને વધુ સારી સેવા આપવામાં મદદ કરો',
  nameLabel: 'તમારું નામ',
  namePlaceholder: 'તમારું નામ દાખલ કરો',
  locationLabel: 'તમારું સ્થાન',
  locationPlaceholder: 'તમારું શહેર/ગામ દાખલ કરો',
  continueButton: 'ચાલુ રાખો',
  skipButton: 'છોડી દો',
},
mr: {
  title: 'तुमच्या बद्दल आम्हाला सांगा',
  subtitle: 'तुमची माहिती शेअर करून आम्हाला चांगली सेवा करण्यात मदत करा',
  nameLabel: 'तुमचे नाव',
  namePlaceholder: 'तुमचे नाव लिहा',
  locationLabel: 'तुमचे ठिकाण',
  locationPlaceholder: 'तुमचे शहर/गाव लिहा',
  continueButton: 'पुढे जा',
  skipButton: 'वगळा',
},
pa: {
  title: 'ਸਾਨੂੰ ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ',
  subtitle: 'ਆਪਣੀ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਕੇ ਸਾਨੂੰ ਤੁਹਾਨੂੰ ਬਿਹਤਰ ਸੇਵਾ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੋ',
  nameLabel: 'ਤੁਹਾਡਾ ਨਾਮ',
  namePlaceholder: 'ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ',
  locationLabel: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ',
  locationPlaceholder: 'ਆਪਣਾ ਸ਼ਹਿਰ/ਪਿੰਡ ਦਰਜ ਕਰੋ',
  continueButton: 'ਜਾਰੀ ਰੱਖੋ',
  skipButton: 'ਛੱਡੋ',
},
ur: {
  title: 'اپنے بارے میں ہمیں بتائیں',
  subtitle: 'اپنی معلومات شیئر کرکے ہمیں بہتر خدمت کرنے میں مدد کریں',
  nameLabel: 'آپ کا نام',
  namePlaceholder: 'اپنا نام درج کریں',
  locationLabel: 'آپ کا مقام',
  locationPlaceholder: 'اپنا شہر/گاؤں درج کریں',
  continueButton: 'جاری رکھیں',
  skipButton: 'چھوڑ دیں',
},
or: {
  title: 'ଆମକୁ ଆପଣଙ୍କ ବିଷୟରେ କୁହନ୍ତୁ',
  subtitle: 'ଆପଣଙ୍କ ସୂଚନା ସେୟାର କରି ଆମକୁ ଭଲ ସେବା କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ',
  nameLabel: 'ଆପଣଙ୍କ ନାମ',
  namePlaceholder: 'ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ',
  locationLabel: 'ଆପଣଙ୍କ ଅବସ୍ଥାନ',
  locationPlaceholder: 'ଆପଣଙ୍କ ସହର/ଗାଁ ଲେଖନ୍ତୁ',
  continueButton: 'ଆଗକୁ ବଢନ୍ତୁ',
  skipButton: 'ଛାଡନ୍ତୁ',
},
as: {
  title: 'আপোনাৰ বিষয়ে আমাক কওক',
  subtitle: 'আপোনাৰ তথ্য ভাগ কৰি আমাক ভালকৈ সেৱা কৰিবলৈ সহায় কৰক',
  nameLabel: 'আপোনাৰ নাম',
  namePlaceholder: 'আপোনাৰ নাম লিখক',
  locationLabel: 'আপোনাৰ স্থান',
  locationPlaceholder: 'আপোনাৰ চহৰ/গাঁও লিখক',
  continueButton: 'আগবাঢ়ক',
  skipButton: 'এৰি দিয়ক',
},
bho: {
  title: 'आपन बारे में हमनी के बताईं',
  subtitle: 'आपन जानकारी साझा करके हमनी के अच्छा सेवा करे में मदद करीं',
  nameLabel: 'राउर नाम',
  namePlaceholder: 'आपन नाम डालल जाव',
  locationLabel: 'राउर जगह',
  locationPlaceholder: 'आपन शहर/गाँव डालल जाव',
  continueButton: 'आगे बढ़ीं',
  skipButton: 'छोड़ दीं',
},
mai: {
  title: 'अपन विषय में हमरा बताउ',
  subtitle: 'अपन जानकारी साझा कए हमरा नीक सेवा करए में सहायत करू',
  nameLabel: 'अहाँक नाम',
  namePlaceholder: 'अपन नाम दर्ज करू',
  locationLabel: 'अहाँक स्थान',
  locationPlaceholder: 'अपन शहर/गाम दर्ज करू',
  continueButton: 'आगाँ बढू',
  skipButton: 'छोडू',
},
mag: {
  title: 'अपने बारे में हमके बताइए',
  subtitle: 'अपना जानकारी साझा करके हमके नीक सेवा करे में मदद करीं',
  nameLabel: 'तोहर नाम',
  namePlaceholder: 'अपना नाम डाल',
  locationLabel: 'तोहर ठिकाना',
  locationPlaceholder: 'अपना शहर/गाँव डाल',
  continueButton: 'आगे बढ़ा',
  skipButton: 'छोड़ दे',
},
sa: {
  title: 'भवतः विषये अस्मभ्यं वदतु',
  subtitle: 'स्वस्य सूचना साझा कृत्वा अस्मभ्यं उत्तमसेवा करणाय साहाय्यं कुरुत',
  nameLabel: 'भवतः नाम',
  namePlaceholder: 'स्वनाम लिखतु',
  locationLabel: 'भवतः स्थानम्',
  locationPlaceholder: 'नगरं/ग्रामं लिखतु',
  continueButton: 'अग्रे गच्छतु',
  skipButton: 'उत्सृजतु',
},
sd: {
  title: 'اسان کي پنھنجي باري ۾ ٻڌايو',
  subtitle: 'پنهنجي ڄاڻ شيئر ڪري اسان کي بھتر خدمت ڪرڻ ۾ مدد ڪريو',
  nameLabel: 'توهان جو نالو',
  namePlaceholder: 'پنھنجو نالو داخل ڪريو',
  locationLabel: 'توهان جو هنڌ',
  locationPlaceholder: 'پنھنجو شھر/ڳوٺ داخل ڪريو',
  continueButton: 'جاري رکو',
  skipButton: 'ڇڏي ڏيو',
},
ne: {
  title: 'हामीलाई तपाईंको बारेमा भन्नुहोस्',
  subtitle: 'तपाईंको जानकारी साझा गरेर हामीलाई राम्रो सेवा गर्न सहयोग गर्नुहोस्',
  nameLabel: 'तपाईंको नाम',
  namePlaceholder: 'आफ्नो नाम लेख्नुहोस्',
  locationLabel: 'तपाईंको स्थान',
  locationPlaceholder: 'आफ्नो शहर/गाउँ लेख्नुहोस्',
  continueButton: 'जारी राख्नुहोस्',
  skipButton: 'छोड्नुहोस्',
},
kok: {
  title: 'तुमच्या विषयाम म्हाका सांगात',
  subtitle: 'तुमचो माहिती सामायिक करून आमकां उत्तम सेवा करपाक मदत करात',
  nameLabel: 'तुमचें नाव',
  namePlaceholder: 'तुमचें नाव घालात',
  locationLabel: 'तुमचो ठिकाण',
  locationPlaceholder: 'तुमचें शहर/गांव घालात',
  continueButton: 'फुडारचें',
  skipButton: 'सोडून दियात',
},
mni: {
  title: 'অদুগী মরমদা eigiক হায়বিয়ু',
  subtitle: 'অদুগী তথ্য share তৌবা eigiক ভাল services পাংবদা হায়বিয়ু',
  nameLabel: 'অদুগী মিং',
  namePlaceholder: 'অদুগী মিং লিখু',
  locationLabel: 'অদুগী মফম',
  locationPlaceholder: 'অদুগী চিং/খুল লিখু',
  continueButton: 'লৌখি',
  skipButton: 'লেপচু',
},
bo: {
  title: 'ཁྱེད་ཀྱི་སྐོར་ལ་ང་ཚོར་བཤད་གནང་།',
  subtitle: 'ཁྱེད་ཀྱི་ཆ་འཕྲིན་སྤེལ་ནས་ང་ཚོས་གསོལ་འདེབས་ཡོད།',
  nameLabel: 'ཁྱེད་ཀྱི་མིང་།',
  namePlaceholder: 'ཁྱེད་ཀྱི་མིང་བཀོད།',
  locationLabel: 'ཁྱེད་ཀྱི་གནས།',
  locationPlaceholder: 'ཁྱེད་ཀྱི་གྲོང་ཁྱེར་/གྲོང་རྡལ་བཀོད།',
  continueButton: 'མུ་མཐུད།',
  skipButton: 'མཆོངས།',
},
ks: {
  title: 'سانۍ متعلق اسانك خبر كريو',
  subtitle: 'ساڃي ڄاڻ سانجھي كري اسانك بھتر خذمت كرڻ مدد كريو',
  nameLabel: 'ساڃي ناو',
  namePlaceholder: 'اپنو ناو درج كريو',
  locationLabel: 'ساڃو ستھان',
  locationPlaceholder: 'اپنو شہر/گاوں درج كريو',
  continueButton: 'جاري ركهيو',
  skipButton: 'چھوڑیو',
},
doi: {
  title: 'सांनें अपने बारे दस्सो',
  subtitle: 'अपनी जानकारी सांझी करके सानूं वधिया सेवा करन विच मदद करो',
  nameLabel: 'तुवाडा नाम',
  namePlaceholder: 'अपना नाम भरो',
  locationLabel: 'तुवाडा थां',
  locationPlaceholder: 'अपना शहर/गांव भरो',
  continueButton: 'अग्गे वधो',
  skipButton: 'छड्डो',
},

  // Default to Hindi for other languages
};

interface UserInfoFormProps {
  language: Language;
  onSubmit: (userInfo: UserInfo) => void;
  onSkip: () => void;
}

export default function UserInfoForm({ language, onSubmit, onSkip }: UserInfoFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const t = translations[language.code as keyof typeof translations] || translations.hi;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && location.trim()) {
      onSubmit({ name: name.trim(), location: location.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F6F2' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md bg-white border-0 shadow-none">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#EAE5D4' }}
              >
                <User className="h-10 w-10" style={{ color: '#378632' }} />
              </motion.div>
              <h2 className="text-2xl mb-3" style={{ color: '#224F27' }}>{t.title}</h2>
              <p style={{ color: '#707070' }}>{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="name" style={{ color: '#1C1C1C' }}>{t.nameLabel}</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#A4B6A7' }} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="pl-10 border-2 focus:border-2"
                    style={{ 
                      backgroundColor: '#FAFBFA',
                      borderColor: '#E3E3E3',
                      color: '#1C1C1C'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#378632'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E3E3E3'}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="location" style={{ color: '#1C1C1C' }}>{t.locationLabel}</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#A4B6A7' }} />
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t.locationPlaceholder}
                    className="pl-10 border-2 focus:border-2"
                    style={{ 
                      backgroundColor: '#FAFBFA',
                      borderColor: '#E3E3E3',
                      color: '#1C1C1C'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#378632'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E3E3E3'}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 pt-6"
              >
                <Button
                  type="submit"
                  disabled={!name.trim() || !location.trim()}
                  className="w-full h-12 border-0 disabled:opacity-50"
                  style={{ 
                    backgroundColor: name.trim() && location.trim() ? '#378632' : '#ECECEC',
                    color: name.trim() && location.trim() ? '#FFFFFF' : '#A4B6A7'
                  }}
                >
                  {t.continueButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onSkip}
                  className="w-full h-12 border-2"
                  style={{ 
                    borderColor: '#E3E3E3',
                    backgroundColor: '#FFFFFF',
                    color: '#707070'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAE5D4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {t.skipButton}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6 text-sm"
              style={{ color: '#707070' }}
            >
              Language: {language.nativeName}
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}