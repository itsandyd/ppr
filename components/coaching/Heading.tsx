'use client';

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ 
  title, 
  subtitle,
  center
}) => {
  return ( 
    <div className={center ? 'text-center' : 'text-start'}>
      <div className="text-2xl font-bold dark:text-white theme-transition">
        {title}
      </div>
      <div className="font-light text-neutral-500 dark:text-neutral-400 mt-2 theme-transition">
        {subtitle}
      </div>
    </div>
   );
}
 
export default Heading;