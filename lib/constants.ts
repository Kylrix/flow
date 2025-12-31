// Application constants for WhisperrFlow

export const APP_CONFIG = {
  name: 'WhisperrFlow',
  tagline: 'Smart Task Navigation',
  description: 'The future of task orchestration inside the Whisperr ecosystem.',

  // Brand assets
  logo: {
    url: 'https://res.cloudinary.com/dr266qqeo/image/upload/v1764592030/whisperrflow2_mzoiz5.jpg',
    alt: 'WhisperrFlow Logo',
  },

  // Brand colors (for reference, actual theme colors are in theme/theme.ts)
  colors: {
    primary: '#00F0FF', // Cybernetic Teal
    secondary: '#A1A1AA', // Gunmetal
  },
} as const;

// Whisperr ecosystem app type
interface EcosystemApp {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  url: string;
  active?: boolean;
}

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'whisperrnote.space';

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    name: 'Note',
    shortName: 'Note',
    icon: '📝',
    color: '#6366F1',
    description: 'Secure workspace & thinking',
    url: `https://app.${DOMAIN}`,
  },
  {
    name: 'Keep',
    shortName: 'Keep',
    icon: '🔐',
    color: '#8B5CF6',
    description: 'Privacy-first vault',
    url: `https://keep.${DOMAIN}`,
  },
  {
    name: 'Flow',
    shortName: 'Flow',
    icon: '🚀',
    color: '#00F0FF',
    description: 'Smart task navigation',
    active: true,
    url: `https://flow.${DOMAIN}`,
  },
  {
    name: 'Connect',
    shortName: 'Connect',
    icon: '💬',
    color: '#EC4899',
    description: 'Secure bridge & chat',
    url: `https://connect.${DOMAIN}`,
  },
  {
    name: 'Identity',
    shortName: 'ID',
    icon: '🛡️',
    color: '#00F0FF',
    description: 'SSO & Identity management',
    url: `https://accounts.${DOMAIN}`,
  },
];
