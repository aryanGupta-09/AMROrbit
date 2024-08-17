"use client";
import Image from 'next/image';
import landingAnimation from '@/public/images/landingAnimation.gif';
import { motion } from 'framer-motion';

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Landing() {
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-row gap-x-6 items-center justify-center mx-auto mt-20" style={{ width: "70%" }}>
                <div className="flex-shrink-0">
                    <Image
                        src={landingAnimation}
                        alt="Landing Animation"
                        width={400}
                        height={400}
                        className='rounded-xl shadow-lg'
                    />
                </div>
                <div className="text-gray-400 text-xl flex flex-col items-start justify-center gap-y-7 flex-grow">
                    <div>
                        <h1 className="font-bold text-gray-100" style={{ fontSize: '40px' }}>Our World in AMR</h1>
                    </div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                    >
                        <p>
                            AMROrbit Scorecard is an actionable tool that can be used by governments to monitor the effectiveness
                            of surveillance and stewardship efforts in countries to contain AMR.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}