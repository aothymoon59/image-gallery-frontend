import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { BiImage } from "react-icons/bi";
import ImageLoadingCompo from "../../Components/ImageLoadingCompo/ImageLoadingCompo";

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([])
    const [control, setControl] = useState(true);
    const [imageUploadLoading, setImageUploadLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState([])

    // console.log(selectedImage)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://image-gallery-server.vercel.app/get-gallery-images');
                const checkedImages = response.data.filter(data => data?.isChecked === true);
                setSelectedImage(checkedImages);
                setGalleryData(response.data);
                setImageLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [control]);

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

    const handleSelectedImage = (e, id) => {
        const filterData = galleryData?.find((item) => item?._id == id);
        const updatedData = {
            ...filterData,
            isChecked: e.target.checked,
        };

        axios
            .patch(`http://localhost:5000/update-selected-image/${id}`, updatedData)
            .then((res) => {
                if (res.data?.matchedCount) {
                    setControl(!control);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="shadow-md">
            <div className="p-5 border-b">
                <h3 className="text-xl font-bold">Gallery</h3>
            </div>
            {
                imageLoading ? <ImageLoadingCompo /> : <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="gallery">
                        {
                            (provided) => (
                                <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5" {...provided.droppableProps} ref={provided.innerRef}>
                                    {galleryData?.map((item, index) => {
                                        return <Draggable key={item?._id} draggableId={item?._id} index={index}>
                                            {
                                                (provided) => (
                                                    // Check if it's the first image to apply different styling
                                                    <div className={`${index === 0 && 'col-span-2 row-span-2'}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                        {/* single image component start  */}
                                                        <div className={`group border-2 rounded-xl overflow-hidden relative transition duration-200 transform`}>
                                                            <img src={item?.thumb} className="w-full h-full" alt="Gallery Image" />
                                                            <div className={`${item?.isChecked ? '' : 'hidden'} group-hover:block bg-black rounded-xl bg-opacity-50 opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out`}>
                                                                <input onChange={(e) => handleSelectedImage(e, item?._id)}
                                                                    type="checkbox"
                                                                    defaultChecked={item?.isChecked} className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' name="" id="" />
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
                                    <div className="col-span-1 row-span-1 h-full min-h-[210px]">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                name="image"
                                                onChange={handleFileChange}
                                            />
                                            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg h-full min-h-[210px] flex flex-col items-center justify-center">
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
            }


        </div>
    );
};

export default Gallery;