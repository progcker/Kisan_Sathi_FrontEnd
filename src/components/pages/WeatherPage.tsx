import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  MapPin,
  Sunrise,
  Sunset,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    description: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
  }>;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

const translations = {
  hi: {
    title: 'मौसम की जानकारी',
    subtitle: 'आज का मौसम और खेती के सुझाव',
    temperature: 'तापमान',
    humidity: 'नमी',
    windSpeed: 'हवा की गति',
    visibility: 'दृश्यता',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    todayWeather: 'आज का मौसम',
    forecast: '7 दिनों का पूर्वानुमान',
    farmingAdvice: 'खेती सलाह',
    goodDay: 'खेती के लिए अच्छा दिन',
    rainyDay: 'बारिश का दिन - छिड़काव न करें',
    hotDay: 'गर्म दिन - सिंचाई करें',
    windyDay: 'तेज हवा - छिड़काव से बचें',
    location: 'स्थान',
    loading: 'मौसम की जानकारी लोड हो रही है...',
    error: 'मौसम की जानकारी लोड नहीं हो सकी',
    noLocation: 'स्थान निर्धारित नहीं है',
    current: 'वर्तमान मौसम',
    hourly: 'घंटेवार पूर्वानुमान',
    daily: '7-दिन का पूर्वानुमान',
    recommendations: 'कृषि सुझाव',
    sunriseTip: 'सुबह जल्दी खेती का काम करें',
    sunsetTip: 'शाम में छिड़काव का उपयुक्त समय',
  },
  en: {
    title: 'Weather Information',
    subtitle: "Today's weather and farming suggestions",
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    todayWeather: "Today's Weather",
    forecast: '7-Day Forecast',
    farmingAdvice: 'Farming Advice',
    goodDay: 'Good day for farming',
    rainyDay: 'Rainy day - avoid spraying',
    hotDay: 'Hot day - water your crops',
    windyDay: 'Windy day - avoid spraying',
    location: 'Location',
    loading: 'Loading weather information...',
    error: 'Unable to load weather data',
    noLocation: 'Location not set',
    current: 'Current Weather',
    hourly: 'Hourly Forecast',
    daily: '7-Day Forecast',
    recommendations: 'Farming Recommendations',
    sunriseTip: 'Good time for early morning farm work',
    sunsetTip: 'Suitable time for evening spraying',
  }
};

const WEATHER_API_KEY = 'c538355a3e92b60f81ebc8f2669d6918';

const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);
    
    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather data not available');
    }
    
    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    
    // Convert weather condition to our simplified format
    const getCondition = (weather: any) => {
      const main = weather.weather[0].main.toLowerCase();
      if (main.includes('rain')) return 'rainy';
      if (main.includes('cloud')) return 'cloudy';
      if (main.includes('clear') || main.includes('sun')) return 'sunny';
      return 'cloudy';
    };
    
    // Format sunrise/sunset times
    const formatTime = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    // Process hourly forecast (next 5 hours)
    const hourly = forecastData.list.slice(0, 5).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      temp: Math.round(item.main.temp),
      condition: getCondition(item)
    }));
    
    // Process daily forecast (group by day)
    const dailyData: any = {};
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!dailyData[day]) {
        dailyData[day] = {
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: getCondition(item)
        };
      } else {
        dailyData[day].high = Math.max(dailyData[day].high, item.main.temp_max);
        dailyData[day].low = Math.min(dailyData[day].low, item.main.temp_min);
      }
    });
    
    const daily = Object.entries(dailyData).slice(0, 7).map(([day, data]: [string, any], index) => ({
      day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day,
      high: Math.round(data.high),
      low: Math.round(data.low),
      condition: data.condition
    }));
    
    return {
      current: {
        temperature: Math.round(weatherData.main.temp),
        condition: getCondition(weatherData),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 10,
        sunrise: formatTime(weatherData.sys.sunrise),
        sunset: formatTime(weatherData.sys.sunset),
        description: weatherData.weather[0].description
      },
      hourly,
      daily
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export default function WeatherPage() {
  const { language, userInfo } = useAppContext();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language?.code as keyof typeof translations] || translations.hi;

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!userInfo?.location) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData(userInfo?.location || '');
        setWeather(data);
      } catch (err) {
        setError(t.error);
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [userInfo?.location]);

  const getWeatherIcon = (condition: string, size: number = 6) => {
    const className = `w-${size} h-${size}`;
    switch (condition) {
      case 'sunny': return <Sun className={className} style={{ color: '#F4AE29' }} />;
      case 'cloudy': return <Cloud className={className} style={{ color: '#A4B6A7' }} />;
      case 'rainy': return <CloudRain className={className} style={{ color: '#3391E6' }} />;
      default: return <Sun className={className} style={{ color: '#F4AE29' }} />;
    }
  };

  const getFarmingAdvice = () => {
    if (!weather) {
      return { message: t.goodDay, color: '#378632', bgColor: '#EAE5D4', icon: '✅' };
    }
    
    const temp = weather.current.temperature;
    const windSpeed = weather.current.windSpeed;
    const condition = weather.current.condition;

    if (condition === 'rainy') {
      return { message: t.rainyDay, color: '#3391E6', bgColor: '#EAE5D4', icon: '🌧️' };
    } else if (temp > 35) {
      return { message: t.hotDay, color: '#D34C24', bgColor: '#EAE5D4', icon: '🌡️' };
    } else if (windSpeed > 20) {
      return { message: t.windyDay, color: '#F4AE29', bgColor: '#EAE5D4', icon: '💨' };
    } else {
      return { message: t.goodDay, color: '#378632', bgColor: '#EAE5D4', icon: '✅' };
    }
  };

  const getRecommendations = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return [
          language?.code === 'hi' ? 'सिंचाई के लिए उत्तम समय' : 'Perfect time for irrigation',
          language?.code === 'hi' ? 'खेती के काम के लिए अच्छा दिन' : 'Good day for fieldwork',
          language?.code === 'hi' ? 'धान की कटाई के लिए उपयुक्त' : 'Ideal for harvesting rice'
        ];
      case 'rainy':
        return [
          language?.code === 'hi' ? 'बाहरी काम से बचें' : 'Avoid outdoor work',
          language?.code === 'hi' ? 'उर्वरक और बीजों को सुरक्षित रखें' : 'Keep fertilizers and seeds dry',
          language?.code === 'hi' ? 'प्राकृतिक सिंचाई का लाभ उठाएं' : 'Take advantage of natural irrigation'
        ];
      case 'cloudy':
        return [
          language?.code === 'hi' ? 'रोपण के लिए अच्छा समय' : 'Good time for planting',
          language?.code === 'hi' ? 'नर्सरी का काम कर सकते हैं' : 'Work in nursery possible',
          language?.code === 'hi' ? 'उपकरणों की जांच करें' : 'Check equipment maintenance'
        ];
      default:
        return [language?.code === 'hi' ? 'सामान्य कृषि कार्य कर सकते हैं' : 'General farming activities can be done'];
    }
  };

  const advice = getFarmingAdvice();

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-8 pb-24" style={{ backgroundColor: '#F7F6F2' }}>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: '#378632' }} />
            <p style={{ color: '#707070' }}>{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen p-4 pt-8 pb-24" style={{ backgroundColor: '#F7F6F2' }}>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="w-8 h-8 mb-4" style={{ color: '#D34C24' }} />
            <p style={{ color: '#707070' }}>{error || t.error}</p>
            {!userInfo?.location && (
              <p className="mt-2 text-center" style={{ color: '#707070' }}>{t.noLocation}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-8 pb-24" style={{ backgroundColor: '#F7F6F2' }}>
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2" style={{ color: '#1C1C1C' }}>{t.title}</h1>
          <p className="text-sm" style={{ color: '#707070' }}>{t.subtitle}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <MapPin className="w-4 h-4" style={{ color: '#A4B6A7' }} />
            <span className="text-sm" style={{ color: '#707070' }}>
              {userInfo?.location || t.noLocation}
            </span>
          </div>
        </div>

        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#1C1C1C' }}>
                {getWeatherIcon(weather.current.condition, 5)}
                {t.current}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="mb-2" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#1C1C1C' }}>
                  {weather.current.temperature}°C
                </div>
                <div className="mb-2 flex justify-center">
                  {getWeatherIcon(weather.current.condition, 12)}
                </div>
                <p className="text-sm capitalize" style={{ color: '#707070' }}>
                  {weather.current.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" style={{ color: '#378632' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#707070' }}>{t.humidity}</p>
                    <p style={{ color: '#1C1C1C' }}>{weather.current.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" style={{ color: '#378632' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#707070' }}>{t.windSpeed}</p>
                    <p style={{ color: '#1C1C1C' }}>{weather.current.windSpeed} km/h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" style={{ color: '#378632' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#707070' }}>{t.visibility}</p>
                    <p style={{ color: '#1C1C1C' }}>{weather.current.visibility} km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4" style={{ color: '#F4AE29' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#707070' }}>{t.sunrise}</p>
                    <p style={{ color: '#1C1C1C' }}>{weather.current.sunrise}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Farming Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border" style={{ backgroundColor: advice.bgColor, borderColor: '#E3E3E3' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{advice.icon}</div>
                <div>
                  <h3 className="mb-1" style={{ color: advice.color }}>{t.farmingAdvice}</h3>
                  <p style={{ color: '#1C1C1C' }}>{advice.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
            <CardHeader>
              <CardTitle style={{ color: '#1C1C1C' }}>{t.hourly}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {weather.hourly.map((hour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex-shrink-0 text-center p-3 rounded-lg min-w-[80px]"
                    style={{ backgroundColor: '#FAFBFA', border: '1px solid #E3E3E3' }}
                  >
                    <p className="text-xs mb-2" style={{ color: '#707070' }}>{hour.time}</p>
                    <div className="mb-2 flex justify-center">
                      {getWeatherIcon(hour.condition, 5)}
                    </div>
                    <p style={{ color: '#1C1C1C' }}>{hour.temp}°</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
            <CardHeader>
              <CardTitle style={{ color: '#1C1C1C' }}>{t.daily}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weather.daily.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: '#FAFBFA', border: '1px solid #E3E3E3' }}
                  >
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(day.condition, 5)}
                      <span style={{ color: '#1C1C1C' }}>{day.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#1C1C1C' }}>{day.high}°</span>
                      <span style={{ color: '#707070' }}>/{day.low}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }}>
            <CardHeader>
              <CardTitle style={{ color: '#1C1C1C' }}>{t.recommendations}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getRecommendations(weather.current.condition).map((recommendation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#378632' }} />
                    <p className="text-sm" style={{ color: '#707070' }}>{recommendation}</p>
                  </div>
                ))}
              </div>
              
              {/* Sun times tips */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E3E3E3' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sunrise className="w-4 h-4" style={{ color: '#F4AE29' }} />
                  <p className="text-sm" style={{ color: '#707070' }}>{t.sunriseTip}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4" style={{ color: '#F4AE29' }} />
                  <p className="text-sm" style={{ color: '#707070' }}>{t.sunsetTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}