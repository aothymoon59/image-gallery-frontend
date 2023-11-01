import { useEffect } from "react";
import { useState } from "react";
import ImageCard from "../../Components/ImageCard/ImageCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Gallery = () => {
    const [finalGalleryData, setFinalGalleryData] = useState([])
    const [galleryData, setGalleryData] = useState([])

    useEffect(() => {
        // Update galleryData when finalGalleryData changes
        setGalleryData(finalGalleryData);
    }, [finalGalleryData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/galleryData.json');
                if (response.ok) {
                    const data = await response.json();
                    setFinalGalleryData(data);
                }
            } catch (error) {
                // Handle the error here
                console.error('Error fetching gallery data:', error);
            }
        };
        fetchData();
    }, []);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(galleryData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setGalleryData(items)
    }
    return (
        <div className="shadow-md">
            <div className="p-5 border-b">
                <h3 className="text-xl font-bold">Gallery</h3>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="gallery">
                    {
                        (provided) => (
                            <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5" {...provided.droppableProps} ref={provided.innerRef}>
                                {galleryData?.map((item, index) => {
                                    return <Draggable key={item?.id} draggableId={item?.id} index={index}>
                                        {
                                            (provided) => (
                                                // Check if it's the first image to apply different styling
                                                <div className={`${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ImageCard item={item} featured={index === 0} />
                                                </div>
                                            )
                                        }

                                    </Draggable>;
                                })}
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Gallery;