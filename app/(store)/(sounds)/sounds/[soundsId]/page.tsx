import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/courses/banner';
import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import react from 'react';


import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/courses/preview';
import { getPlugins } from '@/actions/get-plugins';
import { getPlugin } from '@/actions/get-plugin-by-id';
import Image from 'next/image';
import { getSounds } from '@/actions/get-sounds';
import { getSoundsById } from '@/actions/get-sounds-by-id';
import { SoundsPurchaseButton } from '@/components/sounds/SoundsIdPage/SoundsPurchaseButton';

const PluginIdPage = async ({
  params
}: {
  params: { soundsId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    null;
  } 

  const {
    sounds
  } = await getSoundsById({
    soundsId: params.soundsId
  });

  if (!sounds) {
    // Example: Redirect to a not found page or display a message
    return redirect("/sounds");
  }

//   if (!chapter || !course) {
//     return redirect("/")
//   }


//   const isLocked = !chapter.isFree && !purchase;
//   const completeOnEnd = !!purchase && !userProgress?.isCompleted;


    return ( 
        <div className='pt-12'>
            {/* {userProgress?.isCompleted && (
            <Banner 
                variant="success"
                label="You have completed this chapter."
            />
            )}
            {isLocked && (
                <Banner 
                    variant="warning"
                    label="This chapter is locked."
                />
            )} */}
            
<div className="group pt-12 transition overflow-hidden border rounded-lg p-3 mx-auto max-w-4xl">
    <div className="flex justify-center items-center p-4">
        <Image 
            src={sounds?.image || 'placeholder.svg'}
            alt={sounds?.name || 'Plugin Name'}
            width={500}
            height={500}
            className="object-cover rounded-md"
        />
    </div>
    <div className="flex flex-col pt-2">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-lg md:text-base font-bold mb-2">{sounds?.name}</h2>
            <SoundsPurchaseButton 
                pluginId={params.soundsId}
                price={sounds.price || 0} // Ensure there's a default or conditional rendering based on the existence of price
                pricingType={sounds.pricingType}
                optInFormUrl={sounds.optInFormUrl || ''}
                purchaseUrl={sounds.purchaseUrl || ''}
            />
            {/* {userId === sounds.userId && <PluginEditButton pluginId={params.soundsId} />} */}
        </div>
        <Separator />
        <div>
            <Preview value={sounds?.description!}/>
        </div>
    </div>
</div>
        </div>
     );
}

export default PluginIdPage;