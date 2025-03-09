'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiForestCamp, 
  GiIsland,
  GiSoundWaves,
  GiWindmill
} from 'react-icons/gi';
import { FaBook, FaBrain, FaBriefcase, FaGuitar, FaHeadphones, FaLaptop, FaMicrophone, FaMusic, FaPencilAlt, FaRecordVinyl, FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';


import Container from '../Container';
import CategoryBox from '../CategoryBox';


export const categories = [
  {
    label: 'Mixing',
    icon: FaMusic,
    description: 'This mentor specializes in mixing!',
  },
  {
    label: 'Mastering',
    icon: FaHeadphones,
    description: 'This mentor specializes in mastering!',
  },
  {
    label: 'Recording',
    icon: FaMicrophone,
    description: 'This mentor specializes in recording techniques!'
  },
  {
    label: 'Sound Design',
    icon: GiSoundWaves,
    description: 'This mentor specializes in sound design!'
  },
  {
    label: 'Music Theory',
    icon: FaBook,
    description: 'This mentor specializes in music theory!'
  },
  {
    label: 'Composition',
    icon: FaPencilAlt,
    description: 'This mentor specializes in composition!'
  },
  {
    label: 'Production',
    icon: FaLaptop,
    description: 'This mentor specializes in music production!'
  },
  {
    label: 'Live Performance',
    icon: FaGuitar,
    description: 'This mentor specializes in live performance!'
  },
  {
    label: 'DJing',
    icon: FaRecordVinyl,
    description: 'This mentor specializes in DJing!'
  },
  {
    label: 'Music Business',
    icon: FaBriefcase,
    description: 'This mentor specializes in the music business!'
  },
  {
    label: 'Creativity',
    icon: FaBrain,
    description: 'This mentor specializes in creativity!'
  }
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('/coaching/category');
  const pathname = usePathname();
  const isMainPage = pathname === '/coaching/';

  // if (!isMainPage) {
  //   return null;
  // }

  return (
    <div className="bg-white dark:bg-neutral-900 theme-transition border-b-[1px] border-neutral-200 dark:border-neutral-700">
      <Container>
        <div
          className="
            pt-4
            pb-4
            flex 
            flex-row 
            items-center 
            justify-between
            overflow-x-auto
          "
        >
          {categories.map((item) => (
            <CategoryBox 
              key={item.label}
              label={item.label}
              icon={item.icon}
              selected={category === item.label}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
 
export default Categories;