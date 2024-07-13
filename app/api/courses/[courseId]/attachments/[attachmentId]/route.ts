import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = auth();


        if (!userId ) {
            return new NextResponse("Unauthorized user", { status: 401 });

        }
        ///checking for if the person is owner or not 

        const courseOwner = await db.course.findUnique(
            {
                where: {
                    id: params.courseId,
                    userId: userId,
                },
            }
        );

        if (!courseOwner) {
            return new NextResponse("unauthorized", { status: 401 })
        }
        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId


            }
        }
        );

        return NextResponse.json(attachment)



    } catch (error) {
        console.log("[ATTACHMENT_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}