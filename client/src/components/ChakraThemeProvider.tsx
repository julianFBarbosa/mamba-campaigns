import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import React from 'react';

interface ChakraThemeProviderProps {
  children: React.ReactNode;
}

export const ChakraThemeProvider: React.FC<ChakraThemeProviderProps> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}; 