import Button from '@mui/material/Button';

export default function GenomicCard({ image, title, link }) {
    return (
        <div className="flex flex-col items-center gap-y-4 bg-[#384559] rounded-xl shadow-lg">
            {image}
            <div className="w-full flex justify-around items-center pb-2">
                <h2 className="text-xl 2xl:text-2xl font-bold text-gray-200">{title}</h2>
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-fit text-lg 2xl:text-xl" sx={{
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