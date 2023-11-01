import React from 'react';

const ImageCard = ({ item, featured }) => {
    const { id, thumb } = item;

    return (
        <div className={`border-2 rounded-xl overflow-hidden ${featured && 'col-span-2 row-span-2'} relative transition duration-200 transform cursor-pointer`}>
            <img src={thumb} className="w-full h-full" alt="Gallery Image" />
            <div className="bg-black rounded-xl bg-opacity-75 opacity-0 hover:opacity-100 text-blue-100 font-medium p-2 absolute inset-0 transition duration-300 ease-in-out">
                <input type="checkbox" className='w-5 h-5 rounded-md absolute top-[7%] left-[7%]' name="" id="" />
            </div>
        </div>
    );
};

export default ImageCard;
