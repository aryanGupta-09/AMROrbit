import { useSelector } from "react-redux";
import { optionsSelector } from "@/redux/reducers/optionsReducer";
import { useEffect, useState, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, ReferenceLine, LabelList } from 'recharts';
import Legend from "./Legend";

import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

export default function Plots() {
    const options = useSelector(optionsSelector);

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 2000, stopOnMouseEnter: true, stopOnInteraction: false, jump: true })])

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop

        resetOrStop()
    }, []);

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    );

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onNavButtonClick);

    const [files, setFiles] = useState({ years: [], countries: [] });
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const { antibiotic, organism, sampleType } = options;
                const basePath = `/api/searchFiles?antibiotic=${antibiotic}&organism=${organism}&sampleType=${sampleType}`;

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
            } catch (error) {
                setFiles({ years: [], countries: [] });
            }
        };

        fetchFiles();
    }, [options]);

    if (files.years.length === 0 || files.countries.length === 0) {
        return <div>No data found...</div>;
    }

    const CustomTooltip = ({ active, payload, label, data, selectedIndex }) => {
        if (active && payload && payload.length) {
            const { x, y, label: dataLabel } = payload[0].payload;
            const index = (selectedIndex === undefined ? data.findIndex(item => item.label === dataLabel) : selectedIndex);
            const color = COLORS[index % COLORS.length];
            return (
                <div className="bg-white bg-opacity-50 border p-1">
                    {selectedIndex === undefined && <p style={{ color }}>{dataLabel}</p>}
                    <p className="text-sm">{`Log Intercept: ${x}`}</p>
                    <p className="text-sm">{`Log Slope: ${y}`}</p>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
    return (
        (options.country === null || options.country === "All") ? (
            <div className="flex flex-wrap justify-around gap-y-7">
                {files.years.map((year, index) => {
                    const data = year.countries.map(country => (
                        { x: country.x, y: country.y, label: country.name }
                    ));

                    return (
                        <div style={{ width: "90%", height: "500px" }} className="flex flex-row gap-3" key={index}>
                            <div className="bg-[#f1f2f7] rounded-xl shadow-lg flex-grow">
                                <div className="relative" style={{ height: "500px" }}>
                                    <div className="absolute top-3 right-3 z-10 p-2 bg-[#A2A2A2] rounded-lg text-white text-lg">
                                        &nbsp;&nbsp;{year.year}&nbsp;&nbsp;
                                    </div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                bottom: 20,
                                                left: 20,
                                            }}
                                        >
                                            <CartesianGrid />
                                            <XAxis type="number" dataKey="x" name="Log Intercept" domain={[0, dataMax => (Math.round(dataMax) + 1)]}>
                                                <Label value="Log Intercept" position="bottom" />
                                            </XAxis>
                                            <YAxis type="number" dataKey="y" name="Log Slope" domain={[0, dataMax => (Math.round(dataMax) + 1)]}>
                                                <Label value="Log Slope" offset={-15} angle={-90} position="left" />
                                            </YAxis>
                                            <Tooltip content={<CustomTooltip data={data} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />
                                            <ReferenceLine x={year.median_intercept} stroke="green" strokeDasharray="7 7" strokeWidth={1.5} />
                                            <ReferenceLine y={year.median_slope} stroke="red" strokeDasharray="7 7" strokeWidth={1.5} />
                                            <Scatter data={data} fill="#8884d8">
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div style={{ width: "15%" }} className="flex flex-col gap-y-3">
                                <div className="bg-[#f1f2f7] rounded-xl shadow-lg p-2">
                                    <div className="flex pt-1" style={{ color: 'green' }}>
                                        --&nbsp;Median Intercept
                                    </div>
                                    <div className="flex pt-1" style={{ color: 'red' }}>
                                        --&nbsp;Median Slope
                                    </div>
                                </div>
                                <Legend data={data} colors={COLORS} />
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            () => {
                const selectedCountryIndex = files.countries.findIndex(country => country.name === options.country);
                const selectedCountry = files.countries[selectedCountryIndex];
                if (!selectedCountry) return <div>No data found...</div>;

                return (
                    <div style={{ width: "90%" }} className="flex flex-row justify-around gap-x-3 mx-auto">
                        <section style={{ height: "500px" }} className="embla flex-grow">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {selectedCountry.years.map((year, index) => {
                                        const data = { x: year.x, y: year.y, label: year.year };
                                        return (
                                            <div className="embla__slide bg-[#f1f2f7] rounded-xl shadow-lg flex justify-center items-center" key={index}>
                                                <ResponsiveContainer width="100%" height={500}>
                                                    <ScatterChart
                                                        margin={{
                                                            top: 20,
                                                            right: 20,
                                                            bottom: 20,
                                                            left: 20,
                                                        }}
                                                    >
                                                        <CartesianGrid />
                                                        <XAxis type="number" dataKey="x" name="Log Intercept" domain={[0, dataMax => (Math.round(dataMax) + 1)]}>
                                                            <Label value="Log Intercept" position="bottom" />
                                                        </XAxis>
                                                        <YAxis type="number" dataKey="y" name="Log Slope" domain={[0, dataMax => (Math.round(dataMax) + 1)]}>
                                                            <Label value="Log Slope" offset={-15} angle={-90} position="left" />
                                                        </YAxis>
                                                        <Tooltip content={<CustomTooltip data={data} selectedIndex={selectedCountryIndex} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />
                                                        <ReferenceLine x={year.median_intercept} stroke="green" strokeDasharray="7 7" strokeWidth={1.5} ifOverflow="extendDomain" />
                                                        <ReferenceLine y={year.median_slope} stroke="red" strokeDasharray="7 7" strokeWidth={1.5} ifOverflow="extendDomain" />
                                                        <Scatter data={[data]} fill="#8884d8">
                                                            <Cell key={`cell-${selectedCountryIndex}`} fill={COLORS[selectedCountryIndex % COLORS.length]} />
                                                            <LabelList dataKey="label" position="right" />
                                                        </Scatter>
                                                    </ScatterChart>
                                                </ResponsiveContainer>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="embla__controls px-5">
                                <div className="embla__buttons">
                                    <PrevButton
                                        onClick={onPrevButtonClick}
                                        disabled={prevBtnDisabled}
                                    />
                                    <NextButton
                                        onClick={onNextButtonClick}
                                        disabled={nextBtnDisabled}
                                    />
                                </div>
                                <div className="embla__dots">
                                    {scrollSnaps.map((_, index) => (
                                        <DotButton
                                            key={index}
                                            onClick={() => onDotButtonClick(index)}
                                            className={'embla__dot'.concat(
                                                index === selectedIndex ? ' embla__dot--selected' : '',
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                        <div style={{ width: "15%", minWidth: "15%" }} className="bg-[#f1f2f7] rounded-xl shadow-lg p-2 h-fit">
                            <div className="flex pt-1" style={{ color: 'green' }}>
                                --&nbsp;Median Intercept
                            </div>
                            <div className="flex pt-1" style={{ color: 'red' }}>
                                --&nbsp;Median Slope
                            </div>
                        </div>
                    </div>
                );
            }
        )()
    );
}