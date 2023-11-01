import { useEffect } from "react";
import { useState } from "react";

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
            <div className="p-5">
                {
                    finalGalleryData?.map((item, index) => {
                        return <h1 key={item?.id}>{item?.id}</h1>
                    })
                }
            </div>
        </div>
    );
};

export default Gallery;