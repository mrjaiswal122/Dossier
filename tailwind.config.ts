import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { 
      animation: {
      timedMsg: 'timedMsg 2.5s ease-in-out 1',
    },
    keyframes: {
      timedMsg: {
        from: { width:'100%' },
        to: { width: '0%' },
      }
    },
      backgroundImage: {
       
      },
      colors: {
        "black": '#0f172a',
        "black-bg": '#1f293a',
        "black-bg2": '#1a383a',
        "black-icon": '#65758b',
        "theme": '#39bcf8',
        "whites": '#f8fafc',       
        "grays": '#94a3b8',        
        "theme-light": '#81dfff', 
        "theme-dark": '#1a94d3',  
        "blue-muted": '#3b82f6',   
        "greens": '#10b981',       
        "reds": '#ef4444',         
        "yellows": '#fbbf24',       
      }
    },
    screens:{
      sm:'575px',
      md:'767px',
      lg:'992px',
      xl:'1200px',
    },
  },
  plugins: [],
};
export default config;
