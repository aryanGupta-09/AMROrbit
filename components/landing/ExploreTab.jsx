import Link from 'next/link';
import Button from '@mui/material/Button';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function ExploreTab({ title, img, description, link }) {
    return (
        <div className="flex flex-row justify-center items-center mx-auto bg-[#384559] w-10/12 rounded-xl shadow-lg gap-x-4 2xl:gap-x-7">
            <div className="w-1/4 h-full">
                {img}
            </div>
            <div className="w-3/4 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-y-4">
                    <h1 className="text-xl 2xl:text-2xl 3xl:text-3xl text-white">{title}</h1>
                    <h2 className="2xl:text-lg 3xl:text-xl text-gray-300">{description}</h2>
                </div>
                <Link href={link}>
                    <Button className="w-fit 2xl:text-lg 3xl:text-xl mt-4 2xl:mt-7" sx={{
                        color: "white",
                        backgroundColor: "#4F6077",
                        '&:hover': {
                            backgroundColor: "#2A2F36",
                        },
                    }}>Explore&nbsp;<ArrowRightAltIcon /></Button>
                </Link>
            </div>
        </div>
    );
}