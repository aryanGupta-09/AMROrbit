import Image from 'next/image';
import contVis from '@/public/images/contVis.svg';
import { Button } from '@mui/material';

export default function VisualizationBox({ heading, text, handleClick }) {
    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ top: "62%" }}>
            <div className="flex flex-col gap-y-4 items-center justify-center">
                <div>
                    <Image
                        src={contVis}
                        alt={heading}
                        className="h-48 md:h-56 2xl:h-64 3xl:h-72 w-auto"
                    />
                </div>
                <div className="flex flex-col gap-y-3 text-center md:w-2/3 mt-3">
                    <Button
                        className="w-fit mx-auto text-base md:text-lg 2xl:text-2xl 3xl:text-3xl mb-3"
                        sx={{
                            color: "white",
                            backgroundColor: "#4F6077",
                            textTransform: "none",
                        }}
                        onClick={handleClick}
                    >
                        {heading}
                    </Button>
                    <p className="font-medium leading-9 text-[#E9E9E9] text-base md:text-lg 2xl:text-2xl 3xl:text-3xl">{text}</p>
                </div>
            </div>
        </div>
    );
}