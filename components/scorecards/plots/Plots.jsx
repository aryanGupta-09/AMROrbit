import { useSelector } from "react-redux";
import { scorecardOptionsSelector } from "@/redux/reducers/scorecardOptionsReducer";
import { useEffect, useState, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell, ReferenceLine, LabelList } from 'recharts';
import Legend from "./Legend";
import VisualizationBox from "../../common/VisualizationBox";

import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import colors from '@/public/colors.json';

import { useDispatch } from 'react-redux';
import { actions } from '@/redux/reducers/scorecardOptionsReducer';

import React from 'react';
import ReactDOM from 'react-dom';

export default function Plots() {
    const dispatch = useDispatch();
    const handleCountryClick = (newValue) => {
        dispatch(actions.setCountry(newValue));
    };
    const options = useSelector(scorecardOptionsSelector);

    const [hoveredEntry, setHoveredEntry] = useState(null);
    const [refTip, setRefTip] = useState({ x: 0, y: 0, text: '', visible: false, color: '' });

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
    const [firstRender, setFirstRender] = useState(true);

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
            } catch (error) {
                setFiles({ years: [], countries: [] });
            }
        };

        fetchFiles();
    }, [options]);

    if (firstRender) {
        return <VisualizationBox heading='Start Visualization' text='Select "Antibiotic", "Organism", and "Sample Type" to begin year-wise analysis.' />;
    }
    else if ((files.years && files.years.length === 0) && (files.countries && files.countries.length === 0)) {
        return <VisualizationBox heading='Continue Visualization' text='Sorry, no data was found. Please try another combination.' />;
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

    return (
        (options.country === null || options.country === "All") ? (
            <div className="flex flex-wrap justify-around gap-y-7">
                {
                    files.years
                        .sort((a, b) => a.year - b.year)
                        .map((year, index) => {
                            const data = year.countries.map(country => (
                                { x: country.x, y: country.y, label: country.name }
                            ));

                            return (
                                <div style={{ width: "90%", height: "70vh" }} className="flex flex-row gap-3" key={index}>
                                    <div className="bg-[#f1f2f7] rounded-xl shadow-lg flex-grow">
                                        <div className="relative" style={{ height: "70vh" }}>
                                            <div className="absolute top-3 right-3 z-10 p-2 bg-[#A2A2A2] rounded-lg text-white text-lg">
                                                &nbsp;&nbsp;{year.year}&nbsp;&nbsp;
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
                                                    <XAxis type="number" dataKey="x" name="Intercept" domain={[dataMin => (Math.round(dataMin) - 3), dataMax => (Math.round(dataMax) + 3)]} allowDecimals={false}>
                                                        <Label value="Intercept" offset={-5} position="bottom" />
                                                    </XAxis>
                                                    <YAxis type="number" dataKey="y" name="Slope" domain={[dataMin => (Math.round(dataMin) - 3), dataMax => (Math.round(dataMax) + 3)]} allowDecimals={false}>
                                                        <Label value="Slope" offset={-17} angle={-90} position="left" />
                                                    </YAxis>
                                                    <Tooltip content={<CustomTooltip data={data} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />
                                                    <ReferenceLine
                                                        x={year.median_intercept}
                                                        stroke="green"
                                                        strokeDasharray="7 7"
                                                        strokeWidth={1.5}
                                                        ifOverflow="extendDomain"
                                                    />
                                                    <ReferenceLine
                                                        x={year.median_intercept}
                                                        stroke="transparent"
                                                        strokeWidth={10}
                                                        strokeOpacity={0}
                                                        ifOverflow="extendDomain"
                                                        onMouseEnter={(e) => handleShowRefTip(e, `Median Intercept: ${year.median_intercept}`, 'green')}
                                                        onMouseLeave={handleHideRefTip}
                                                    />
                                                    <ReferenceLine
                                                        y={year.median_slope}
                                                        stroke="red"
                                                        strokeDasharray="7 7"
                                                        strokeWidth={1.5}
                                                        ifOverflow="extendDomain"
                                                    />
                                                    <ReferenceLine
                                                        y={year.median_slope}
                                                        stroke="transparent"
                                                        strokeWidth={10}
                                                        strokeOpacity={0}
                                                        ifOverflow="extendDomain"
                                                        onMouseEnter={(e) => handleShowRefTip(e, `Median Slope: ${year.median_slope}`, 'red')}
                                                        onMouseLeave={handleHideRefTip}
                                                    />
                                                    <Scatter data={data} fill="#8884d8">
                                                        {data.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={colors[index % colors.length]}
                                                                className={`cell-${index}`}
                                                                stroke={hoveredEntry && hoveredEntry.label === entry.label ? 'black' : 'none'}
                                                                strokeWidth={hoveredEntry && hoveredEntry.label === entry.label ? 1 : 0}
                                                                style={{ opacity: hoveredEntry && hoveredEntry.label !== entry.label ? 0.3 : 1 }}
                                                                onClick={() => handleCountryClick(entry.label)}
                                                            />
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
                                        <Legend data={data} onHover={setHoveredEntry} onClick={handleCountryClick} />
                                    </div>
                                </div>
                            );
                        })}
            </div>
        ) : (
            () => {
                const selectedCountryIndex = files.countries.findIndex(country => country.name === options.country);
                const selectedCountry = files.countries[selectedCountryIndex];
                if (!selectedCountry) return <VisualizationBox heading='Continue Visualization' text='Sorry, no data was found. Please try another combination.' />;

                return (
                    <div style={{ width: "90%" }} className="flex flex-row justify-around gap-x-3 mx-auto">
                        <section style={{ height: "70vh" }} className="embla flex-grow">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {selectedCountry.years
                                        .sort((a, b) => a.year - b.year)
                                        .map((year, index) => {
                                            const data = { x: year.x, y: year.y, label: year.year };
                                            return (
                                                <div style={{ height: "70vh" }} className="embla__slide bg-[#f1f2f7] rounded-xl shadow-lg flex justify-center items-center relative" key={index}>
                                                    <div className={`absolute top-3 right-3 z-10 p-2 rounded-lg text-white text-lg`} style={{ backgroundColor: colors[selectedCountryIndex % colors.length] }}>
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
                                                            <XAxis type="number" dataKey="x" name="Intercept" domain={[dataMin => (Math.round(dataMin) - 3), dataMax => (Math.round(dataMax) + 3)]} allowDecimals={false}>
                                                                <Label value="Intercept" offset={-5} position="bottom" />
                                                            </XAxis>
                                                            <YAxis type="number" dataKey="y" name="Slope" domain={[dataMin => (Math.round(dataMin) - 3), dataMax => (Math.round(dataMax) + 3)]} allowDecimals={false}>
                                                                <Label value="Slope" offset={-17} angle={-90} position="left" />
                                                            </YAxis>
                                                            <Tooltip content={<CustomTooltip data={data} selectedIndex={selectedCountryIndex} />} cursor={{ strokeDasharray: '5 5', strokeWidth: '1.5' }} isAnimationActive="true" />
                                                            <ReferenceLine
                                                                x={year.median_intercept}
                                                                stroke="green"
                                                                strokeDasharray="7 7"
                                                                strokeWidth={1.5}
                                                                ifOverflow="extendDomain"
                                                            />
                                                            <ReferenceLine
                                                                x={year.median_intercept}
                                                                stroke="transparent"
                                                                strokeWidth={10}
                                                                strokeOpacity={0}
                                                                ifOverflow="extendDomain"
                                                                onMouseEnter={(e) => handleShowRefTip(e, `Median Intercept: ${year.median_intercept}`, 'green')}
                                                                onMouseLeave={handleHideRefTip}
                                                            />
                                                            <ReferenceLine
                                                                y={year.median_slope}
                                                                stroke="red"
                                                                strokeDasharray="7 7"
                                                                strokeWidth={1.5}
                                                                ifOverflow="extendDomain"
                                                            />
                                                            <ReferenceLine
                                                                y={year.median_slope}
                                                                stroke="transparent"
                                                                strokeWidth={10}
                                                                strokeOpacity={0}
                                                                ifOverflow="extendDomain"
                                                                onMouseEnter={(e) => handleShowRefTip(e, `Median Slope: ${year.median_slope}`, 'red')}
                                                                onMouseLeave={handleHideRefTip}
                                                            />
                                                            <Scatter data={[data]} fill="#8884d8">
                                                                <Cell key={`cell-${selectedCountryIndex}`} fill={colors[selectedCountryIndex % colors.length]} />
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
                        <div style={{ width: "15%", minWidth: "15%" }} className="flex flex-col gap-y-3">
                            <div className="bg-[#f1f2f7] rounded-xl shadow-lg p-2 h-fit">
                                <div className="flex pt-1" style={{ color: 'green' }}>
                                    --&nbsp;Median Intercept
                                </div>
                                <div className="flex pt-1" style={{ color: 'red' }}>
                                    --&nbsp;Median Slope
                                </div>
                            </div>
                            <div className="bg-[#A2A2A2] text-white text-center rounded-xl shadow-lg p-2 h-fit cursor-pointer" onClick={() => handleCountryClick("All")}>Back to all countries</div>
                        </div>
                    </div>
                );
            }
        )()
    );
}