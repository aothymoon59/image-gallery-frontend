import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { BiImage } from "react-icons/bi";

const Gallery = () => {
    const [finalGalleryData, setFinalGalleryData] = useState([])
    const [galleryData, setGalleryData] = useState([])
    const [control, setControl] = useState(true);
    const [imageUploadLoading, setImageUploadLoading] = useState(false)

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

    const handleFileChange = (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append("image", image);

        const imgBBHostingUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;

        setImageUploadLoading(true)
        fetch(imgBBHostingUrl, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((imgData) => {
                if (imgData.success) {
                    const thumb = imgData.data.display_url;
                    const finalGalleryData = {
                        thumb
                    }
                    axios
                        .post("http://localhost:5000/upload-image", finalGalleryData)
                        .then((res) => {
                            if (res.data?.insertedId) {
                                toast.success('Image upload successfully')
                                setControl(!control);
                                setImageUploadLoading(false)
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }

            });
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
                                                <div className={`${index === 0 && 'col-span-2 row-span-2'}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    {/* single image component start  */}
                                                    <div className={`group border-2 rounded-xl overflow-hidden relative transition duration-200 transform`}>
                                                        <img src={item?.thumb} className="w-full h-full" alt="Gallery Image" />
                                                        <div className="bg-black rounded-xl bg-opacity-75 opacity-0 hover:opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out">
                                                            <input type="checkbox" className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' name="" id="" />
                                                        </div>
                                                    </div>
                                                    {/* single image component end  */}

                                                </div>
                                            )
                                        }

                                    </Draggable>;
                                })}
                                {provided.placeholder}
                                {/* image upload start */}
                                <div className="col-span-1 row-span-1 h-full">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            name="image"
                                            onChange={handleFileChange}
                                        />
                                        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg h-full flex flex-col items-center justify-center">
                                            <BiImage className="text-3xl" />
                                            <p className="text-xl font-semibold text-gray-700 text-center">Add Images</p>

                                            {
                                                imageUploadLoading ? <p className="text-xs mt-2 text-center">Uploading...</p> : ''
                                            }
                                        </div>
                                    </label>
                                </div>
                                {/* image upload end */}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Gallery;