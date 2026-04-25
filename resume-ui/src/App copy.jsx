import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [results, setResults] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  console.log("Results state:", results);
  
  const BASE_URL = "https://elementary-armando-misshapenly.ngrok-free.dev"; 
  
  // const BASE_URL = "/api";

  // --------------------------------------------auto-hide logic

  useEffect(() => {
    if (error || success) {
      setVisible(true);

      const timer = setTimeout(() => {
        if (!isHovered) {
          setVisible(false);

          setTimeout(() => {
            setError("");
            setSuccess("");
          }, 300); // wait for fade-out
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success, isHovered]);


  // ---------------- Add close functions --User can manually close message anytime

  const handleCloseMessage = () => {
    setVisible(false);

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 300);
  };

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (!files || files.length === 0) {
      setError("⚠️ Please upload at least one PDF file");
      return;
    }

    if (!jobDesc.trim()) {
      setError("⚠️ Please enter a job description");
      return;
    }

    setLoading(true); // 👈 start loading

    try {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await axios.post(`${BASE_URL}/upload_files/`, formData);

      setSessionId(res.data.session_id);

      setSuccess("🎉 Upload complete! Click 'Analyze' to view candidate rankings.");
    } catch (err) {
      setError("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };
  


  const handleAnalyze = async () => {

    setError("");
    setSuccess("");

    if (!sessionId) {
      setError("Please upload resumes first");
      return;
    }

    if (!jobDesc.trim()) {
      setError("Please enter a job description");
      return;
    }


    try {
      
      console.log("Session ID:", sessionId);
      console.log("Job Desc:", jobDesc);
      setLoading(true);
      
      const res = await axios.post(`${BASE_URL}/rank`, {
        session_id: sessionId,
        job_description: jobDesc
      });

      console.log("DATA:", res.data);

      setResults(res.data.ranking || []);
    } catch (error) {

      setError("Something went wrong while analyzing");

      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };



  const btnStyle = {
    marginRight: "10px",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"

  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fafafa"
  };

  const getScoreColor = (score) => {
    if (score > 70) return "green";
    if (score > 40) return "orange";
    return "red";
  };




  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🚀 Resume Screening System</h1>

{/* -----------------------Input files and Hide default input */}
      <input
        type="file"
        multiple
        id="fileUpload"
        style={{ display: "none" }}
        onChange={(e) => setFiles(e.target.files)}
      />

      {/* ------------------------Create custom button */}
      <label
        htmlFor="fileUpload"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          borderRadius: "6px",
          backgroundColor: "#28a745",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          marginRight: "10px"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1e7e34";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#28a745";
          e.target.style.transform = "scale(1)";
        }}
      >
        📂 Choose Files
      </label>


      {/* ----------------------------FILE PREVIEW  */}
      {files.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          
          <p style={{ fontWeight: "bold" }}>
            📄 {files.length} file(s) selected
          </p>

          <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
            {Array.from(files)
              .slice(0, 5)
              .map((file, i) => (
                <li key={i} style={{ fontSize: "14px" }}>
                  {file.name}
                </li>
              ))}
          </ul>

          {files.length > 5 && (
            <p style={{ fontSize: "13px", color: "gray" }}>
              + {files.length - 5} more files
            </p>
          )}
        </div>
      )}

      <br /><br />

      <textarea
        placeholder="Enter Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <br /><br />


      {/* <button onClick={handleUpload} style={btnStyle}>Upload</button> */}

      <button
        onClick={handleUpload}
        style={{
          ...btnStyle,
          opacity: files.length > 0 && jobDesc.trim() && !loading ? 1 : 0.5,
          cursor: files.length > 0 && jobDesc.trim() && !loading ? "pointer" : "not-allowed"
        }}
        disabled={files.length === 0 || !jobDesc.trim() || loading}
        onMouseEnter={(e) => {
          if (files.length > 0 && jobDesc.trim() && !loading) {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (files.length > 0 && jobDesc.trim() && !loading) {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>     



      <button
        onClick={handleAnalyze}
        style={{
          ...btnStyle,
          opacity: sessionId ? 1 : 0.5,
          cursor: sessionId ? "pointer" : "not-allowed"
        }}
        disabled={!sessionId}
        onMouseEnter={(e) => {
          if (sessionId) {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (sessionId) {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }
        }}
      >
        Analyze
      </button>

      {!sessionId && (
        <p style={{ color: "gray", fontSize: "14px", marginTop: "5px" }}>

          ⬆️ First Choose files above → Enter job description → Click Upload → then Analyze
        </p>
      )}


    {(error || success) && (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: error ? "#ffe6e6" : "#e6ffe6",
          color: error ? "red" : "green",
          padding: "10px",
          borderRadius: "6px",
          marginTop: "12px",
          marginBottom: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <span>
          {error ? `❌ ${error}` : `✅ ${success}`}
        </span>

        <button
          onClick={handleCloseMessage}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          ❌
        </button>
      </div>
    )}
      



{/* ------------------------------------------------------loading message------- */}
      <div style={{ marginTop: "20px" }}>
        {loading && (
          <p style={{ textAlign: "center", fontWeight: "bold", color: "blue" }}>
            Analyzing resumes... please wait
          </p>
        )}
      </div>

      {results && results.length > 0 ? (
        results.map((r, i) => (
          <div key={i} style={cardStyle}>
            
            {/* <h2>🏆 Rank #{i + 1} — {r.name}</h2> */}

            <h2> {i === 0 ? "🥇 Top Candidate" : `🏆 Rank #${i + 1}`} — {r.name}</h2>
            <p>
              <strong>Score:</strong>{" "}
              <span style={{ color: getScoreColor(r.score) }}>
                {r.score.toFixed(2)}
              </span>
            </p>

            <p>
              <strong>Matched:</strong>{" "}
              {r.matched?.join(", ") || "None"}
            </p>

            <p>
              <strong>Missing:</strong>{" "}
              {r.missing?.join(", ") || "None"}
            </p>

          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No results yet</p>
      )}
    </div>
  );
}

export default App;