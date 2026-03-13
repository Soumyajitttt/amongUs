import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import Sidebar from "../components/Sidebar"
import api from "../api/axios"

export default function Dashboard() {

  const [mode,setMode] = useState("pdf")
  const [file,setFile] = useState(null)
  const [text,setText] = useState("")
  const [loading,setLoading] = useState(false)

  const fileInputRef = useRef(null)

const handleUpload = async () => {

    if(mode === "pdf" && !file){
      return alert("Please upload a PDF")
    }

    if(mode === "text" && !text.trim()){
      return alert("Please enter text")
    }

    const formData = new FormData()
    formData.append("text", text)

    if(file){
      formData.append("pdf", file)
    }

    try{
      setLoading(true)

      // Added explicit header for file uploads
      await api.post("/documents/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      alert("Uploaded successfully")

      setFile(null)
      setText("")

    } catch(err){
      // This will now show the EXACT error your Node backend sent back
      console.error("Full upload error:", err)
      
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Server Error: ${err.response.data.error}`)
      } else {
        alert("Upload failed. Check the console for details.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex min-h-screen bg-yellow-50 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">

      <Sidebar/>

      <div className="flex-1 flex items-center justify-center p-10">

        <div className="bg-yellow-100 w-[480px] rounded-2xl shadow-lg p-8 border-2 border-yellow-950">

          <h1 className="text-xl font-semibold mb-1">
            Upload document
          </h1>

          <p className="text-yellow-950 text-sm mb-6">
            PDF file or paste text directly
          </p>

          {/* Toggle */}
          <div className="flex bg-yellow-200 rounded-full p-1 mb-6">

            <button
              onClick={()=>setMode("pdf")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode==="pdf"
                ? "bg-yellow-950 text-white"
                : "text-yellow-950"
              }`}
            >
              Upload PDF
            </button>

            <button
              onClick={()=>setMode("text")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode==="text"
                ? "bg-yellow-950 text-white"
                : "text-yellow-950"
              }`}
            >
              Paste text
            </button>

          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e)=>setFile(e.target.files[0])}
            className="hidden"
          />

          {/* Upload Box */}
          <div
            onClick={()=> mode==="pdf" && fileInputRef.current.click()}
            className="border-2 border-yellow-950 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-yellow-200"
          >

            {/* Upload Icon */}
            {mode === "pdf" && (
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Upload size={24} className="text-yellow-950"/>
              </div>
            )}

            {mode === "pdf" && (
              <>
                <p className="font-medium">
                  {file ? file.name : "Drop your PDF here"}
                </p>

                <p className="text-sm text-yellow-950">
                  or click to browse your files
                </p>

                <p className="text-xs text-yellow-950">
                  PDF only · max 10 MB
                </p>
              </>
            )}

            {mode === "text" && (
              <textarea
                placeholder="Paste your text here..."
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className="w-full border rounded-lg p-3 h-32 text-sm border-yellow-950 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            )}

          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">

            <button
              onClick={handleUpload}
              className="bg-yellow-950 text-white px-8 py-2 rounded-lg hover:bg-yellow-800 transition"
            >
              {loading ? "Uploading..." : "Continue"}
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}