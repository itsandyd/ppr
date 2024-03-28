import { db } from "@/lib/db";

interface getSoundsByIdProps {
//   userId: string;
  soundsId: string;
};

export const getSoundsById = async ({
//   userId,
  soundsId
}: getSoundsByIdProps) => {
  try {
    // const purchase = await db.purchaseCourse.findUnique({
    //   where: {
    //     userId_courseId: {
    //       userId,
    //       courseId,
    //     }
    //   }
    // });

    const sounds = await db.sounds.findUnique({
      where: {
        // isPublished: true,
        id: soundsId,
      },
    //   select: {
    //     price: true,
    //   }
    });

    // const chapter = await db.courseChapter.findUnique({
    //   where: {
    //     id: chapterId,
    //     isPublished: true,
    //   }
    // });

    // if (!chapter || !course) {
    //   throw new Error("Chapter or course not found");
    // }

    // let muxData = null;
    // let attachments: Attachment[] = [];
    // let nextChapter: CourseChapter | null = null;

    // if (purchase) {
    //   attachments = await db.attachment.findMany({
    //     where: {
    //       courseId: courseId
    //     }
    //   });
    // }

    // if (chapter.isFree || purchase) {
    //   muxData = await db.muxData.findUnique({
    //     where: {
    //       chapterId: chapterId,
    //     }
    //   });

    //   nextChapter = await db.courseChapter.findFirst({
    //     where: {
    //       courseId: courseId,
    //       isPublished: true,
    //       position: {
    //         gt: chapter?.position,
    //       }
    //     },
    //     orderBy: {
    //       position: "asc",
    //     }
    //   });
    // }

    // const userProgress = await db.userProgress.findUnique({
    //   where: {
    //     userId_chapterId: {
    //       userId,
    //       chapterId,
    //     }
    //   }
    // });

    return {
      sounds
    };
  } catch (error) {
    console.log("[GET_SOUNDS_BY_ID]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}