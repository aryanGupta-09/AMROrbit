import CircleIcon from '@mui/icons-material/Circle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useState, useRef, useEffect } from 'react';
import colors from '@/public/colors.json';

export default function Legend({ data, onHover, onClick }) {
    const [hasScrolled, setHasScrolled] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const legendRef = useRef(null);
    const topArrowRef = useRef(null);
    const bottomArrowRef = useRef(null);

    useEffect(() => {
        const legend = legendRef.current;
        if (legend) {
            setHasOverflow(legend.scrollHeight > legend.clientHeight);
        }
    }, [data]);

    const handleMouseEnter = (entry, index) => {
        // Find the corresponding data point's position
        const pointElement = document.querySelector(`.cell-${index}`);

        if (pointElement) {
            const cx = pointElement.getAttribute('cx');
            const cy = pointElement.getAttribute('cy');

            const x_pos = parseFloat(cx) + window.scrollX;
            const y_pos = parseFloat(cy) + window.scrollY;

            // Pass this position to onHover
            onHover({ ...entry, x_pos, y_pos });
        }
    };

    return (
        <div
            className="bg-[#f1f2f7] rounded-xl shadow-lg px-2 overflow-y-auto scrollbar-hide 2xl:text-lg 3xl:text-xl"
            ref={legendRef}
            onScroll={(e) => {
                const legend = e.target;
                const topArrow = topArrowRef.current;
                const bottomArrow = bottomArrowRef.current;
                if (legend.scrollTop === 0) {
                    topArrow.style.display = 'none';
                } else {
                    topArrow.style.display = 'flex';
                    setHasScrolled(true);
                }
                if (bottomArrow) {
                    if (legend.scrollHeight - legend.scrollTop <= legend.clientHeight + 1) {
                        bottomArrow.style.display = 'none';
                    } else {
                        bottomArrow.style.display = 'flex';
                    }
                }
            }}
        >
            <div
                className="flex justify-center items-center sticky top-0 left-0 w-full bg-[#f1f2f7]"
                ref={topArrowRef}
                onMouseEnter={() => {
                    const legend = legendRef.current;
                    if (legend) {
                        window.scrollInterval = requestAnimationFrame(function scroll() {
                            legend.scrollTop -= 3.5; // Increase the scrollTop value for faster scrolling
                            window.scrollInterval = requestAnimationFrame(scroll);
                        });
                    }
                }}
                onMouseLeave={() => {
                    cancelAnimationFrame(window.scrollInterval);
                }}
            >
                {hasScrolled && <ArrowDropUpIcon sx={{ marginY: -0.8 }} />}
            </div>

            {data.map((entry, index) => (
                <div
                    key={index}
                    className="flex items-start gap-x-2 mt-2 cursor-pointer" // Add cursor-pointer class
                    onMouseEnter={() => handleMouseEnter(entry, index)}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => onClick(entry.label)} // Add onClick handler
                >
                    <CircleIcon className="pt-1" fontSize="small" style={{ color: colors[index % colors.length] }} />
                    <p style={{ color: colors[index % colors.length] }}>{entry.label}</p>
                </div>
            ))}

            {hasOverflow && (
                <div
                    className="flex justify-center items-center sticky bottom-0 left-0 w-full bg-[#f1f2f7]"
                    ref={bottomArrowRef}
                    onMouseEnter={() => {
                        const legend = legendRef.current;
                        if (legend) {
                            window.scrollInterval = requestAnimationFrame(function scroll() {
                                legend.scrollTop += 3.5; // Increase the scrollTop value for faster scrolling
                                window.scrollInterval = requestAnimationFrame(scroll);
                            });
                        }
                    }}
                    onMouseLeave={() => {
                        cancelAnimationFrame(window.scrollInterval);
                    }}
                >
                    <ArrowDropDownIcon sx={{ marginY: -0.8 }} />
                </div>
            )}
        </div>
    );
}