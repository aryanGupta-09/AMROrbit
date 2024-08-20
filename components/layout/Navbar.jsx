"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import tavLabLogo from '@/public/images/tavlab.svg';

export default function Navbar() {
    const links = {
        'Home': '/',
        'Scorecards': '/scorecards',
        'Surrogate Indicators': '/surrogate-indicators',
        'Genomic Models': '/genomic-models'
    };
    const [hoveredLink, setHoveredLink] = useState(null);

    return (
        <div className="bg-[#191D23] sticky top-0 z-50 text-white flex justify-between items-center py-2">
            <Link href="/">
                <h1 className="text-2xl 3xl:text-4xl pl-8">AMROrbit</h1>
            </Link>
            <div className="flex flex-row gap-x-8 2xl:gap-x-12 items-center pr-5">
                {Object.entries(links).map(([linkName, linkHref]) => (
                    <Link href={linkHref} key={linkName}>
                        <h2
                            className="text-lg 3xl:text-2xl relative"
                            onMouseEnter={() => setHoveredLink(linkName)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            {linkName}
                            <motion.div
                                className="absolute bottom-[-4px] left-0 w-full h-[1.5px] bg-white"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: hoveredLink === linkName ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ originX: 0 }}
                            />
                        </h2>
                    </Link>
                ))}
                <a href="https://tavlab.iiitd.edu.in/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src={tavLabLogo}
                        alt="TavLab logo"
                        className="h-[55px] 3xl:h-16 w-auto bg-white"
                    />
                </a>
            </div>
        </div>
    );
}