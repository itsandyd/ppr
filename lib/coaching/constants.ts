import { TbMusic, TbMicrophone, TbAdjustments, TbPencil, TbLayoutGridAdd, TbVocabulary, TbDeviceAudioTape, TbMoonStars, TbCoin, TbBookmark, TbBrandAppleArcade, TbPiano, TbHeadphones, TbVideoPlus, TbDeviceLaptop, TbSettings, TbWaveSawTool, TbWaveSine, TbPlayerPlay, TbBrandSoundcloud, TbTrophy, TbBriefcase, TbMovie, TbDeviceGamepad2, TbUsers, TbPlus } from "react-icons/tb";

// Category Types for TypeScript type checking
export type CategoryType = 
  // Original Categories
  | 'Music Production'
  | 'Mixing'
  | 'Mastering'
  | 'Vocal Production'
  | 'Songwriting'
  | 'Music Theory'
  | 'Instruments'
  | 'DJing'
  | 'Music Business'
  // DAW-Specific Categories
  | 'FL Studio'
  | 'Ableton Live'
  | 'Logic Pro'
  | 'Pro Tools'
  | 'Studio One'
  | 'Cubase'
  | 'Reason'
  | 'Bitwig Studio'
  | 'GarageBand'
  // Genre-Specific Production
  | 'EDM Production'
  | 'Hip Hop Production'
  | 'Rock Production'
  | 'Pop Production'
  | 'Classical Composition'
  | 'Film Scoring'
  | 'Game Audio'
  // Technical Skills
  | 'Sound Design'
  | 'Synthesis'
  | 'Sampling'
  | 'Recording Techniques'
  | 'Arrangement'
  | 'Live Performance'
  | 'Drum Programming'
  // Business/Career
  | 'Music Marketing'
  | 'Music Licensing'
  | 'Distribution Strategies'
  | 'Building a Fanbase'
  | 'Music Monetization'
  | 'Custom'
  | 'Other';

export const categories = [
  // Original Categories
  {
    label: 'Music Production',
    icon: TbMusic,
    description: 'Learn the art of music production from experienced producers'
  },
  {
    label: 'Mixing',
    icon: TbAdjustments,
    description: 'Master the techniques of mixing your tracks'
  },
  {
    label: 'Mastering',
    icon: TbLayoutGridAdd,
    description: 'Get your tracks ready for professional release'
  },
  {
    label: 'Vocal Production',
    icon: TbMicrophone,
    description: 'Learn how to record and process vocals'
  },
  {
    label: 'Songwriting',
    icon: TbPencil,
    description: 'Develop your songwriting skills'
  },
  {
    label: 'Music Theory',
    icon: TbVocabulary,
    description: 'Understand the fundamentals of music'
  },
  
  // DAW-Specific Categories
  {
    label: 'FL Studio',
    icon: TbDeviceLaptop,
    description: 'Master FL Studio for music production'
  },
  {
    label: 'Ableton Live',
    icon: TbDeviceLaptop,
    description: 'Learn Ableton Live for production and performance'
  },
  {
    label: 'Logic Pro',
    icon: TbBrandAppleArcade,
    description: 'Produce music with Logic Pro X'
  },
  {
    label: 'Pro Tools',
    icon: TbDeviceLaptop,
    description: 'Learn the industry standard for audio recording'
  },
  {
    label: 'Studio One',
    icon: TbDeviceLaptop,
    description: 'Master PreSonus Studio One'
  },
  {
    label: 'Cubase',
    icon: TbDeviceLaptop,
    description: 'Learn Steinberg Cubase for professional production'
  },
  {
    label: 'Reason',
    icon: TbDeviceLaptop,
    description: 'Create music with Reason\'s powerful virtual instruments'
  },
  {
    label: 'Bitwig Studio',
    icon: TbDeviceLaptop,
    description: 'Explore modern production workflows with Bitwig'
  },
  {
    label: 'GarageBand',
    icon: TbBrandAppleArcade,
    description: 'Start your production journey with GarageBand'
  },
  
  // Genre-Specific Production
  {
    label: 'EDM Production',
    icon: TbWaveSine,
    description: 'Learn to produce electronic dance music'
  },
  {
    label: 'Hip Hop Production',
    icon: TbHeadphones,
    description: 'Create beats and produce hip hop tracks'
  },
  {
    label: 'Rock Production',
    icon: TbDeviceAudioTape,
    description: 'Record and produce rock music'
  },
  {
    label: 'Pop Production',
    icon: TbPlayerPlay,
    description: 'Master modern pop production techniques'
  },
  {
    label: 'Classical Composition',
    icon: TbPiano,
    description: 'Learn to compose classical and orchestral music'
  },
  {
    label: 'Film Scoring',
    icon: TbMovie,
    description: 'Create compelling music for film and video'
  },
  {
    label: 'Game Audio',
    icon: TbDeviceGamepad2,
    description: 'Design and implement audio for games'
  },
  
  // Technical Skills
  {
    label: 'Sound Design',
    icon: TbWaveSawTool,
    description: 'Create unique sounds from scratch'
  },
  {
    label: 'Synthesis',
    icon: TbSettings,
    description: 'Master synthesizers and sound generation'
  },
  {
    label: 'Sampling',
    icon: TbDeviceAudioTape,
    description: 'Learn the art of sampling and sample manipulation'
  },
  {
    label: 'Recording Techniques',
    icon: TbMicrophone,
    description: 'Capture professional audio recordings'
  },
  {
    label: 'Arrangement',
    icon: TbLayoutGridAdd,
    description: 'Structure your music for maximum impact'
  },
  {
    label: 'Live Performance',
    icon: TbTrophy,
    description: 'Prepare for and execute live electronic music performances'
  },
  {
    label: 'Drum Programming',
    icon: TbHeadphones,
    description: 'Create realistic or electronic drum patterns'
  },
  
  // Business/Career
  {
    label: 'Music Marketing',
    icon: TbUsers,
    description: 'Promote your music effectively'
  },
  {
    label: 'Music Licensing',
    icon: TbBriefcase,
    description: 'Learn how to license your music for various media'
  },
  {
    label: 'Distribution Strategies',
    icon: TbBrandSoundcloud,
    description: 'Get your music on streaming platforms and beyond'
  },
  {
    label: 'Building a Fanbase',
    icon: TbUsers,
    description: 'Grow your audience and engage with fans'
  },
  {
    label: 'Music Monetization',
    icon: TbCoin,
    description: 'Turn your music into a sustainable income'
  },
  
  // Original Categories
  {
    label: 'Instruments',
    icon: TbDeviceAudioTape,
    description: 'Learn to play various instruments'
  },
  {
    label: 'DJing',
    icon: TbMoonStars,
    description: 'Master the art of DJing'
  },
  {
    label: 'Music Business',
    icon: TbCoin,
    description: 'Learn about the business side of music'
  },
  
  // Custom Option
  {
    label: 'Custom',
    icon: TbPlus,
    description: 'Create your own custom coaching category'
  },
  
  // Other Option
  {
    label: 'Other',
    icon: TbBookmark,
    description: 'Other music-related coaching'
  }
]; 