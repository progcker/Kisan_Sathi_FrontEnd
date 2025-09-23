import React, { createContext, useContext, ReactNode } from 'react';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type UserInfo = {
  name: string;
  location: string;
};

type AppContextType = {
  language: Language;
  userInfo: UserInfo;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  language: Language;
  userInfo: UserInfo;
}

export const AppProvider = ({ children, language, userInfo }: AppProviderProps) => {
  return (
    <AppContext.Provider value={{ language, userInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};