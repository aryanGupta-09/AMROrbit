"use client";
import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Scatter, Cell, Label, ResponsiveContainer } from 'recharts';
import years from '@/public/scorecards/Blood/Imipenem_Klebsiella pneumoniae/years.json';
import colors from '@/public/colors.json'
import { motion } from 'framer-motion';

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Landing() {
    const sortedYears = years
        .map(file => Number(file.year)) // Extract and convert year to number
        .sort((a, b) => a - b); // Sort the years in ascending order

    const [selectedYear, setSelectedYear] = useState(sortedYears[0]);

    const isMd = useMediaQuery('(min-width: 768px)');
    const is2xl = useMediaQuery('(min-width: 1536px)');
    const is3xl = useMediaQuery('(min-width: 1920px)');

    const getStrokeWidth = () => {
        if (is3xl) return 12; // Stroke width for 3xl screens
        if (is2xl) return 8;  // Stroke width for 2xl screens
        return 2;            // Default stroke width
    };

    const currentIndexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedYear(sortedYears[currentIndexRef.current]);
            currentIndexRef.current = (currentIndexRef.current + 1) % sortedYears.length;
        }, 500);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [sortedYears]);

    const { maxX, maxY, minX, minY } = years.reduce((acc, year) => {
        year.countries.forEach(country => {
            const x = Math.max(0, country.x); // Ensure x is never negative
            acc.maxX = Math.max(acc.maxX, x);
            acc.maxY = Math.max(acc.maxY, country.y);
            acc.minX = Math.min(acc.minX, x);
            acc.minY = Math.min(acc.minY, country.y);
        });
        return acc;
    }, { maxX: -Infinity, maxY: -Infinity, minX: Infinity, minY: Infinity });

    const year = years.find(year => Number(year.year) === selectedYear);
    if (!year) return null;

    const data = year.countries.map(country => (
        {
            x: Math.max(0, parseFloat(country.x.toFixed(2))),
            y: parseFloat(country.y.toFixed(2)),
            label: country.name
        }
    ));

    return (
        <div className="flex flex-col gap-y-5 2xl:gap-y-6 3xl:gap-y-7 justify-center items-center my-6 mb-14 mx-auto w-10/12">
            <h1 className="text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold text-gray-100 text-center">Our World in <span className="text-[#BAC0DF]">AMR</span></h1>
            <ResponsiveContainer className="bg-[#f1f2f7] rounded-xl shadow-lg" width="100%" height={is3xl ? 800 : is2xl ? 600 : isMd ? 500 : 350}>
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 30,
                        bottom: 25,
                        left: 10,
                    }}
                >
                    <CartesianGrid />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Intercept"
                        domain={[Math.max(0, Math.round(minX)), Math.round(maxX) + 1]}
                        allowDecimals={false}
                        tickFormatter={(tick) => Math.round(tick)}
                    >
                        <Label value="Intercept" offset={-5} position="bottom" />
                    </XAxis>
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Slope"
                        domain={[Math.round(minY), Math.round(maxY) + 1]}
                        allowDecimals={false}
                        tickFormatter={(tick) => Math.round(tick)}
                    >
                        <Label value="Slope" offset={-17} angle={-90} position="left" />
                    </YAxis>
                    <ReferenceLine
                        x={parseFloat(year.median_intercept.toFixed(2))}
                        stroke="green"
                        strokeDasharray="7 7"
                        strokeWidth={1.5}
                        ifOverflow="extendDomain"
                    />
                    <ReferenceLine
                        y={parseFloat(year.median_slope.toFixed(2))}
                        stroke="red"
                        strokeDasharray="7 7"
                        strokeWidth={1.5}
                        ifOverflow="extendDomain"
                    />
                    <Scatter data={data} fill="#8884d8">
                        {data.map((entry, index) => {
                            const modifiedEntry = { ...entry, x: entry.x < 0 ? 0 : entry.x };
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                    className={`cell-${index}`}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={getStrokeWidth()}
                                    opacity={modifiedEntry.label === "Thailand" ? 1 : 0.3}
                                />
                            );
                        })}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={textVariants}
            >
                <p className="text-gray-300 text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl text-center">
                    &quot;AMROrbit Scorecard is an actionable tool that can be used by governments to monitor the effectiveness
                    of surveillance and stewardship efforts in countries to contain AMR.&quot;
                </p>
            </motion.div>
        </div>
    );
}