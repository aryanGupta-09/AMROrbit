import { useSelector } from "react-redux";
import { scorecardOptionsSelector } from "@/redux/reducers/scorecardOptionsReducer";
import { useEffect, useState, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, ReferenceLine } from 'recharts';
import Legend from "./Legend";
import VisualizationBox from "../../common/VisualizationBox";

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import colors from '@/public/colors.json';

import { useDispatch } from 'react-redux';
import { actions } from '@/redux/reducers/scorecardOptionsReducer';

import ReactDOM from 'react-dom';

import { Tabs, Tab, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Plots() {
    const dispatch = useDispatch();

    const [hoveredEntry, setHoveredEntry] = useState(null);

    const handleCountryClick = (newValue) => {
        setHoveredEntry(null);
        dispatch(actions.setCountry(newValue));
    };

    const handleContinueClick = () => {
        dispatch(actions.setCountry("All"));
    };

    const options = useSelector(scorecardOptionsSelector);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 500, stopOnMouseEnter: false, stopOnInteraction: false, jump: true })]);

    const [refTip, setRefTip] = useState({ x: 0, y: 0, text: '', visible: false, color: '' });

    const [files, setFiles] = useState({ years: [], countries: [] });
    const [firstRender, setFirstRender] = useState(true);

    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [isYearSet, setIsYearSet] = useState(false);

    const handleYearChange = (event, newValue) => {
        setIsYearSet(true);
        setSelectedYear(newValue);
    };

    const is2xl = useMediaQuery('(min-width: 2560px)');
    const is3xl = useMediaQuery('(min-width: 3200px)');

    const getStrokeWidth = () => {
        if (is3xl) return 14; // Stroke width for 3xl screens
        if (is2xl) return 12;  // Stroke width for 2xl screens
        return 2;            // Default stroke width
    };

    useEffect(() => {
        const sortedYears = files.years
            .map(file => Number(file.year)) // Extract and convert year to number
            .sort((a, b) => a - b); // Sort the years in ascending order
        setYears(sortedYears);
    }, [files]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const { antibiotic, organism, sampleType } = options;
                const basePath = `/api/searchScorecards?antibiotic=${antibiotic}&organism=${organism}&sampleType=${sampleType}`;

                const fetchJson = async () => {
                    const response = await fetch(basePath);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return await response.json();
                    } else {
                        throw new Error("Response is not JSON");
                    }
                };

                const { years, countries } = await fetchJson();
                setFiles({ years, countries });
                setFirstRender(false);
                setIsYearSet(false);
            } catch (error) {
                setFiles({ years: [], countries: [] });
            }
        };

        fetchFiles();
    }, [options]);

    useEffect(() => {
        if (!isYearSet) { // Only start the loop if it's not manually changed
            let currentIndex = 0;
            const interval = setInterval(() => {
                setSelectedYear(years[currentIndex]);
                currentIndex = (currentIndex + 1) % years.length;
            }, 500);

            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [isYearSet, years]);

    if (!firstRender && (files.years && files.years.length === 0) && (files.countries && files.countries.length === 0)) {
        return <VisualizationBox heading='Continue Visualization' text='Sorry, no data is available for this drug-bug combination in this country.' handleClick={handleContinueClick} />;
    }

    const CustomTooltip = ({ active, payload, label, data, selectedIndex }) => {
        if (active && payload && payload.length) {
            const { x, y, label: dataLabel } = payload[0].payload;
            const index = (selectedIndex === undefined ? data.findIndex(item => item.label === dataLabel) : selectedIndex);
            const color = colors[index % colors.length];
            return (
                <div className="bg-white bg-opacity-70 border p-1 z-20">
                    {selectedIndex === undefined && <p style={{ color }}>{dataLabel}</p>}
                    <p className="text-sm">{`Intercept: ${x}`}</p>
                    <p className="text-sm">{`Slope: ${y}`}</p>
                </div>
            );
        }
        return null;
    };

    const handleShowRefTip = (e, text, color) => {
        setRefTip({ visible: true, x: e.clientX + window.scrollX, y: e.clientY + window.scrollY, text, color });
    };

    const handleHideRefTip = () => {
        setRefTip({ visible: false, x: 0, y: 0, text: '' });
    };

    const RefTipComponent = () => (
        refTip.visible && (
            <div
                className="absolute bg-white bg-opacity-70 p-1 z-20 text-sm"
                style={{
                    left: refTip.x + 10,
                    top: refTip.y + 10,
                    color: refTip.color,
                }}
            >
                {refTip.text}
            </div>
        )
    );

    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
                '2xl': 2560, // Custom breakpoint
                '3xl': 3200, // Custom breakpoint
            },
        },
        palette: {
            primary: {
                main: '#ffffff',
            },
        },
    });

    return (
        (options.country === null || options.country === "All") ? (() => {
            const { maxX, maxY, minX, minY } = files.years.reduce((acc, year) => {
                year.countries.forEach(country => {
                    const x = Math.max(0, country.x); // Ensure x is never negative
                    acc.maxX = Math.max(acc.maxX, x);
                    acc.maxY = Math.max(acc.maxY, country.y);
                    acc.minX = Math.min(acc.minX, x);
                    acc.minY = Math.min(acc.minY, country.y);
                });
                return acc;
            }, { maxX: -Infinity, maxY: -Infinity, minX: Infinity, minY: Infinity });

            return (
                <div>
                    <ThemeProvider theme={theme}>
                        <div className="flex justify-center overflow-auto mb-4">
                            <Tabs
                                value={selectedYear}
                                onChange={handleYearChange}
                                centered={false} // Disable centered to allow flexbox centering
                                variant="scrollable"
                                scrollButtons="false"
                                sx={{
                                    overflow: 'auto',
                                }}
                            >
                                {years.map((year) => (
                                    <Tab
                                        key={year}
                                        label={year}
                                        value={year}
                                        sx={{
                                            fontSize: {
                                                xs: '1rem', // Default font size
                                                md: '1.2rem', // Font size for medium screens and up
                                                xl: '1.4rem', // Font size for extra-large screens and up
                                                '2xl': '1.7rem',
                                                '3xl': '2rem',
                                            },
                                            color: 'white',
                                            '&.Mui-selected': {
                                                color: 'white',
                                            },
                                            mr: {
                                                xs: '-0.5rem',
                                                xl: '1rem',
                                                '2xl': '2rem',
                                                '3xl': '4rem',
                                            },
                                        }}
                                    />
                                ))}
                            </Tabs>
                        </div>
                    </ThemeProvider>
                    <div className="flex flex-wrap justify-around gap-y-7">
                        {
                            (() => {
                                const year = files.years.find(year => Number(year.year) === selectedYear);
                                if (!year) return null;

                                const data = year.countries.map(country => (
                                    {
                                        x: Math.max(0, parseFloat(country.x.toFixed(2))),
                                        y: parseFloat(country.y.toFixed(2)),
                                        label: country.name
                                    }
                                ));

                                return (
                                    <div style={{ width: "90%", height: "70vh" }} className="flex flex-row gap-3">
                                        <div className="bg-[#f1f2f7] rounded-xl shadow-lg flex-grow" style={{ height: "70vh" }}>
                                            {ReactDOM.createPortal(<RefTipComponent />, document.body)}
                                            <ResponsiveContainer width="100%" height="100%">
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
                                                    {isYearSet && <Tooltip content={<CustomTooltip data={data} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />}
                                                    <ReferenceLine
                                                        x={parseFloat(year.median_intercept.toFixed(2))}
                                                        stroke="green"
                                                        strokeDasharray="7 7"
                                                        strokeWidth={1.5}
                                                        ifOverflow="extendDomain"
                                                    />
                                                    {isYearSet &&
                                                        <ReferenceLine
                                                            x={parseFloat(year.median_intercept.toFixed(2))}
                                                            stroke="transparent"
                                                            strokeWidth={10}
                                                            strokeOpacity={0}
                                                            ifOverflow="extendDomain"
                                                            onMouseEnter={(e) => handleShowRefTip(e, `Median Intercept: ${year.median_intercept.toFixed(2)}`, 'green')}
                                                            onMouseLeave={handleHideRefTip}
                                                        />
                                                    }
                                                    <ReferenceLine
                                                        y={parseFloat(year.median_slope.toFixed(2))}
                                                        stroke="red"
                                                        strokeDasharray="7 7"
                                                        strokeWidth={1.5}
                                                        ifOverflow="extendDomain"
                                                    />
                                                    {isYearSet &&
                                                        <ReferenceLine
                                                            y={parseFloat(year.median_slope.toFixed(2))}
                                                            stroke="transparent"
                                                            strokeWidth={10}
                                                            strokeOpacity={0}
                                                            ifOverflow="extendDomain"
                                                            onMouseEnter={(e) => handleShowRefTip(e, `Median Slope: ${year.median_slope.toFixed(2)}`, 'red')}
                                                            onMouseLeave={handleHideRefTip}
                                                        />
                                                    }
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
                                                                    style={{ opacity: hoveredEntry && hoveredEntry.label !== modifiedEntry.label ? 0.2 : 1 }}
                                                                    onClick={() => handleCountryClick(modifiedEntry.label)}
                                                                />
                                                            );
                                                        })}
                                                    </Scatter>
                                                </ScatterChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ width: "15%" }} className="flex flex-col gap-y-3 text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">
                                            <div className="bg-[#f1f2f7] rounded-xl shadow-lg py-1 pl-[0.1rem] sm:p-2">
                                                <div className="flex pt-1" style={{ color: 'green' }}>
                                                    --&nbsp;Median Intercept
                                                </div>
                                                <div className="flex pt-1" style={{ color: 'red' }}>
                                                    --&nbsp;Median Slope
                                                </div>
                                            </div>
                                            <Legend data={data} onHover={setHoveredEntry} onClick={handleCountryClick} />
                                        </div>
                                    </div>
                                );
                            })()
                        }
                    </div>
                </div>
            );
        }
        )() : (
            () => {
                const selectedCountryIndex = files.countries.findIndex(country => country.name === options.country);
                const selectedCountry = files.countries[selectedCountryIndex];
                if (!selectedCountry) return <VisualizationBox heading='Continue Visualization' text='Sorry, no data is available for this drug-bug combination in this country.' handleClick={handleContinueClick} />;

                const { minX, maxX, minY, maxY } = selectedCountry.years.reduce(
                    (acc, year) => {
                        const x = Math.max(0, year.x); // Ensure x is never negative
                        acc.minX = Math.min(acc.minX, x);
                        acc.maxX = Math.max(acc.maxX, x);
                        acc.minY = Math.min(acc.minY, year.y);
                        acc.maxY = Math.max(acc.maxY, year.y);
                        return acc;
                    },
                    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
                );

                return (
                    <div style={{ width: "90%" }} className="flex flex-row justify-around gap-x-3 mx-auto mt-7">
                        <section style={{ height: "70vh" }} className="embla flex-grow">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {selectedCountry.years
                                        .sort((a, b) => a.year - b.year)
                                        .map((year, index) => {
                                            const data = {
                                                x: Math.max(0, parseFloat(year.x.toFixed(2))),
                                                y: parseFloat(year.y.toFixed(2)),
                                            };
                                            return (
                                                <div style={{ height: "70vh" }} className="embla__slide bg-[#f1f2f7] rounded-xl shadow-lg flex justify-center items-center relative" key={index}>
                                                    <div className={`absolute top-3 right-3 z-10 p-2 rounded-lg text-white text-lg 2xl:text-xl 3xl:text-2xl`} style={{ backgroundColor: colors[selectedCountryIndex % colors.length] }}>
                                                        &nbsp;&nbsp;{selectedCountry.name}&nbsp;&nbsp;
                                                    </div>
                                                    {ReactDOM.createPortal(<RefTipComponent />, document.body)}
                                                    <ResponsiveContainer width="100%" height="100%">
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
                                                            <Tooltip content={<CustomTooltip data={data} selectedIndex={selectedCountryIndex} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />
                                                            <ReferenceLine
                                                                x={parseFloat(year.median_intercept.toFixed(2))}
                                                                stroke="green"
                                                                strokeDasharray="7 7"
                                                                strokeWidth={1.5}
                                                                ifOverflow="extendDomain"
                                                            />
                                                            <ReferenceLine
                                                                x={parseFloat(year.median_intercept.toFixed(2))}
                                                                stroke="transparent"
                                                                strokeWidth={10}
                                                                strokeOpacity={0}
                                                                ifOverflow="extendDomain"
                                                                onMouseEnter={(e) => handleShowRefTip(e, `Median Intercept: ${year.median_intercept.toFixed(2)}`, 'green')}
                                                                onMouseLeave={handleHideRefTip}
                                                            />
                                                            <ReferenceLine
                                                                y={parseFloat(year.median_slope.toFixed(2))}
                                                                stroke="red"
                                                                strokeDasharray="7 7"
                                                                strokeWidth={1.5}
                                                                ifOverflow="extendDomain"
                                                            />
                                                            <ReferenceLine
                                                                y={parseFloat(year.median_slope.toFixed(2))}
                                                                stroke="transparent"
                                                                strokeWidth={10}
                                                                strokeOpacity={0}
                                                                ifOverflow="extendDomain"
                                                                onMouseEnter={(e) => handleShowRefTip(e, `Median Slope: ${year.median_slope.toFixed(2)}`, 'red')}
                                                                onMouseLeave={handleHideRefTip}
                                                            />
                                                            <Scatter data={[data]} fill="#8884d8">
                                                                <Cell
                                                                    key={`cell-${selectedCountryIndex}`}
                                                                    fill={colors[selectedCountryIndex % colors.length]}
                                                                    stroke={colors[selectedCountryIndex % colors.length]}
                                                                    strokeWidth={getStrokeWidth()}
                                                                />
                                                            </Scatter>
                                                        </ScatterChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </section>
                        <div style={{ width: "15%", minWidth: "15%" }} className="flex flex-col gap-y-3 text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl">
                            <div className="bg-[#f1f2f7] rounded-xl shadow-lg p-2 h-fit py-1 pl-[0.1rem] sm:p-2">
                                <div className="flex pt-1" style={{ color: 'green' }}>
                                    --&nbsp;Median Intercept
                                </div>
                                <div className="flex pt-1" style={{ color: 'red' }}>
                                    --&nbsp;Median Slope
                                </div>
                            </div>
                            <div className="bg-[#4F6077] text-white text-center rounded-xl shadow-lg p-2 h-fit cursor-pointer text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl" onClick={() => handleCountryClick("All")}>Back to all <span className="hidden xs:inline">countries</span></div>
                        </div>
                    </div>
                );
            }
        )()
    );
}