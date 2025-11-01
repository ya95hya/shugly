import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  direction: 'rtl',
  fonts: {
    heading: 'Avenir Next Arabic, Cairo, sans-serif',
    body: 'Cairo, sans-serif',
  },
  colors: {
    // الألوان الأساسية للشركة
    brand: {
      50: '#f5f3f0',   // Light beige
      100: '#e8ddd4',  // Light tan
      200: '#d4c4b0',  // Medium tan
      300: '#c0a88c',  // Tan
      400: '#ac8c68',  // Dark tan
      500: '#955C33', // Primary brown
      600: '#7a4a29', // Dark brown
      700: '#5f381f', // Darker brown
      800: '#442615', // Very dark brown
      900: '#29140b', // Darkest brown
    },
    // الألوان الثانوية
    secondary: {
      50: '#f8f9fa',   // Light grey
      100: '#EBF0F2',  // Light blue-grey
      200: '#d1d9dd',  // Medium blue-grey
      300: '#b7c2c8',  // Blue-grey
      400: '#9dabb3',  // Dark blue-grey
      500: '#83949e', // Blue-grey
      600: '#697d89', // Dark blue-grey
      700: '#4f6674', // Darker blue-grey
      800: '#39404A', // Very dark blue-grey
      900: '#1f2529', // Darkest blue-grey
    },
    // الألوان المحايدة
    neutral: {
      50: '#FFFFFF',  // White
      100: '#EFEDE9', // Light beige
      200: '#CCB097', // Light tan
      300: '#b8a085', // Medium tan
      400: '#a48e73', // Tan
      500: '#907e61', // Dark tan
      600: '#7c6e4f', // Darker tan
      700: '#685e3d', // Very dark tan
      800: '#544e2b', // Darkest tan
      900: '#403e19', // Almost black tan
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
        fontFamily: 'Avenir Next Arabic, Cairo, sans-serif',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            borderColor: 'brand.600',
          },
        },
        ghost: {
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          borderColor: 'neutral.200',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'neutral.100',
          _hover: {
            boxShadow: 'md',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'semibold',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'neutral.50',
        color: 'secondary.800',
        fontFamily: 'Cairo, sans-serif',
      },
    },
  },
});

export default theme;



