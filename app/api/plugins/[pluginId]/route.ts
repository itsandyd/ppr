import { CourseChapter } from '@prisma/client';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { pluginId: string } }
  ) {
    try {
      const { userId } = auth();
    //   const { pluginCategoryId } = await req.json();
      const body = await req.json();
const { pluginCategoryId } = body; // Extracting pluginCategoryId from the request body
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const plugin = await db.plugin.update({
        where: {
          id: params.pluginId,
          userId
        },
        data: {
        //   ...values,
        categoryId: pluginCategoryId, // Ensure this matches the schema field name

        }
      });
  
      return NextResponse.json(plugin);
    } catch (error) {
      console.log("[PLUGIN_ID]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  // export async function DELETE(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const course = await db.course.findUnique({
//       where: {
//         id: params.courseId,
//         userId: userId,
//       },
//       include: {
//         courseChapter: {
//           include: {
//             muxData: true,
//           }
//         }
//       }
//     });


//     if (!course) {
//       return new NextResponse("Not found", { status: 404 });
//     }

//     for (const chapter of course.courseChapter) {
//       if (chapter.muxData?.assetId) {
//         await Video.Assets.del(chapter.muxData.assetId);
//       }
//     }

//     const deletedCourse = await db.course.delete({
//       where: {
//         id: params.courseId,
//       },
//     });

//     return NextResponse.json(deletedCourse);

//   } catch (error) {
//     console.log("[COURSE_ID_DELETE]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }