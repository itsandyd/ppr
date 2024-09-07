import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

export const maxDuration = 300; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.courseChapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
    });

    if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
        where: {
            id: existingMuxData.id,
        }
        });

      }
    }

    const deletedChapter = await db.courseChapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChaptersInCourse = await db.courseChapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(deletedChapter);


  } catch (error) {
    console.log("[CHAPTER_ID_DELETE", error)
    return new NextResponse("Internal Error", { status: 500 } )
  }
};



export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
      const { userId } = auth();
      const { isPublished, ...values } = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId
        }
      });
  
      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const chapter = await db.courseChapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          ...values,
        }
      });
  
      // Index the chapter description in Pinecone
      if (values.description) {
        try {
          console.log("Starting indexing process...");
          const embeddings = new OpenAIEmbeddings();
          
          console.log("Initializing Pinecone...");
          const pinecone = new Pinecone();

          console.log("Getting Pinecone index...");
          const index = pinecone.Index(process.env.PINECONE_INDEX!);

          console.log("Creating vector store...");
          const vectorStore = await PineconeStore.fromExistingIndex(
            embeddings,
            { 
              pineconeIndex: index,
              namespace: params.courseId,
              textKey: 'text',
            }
          );

          console.log("Adding documents to vector store...");
          await vectorStore.addDocuments([{
            pageContent: values.description,
            metadata: { courseId: params.courseId, chapterId: params.chapterId }
          }]);

          console.log("Indexing completed successfully.");
        } catch (error) {
          console.error("Error during indexing:", error);
          // Don't throw the error, just log it, so we can still update the chapter
        }
      }

      if (values.videoUrl) {
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterId: params.chapterId,
          }
        });
  
        if (existingMuxData) {
          await Video.Assets.del(existingMuxData.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            }
          });
        }
  
        const asset = await Video.Assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });
  
        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          }
        });
      }
  
      return NextResponse.json(chapter);
    } catch (error) {
      console.error("[COURSES_CHAPTER_ID]", error);
      return new NextResponse("Internal Error", { status: 500 }); 
    }
  }
