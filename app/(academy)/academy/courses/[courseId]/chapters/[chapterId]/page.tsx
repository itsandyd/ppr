import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/courses/banner';
import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import react from 'react';
import { VideoPlayer } from './components/video-player';
import { CourseEnrollButton } from './components/course-enroll-button';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/courses/preview';
import { cn } from '@/lib/utils';

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
    <div className="bg-background min-h-screen">
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
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground mb-2 md:mb-0">
              {chapter.title}
            </h2>
            {purchase ? (
              <div className="text-muted-foreground">
                Course Progression
              </div>
            ) : (
              <CourseEnrollButton 
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator className="bg-border" />
          <div className="text-foreground">
            <Preview value={chapter.description!}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;