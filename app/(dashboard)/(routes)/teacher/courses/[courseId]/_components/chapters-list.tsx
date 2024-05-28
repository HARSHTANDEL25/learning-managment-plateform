"use client";
import { useState, useEffect } from "react";
import { Chapter } from "@prisma/client";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onReorder: (
        updateData: {
            id: string;
            position: number;
        }[]
    ) => void;
    onEdit: (id: string) => void;
}
export const ChaptersList = ({
    items,
    onReorder,
    onEdit,
}: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    /* 
		When you have a "use-client" directive that doesn't mean that the
		server-side rendering is completely skipped. This is definitely a
		client component but "use client" is still run once on the server-
		side rendering and then again executed on the client and that can
		cause hydration errors if what was rendered on the server-side and
		then what was rendered on the client-side doesn't match. So what we
		have to do is a little trick here that we don't display anything if 
		we are not mounted (isMounted is false). So we are going to display
		return null here. That means in the server-side rendering this entire
		component is not even going to be displayed and only when it comes 
		to client-side rendering this component is going to be displayed. This 
		trick is going to fix our hydration issues. There's a possibility of
		hydration issue because of this drag and drop component which is not 
		very optimized for the server component and server-side rendering
	 */
  // Set isMounted to true when the component mounts
  useEffect(() => {
    setIsMounted(true);
}, []);
    /* 
		To rehydrate the items
	*/
 // Update chapters state when items prop changes
 useEffect(() => {
    setChapters(items);
}, [items]);


    /*
		I do not understand what is going on here on detail but this function 
		only updates the position locally. What I mean by locally is that with 
		this function the items will stay in place when you change their 
		position but will not be saved in the API if the onReorder function is
		disabled/removed. This means that if you refresh the page the positioning
		of the items will not be saved in the database. It's local because if you
		for example remove the implementation of the onDragEnd function the 
		items will draggable but will not stay in place you change their 
		position
	*/

    // Handle drag and drop end event
    const onDragEnd=(result: DropResult)=>{
        if(!result.destination) return;

        const items=Array.from(chapters);
        const [reorderedItem]=items.splice(result.source.index,1);
        items.splice(result.destination.index,0,reorderedItem);

        const startIndex = Math.min(
            result.source.index,
            result.destination.index
        );

        const endIndex = Math.max   (
            result.source.index,
            result.destination.index
        );

        const updatedChapters=items.splice(startIndex,endIndex +1);
        setChapters(items);

        const bulkUpdateData=updatedChapters.map((chapter)=>({
            id:chapter.id,
            position:items.findIndex((item)=>item.id===chapter.id)
        }))
        
        onReorder(bulkUpdateData)


    }

    if (!isMounted) {
        return null;
    }

return (
    <DragDropContext onDragEnd={onDragEnd}>
        {/* DragDropContext provides the context for drag-and-drop operations */}
        <Droppable droppableId="chapters">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {/* Spread provided.droppableProps onto the droppable element and attach the provided ref */}
                    {chapters.map((chapter, index) => (
                        <Draggable
                            key={chapter.id}
                            draggableId={chapter.id}
                            index={index}
                        >
                            {/* Draggable defines the draggable item with unique key, draggableId, and index */}
                            {(provided) => (
                                <div
                                    className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                        chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                >
                                    {/* Apply dynamic class names based on whether the chapter is published */}
                                    <div
                                        className={cn(
                                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                            chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                        )}
                                        {...provided.dragHandleProps}
                                    >
                                        {/* Drag handle with dynamic class names */}
                                        <Grip className="h-5 w-5" />
                                    </div>
                                    {/* Display the chapter title */}
                                    {chapter.title}
                                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                                        {/* Container for additional chapter details and actions */}
                                        {chapter.isFree && (
                                            <Badge>Free</Badge>
                                        )}
                                        {/* Conditionally render the "Free" badge */}
                                        <Badge
                                            className={cn(
                                                "bg-slate-500",
                                                chapter.isPublished && "bg-sky-700"
                                            )}
                                        >
                                            {chapter.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                        {/* Badge indicating whether the chapter is published or a draft */}
                                        <Pencil
                                            onClick={() => onEdit(chapter.id)}
                                            className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                        />
                                        {/* Pencil icon for editing the chapter, with click event handler */}
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {/* Placeholder ensures the droppable area adjusts its height during dragging */}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);
};