import { useEffect } from "react";
import { useState } from "react";
import ImageCard from "../../Components/ImageCard/ImageCard";

const Gallery = () => {
    const [finalGalleryData, setFinalGalleryData] = useState([])

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

    // console.log(finalGalleryData)

    return (
        <div className="shadow-md">
            <div className="p-5 border-b">
                <h3 className="text-xl font-bold">Gallery</h3>
            </div>
            <div className="p-5 grid grid-cols-5 gap-5">
                {finalGalleryData?.map((item, index) => {
                    // Check if it's the first image to apply different styling
                    if (index === 0) {
                        return <ImageCard key={item?.id} item={item} featured />;
                    } else {
                        return <ImageCard key={item?.id} item={item} />;
                    }
                })}
            </div>
        </div>
    );
};

export default Gallery;