import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/courses/banner';
import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import react from 'react';


import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/courses/preview';
import { getPlugins } from '@/actions/get-plugins';
import { getPlugin } from '@/actions/get-plugin-by-id';
import Image from 'next/image';

const ChapterIdPage = async ({
  params
}: {
  params: { pluginId: string }
}) => {
  const { userId } = auth();
  
//   if (!userId) {
//     return redirect("/");
//   } 

  const {
    plugin,
  } = await getPlugin({
    // userId,
    pluginId: params.pluginId,
  });

//   if (!chapter || !course) {
//     return redirect("/")
//   }


//   const isLocked = !chapter.isFree && !purchase;
//   const completeOnEnd = !!purchase && !userProgress?.isCompleted;


    return ( 
        <div>
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
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    {/* <VideoPlayer 
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId || null}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    /> */}
                    <Image 
                        src={plugin?.image || 'placeholder.svg'}
                        alt={plugin?.name || 'Plugin Name'}
                        width={500}
                        height={500}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">{plugin?.name}</h2>
                        {/* {purchase ? (
                            <div>
                                Course Progression
                            </div>
                        ) : (
                            <CourseEnrollButton 
                                courseId={params.courseId}
                                price={course.price!}
                            />

                        )} */}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={plugin?.description!}/>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ChapterIdPage;