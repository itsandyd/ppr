import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/courses/banner';
import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import react from 'react';
import { VideoPlayer } from './components/video-player';

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    return redirect("/");
  } 

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }


  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;


    return ( 
        <div>
            {userProgress?.isCompleted && (
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
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer 
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId || null}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
            </div>
            <div>
                {chapter.title}
                {chapter.description}
            </div>
        </div>
     );
}

export default ChapterIdPage;