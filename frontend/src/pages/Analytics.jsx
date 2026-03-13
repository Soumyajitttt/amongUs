import Sidebar from "../components/Sidebar"
import { useState, useEffect } from "react"
// import api from "../api/axios" // Uncomment when ready

export default function Analytics() {
  const [tab, setTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [auditData, setAuditData] = useState(null)

  // DUMMY API FETCH FUNCTION
  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true)
        
        // --- REAL API CALL (Uncomment when Flask RAG is ready) ---
        // const res = await api.get("/api/analysis/latest") 
        // const rawClauses = res.data

        // --- DUMMY API CALL (Simulating your new Flask RAG JSON response) ---
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2s simulated delay
        
        // This is exactly what your Flask app should return:
        const rawClauses = [
          // NEGATIVE / RISK CLAUSES
          { 
            id: 1, 
            text: "Only addresses mapped in the authorizedSellers variable are permitted to execute the transferFrom function via the DEX router.", 
            sentiment: "negative", 
            category: "Access Control" 
          },
          { 
            id: 4, 
            text: "The maxTxAmount variable can be modified by the admin down to 0 wei, effectively pausing the network.", 
            sentiment: "negative", 
            category: "Access Control" 
          },
          { 
            id: 22, 
            text: "The internal exchange rate is determined by calling getReserves() directly from the Uniswap V2 pair during execution.", 
            sentiment: "negative", 
            category: "DeFi Logic" // High risk for flash loan manipulation
          },
          { 
            id: 34, 
            text: "By interacting with this protocol, you waive your right to join any class-wide arbitration or class-action lawsuit.", 
            sentiment: "negative", 
            category: "Legal" 
          },
          { 
            id: 42, 
            text: "The core team reserves the right to increase token emissions or alter the utility of the token without holding a DAO governance vote.", 
            sentiment: "negative", 
            category: "Governance" 
          },

          // ⚪ NEUTRAL / STANDARD CLAUSES
          { 
            id: 53, 
            text: "These terms and conditions shall be governed by and construed in accordance with the laws of the State of Delaware.", 
            sentiment: "neutral", 
            category: "Legal" 
          },
          { 
            id: 64, 
            text: "Due to regulatory requirements, access to the frontend interface is geographically blocked for residents of the United States.", 
            sentiment: "neutral", 
            category: "Compliance" 
          },
          { 
            id: 90, 
            text: "The native governance token is intended solely for utility within the protocol and does not represent an equity stake.", 
            sentiment: "neutral", 
            category: "Legal" 
          },
          { 
            id: 91, 
            text: "The smart contracts implement standard ERC-20 and ERC-721 interfaces for fungible and non-fungible asset handling.", 
            sentiment: "neutral", 
            category: "Smart Contract" 
          },

          // 🟢 POSITIVE / SAFE CLAUSES
          { 
            id: 101, 
            text: "Every public function that modifies the contract's state is wrapped with the nonReentrant modifier from OpenZeppelin.", 
            sentiment: "positive", 
            category: "Security" 
          },
          { 
            id: 105, 
            text: "The architecture strictly adheres to the Checks-Effects-Interactions pattern, updating all balances before executing external calls.", 
            sentiment: "positive", 
            category: "Security" 
          },
          { 
            id: 110, 
            text: "The protocol's GitHub repository includes a comprehensive unit testing suite that covers 98% of the smart contract logic.", 
            sentiment: "positive", 
            category: "Security" 
          },
          { 
            id: 114, 
            text: "We adhere to a strict opt-in policy for data collection; absolutely no cookies or tracking scripts are loaded without explicit user consent.", 
            sentiment: "positive", 
            category: "Privacy" 
          },
          { 
            id: 122, 
            text: "The smart contracts explicitly guarantee that zero exit fees or withdrawal penalties will ever be applied to user principal.", 
            sentiment: "positive", 
            category: "DeFi Logic" 
          },
          { 
            id: 138, 
            text: "Prior to deploying on mainnet, the codebase was subjected to three independent security audits by industry-leading firms.", 
            sentiment: "positive", 
            category: "Security" 
          },
          { 
            id: 143, 
            text: "The development team does not possess any admin keys or veto privileges capable of overturning a successful community vote.", 
            sentiment: "positive", 
            category: "Governance" 
          }
        ];

        // --- PROCESS THE RAW DATA INTO DASHBOARD STATS ---
        const total = rawClauses.length
        const risk = rawClauses.filter(c => c.sentiment === "negative").length
        const safe = rawClauses.filter(c => c.sentiment === "positive").length
        const neutral = rawClauses.filter(c => c.sentiment === "neutral").length
        
        // Calculate percentages
        const negativeScore = Math.round((risk / total) * 100) || 0
        const safeScore = Math.round((safe / total) * 100) || 0
        const neutralScore = Math.round((neutral / total) * 100) || 0

        // Group by category to build the category cards dynamically
        const categoryMap = {}
        rawClauses.forEach(clause => {
          if (!categoryMap[clause.category]) {
            categoryMap[clause.category] = { total: 0, risk: 0 }
          }
          categoryMap[clause.category].total += 1
          if (clause.sentiment === "negative") {
            categoryMap[clause.category].risk += 1
          }
        })

        const categories = Object.keys(categoryMap).map((key, index) => ({
          id: index,
          name: key,
          count: categoryMap[key].total,
          text: categoryMap[key].risk === 0 ? "All clear" : `${categoryMap[key].risk} risk · ${categoryMap[key].total} total`,
          color: categoryMap[key].risk === 0 ? "green" : "red"
        }))

        // Filter out only the negative ones for the risk tab
        const negativeAudits = rawClauses.filter(c => c.sentiment === "negative")

        // Set the processed data into our state
        setAuditData({
          negativeScore,
          stats: { total, risk, safe, neutral },
          clausePercentages: { risk: negativeScore, safe: safeScore, neutral: neutralScore },
          categories,
          negativeAudits
        })

      } catch (err) {
        console.error("Failed to fetch audit data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditData()
  }, [])

  // LOADING STATE UI
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-[2px] bg-yellow-50 flex flex-col items-center justify-center bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="w-16 h-16 border-4 border-yellow-950 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-yellow-950 font-bold animate-pulse">Consulting AI... Analyzing Contract...</p>
        </div>
      </div>
    )
  }

  if (!auditData) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* UNIVERSAL SIDEBAR */}
      <Sidebar />

      {/* PAGE */}
      <div className="flex-1 ml-[2px] bg-yellow-50 overflow-y-auto p-10 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-6xl">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-yellow-950">
                Documents · SaaS Subscription Agreement v2.4
              </p>
              <h1 className="text-3xl font-bold mt-1 text-yellow-950">
                Analytics
              </h1>
              <p className="text-sm text-yellow-950">
                Analysed on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="bg-yellow-100 rounded-xl p-4 flex items-center gap-3 shadow-sm border-2 border-yellow-950 flex flex-col items-center">
              <div className="bg-white p-2 rounded">📄</div>
              <div>
                <p className="font-semibold text-sm text-center">
                  SaaS Subscription Agreement v2.4
                </p>
                <p className="text-xs text-yellow-950 text-center mt-1">
                  {auditData.stats.total} clauses extracted
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Stat label="TOTAL CLAUSES" value={auditData.stats.total} sub="identified by AI" />
            <Stat label="RISK CLAUSES" value={auditData.stats.risk} color="text-red-500" sub="need attention" />
            <Stat label="SAFE CLAUSES" value={auditData.stats.safe} color="text-green-500" sub="no action needed" />
            <Stat label="NEUTRAL CLAUSES" value={auditData.stats.neutral} sub="review optional" />
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-6">
            <Tab name="overview" label="Overview" tab={tab} setTab={setTab} />
            <Tab name="risk" label={`Risk Clauses (${auditData.stats.risk})`} tab={tab} setTab={setTab} />
          </div>

          {/* OVERVIEW TAB CONTENT */}
          {tab === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              {/* RISK SCORE */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950 flex flex-col items-center">
                <p className="text-xs text-yellow-950 mb-4 font-bold">NEGATIVE SCORE</p>
                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="rotate-[-90deg]" width="160" height="160">
                      <circle cx="80" cy="80" r="65" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        stroke="#ef4444"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="408"
                        strokeDashoffset={408 - (408 * auditData.negativeScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-bold">{auditData.negativeScore}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-red-500 font-semibold mt-4">Risk Detected</p>
                
                {/* Updated Legend to reflect actual data */}
                <div className="mt-6 space-y-2 text-sm w-full px-4">
                  <Legend color="bg-red-500" label="Negative" value={auditData.stats.risk} />
                  <Legend color="bg-green-500" label="Positive" value={auditData.stats.safe} />
                  <Legend color="bg-gray-400" label="Neutral" value={auditData.stats.neutral} />
                </div>
              </div>

              {/* CLAUSE BREAKDOWN */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950">
                <p className="text-xs text-yellow-950 mb-4 font-bold">CLAUSE BREAKDOWN</p>
                <Bar label="Risk clauses" value={auditData.clausePercentages.risk} color="bg-red-500" />
                <Bar label="Safe clauses" value={auditData.clausePercentages.safe} color="bg-green-500" />
                <Bar label="Neutral clauses" value={auditData.clausePercentages.neutral} color="bg-gray-400" />
                <div className="flex mt-6 h-2 rounded-full overflow-hidden">
                  <div className={`bg-red-500`} style={{ width: `${auditData.clausePercentages.risk}%` }} />
                  <div className={`bg-green-500`} style={{ width: `${auditData.clausePercentages.safe}%` }} />
                  <div className={`bg-gray-400`} style={{ width: `${auditData.clausePercentages.neutral}%` }} />
                </div>
              </div>

              {/* CATEGORY (Now generated dynamically!) */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950 overflow-y-auto max-h-[400px]">
                <p className="text-xs text-yellow-950 mb-4 font-bold">BY CATEGORY</p>
                <div className="grid grid-cols-2 gap-4">
                  {auditData.categories.map((cat) => (
                    <Category key={cat.id} name={cat.name} count={cat.count} text={cat.text} color={cat.color} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RISK TAB CONTENT */}
          {tab === "risk" && (
            <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950">
              <h2 className="text-xl font-bold text-yellow-950 mb-6">Identified Risk Clauses</h2>
              {auditData.negativeAudits.length === 0 ? (
                <p className="text-yellow-950/70">Great news! No high-risk clauses were detected in this document.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {auditData.negativeAudits.map((audit) => (
                    <div key={audit.id} className="bg-white p-5 rounded-xl border-2 border-red-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {audit.category}
                        </span>
                      </div>
                      <p className="text-yellow-950 font-medium leading-relaxed">
                        {audit.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* COMPONENTS */

function Stat({ label, value, sub, color }) {
  return (
    <div className="bg-yellow-100 rounded-2xl p-6 shadow-sm border-2 border-yellow-950 flex flex-col items-center text-center">
      <p className="text-xs text-yellow-950 font-bold">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || "text-yellow-950"}`}>
        {value}
      </p>
      <p className="text-sm text-yellow-950 mt-1">{sub}</p>
    </div>
  )
}

function Tab({ name, label, tab, setTab }) {
  return (
    <button
      onClick={() => setTab(name)}
      className={`px-5 py-2 rounded-xl text-sm font-medium border-2 border-yellow-950 transition-colors ${
        tab === name
          ? "bg-yellow-950 text-white"
          : "bg-yellow-100 text-yellow-950 hover:bg-yellow-200"
      }`}
    >
      {label}
    </button>
  )
}

function Bar({ label, value, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1 font-medium text-yellow-950">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-white border border-yellow-950/20 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Category({ name, count, text, color }) {
  return (
    <div className="border-2 border-yellow-950/20 bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-yellow-950">{name}</p>
        <div className={`w-3 h-3 rounded-full ${color === "red" ? "bg-red-500" : "bg-green-500"}`} />
      </div>
      <p className="text-2xl font-bold mt-2 text-yellow-950">{count}</p>
      <p className={`text-xs mt-1 font-medium ${color === "red" ? "text-red-500" : "text-green-500"}`}>
        {text}
      </p>
    </div>
  )
}

function Legend({ color, label, value }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <p className="text-yellow-950 font-medium">{label}</p>
      </div>
      <p className="font-bold text-yellow-950">{value}</p>
    </div>
  )
}