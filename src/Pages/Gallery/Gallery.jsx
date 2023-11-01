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

    // image upload handler with functionality 
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
    const handleSelectedImage = (e, id) => {
        const filterData = galleryData?.find((item) => item?._id == id);
        const updatedData = {
            ...filterData,
            isChecked: e.target.checked,
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

    return (
        <div className="shadow-md">
            <div className="p-5 border-b flex justify-between">
                <div>
                    {
                        selectedImage.length <= 0 ? <h3 className="text-xl font-bold">Gallery</h3> : <h3 className="text-xl font-bold">{selectedImage.length} Files Selected</h3>
                    }
                </div>
                <div className='text-red-500'>
                    {
                        selectedImage.length === 1 ? (
                            <button className="text-xl font-bold">Delete File</button>
                        ) : (
                            selectedImage.length > 0 ? (
                                <button className="text-xl font-bold">Delete Files</button>
                            ) : (
                                ""
                            )
                        )

                    }
                </div>
            </div>
            {
                imageLoading ? <ImageLoadingCompo /> : <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {galleryData?.map((image, index) => (
                        <div
                            key={image._id}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            draggable
                            className={`group border-2 rounded-xl overflow-hidden relative transition duration-200 transform ${index === 0 && 'col-span-2 row-span-2'}`}
                        >
                            <img src={image?.thumb} className="w-full h-full" alt="Gallery Image" />
                            <div className={`${image?.isChecked ? '' : 'hidden'} group-hover:block bg-black rounded-xl bg-opacity-50 opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out`}>
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleSelectedImage(e, image?._id)}
                                    defaultChecked={image?.isChecked} className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' />
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
