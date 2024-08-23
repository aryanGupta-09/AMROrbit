"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import tavLabLogo from '@/public/images/tavlab.svg';
import { Drawer, Divider, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Navbar() {
    const links = {
        'Home': '/',
        'Scorecards': '/scorecards',
        'Surrogate Indicators': '/surrogate-indicators',
        'Genomic Models': '/genomic-models'
    };
    const [hoveredLink, setHoveredLink] = useState(null);

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <div className="lg:hidden bg-[#191D23] sticky top-0 z-50 text-white flex justify-between items-center py-2">
                <Link href="/">
                    <h1 className="text-xl lg:text-2xl 3xl:text-4xl 4xl:text-5xl pl-8">AMROrbit</h1>
                </Link>
                <IconButton onClick={toggleDrawer(true)} className="pr-6">
                    <MenuIcon fontSize='large' style={{ color: "white" }} />
                </IconButton>
                <Drawer
                    anchor='right'
                    open={open}
                    onClose={toggleDrawer(false)}
                    PaperProps={{
                        style: {
                            backgroundColor: '#2A2F36',
                            color: 'white',
                        },
                    }}
                >
                    <div className="flex justify-start">
                        <IconButton onClick={toggleDrawer(false)}>
                            <ChevronLeftIcon style={{ color: "white" }} />
                        </IconButton>
                    </div>
                    <Divider className='bg-gray-200' />
                    <List>
                        {Object.entries(links).map(([linkName, linkHref]) => (
                            <ListItem key={linkName} disablePadding>
                                <ListItemButton component={Link} to={linkHref} onClick={toggleDrawer(false)}>
                                    <ListItemText primary={linkName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </div>
            <div className="hidden lg:flex bg-[#191D23] sticky top-0 z-50 text-white justify-between items-center py-2 3xl:py-4">
                <Link href="/">
                    <h1 className="text-2xl 3xl:text-4xl 4xl:text-5xl pl-8">AMROrbit</h1>
                </Link>
                <div className="flex flex-row gap-x-8 2xl:gap-x-12 items-center pr-5">
                    {Object.entries(links).map(([linkName, linkHref]) => (
                        <Link href={linkHref} key={linkName}>
                            <h2
                                className="text-lg 3xl:text-3xl 4xl:text-4xl relative"
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
                            className="h-[55px] 3xl:h-16 4xl:h-24 w-auto bg-white"
                        />
                    </a>
                </div>
            </div>
        </>
    );
}