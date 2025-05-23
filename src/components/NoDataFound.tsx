import Image from "next/image";

const NoDataFound = () => {
    return (
        <div className="text-center">
            <Image className="inline-block w-60" src="https://www.eduplusnow.com/assets/social-img/No-Data-Found-Image.png" alt="no-data-found" />
        </div>
    );
};

export default NoDataFound;
