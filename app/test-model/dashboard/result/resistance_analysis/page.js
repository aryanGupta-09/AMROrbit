"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Dummy data for dropdowns (replace with props or API data as needed)
const bacteriaSpecies = ['E. coli', 'S. aureus', 'K. pneumoniae'];
const antibioticColumns = ['Amoxicillin', 'Ciprofloxacin', 'Gentamicin'];
const sourceColumns = ['Blood', 'Urine', 'Sputum'];

export default function ResistanceAnalysis() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();

  const [dataset, setDataset] = useState([]);
  const [mapping, setMapping] = useState({});

  const [user, setUser] = useState({});

  const [bacteriaSpecies, setBacteriaSpecies] = useState([]);
  const [sourceColumns, setSourceColumns] = useState([]);
  const [antibioticColumns, setAntibioticColumns] = useState([]);

  const [infection, setInfection] = useState('');
  const [antibiotic, setAntibiotic] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resistance-analysis?user=${user.id}&id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setBacteriaSpecies(res.bacteria_species || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const formData = new FormData();
      formData.append('infection', infection);
      formData.append('antibiotic', antibiotic);
      formData.append('source', source);
      formData.append('user', user.id);
      formData.append('id', id);
      // Replace the URL below with your backend endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-resistance-graph`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      } else {
        setError('Error generating graph. Please try again.');
      }
    } catch (err) {
      setError('Error generating graph. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
      <main className="flex-1 py-10 px-4 max-w-5xl mx-auto">
        <div className="flex items-center mb-10">
          <button
            className="text-white text-2xl mr-5 bg-transparent border-none cursor-pointer"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold">Resistance Analysis</h1>
        </div>
        <div className="grid md:grid-cols-[300px_1fr] gap-10">
          <section className="bg-[#2a2f3b] p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Choose Infection:</label>
                <div className="relative bg-gray-200 rounded">
                  <select
                    className="w-full p-3 rounded bg-gray-200 text-black appearance-none cursor-pointer"
                    value={infection}
                    onChange={e => setInfection(e.target.value)}
                    required
                  >
                    <option value="">Choose Infection</option>
                    {bacteriaSpecies.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">▼</span>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">Choose Antibiotic:</label>
                <div className="relative bg-gray-200 rounded">
                  <select
                    className="w-full p-3 rounded bg-gray-200 text-black appearance-none cursor-pointer"
                    value={antibiotic}
                    onChange={e => setAntibiotic(e.target.value)}
                    required
                  >
                    <option value="">Choose Antibiotic</option>
                    {antibioticColumns.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">▼</span>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">Choose Source:</label>
                <div className="relative bg-gray-200 rounded">
                  <select
                    className="w-full p-3 rounded bg-gray-200 text-black appearance-none cursor-pointer"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    required
                  >
                    <option value="">Choose Source</option>
                    {sourceColumns.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">▼</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-[#1a2133] text-white rounded hover:bg-[#2a3143] transition text-base font-medium"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </form>
          </section>
          <section className="bg-[#2a2f3b] p-6 rounded-xl min-h-[400px] flex items-center justify-center">
            {!imageUrl && !loading && !error && (
              <div className="w-full h-[400px] bg-[#1a1a1a] rounded flex items-center justify-center text-gray-500 text-lg">
                Select attributes and generate to view the graph
              </div>
            )}
            {loading && (
              <div className="w-full h-[400px] bg-[#1a1a1a] rounded flex items-center justify-center text-gray-400 text-lg">
                Generating graph...
              </div>
            )}
            {error && (
              <div className="w-full h-[400px] bg-[#1a1a1a] rounded flex items-center justify-center text-red-400 text-lg">
                {error}
              </div>
            )}
            {imageUrl && !loading && !error && (
              <img src={imageUrl} alt="Resistance Analysis Graph" className="max-w-full h-auto rounded" />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
