"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function matchPatterns(values, patterns) {
	return values.filter((v) =>
		patterns.some((p) => String(v).toLowerCase().includes(p))
	);
}

function Tooltip({ text }) {
	// Custom tooltip on hover
	const [visible, setVisible] = useState(false);
	return (
		<span
			style={{
				position: "relative",
				marginLeft: 6,
				cursor: "help",
				borderBottom: "1px dotted #666",
				padding: "0 2px",
				borderRadius: "2px",
			}}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			aria-label={text}
			role="tooltip"
		>
			&#9432;
			{visible && (
				<span
					style={{
						position: "absolute",
						left: "50%",
						bottom: "120%",
						transform: "translateX(-50%)",
						background: "#222",
						color: "#fff",
						padding: "6px 12px",
						borderRadius: 4,
						whiteSpace: "pre-line",
						fontSize: 13,
						zIndex: 1000,
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						pointerEvents: "none",
						minWidth: 180,
						textAlign: "center",
					}}
				>
					{text}
				</span>
			)}
		</span>
	);
}

export default function DatasetMapping() {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	const router = useRouter();

	const [columns, setColumns] = useState([]);
	const [dataset, setDataset] = useState(null);

	// Form state
	const [isolateId, setIsolateId] = useState("");
	const [datasetFormat, setDatasetFormat] = useState("Wide");
	const [bacterialInfection, setBacterialInfection] = useState("");
	const [sourceInput, setSourceInput] = useState("");
	const [antibioticFormat, setAntibioticFormat] = useState("");
	const [antibioticNameColumn, setAntibioticNameColumn] = useState("");
	const [antibioticResultColumn, setAntibioticResultColumn] = useState("");

	const [antibioticColumns, setAntibioticColumns] = useState(columns);
	const [selectedAntibioticColumns, setSelectedAntibioticColumns] = useState(
		[]
	);

	const [dateColumn, setDateColumn] = useState("");
	const [dateFormat, setDateFormat] = useState("");
	const [resistanceGranularity, setResistanceGranularity] = useState("");

	const [clusterAttribute, setClusterAttribute] = useState("");
	const [timeStamp, setTimeStamp] = useState("");
	const [timeGapAttribute, setTimeGapAttribute] = useState("");

	const [search, setSearch] = useState("");
	const [showTooltip, setShowTooltip] = useState(false);

	useEffect(() => {
		if (id) {
			fetch(`/api/test-model/mapping?id=${id}`)
				.then((res) => res.json())
				.then((res) => {
					if (res.success) {
						setDataset(res.data.dataset);
						setColumns(res.data.columns);
						setAntibioticColumns(res.data.columns);
						if (res.data.mapping_data) {
							setIsolateId(res.data.mapping_data.isolate_id || "");
							setDatasetFormat(res.data.mapping_data.dataset_format || "Wide");
							setBacterialInfection(res.data.mapping_data.bacterial_infection || "");
							setSourceInput(res.data.mapping_data.source_input || "");
							setAntibioticFormat(res.data.mapping_data.antibiotic_format || "");
							setAntibioticNameColumn(
								res.data.mapping_data.antibiotic_name_col || ""
							);
							setAntibioticResultColumn(
								res.data.mapping_data.antibiotic_result_col || ""
							);
							setDateColumn(res.data.mapping_data.date_column || "");
							setDateFormat(res.data.mapping_data.date_format || "");
							setResistanceGranularity(
								res.data.mapping_data.resistance_granularity || ""
							);
							setClusterAttribute(
								res.data.mapping_data.cluster_attribute || ""
							);
							setTimeStamp(res.data.mapping_data.time_stamp || "");
							setTimeGapAttribute(
								res.data.mapping_data.time_gap_attribute || ""
							);
							setSelectedAntibioticColumns(
								res.data.antibiotic_columns || []
							);
						}
					} else {
						toast.error(
							"Failed to fetch columns. Reason: " + res.message
						);
					}
				})
		}
	}, [id]);

	// // Auto-select columns based on format input
	useEffect(() => {
		if (datasetFormat === "Wide" && antibioticFormat) {
			const prefix = antibioticFormat.trim();
			const suffix = antibioticFormat.toLowerCase().split("_")[1];
			const matches = antibioticColumns.filter((col) => col.toLowerCase().endsWith(suffix));
			setSelectedAntibioticColumns(matches);
		}
	}, [antibioticFormat, datasetFormat, antibioticColumns]);

	// Antibiotic columns search filter
	const filteredAntibioticColumns = antibioticColumns.filter((col) =>
		col.toLowerCase().includes(search.toLowerCase())
	);

	// Form submit handler (demo only)
	async function handleSubmit(e) {
		e.preventDefault();
		const payload = {
			dataset: dataset,
			isolate_id: isolateId,
			bacterial_infection: bacterialInfection,
			source_input: sourceInput,
			dataset_format: datasetFormat,
			cluster_attribute: clusterAttribute,
			time_stamp: timeStamp,
			antibiotic_format: antibioticFormat,
			antibiotic_name_col: antibioticNameColumn,
			antibiotic_result_col: antibioticResultColumn,
			date_format: dateFormat,
			date_column: dateColumn,
			resistance_granularity: resistanceGranularity,
			time_gap_attribute: timeGapAttribute,
			selected_antibiotic_columns: selectedAntibioticColumns
		};

		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/process-mapping`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		}).then((res) => res.json());
		if (res.success) {
			toast.success("Mapping processed successfully!");
			const ress = await fetch("/api/test-model/mapping/updated", {
				method: 'POST',
				body: JSON.stringify({
					id: id,
					mapping: res.mapping,
					antibiotic_columns: res.antibiotic_columns,
				}),
			}).then((ress) => ress.json());
			if (!ress.success) {
				toast.error(ress.message);
				return;
			}
			router.push('/test-model/dashboard/resistance-mapping?id=' + ress.data._id);
		} else {
			toast.error(res.error || "Failed to process mapping.");
		}
	}

	return (
		<div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
			<div className="container mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
				<form onSubmit={handleSubmit}>
					<h1 className="text-2xl font-bold text-center mb-8 text-white">
						Dataset Mapping
					</h1>
					<div className="flex flex-col space-y-5">
						<div className="flex flex-row space-x-5">
							{/* Core Details */}
							<div className="w-full md:w-1/4 space-y-5 bg-gray-900 shadow-lg p-5 rounded-xl">
								<h1 className="text-2xl text-white font-medium">Core Details</h1>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Isolate ID
										<Tooltip text="Column containing unique identifier for each record/isolate. Select 'None' if your dataset doesn't have unique IDs."></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={isolateId}
										onChange={(e) =>
											setIsolateId(e.target.value)
										}
									>
										<option value="">None</option>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Dataset Format
										<span className="text-red-500">*</span>
										<Tooltip text="Choose whether your dataset has separate columns for each antibiotic (Wide) or a single column for antibiotic names (Long)"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={datasetFormat}
										onChange={(e) =>
											setDatasetFormat(e.target.value)
										}
										required
									>
										<option value="Long">Long</option>
										<option value="Wide">Wide</option>
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Bacterial Infection
										<span className="text-red-500">*</span>
										<Tooltip text="Column containing bacterial species or pathogen names"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={bacterialInfection}
										onChange={(e) =>
											setBacterialInfection(
												e.target.value
											)
										}
										required
									>
										<option value="">Select Column</option>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Source Input
										<span className="text-red-500">*</span>
										<Tooltip text="Column indicating sample type (e.g., blood, urine, sputum)"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={sourceInput}
										onChange={(e) =>
											setSourceInput(e.target.value)
										}
										required
									>
										<option value="">Select Column</option>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
								</div>
								{datasetFormat === "Wide" && (
									<div>
										<label className="block text-gray-200 mb-2 font-medium">
											Antibiotic Column Format
											<span className="text-red-500">*</span>
											<Tooltip text="Pattern used for antibiotic column names (e.g., Antibiotic_CIP for Ciprofloxacin)"></Tooltip>
										</label>
										<input
											type="text"
											placeholder="Format: Antibiotic [any suffix]"
											pattern="^Antibiotic.*$"
											className="w-full p-3 rounded bg-gray-200 text-gray-900"
											value={antibioticFormat}
											onChange={(e) =>
												setAntibioticFormat(
													e.target.value
												)
											}
											required
										/>
									</div>
								)}

								{datasetFormat === "Long" && (
									<>
										<div>
											<label className="block text-gray-200 mb-2 font-medium">
												Antibiotic Name Column
												<span className="text-red-500">*</span>
												<Tooltip text="Column that contains the names of antibiotics tested (e.g., CIP, AMP, GEN)"></Tooltip>
											</label>
											<select
												className="w-full p-3 rounded bg-gray-200 text-gray-900"
												value={antibioticNameColumn}
												onChange={(e) =>
													setAntibioticNameColumn(
														e.target.value
													)
												}
												required
											>
												<option value="">
													Select Column
												</option>
												{columns.map((col) => (
													<option
														key={col}
														value={col}
													>
														{col}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-gray-200 mb-2 font-medium">
												Antibiotic Result Column
												<span className="text-red-500">*</span>
												<Tooltip text="Column containing the test results for each antibiotic (e.g., R, S, I)"></Tooltip>
											</label>
											<select
												className="w-full p-3 rounded bg-gray-200 text-gray-900"
												value={antibioticResultColumn}
												onChange={(e) =>
													setAntibioticResultColumn(
														e.target.value
													)
												}
												required
											>
												<option value="">
													Select Column
												</option>
												{columns.map((col) => (
													<option
														key={col}
														value={col}
													>
														{col}
													</option>
												))}
											</select>
										</div>
									</>
								)}
							</div>
							{/* Antibiotic Columns */}
							<div className="w-full md:w-1/4 space-y-5 bg-gray-900 shadow-lg p-5 rounded-xl">
								<h1 className="text-2xl text-white font-medium">Antibiotic Columns</h1>
								<p class="text-gray-400 text-sm">
									Review and modify the automatically selected
									antibiotic columns
								</p>
								<label className="block text-gray-200 mb-2 font-medium">
									Select Antibiotic Columns
									<Tooltip text="Columns containing antibiotic test results are automatically selected based on your format. You can add or remove columns as needed."></Tooltip>
								</label>
								<div className="flex flex-col gap-4 items-start">
									<input
										className="mb-2 md:mb-0 p-2 rounded bg-gray-200 text-gray-900 w-full"
										type="text"
										placeholder="Search columns..."
										value={search}
										onChange={(e) =>
											setSearch(e.target.value)
										}
									/>
									<div className="flex gap-2">
										<button
											type="button"
											className="px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800"
											onClick={() =>
												setSelectedAntibioticColumns(
													filteredAntibioticColumns
												)
											}
										>
											Select All
										</button>
										<button
											type="button"
											className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
											onClick={() =>
												setSelectedAntibioticColumns([])
											}
										>
											Clear
										</button>
									</div>
								</div>
								<div className="mt-2 border rounded bg-white max-h-72 overflow-y-auto">
									<ul className="divide-y divide-gray-200">
										{filteredAntibioticColumns.map(
											(col) => (
												<li
													key={col}
													className="flex items-center px-3 py-2 hover:bg-gray-100"
												>
													<input
														type="checkbox"
														className="mr-2 accent-blue-700"
														checked={selectedAntibioticColumns.includes(
															col
														)}
														onChange={() => {
															setSelectedAntibioticColumns(
																(prev) =>
																	prev.includes(
																		col
																	)
																		? prev.filter(
																			(
																				v
																			) =>
																				v !==
																				col
																		)
																		: [
																			...prev,
																			col,
																		]
															);
														}}
													/>
													<span className="truncate text-gray-800">
														{col}
													</span>
												</li>
											)
										)}
									</ul>
								</div>
								<div className="text-sm text-gray-400 mt-1">
									Selected: {selectedAntibioticColumns.length}
								</div>
							</div>
							{/* Date Details */}
							<div className="w-full md:w-1/4 space-y-5 bg-gray-900 shadow-lg p-5 rounded-xl">
								<h1 className="text-2xl text-white font-medium">Date Details</h1>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Date Column
										<span className="text-red-500">*</span>
										<Tooltip text="Column containing the date when samples were collected or tested"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={dateColumn}
										onChange={(e) =>
											setDateColumn(e.target.value)
										}
										required
									>
										<option value="">Select Column</option>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Date Format
										<span className="text-red-500">*</span>
										<Tooltip text="Format of dates in your dataset. Choose the pattern that matches your data (e.g., YYYY-MM-DD for 2025-05-11)"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={dateFormat}
										onChange={(e) =>
											setDateFormat(e.target.value)
										}
										required
									>
										<option value="">Select Date</option>
										<optgroup label="Full Date Formats">
											<option value="YYYY-MM-DD">
												YYYY-MM-DD
											</option>
											<option value="DD-MM-YYYY">
												DD-MM-YYYY
											</option>
											<option value="MM-DD-YYYY">
												MM-DD-YYYY
											</option>
											<option value="YYYY/MM/DD">
												YYYY/MM/DD
											</option>
											<option value="DD/MM/YYYY">
												DD/MM/YYYY
											</option>
											<option value="MM/DD/YYYY">
												MM/DD/YYYY
											</option>
										</optgroup>
										<optgroup label="Single Format">
											<option value="YYYY">
												Year Only (YYYY)
											</option>
											<option value="MM">
												Month Only (MM)
											</option>
											<option value="DD">
												Day Only (DD)
											</option>
										</optgroup>
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Resistance Analysis Granularity
										<span className="text-red-500">*</span>
										<Tooltip text="Time period for grouping resistance data. Daily shows detailed patterns, while Monthly or Yearly shows long-term trends"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={resistanceGranularity}
										onChange={(e) =>
											setResistanceGranularity(e.target.value)
										}
										required
									>
										<option value="">
											Select Time Granularity
										</option>
										<option value="yearly">
											Yearly Analysis
										</option>
										<option value="monthly">
											Monthly Analysis
										</option>
										<option value="daily">
											Daily Analysis
										</option>
									</select>
								</div>
							</div>
							{/* Clustering Details */}
							<div className="w-full md:w-1/4 space-y-5 bg-gray-900 shadow-lg p-5 rounded-xl">
								<h1 className="text-2xl text-white font-medium">Clustering Details</h1>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Cluster Attribute
										<span className="text-red-500">*</span>
										<Tooltip text="Column used to group related samples (e.g., department, ward, location)"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={clusterAttribute}
										onChange={(e) =>
											setClusterAttribute(e.target.value)
										}
										required
									>
										<option value="">Select Column</option>
										{columns.map((col) => (
											<option key={col} value={col}>
												{col}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-gray-200 mb-2 font-medium">
										Time Stamp
										<span className="text-red-500">*</span>
										<Tooltip text="Select the temporal granularity for clustering (e.g., Year, Month, or Date)"></Tooltip>
									</label>
									<select
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										value={timeStamp}
										onChange={(e) =>
											setTimeStamp(e.target.value)
										}
										required
									>
										<option value="">Select Temporal Granularity</option>
										<option value="Year">Year</option>
										<option value="Month">Month</option>
										<option value="Date">Date</option>
									</select>
								</div>
								<div>
									<label
										className="block text-gray-200 mb-2 font-medium"
									>
										Cluster Time Gap
										<span className="text-red-500">*</span>
										<Tooltip text="Minimum number of days between samples to be considered separate clusters"></Tooltip>
									</label>
									<input
										type="number"
										min={2}
										required
										className="w-full p-3 rounded bg-gray-200 text-gray-900"
										placeholder="e.g., 4"
										value={timeGapAttribute}
										onChange={(e) =>
											setTimeGapAttribute(e.target.value)
										}
									/>
								</div>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="block mx-auto mt-8 px-8 py-3 rounded bg-blue-700 text-white font-semibold text-lg hover:bg-blue-800 transition"
					>
						Process Dataset
					</button>
				</form>
			</div>
		</div>
	);
}
