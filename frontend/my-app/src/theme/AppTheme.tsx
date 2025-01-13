import {FC} from 'react'
import { createTheme, ThemeOptions, ThemeProvider, CssBaseline } from '@mui/material';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

const defaultTheme = createTheme()

const { breakpoints, typography: { pxToRem } } = defaultTheme

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#2BD17E',
		},
		error: {
			main: '#EB5757',
		},
		background: {
			default: '#093545',
			paper: '#224957',
		},
		secondary: {
			main: '#092C39',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#C3C8D4',
		},
	},
	typography: {
		fontFamily: montserrat.style.fontFamily,
		h1: {
			fontSize: pxToRem(64),
			lineHeight: pxToRem(80),
			fontWeight: 500,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(48),
				lineHeight: pxToRem(64),
			},
		},
		h2: {
			fontSize: pxToRem(48),
			lineHeight: pxToRem(56),
			fontWeight: 500,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(32),
				lineHeight: pxToRem(40),
			},
		},
		h3: {
			fontSize: pxToRem(32),
			lineHeight: pxToRem(40),
			fontWeight: 500,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(24),
				lineHeight: pxToRem(32),
			},
		},
		h4: {
			fontSize: pxToRem(24),
			lineHeight: pxToRem(32),
			fontWeight: 700,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(20),
				lineHeight: pxToRem(24),
			},
		},
		h5: {
			fontSize: pxToRem(20),
			lineHeight: pxToRem(24),
			fontWeight: 700,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(16),
				lineHeight: pxToRem(20),
			},
		},
		h6: {
			fontSize: pxToRem(16),
			lineHeight: pxToRem(24),
			fontWeight: 700,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(14),
				lineHeight: pxToRem(20),
			},
		},
		body1: {
			fontSize: pxToRem(20),
			lineHeight: pxToRem(32),
			fontWeight: 400,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(16),
				lineHeight: pxToRem(24),
			},
		},
		body2: {
			fontSize: pxToRem(14),
			lineHeight: pxToRem(24),
			fontWeight: 400,
			[breakpoints.down('md')]: {
				fontSize: pxToRem(12),
				lineHeight: pxToRem(16),
			},
		},
		caption: {
			fontSize: pxToRem(12),
			lineHeight: pxToRem(16),
			fontWeight: 400,
		},
		button: {
			fontSize: pxToRem(16),
			fontWeight: 700,
		},
	},
	components: {
		MuiTextField: {
			defaultProps: {
				variant: 'outlined',
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: pxToRem(14),
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: '#224957',
					borderRadius: '10px',
					fontSize: pxToRem(14),
				},
				notchedOutline: {
					borderColor: '#224957',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: '#FFFFFF',
					textTransform: 'none',
					borderRadius: '10px',
				},
				sizeLarge: {
					padding: '14px 24px',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: '#FFFFFF',
					borderRadius: '10px',
				},
			},
		},
	},
});

const AppTheme: FC<AppThemeProps> = (props: AppThemeProps) => {
	const { children } = props;
	return <ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>;
}



interface AppThemeProps {
	children: React.ReactNode;
	themeComponents?: ThemeOptions['components'];
}

export default AppTheme;
