import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiImage } from 'react-icons/bi';
import ImageLoadingCompo from '../../Components/ImageLoadingCompo/ImageLoadingCompo';
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'

const SortableGallery = ({ image, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition, } = useSortable({ id: image._id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    }

    return <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        {...image}
        style={style}
        className={`group border-2 rounded-xl overflow-hidden relative transition duration-200 transform ${index === 0 && 'col-span-2 row-span-2'}`}
    >
        <img src={image?.thumb} className="w-full h-full" alt="Gallery Image" />
        <div className={`${image?.isChecked ? '!bg-opacity-20' : 'hidden'} group-hover:block bg-black rounded-xl  bg-opacity-70 opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out`}>
            <input
                type="checkbox"
                // onChange={(event) => handleSelectedImage(event, image?._id)}
                checked={image?.isChecked} className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' />
        </div>
    </div>
}

const Gallery2 = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [control, setControl] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageUploadLoading, setImageUploadLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState([])

    // get image data from api 
    const fetchGalleryData = () => {
        axios.get('https://image-gallery-server.vercel.app/get-gallery-images')
            .then(response => {
                const checkedImages = response.data.filter(data => data?.isChecked === true);
                setSelectedImage(checkedImages);
                setGalleryData(response.data);
                setImageLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    };
    useEffect(() => {
        fetchGalleryData();
    }, [control]);

    const onDragEnd = (event) => {
        const { active, over } = event;
        if (active.id === over.id) {
            return;
        }

        setGalleryData((galleryData) => {
            const oldIndex = galleryData.findIndex((image) => image._id === active.id);
            const newIndex = galleryData.findIndex((image) => image._id === over.id);
            return arrayMove(galleryData, oldIndex, newIndex);
        });
    };

    return (
        <div className="shadow-md">
            <div className="p-5 border-b flex justify-between">
                <div className='flex items-center gap-2'>
                    <div className='flex items-center h-5'>
                        {selectedImage.length > 0 && (
                            <input
                                title={`${selectedImage.length > 1 ? 'Unselect Files' : 'Unselect File'}`}
                                type="checkbox"
                                className='remove-all w-5 h-5 rounded-md'
                                // onChange={handleUnselectAllImages}
                                defaultChecked={selectedImage.length > 0}
                            />
                        )}
                    </div>

                    {
                        selectedImage.length <= 0 ? <h3 className="text-xl font-bold">Gallery</h3> :
                            selectedImage.length === 1 ?
                                <h3 className="text-xl font-bold">{selectedImage.length} File Selected</h3> :
                                <h3 className="text-xl font-bold">{selectedImage.length} Files Selected</h3>
                    }
                </div>

                <button
                    // onClick={deleteSelectedImages}
                    title={`${selectedImage.length > 1 ? 'Delete Files' : 'Delete File'}`}
                    className='delete-image text-red-500 text-xl font-bold'
                >
                    {
                        selectedImage.length === 1 ? "Delete File" : selectedImage.length > 0 ? "Delete Files" : ""
                    }
                </button>
            </div>
            {
                imageLoading ? <ImageLoadingCompo /> : <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                        <SortableContext items={galleryData} strategy={rectSortingStrategy}>
                            {galleryData?.map((image, index) => (
                                <SortableGallery key={image._id} image={image} index={index} />
                            ))}
                        </SortableContext>
                    </DndContext>
                    {/* image upload start */}
                    <div className="col-span-1 row-span-1 h-full min-h-[210px]">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                name="image"
                            // onChange={handleFileChange}
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
            }
        </div>
    );
};

export default Gallery2;