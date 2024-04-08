"use client"
import { FC, useState, createContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { themeCreator } from './base';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

export const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

type ThemeContext = {
  darkMode: any;
  setDarkMode: () => void;
  rtl: any;
  setRtl: () => void;
};

const ThemeProviderWrapper = (props: any) => {
  const [darkMode, __setDarkMode] = useState(false);
  const [rtl, __setRtl] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    __setDarkMode((window.localStorage.getItem('darkMode') == 'true') ? true : false)
    __setRtl((window.localStorage.getItem('rtl') == 'true') ? true : false)
    document.dir = (window.localStorage.getItem('rtl') == 'true') ? 'rtl' : 'ltr';
    setLoading(false)
  }, []);

  // Light = PureLightTheme / GreyGooseTheme / PurpleFlowTheme
  // Dark = NebulaFighterTheme / DarkSpacesTheme / GreenFieldsTheme
  const themeDark = themeCreator('GreenFieldsTheme', rtl);
  const themeLight = themeCreator('PureLightTheme', rtl);
  
  const setDarkMode = (): void => {
    __setDarkMode((window.localStorage.getItem('darkMode') == 'true') ? false : true);
    window.localStorage.setItem('darkMode', (window.localStorage.getItem('darkMode') == 'true') ? 'false' : 'true');
  };

  const setRtl = (): void => {
    const rtl = (window.localStorage.getItem('rtl') == 'true') ? false : true;
    __setRtl(rtl);
    window.localStorage.setItem('rtl', rtl.toString());
    document.dir = (rtl) ? 'rtl' : 'ltr';
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={{ darkMode, setDarkMode, rtl, setRtl }}>
        <ThemeProvider theme={(darkMode) ? themeDark : themeLight}>{!loading && props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
