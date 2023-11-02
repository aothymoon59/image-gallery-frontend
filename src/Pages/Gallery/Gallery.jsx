import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiImage } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ImageLoadingCompo from '../../Components/ImageLoadingCompo/ImageLoadingCompo';

const Gallery = () => {
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

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        const sourceIndex = e.dataTransfer.getData('text/plain');
        const updatedGallery = [...galleryData];
        const [draggedItem] = updatedGallery.splice(sourceIndex, 1);
        updatedGallery.splice(targetIndex, 0, draggedItem);
        setGalleryData(updatedGallery);
    };

    // mobile device touch functionality
    const handleTouchStart = (index) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', index);
    };

    const handleTouchEnd = (targetIndex) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        const sourceIndex = event.dataTransfer.getData('text/plain');
        const updatedGallery = [...galleryData];
        const [draggedItem] = updatedGallery.splice(sourceIndex, 1);
        updatedGallery.splice(targetIndex, 0, draggedItem);
        setGalleryData(updatedGallery);
    };

    // image upload handler with functionality 
    const handleFileChange = (event) => {
        const image = event.target.files[0];
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
                        .post("https://image-gallery-server.vercel.app/upload-image", finalGalleryData)
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

    // select image handler with functionality 
    const handleSelectedImage = (event, id) => {
        const filteredData = galleryData?.find((item) => item?._id == id);
        const updatedData = {
            ...filteredData,
            isChecked: event.target.checked,
        };
        axios
            .patch(`https://image-gallery-server.vercel.app/update-selected-image/${id}`, updatedData)
            .then((res) => {
                if (res.data?.matchedCount) {
                    setControl(!control);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // unselect all images function
    const handleUnselectAllImages = () => {
        axios
            .patch(`https://image-gallery-server.vercel.app/unselect-all-images`)
            .then((res) => {
                if (res.data?.matchedCount) {
                    setControl(!control); // Triggers a re-render when unselect all
                    toast.success('All images unselected');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };



    return (
        <div className="shadow-md">
            <div className="p-5 border-b flex justify-between">
                <div className='flex items-center gap-2'>
                    <div className='flex items-center h-5'>
                        {selectedImage.length > 0 && (
                            <input
                                type="checkbox"
                                className='remove-all w-5 h-5 rounded-md'
                                onChange={handleUnselectAllImages} // Use onChange instead of onClick
                                defaultChecked={selectedImage.length > 0} // Conditionally set checkbox state
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

                <div className='text-red-500'>
                    {
                        selectedImage.length === 1 ? <button className="text-xl font-bold">Delete File</button> : selectedImage.length > 0 ? <button className="text-xl font-bold">Delete Files</button> : ""
                    }
                </div>
            </div>
            {
                imageLoading ? <ImageLoadingCompo /> : <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {galleryData?.map((image, index) => (
                        <div
                            key={image._id}
                            onDragStart={(event) => handleDragStart(event, index)}
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, index)}
                            draggable
                            onTouchStart={handleTouchStart(index)}
                            onTouchEnd={handleTouchEnd(index)}
                            className={`group border-2 rounded-xl overflow-hidden relative transition duration-200 transform ${index === 0 && 'col-span-2 row-span-2'}`}
                        >
                            <img src={image?.thumb} className="w-full h-full" alt="Gallery Image" />
                            <div className={`${image?.isChecked ? '!bg-opacity-20' : 'hidden'} group-hover:block bg-black rounded-xl  bg-opacity-70 opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out`}>
                                <input
                                    type="checkbox"
                                    onChange={(event) => handleSelectedImage(event, image?._id)}
                                    checked={image?.isChecked} className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' />
                            </div>
                        </div>
                    ))}

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
            }
        </div>

    );
};

export default Gallery;
