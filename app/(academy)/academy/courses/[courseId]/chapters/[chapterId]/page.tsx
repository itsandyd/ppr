import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import react from 'react';

const ChapterIdPage = async ({
    params
  }: {
    params: { courseId: string; chapterId: string }
  }) => {
    const { userId } = auth();
    
    if (!userId) {
      return redirect("/");
    } 

    // const {
    //     chapter,
    //     course,
    //     muxData,
    //     attachments,
    //     nextChapter,
    //     userProgress,
    //     purchase,
    //   } = await getChapter({
    //     userId,
    //     chapterId: params.chapterId,
    //     courseId: params.courseId,
    //   });
    
    //   if (!chapter || !course) {
    //     return redirect("/")
    //   }


    return ( 
        <div>
            <h1>Chapter Id Page</h1>
        </div>
     );
}

export default ChapterIdPage;