import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import next from "next";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}:{ params:{ courseId: string}}
    
)
{
    try {
        const{userId} =auth()
        const {url}=await req.json();

        if(!userId)
            {
                return new NextResponse("Unauthorized user", { status: 401 });        
            
            }
            ///checking for if the person os owner or not 

            const courseOwner= await db.course.findUnique(
                {
                    where:{
                        id:params.courseId,
                        userId:userId,
                    },
                    select:{
                        userId:true
                    }
                }
            );

            if(!courseOwner)
                {
                    return new NextResponse("unauthorized",{status:401})
                }

                const attachment= await db.attachment.create({
                    data:{
                        url,
                        name:url.split("/").pop(),
                        courseId:params.courseId,
                    }
                }
                )

                return NextResponse.json(attachment)
    } 
        catch (error) {
            console.error("[COURSE_ID_ATTACHMENTS]", error);
            return new NextResponse("Internal Server Error", { status: 500 });
        
    }
}