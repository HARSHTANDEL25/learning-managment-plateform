import { db } from "@/lib/db";
// import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    // Ensure the user is authenticated
    if (!userId ) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    // Parse the request body to get the course title
    const { title } = await req.json();

    // Validate the title field
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Create a new course in the database
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    // Return the created course as JSON response
    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
