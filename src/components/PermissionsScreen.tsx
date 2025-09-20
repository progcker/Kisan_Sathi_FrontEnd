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
  }
};

export default function PermissionsScreen({ language, userInfo, onComplete }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'pending',
    microphone: 'pending'
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const requestCameraPermission = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera for crop photos
      });
      cameraStream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      return true;
    } catch (error: any) {
      // Handle different types of errors more gracefully
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
      audioStream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      return true;
    } catch (error: any) {
      // Handle different types of errors more gracefully
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
    
    // Request both permissions
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
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                  style={{ 
                    borderColor: '#E3E3E3',
                    backgroundColor: '#FFFFFF',
                    color: '#1C1C1C'
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