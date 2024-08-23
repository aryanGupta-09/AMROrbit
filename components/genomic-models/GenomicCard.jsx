import Button from '@mui/material/Button';

export default function GenomicCard({ image, title, link }) {
    return (
        <div className="flex flex-col items-center gap-y-4 bg-[#384559] rounded-xl shadow-lg">
            {image}
            <div className="w-full flex justify-around items-center pb-2">
                <h2 className="text-base lg:text-lg 2xl:text-xl 3xl:text-3xl font-bold text-gray-200">{title}</h2>
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-fit text-sm lg:text-base 2xl:text-lg 3xl:text-2xl" sx={{
                        color: "white",
                        textTransform: "none",
                        backgroundColor: "#4F6077",
                        '&:hover': {
                            backgroundColor: "#2A2F36",
                        },
                    }}>View</Button>
                </a>
            </div>
        </div>
    );
}