import { LineWave } from 'react-loader-spinner';

const ImageLoadingCompo = () => {
    return (
        <div className='w-full flex justify-center items-center min-h-[50vh]'>
            <LineWave
                height="100"
                width="100"
                color=" #0000FF"
                ariaLabel="line-wave"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
            />
        </div>
    );
};

export default ImageLoadingCompo;