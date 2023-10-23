import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import { utapi } from "@/app/api/uploadthing/core";

const { Video } = new Mux(
  process.env.MUX_TOEKN_ID!,
  process.env.MUX_TOEKN_SECRET!,
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
        attachments: true,
      },
    });

    if (!course) return new NextResponse("Not found", { status: 404 });

    for (const attachment of course.attachments) {
      if (attachment.url) {
        await utapi.deleteFiles(attachment.name);
      }
    }

    if (course.imageUrl) {
      const imageName = course.imageUrl.split("/").pop();
      await utapi.deleteFiles(imageName!);
    }

    for (const chapter of course.chapters) {
      if (chapter.videoUrl) {
        const videoName = chapter.videoUrl.split("/").pop();
        await utapi.deleteFiles(videoName!);
      }
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
        userId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
