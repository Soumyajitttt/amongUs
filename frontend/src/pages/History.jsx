import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { FileText, ArrowRight, Search } from "lucide-react"
// import api from "../api/axios" // Uncomment when backend is ready

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 1. ADD SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch History (Using Dummy Data for now)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        
        // --- REAL API CALL ---
        // const res = await api.get("/documents/history")
        // setHistory(res.data)

        // --- DUMMY API CALL ---
        await new Promise(resolve => setTimeout(resolve, 800)) 
        setHistory([
          {
            _id: "dummy_1",
            originalName: "SaaS Subscription Agreement v2.4.pdf",
            status: "completed",
            createdAt: new Date().toISOString(),
            score: 73
          },
          {
            _id: "dummy_2",
            originalName: "Standard NDA 2026.pdf",
            status: "processing",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            score: null
          },
          {
            _id: "dummy_3",
            originalName: "Freelance_Contract_Alice.pdf",
            status: "completed",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            score: 92
          }
        ])
      } catch (err) {
        console.error("Failed to fetch history:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [])

  // 2. FILTER THE HISTORY BASED ON SEARCH QUERY
  const filteredHistory = history.filter((doc) =>
    doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden bg-yellow-50 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-yellow-950 mb-2">Audit History</h1>
              <p className="text-yellow-950/70">View and manage your previously analyzed contracts.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-950/40" size={18} />
              <input 
                type="text" 
                placeholder="Search documents..." 
                // 3. BIND THE INPUT TO OUR STATE
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border-2 border-yellow-950/20 bg-white focus:outline-none focus:border-yellow-950 text-sm w-64 transition-colors"
              />
            </div>
          </div>

          {/* History Table/List */}
          <div className="bg-white rounded-2xl border-2 border-yellow-950/20 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-10 flex flex-col gap-4">
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="p-10 text-center text-yellow-950/60">
                <p>No documents found. Head over to the Dashboard to upload your first contract!</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              // 4. SHOW MESSAGE IF SEARCH YIELDS NO RESULTS
              <div className="p-10 text-center text-yellow-950/60">
                <p>No documents found matching "{searchQuery}"</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-yellow-100/50 border-b-2 border-yellow-950/10 text-sm text-yellow-950/70">
                    <th className="p-4 font-semibold">Document Name</th>
                    <th className="p-4 font-semibold">Date Uploaded</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Safety Score</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 5. MAP OVER filteredHistory INSTEAD OF history */}
                  {filteredHistory.map((doc) => (
                    <tr key={doc._id} className="border-b border-yellow-950/10 hover:bg-yellow-50 transition group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-950">
                            <FileText size={18} />
                          </div>
                          <span className="font-medium text-yellow-950">{doc.originalName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-yellow-950/70">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-yellow-950">
                        {doc.score ? `${doc.score}/100` : '--'}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => navigate(`/analytics`)} // Later this will be navigate(`/analytics/${doc._id}`)
                          disabled={doc.status !== 'completed'}
                          className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-lg text-sm font-medium transition ${
                            doc.status === 'completed' 
                              ? 'bg-yellow-950 text-white hover:bg-yellow-800' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          View Report <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}