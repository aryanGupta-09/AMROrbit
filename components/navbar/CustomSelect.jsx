import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useState, useEffect, useRef } from 'react';

export default function CustomSelect({ placeholder, icon, handleChange, action, items }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasScrolled(false);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        handleChange(item, action);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            const dropdown = dropdownRef.current;
            if (dropdown) {
                requestAnimationFrame(() => {
                    dropdown.classList.add('show');
                });
            }
        } else {
            const dropdown = dropdownRef.current;
            if (dropdown) {
                requestAnimationFrame(() => {
                    dropdown.classList.remove('show');
                });
            }
        }
    }, [isOpen]);

    return (
        <div className="relative" style={{ flex: 0.22 }}>
            <div className="flex flex-col cursor-pointer shadow-lg rounded-t-sm rounded-b-md" onClick={toggleDropdown}>
                <div className="bg-[#4F55C3] flex items-center justify-between py-1 rounded-t-sm">
                    <div className="pl-6 text-white text-lg">{selectedItem ? selectedItem : placeholder}</div>
                    <div className="pr-3">{icon}</div>
                </div>
                <div className={`flex justify-center items-center rounded-b-md ${isOpen ? 'transition-bg bg-[#C3C8F5]' : 'bg-[#757BD4]'}`}>
                    <ArrowDropDownIcon className="text-white" sx={{ marginY: -0.9 }} />
                </div>
            </div>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`dropdown-menu shadow-lg text-white bg-[#757BD4] rounded-b-md absolute w-full z-10 overflow-y-auto scrollbar-hide fade-in-out`}
                    style={{ maxHeight: '12rem', marginTop: -9 }}
                    onScroll={(e) => {
                        const dropdown = e.target;
                        const topArrow = document.querySelector('.scroll-arrow-top');
                        const bottomArrow = document.querySelector('.scroll-arrow-bottom');
                        if (dropdown.scrollTop === 0) {
                            topArrow.style.display = 'none';
                        } else {
                            topArrow.style.display = 'flex';
                            setHasScrolled(true);
                        }
                        if (dropdown.scrollHeight - dropdown.scrollTop <= dropdown.clientHeight + 1) {
                            bottomArrow.style.display = 'none';
                        } else {
                            bottomArrow.style.display = 'flex';
                        }
                    }}
                >
                    {items.length * 2.5 > 12 && (
                        <div
                            className="scroll-arrow-top flex justify-center items-center sticky top-0 left-0 w-full bg-[#757BD4]"
                            onMouseEnter={() => {
                                const dropdown = document.querySelector('.dropdown-menu');
                                if (dropdown) {
                                    window.scrollInterval = requestAnimationFrame(function scroll() {
                                        dropdown.scrollTop -= 3.5; // Increase the scrollTop value for faster scrolling
                                        window.scrollInterval = requestAnimationFrame(scroll);
                                    });
                                }
                            }}
                            onMouseLeave={() => {
                                cancelAnimationFrame(window.scrollInterval);
                            }}
                        >
                            {hasScrolled && <ArrowDropUpIcon sx={{ color: "white", marginY: -0.9 }} />}
                        </div>
                    )}
                    {items.map((item, index) => (
                        <div
                            key={item}
                            className={`px-4 hover:bg-[#4F55C3] ${index === items.length - 1 ? 'rounded-b-md' : ''}`}
                            style={{ paddingTop: '0.15rem', paddingBottom: '0.4rem' }}
                            onClick={() => handleItemClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                    {items.length * 2.5 > 12 && (
                        <div
                            className="scroll-arrow-bottom flex justify-center items-center sticky bottom-0 left-0 w-full bg-[#757BD4]"
                            onMouseEnter={() => {
                                const dropdown = document.querySelector('.dropdown-menu');
                                if (dropdown) {
                                    window.scrollInterval = requestAnimationFrame(function scroll() {
                                        dropdown.scrollTop += 3.5; // Increase the scrollTop value for faster scrolling
                                        window.scrollInterval = requestAnimationFrame(scroll);
                                    });
                                }
                            }}
                            onMouseLeave={() => {
                                cancelAnimationFrame(window.scrollInterval);
                            }}
                        >
                            <ArrowDropDownIcon sx={{ color: "white", marginY: -0.9 }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}