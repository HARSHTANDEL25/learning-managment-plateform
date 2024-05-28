import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string}}
)
{
   try {
    const {userId} =auth()

    if(!userId)
        {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
      const course=await db.course.findUnique({
        where:{
            id:params.courseId,
            userId,
        },
        include:{
            chapters:{
                include:{
                    muxData:true,
                }
            }
        }
      }) ;
      if (!course) {
        return new NextResponse("Not found", { status: 404 });
    }
           /* 
			Out of all chapters of the course, check if at least one of
			them has their isPublished property set to true. We do this
			because we only want a course to be published if at least
			one of its chapters is published
		*/
        ///some so only one chapter is needed foer publishing the course
        const hasPublishedChapter = course.chapters.some(
            (chapter) => chapter.isPublished
        );   

        if (
            !course.title ||
            !course.description ||
            !course.imgUrl ||
            !course.categoryId ||
            !hasPublishedChapter
        ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
      
        const publishedCourse= await db.course.update({
            where:{
                id:params.courseId,
                userId,
            },
            data:{
                ispublished:true,
            
            }
        })
        return NextResponse.json(publishedCourse);  
      
    
   } catch (error) {
    console.log("[COURSE_ID_PUBLISHED]",error);
    return new NextResponse("Internal Error", { status: 500 });
    
   }
}