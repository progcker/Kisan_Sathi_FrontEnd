import React from "react";
import { motion } from "motion/react";
import { Globe, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Language } from "../App";

const languages: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bh", name: "Bhojpuri", nativeName: "भोजपुरी" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "mag", name: "Magahi", nativeName: "मगही" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯤꯇꯩ ꯂꯣꯟ" },
  { code: "bo", name: "Tibetan", nativeName: "བོད་ཡིག" },
  { code: "ks", name: "Kashmiri", nativeName: "کٲشُر" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी" },
];

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
}

export default function LanguageSelection({
  onLanguageSelect,
}: LanguageSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F6F2' }}>
      <Card className="w-full max-w-4xl bg-white border-0 shadow-none">
        <div className="p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#EAE5D4' }}>
                <Globe className="h-8 w-8" style={{ color: '#378632' }} />
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EAE5D4' }}>
                <Languages className="h-8 w-8" style={{ color: '#378632' }} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl mb-4" style={{ color: '#224F27' }}>
              Kisan Sathi
            </h1>
            <p className="text-lg sm:text-xl mb-2" style={{ color: '#1C1C1C' }}>
              Choose Your Language / अपनी भाषा चुनें
            </p>
            <p className="text-base" style={{ color: '#707070' }}>
              Select your preferred language to continue
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto mb-8 p-1">
            {languages.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.03,
                  duration: 0.3,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative" // Add relative positioning
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center border-2 hover:border-2 transition-all duration-200 relative z-10"
                  style={{ 
                    borderColor: '#E3E3E3',
                    backgroundColor: '#FFFFFF',
                    color: '#1C1C1C'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#378632';
                    e.currentTarget.style.backgroundColor = '#EAE5D4';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.zIndex = '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E3E3E3';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.zIndex = '10';
                  }}
                  onClick={() => onLanguageSelect(language)}
                >
                  <span className="text-sm font-medium" style={{ color: '#1C1C1C' }}>
                    {language.name}
                  </span>
                  <span className="text-base mt-1" style={{ color: '#707070' }}>
                    {language.nativeName}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <p style={{ color: '#707070' }}>
              Supporting farmers across India in their native languages
            </p>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}