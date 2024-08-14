import Image from 'next/image';
import startVis from '@/public/images/startVis.svg';
import { motion } from 'framer-motion';

export default function VisualizationBox({ heading, text }) {
    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ top: "62%" }}>
            <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="flex flex-col gap-y-4 items-center justify-center">
                    <div>
                        <Image
                            src={startVis}
                            alt={heading}
                            className="h-56 w-auto"
                        />
                    </div>
                    <div className="flex flex-col gap-y-3 text-center w-2/3">
                        <h1 className="text-3xl font-semibold text-[#6369C1]">{heading}</h1>
                        <p className="text-lg font-medium leading-9 text-[#757BD3]">{text}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}