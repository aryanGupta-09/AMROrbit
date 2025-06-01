"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { parseCookies } from "nookies";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Tailwind CSS classes are used for styling. Replace API URLs as needed.
// Pass infectionColumns, antibioticColumns, sourceColumns as props or fetch from backend.

const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#FF9F1C",
    "#A5D8FF",
    "#845EC2",
    "#008F7A",
    "#D65DB1",
    "#2C73D2",
    "#FF8066",
    "#9F44D3",
    "#F9F871",
    "#00C9A7",
    "#C34A36",
    "#0089BA",
    "#FFC75F",
    "#E7BCFF",
    "#3A86FF",
    "#FF5722",
    "#4CAF50",
    "#9C27B0",
    "#4B4453",
    "#B0A8B9",
    "#FFEAA7",
    "#FDA7DF",
    "#55EFC4",
];

function ScorecardAnalysis() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const [dataset, setDataset] = useState([]);
    const [mapping, setMapping] = useState({});

    const [user, setUser] = useState({});

    const [infectionColumns, setInfectionColumns] = useState([]);
    const [sourceColumns, setSourceColumns] = useState([]);
    const [antibioticColumns, setAntibioticColumns] = useState([]);

    // State
    const [selectedOrganism, setSelectedOrganism] = useState("");
    const [selectedAntibiotic, setSelectedAntibiotic] = useState("");
    const [selectedSampleType, setSelectedSampleType] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("All");
    const [yearsData, setYearsData] = useState([]); // [{year, countries, median_intercept, median_slope}]
    const [countriesData, setCountriesData] = useState([]); // [{name, years: [{year, x, y, ...}]}]
    const [autoplayInterval, setAutoplayInterval] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [clickedCountry, setClickedCountry] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [countryColorMap, setCountryColorMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [empty, setEmpty] = useState(false);
    const [oldPngs, setOldPngs] = useState(null);
    const [sortedYears, setSortedYears] = useState([]);

    // Refs for D3
    const scatterRef = useRef();
    const tooltipRef = useRef();
    const autoplayRef = useRef();

    useEffect(() => {
        const u = parseCookies().user;
        if (!u) {
            router.push('/test-model/login');
        } else {
            setUser(JSON.parse(u));
        }
    }, []);

    useEffect(() => {
        fetch(`/api/test-model/mapping?id=${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setMapping(res.data.mapping_data || {});
                    setDataset(res.data.dataset || []);
                } else {
                    toast.error(
                        "Failed to fetch data. Reason: " + res.message
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                toast.error("Error fetching data. Please try again later.");
            });
    }, [id]);

    useEffect(() => {
        if (user && dataset.length > 0 && Object.keys(mapping).length > 0) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scorecards?id=${id}`)
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        setInfectionColumns(res.infection_columns || []);
                        setSourceColumns(res.source_columns || []);
                        setAntibioticColumns(res.antibiotic_columns || []);
                    } else {
                        toast.error(
                            "Failed to fetch data. Reason: " + res.message
                        );
                    }
                })
                .catch((err) => {
                    console.error("Error fetching data:", err);
                    toast.error("Error fetching data. Please try again later.");
                });
        }
    }, [user, dataset, mapping]);

    // Build color map for countries
    useEffect(() => {
        if (!yearsData.length) return;
        const allCountries = new Set();
        yearsData.forEach((y) =>
            y.countries.forEach((c) => c.name && allCountries.add(c.name))
        );
        const map = {};
        Array.from(allCountries).forEach((name, i) => {
            map[name] = COLORS[i % COLORS.length];
        });
        setCountryColorMap(map);
    }, [yearsData]);

    // Autoplay for year tabs
    useEffect(() => {
        if (!yearsData.length) return;
        if (yearsData.length <= 1) return;
        let years = yearsData.map((y) => y.year).sort((a, b) => a - b);
        let idx = years.indexOf(selectedYear);
        autoplayRef.current = setInterval(() => {
            idx = (idx + 1) % years.length;
            setSelectedYear(years[idx]);
        }, 2000);
        return () => clearInterval(autoplayRef.current);
    }, [yearsData]);

    // Fetch data
    const fetchScorecardData = async (infection, antibiotic, source) => {
        setLoading(true);
        setError("");
        setEmpty(false);
        setOldPngs(null);
        try {
            const formData = new FormData();
            formData.append("infection", infection);
            formData.append("antibiotic", antibiotic);
            formData.append("source", source);
            formData.append("id", id);
            formData.append("user", user.id);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-scorecards`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Network error");
            const data = await res.json();
            if (data.years && data.countries) {
                const sortedYears = data.years.sort((a, b) => a.year - b.year);
                setYearsData(sortedYears);
                setCountriesData(data.countries);
                setSelectedCountry("All");
                setSelectedYear(sortedYears[0].year);
                setHoveredCountry(null);
                setClickedCountry(null);
                setCurrentSlide(0);
            } else if (data.pngs && data.pngs.length > 0) {
                setOldPngs(data.pngs);
            } else {
                setEmpty(true);
            }
        } catch (e) {
            setError("Failed to fetch data");
            setEmpty(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((s) => (s + 1) % sortedYears.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [sortedYears.length]);

    // D3 for single point
    const svgRef = useRef();
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        const width = 700,
            height = 500;
        svg.attr("width", width).attr("height", height);
        // Axes
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
        sortedYears.forEach((y) => {
            minX = Math.min(minX, y.x || 0);
            maxX = Math.max(maxX, y.x || 0);
            minY = Math.min(minY, y.y || 0);
            maxY = Math.max(maxY, y.y || 0);
        });
        const xScale = d3
            .scaleLinear()
            .domain([Math.floor(minX), Math.ceil(maxX)])
            .range([50, width - 50]);
        const yScale = d3
            .scaleLinear()
            .domain([Math.floor(minY), Math.ceil(maxY)])
            .range([height - 50, 30]);
        svg.append("g")
            .attr("transform", `translate(0,${height - 50})`)
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .attr("transform", `translate(50,0)`)
            .call(d3.axisLeft(yScale));
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Intercept")
            .attr("fill", "#333");
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Slope")
            .attr("fill", "#333");
        svg.append("line")
            .attr("x1", xScale(yearsData.median_intercept))
            .attr("y1", 30)
            .attr("x2", xScale(yearsData.median_intercept))
            .attr("y2", height - 50)
            .attr("stroke", "green")
            .attr("stroke-dasharray", "5,5");
        svg.append("line")
            .attr("x1", 50)
            .attr("y1", yScale(yearsData.median_slope))
            .attr("x2", width - 50)
            .attr("y2", yScale(yearsData.median_slope))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "5,5");
        svg.append("circle")
            .attr("cx", xScale(yearsData.x))
            .attr("cy", yScale(yearsData.y))
            .attr("r", 12)
            .attr("fill", "none")
            .attr("stroke", countryColorMap[countriesData.name])
            .attr("stroke-width", 2)
            .attr("opacity", 0.5);
        svg.append("circle")
            .attr("cx", xScale(yearsData.x))
            .attr("cy", yScale(yearsData.y))
            .attr("r", 8)
            .attr("fill", countryColorMap[countriesData.name]);
    }, [yearsData, countriesData, countryColorMap, sortedYears]);

    // D3 scatter plot for all countries

    useEffect(() => {
        if (
            !yearsData.length ||
            !selectedYear ||
            selectedCountry !== "All" ||
            oldPngs
        )
            return;
        const yearData = yearsData.find((y) => y.year === selectedYear);
        if (!yearData) return;
        const svg = d3.select(scatterRef.current);
        svg.selectAll("*").remove();
        const width = 700,
            height = 500;
        svg.attr("width", width).attr("height", height);
        // Axes domain
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
        yearsData.forEach((y) =>
            y.countries.forEach((c) => {
                minX = Math.min(minX, c.x || 0);
                maxX = Math.max(maxX, c.x || 0);
                minY = Math.min(minY, c.y || 0);
                maxY = Math.max(maxY, c.y || 0);
            })
        );
        const xScale = d3
            .scaleLinear()
            .domain([Math.floor(minX), Math.ceil(maxX)])
            .range([50, width - 50]);
        const yScale = d3
            .scaleLinear()
            .domain([Math.floor(minY), Math.ceil(maxY)])
            .range([height - 50, 30]);
        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height - 50})`)
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .attr("transform", `translate(50,0)`)
            .call(d3.axisLeft(yScale));
        // Labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Intercept")
            .attr("fill", "#333");
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Slope")
            .attr("fill", "#333");
        // Reference lines
        svg.append("line")
            .attr("x1", xScale(yearData.median_intercept))
            .attr("y1", 30)
            .attr("x2", xScale(yearData.median_intercept))
            .attr("y2", height - 50)
            .attr("stroke", "green")
            .attr("stroke-dasharray", "5,5");
        svg.append("line")
            .attr("x1", 50)
            .attr("y1", yScale(yearData.median_slope))
            .attr("x2", width - 50)
            .attr("y2", yScale(yearData.median_slope))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "5,5");
        // Points
        yearData.countries.forEach((c) => {
            if (!c.name) return;
            const color = countryColorMap[c.name] || "#888";
            svg.append("circle")
                .attr("cx", xScale(c.x))
                .attr("cy", yScale(c.y))
                .attr("r", 8)
                .attr("fill", color)
                .attr(
                    "opacity",
                    clickedCountry ? (clickedCountry === c.name ? 1 : 0.2) : 1
                )
                .attr("stroke", hoveredCountry === c.name ? color : "none")
                .attr("stroke-width", hoveredCountry === c.name ? 3 : 0)
                .on("mouseenter", (event) => {
                    setHoveredCountry(c.name);
                    showTooltip(event, c, color);
                })
                .on("mouseleave", () => {
                    setHoveredCountry(null);
                    hideTooltip();
                })
                .on("click", () => {
                    setClickedCountry(
                        clickedCountry === c.name ? null : c.name
                    );
                });
        });
        // Tooltip helpers
        function showTooltip(event, c, color) {
            const tooltip = tooltipRef.current;
            tooltip.innerHTML = `<div class='font-bold' style='color:${color}'>${c.name
                }</div><div>Intercept: <b>${c.x?.toFixed(
                    2
                )}</b></div><div>Slope: <b>${c.y?.toFixed(
                    2
                )}</b></div><div>Year: <b>${selectedYear}-${(selectedYear + 3)
                    .toString()
                    .slice(-2)}</b></div>`;
            // Position tooltip beside mouse pointer, relative to SVG container
            const svgRect = scatterRef.current.getBoundingClientRect();
            const offsetX = 12; // px to the right of cursor
            const offsetY = 8;  // px below cursor
            tooltip.style.left = (event.clientX - svgRect.left + offsetX) + "px";
            tooltip.style.top = (event.clientY - svgRect.top + offsetY) + "px";
            tooltip.classList.remove("hidden");
        }
        function hideTooltip() {
            tooltipRef.current.classList.add("hidden");
        }
    }, [
        yearsData,
        selectedYear,
        countryColorMap,
        hoveredCountry,
        clickedCountry,
        selectedCountry,
        oldPngs,
    ]);

    // Legend for countries
    function CountriesLegend({ data }) {
        if (!data) return null;
        const unique = Array.from(new Set(data.map((c) => c.name))).filter(
            Boolean
        );
        return (
            <div className="bg-white rounded-lg p-4 shadow max-h-80 overflow-y-auto">
                <div className="font-semibold text-center border-b pb-2 mb-2 text-gray-800">
                    Countries
                </div>
                {unique.map((name) => (
                    <div
                        key={name}
                        className={`flex items-center p-2 rounded cursor-pointer mb-1 text-black ${clickedCountry === name
                            ? "bg-gray-200 font-bold"
                            : ""
                            }`}
                        onClick={() => {
                            setClickedCountry(clickedCountry === name ? null : name);
                            clearInterval(autoplayRef.current);
                        }}
                onMouseEnter={() => setHoveredCountry(name)}
                onMouseLeave={() => setHoveredCountry(null)}
                    >
                <span
                    className="w-4 h-4 rounded-full mr-2 border"
                    style={{ background: countryColorMap[name] }}
                ></span>
                <span className="truncate">{name}</span>
            </div>
        ))
    }
            </div >
        );
}

// Form submit
function handleSubmit(e) {
    e.preventDefault();
    fetchScorecardData(
        selectedOrganism,
        selectedAntibiotic,
        selectedSampleType
    );
}

// Main render
return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
        <div className="flex-1 max-w-[1600px] mx-auto px-3 py-2">
            <div className="flex items-center mb-2">
                <button
                    className="bg-none border-none text-white text-2xl cursor-pointer mr-5"
                    onClick={() => window.history.back()}
                >
                    ←
                </button>
                <h1 className="text-2xl font-semibold">AMROrbit Scorecard</h1>
            </div>
            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-[#2a2f3b] p-5 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end"
            >
                <div>
                    <label className="block mb-1 text-gray-300 font-medium">
                        Choose Organism:
                    </label>
                    <select
                        className="w-52 p-2 rounded bg-gray-200 text-black"
                        value={selectedOrganism}
                        onChange={(e) =>
                            setSelectedOrganism(e.target.value)
                        }
                        required
                    >
                        <option value="">Choose Organism</option>
                        {infectionColumns.map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-gray-300 font-medium">
                        Choose Antibiotic:
                    </label>
                    <select
                        className="w-52 p-2 rounded bg-gray-200 text-black"
                        value={selectedAntibiotic}
                        onChange={(e) =>
                            setSelectedAntibiotic(e.target.value)
                        }
                        required
                    >
                        <option value="">Choose Antibiotic</option>
                        {antibioticColumns.map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-gray-300 font-medium">
                        Choose Sample Type:
                    </label>
                    <select
                        className="w-52 p-2 rounded bg-gray-200 text-black"
                        value={selectedSampleType}
                        onChange={(e) =>
                            setSelectedSampleType(e.target.value)
                        }
                        required
                    >
                        <option value="">Choose Sample Type</option>
                        {sourceColumns.map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-[#1a2133] text-white px-4 py-2 rounded hover:bg-[#2a3143] font-medium"
                >
                    Generate
                </button>
            </form>
            {/* Main Content */}
            <div className="bg-[#2a2f3b] p-8 rounded-lg min-h-[70vh] flex flex-col relative shadow">
                {/* Year Tabs */}
                {yearsData.length > 0 && selectedCountry === "All" && (
                    <div className="flex justify-center mb-2 gap-2">
                        {yearsData.map((y) => (
                            <button
                                key={y.year}
                                className={`px-4 py-2 rounded-b-none border-b-2 ${selectedYear === y.year
                                    ? "border-white font-bold"
                                    : "border-transparent"
                                    } text-white`}
                                onClick={() => {
                                    setSelectedYear(y.year);
                                    clearInterval(autoplayRef.current);
                                }}
                            >
                                {y.year}-{Number(y.year) + (mapping["time_gap_attribute"] ? Number(mapping["time_gap_attribute"]) - 1 : 3)}
                            </button>
                        ))}
                    </div>
                )}
                {/* Loading/Empty/Error */}
                {loading && (
                    <div className="flex-1 flex items-center justify-center text-lg">
                        Loading...
                    </div>
                )}
                {error && (
                    <div className="flex-1 flex items-center justify-center text-red-400">
                        {error}
                    </div>
                )}
                {empty && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <h3 className="mb-2 text-xl">
                            Sorry, no data is available for this selection.
                        </h3>
                        <p>
                            Please try a different combination of organism,
                            antibiotic, and sample type.
                        </p>
                    </div>
                )}
                {/* Old PNGs fallback */}
                {oldPngs && (
                    <div className="flex flex-col items-center">
                        {oldPngs.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`scorecard-${i}`}
                                className="mb-4 max-w-full rounded shadow"
                            />
                        ))}
                    </div>
                )}
                {/* Main Scatter View */}
                {yearsData.length > 0 &&
                    selectedCountry === "All" &&
                    !loading &&
                    !empty &&
                    !oldPngs && (
                        <div className="flex flex-row h-full">
                            <div className="flex-1">
                                <div className="bg-white rounded-lg shadow p-2 h-full">
                                    <svg ref={scatterRef}></svg>
                                    <div
                                        ref={tooltipRef}
                                        className="hidden absolute bg-white text-black p-3 rounded shadow z-50 min-w-[150px] text-sm pointer-events-none"
                                        style={{ top: 0, left: 0 }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-64 ml-4 flex flex-col">
                                <div className="bg-white rounded-lg p-4 mb-4 shadow">
                                    <div className="font-semibold text-center border-b pb-2 mb-2 text-gray-800">
                                        Reference Lines
                                    </div>
                                    <div className="flex items-center mb-2 text-black">
                                        <div className="w-6 h-1.5 bg-green-500 mr-2"></div>
                                        Median Intercept
                                    </div>
                                    <div className="flex items-center text-black">
                                        <div className="w-6 h-1.5 bg-red-500 mr-2"></div>
                                        Median Slope
                                    </div>
                                </div>
                                <CountriesLegend
                                    data={
                                        yearsData.find(
                                            (y) => y.year === selectedYear
                                        )?.countries || []
                                    }
                                // setSelectedCountry={setSelectedCountry}
                                />
                            </div>
                        </div>
                    )}
                {/* Info text */}
                {yearsData.length > 0 &&
                    selectedCountry === "All" &&
                    !loading &&
                    !empty &&
                    !oldPngs && (
                        <div className="flex items-center mt-4 text-gray-300 text-sm">
                            <span className="material-icons mr-2">
                                info
                            </span>
                            Hover over a country from the legend to focus on
                            it, or click to view its specific trends.
                        </div>
                    )}
            </div>
        </div>
    </div>
);
}

export default ScorecardAnalysis;
