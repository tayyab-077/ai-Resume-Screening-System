import { useState, useEffect, useRef } from "react";
import axios from "axios";


function App() {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  
  const fileInputRef = useRef(null);

  const [results, setResults] = useState([]);

  const [sessionId, setSessionId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);  

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [showGuide, setShowGuide] = useState(false);


  const BASE_URL = "https://elementary-armando-misshapenly.ngrok-free.dev";

  // ---------------- AUTO HIDE MESSAGE
  useEffect(() => {
    if (error || success) {
      setVisible(true);

      const timer = setTimeout(() => {
        if (!isHovered) {
          setVisible(false);
          setTimeout(() => {
            setError("");
            setSuccess("");
          }, 300);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success, isHovered]);

  const handleCloseMessage = () => {
    setVisible(false);
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 300);
  };

  // ---------------- UPLOAD
  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (files.length === 0) {
      setError("⚠️ Please select at least one PDF file");
      return;
    }

    if (!jobDesc.trim()) {
      setError("⚠️ Please enter a job description");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append("files", file));

      const res = await axios.post(`${BASE_URL}/upload_files/`, formData);

      setSessionId(res.data.session_id);
      setIsUploaded(true)
      setSuccess("🎉 Upload complete! Click Analyze to see results.");
    } catch {
      setError("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------- ANALYZE
  const handleAnalyze = async () => {
    setError("");
    setSuccess("");

    if (!jobDesc.trim()) {
      setError("⚠️ Please enter a job description");
      return;
    }

    setAnalyzing(true);

    try {
      const res = await axios.post(`${BASE_URL}/rank`, {
        session_id: sessionId,
        job_description: jobDesc
      });

      setResults(res.data.ranking || []);
    } catch {
      setError("❌ Error analyzing resumes");
    } finally {
      setAnalyzing(false);
    }
  };

  // ---------------- STATS
  const avgScore =
    results.length > 0
      ? (results.reduce((a, b) => a + b.score, 0) / results.length).toFixed(1)
      : 0;

  const topScore = results.length > 0 ? results[0].score.toFixed(1) : 0;


// ------------------------------------- Categorize results (CORE LOGIC)

  const recommended = results.filter(
    (r) => r.score >= 60 && r.matched?.length > 0
  );

  const moderate = results.filter(
    (r) => r.score >= 40 && r.score < 60 && r.matched?.length > 0
  );

  const notSuitable = results.filter(
    (r) => r.score < 40 || !r.matched || r.matched.length === 0
  );



    // ---------------- REUSABLE STYLES

  const cardStat = {
    flex: 1,
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    textAlign: "center",
    border: "1px solid #eef1f5"
  };

  const fileBtn = {
    display: "inline-block",
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  };

  const textareaStyle = {
    width: "100%",
    height: "100px",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px"
  };

  const resultCard = (score) => ({
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    borderLeft: `6px solid ${
      score > 70 ? "#28a745" : score > 40 ? "#ffc107" : "#dc3545"
    }`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",   // ✅ adds depth
    transition: "all 0.2s ease"                 // ✅ smooth hover
  });

  const progressBar = {
    height: "10px",
    background: "#eee",
    borderRadius: "5px",
    margin: "10px 0",
    overflow: "hidden"
  };

  const progressFill = {
    height: "100%",
    borderRadius: "5px",
    transition: "width 0.5s"
  };

  // ---------------------------Add reusable card function (clean FAANG-style)

  const renderCard = (r, i) => (
    <div
      key={i}
      style={resultCard(r.score)}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      
    >


      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{r.name}</h3>
        <strong>{r.score.toFixed(1)}%</strong>
      </div>

      {/* Progress */}
      <div style={progressBar}>
        <div
          style={{
            ...progressFill,
            width: `${r.score}%`,
            background:
              r.score > 70 ? "green" : r.score > 40 ? "orange" : "red"
          }}
        />
      </div>

      {/* <p><strong>✅ Matched:</strong> {r.matched?.join(", ") || "None"}</p>
      <p><strong>❌ Missing:</strong> {r.missing?.join(", ") || "None"}</p> */}


      <p>
        <strong>❌ Missing:</strong>{" "}
        {r.missing?.length > 0 ? (
          <span style={{ color: "#ef4444" }}>
            {r.missing.join(", ")}
          </span>
        ) : (
          <span style={{ color: "#22c55e" }}>
            🎯 Strong match
          </span>
        )}
      </p>


    </div>
  );

  
  // ---------------- STYLES

  const btnStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #3b82f6)", // 🔥 modern gradient
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginRight: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>

     {/* ---------------- SIDEBAR */}
      <div style={{
        width: "240px",
        background: "#111827",
        color: "white",
        padding: "25px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
      }}>

        {/* TOP SECTION */}
        <div style={{ textAlign: "center" }}>
          
          {/* Logo Circle */}
          <div style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            fontSize: "26px",
            fontWeight: "bold"
          }}>
            🤖
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            color: "#9ca3af"
          }}>
            AI Dashboard
          </h2>

          {/* Subtitle */}
 

          <div style={{ marginTop: "20px" }}>
            <div
              onClick={() => setShowGuide(!showGuide)}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#9ca3af",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>📘 How to Use</span>
              <span>{showGuide ? "−" : "+"}</span>
            </div>

            {showGuide && (
              <ul style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "#d1d5db",
                lineHeight: "1.6",
                paddingLeft: "15px"
              }}>

                <li><strong> Choose Files</strong></li> or
                <li><strong>Try Demo Resumes</strong></li><br></br>
                <li>Enter job description</li>
                <li>Click Upload</li>
                <li>Click Analyze</li>
              </ul>
            )}
          </div>


          {/* Divider */}
          <div style={{
            height: "1px",
            background: "#374151",
            margin: "20px 0"
          }} />
        </div>



        {/* OPTIONAL FOOTER */}
        <div style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center"
        }}>
          © 2026 AI Hiring Tool
        </div>

      </div>

      {/* ---------------- MAIN CONTENT */}

      <div style={{
        flex: 1,
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>

        {/* <h1>AI Resume Screening</h1> */}
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <div>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "5px",
              color: "#111827"
            }}>
               Smart Resume Screening
            </h1>
            <hr></hr>
            <p style={{
              fontSize: "14px",
              color: "#6b7280"
            }}>
               Analyze and rank candidates intelligently
            </p>
          </div>

          {/* Right side (optional but powerful) */}
          <div style={{
            fontSize: "13px",
            color: "#6b7280"
          }}>
            📄 {files.length} files uploaded
          </div>
        </div>
        

        {/* ---------------- FILE INPUT */}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          id="fileUpload"
          style={{ display: "none" }}
          onChange={(e) => setFiles(e.target.files)}
        />



        <label
          htmlFor="fileUpload"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-block",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
            transition: "all 0.2s ease"
          }}
        >
          📂 Choose Files
        </label>


    {/*------------------------------ Professional “Try Sample Resumes (Drive)” Button */}

        <button
          type="button"
          onClick={() => {
            window.open(
              "https://drive.google.com/drive/folders/1NYofXCRcWvorkcFwZdDZP7_FlNxtJnBN?usp=drive_link",
              "_blank"
            );
          }}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #4338ca)", 
            color: "white",
            padding: "15px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            display: "inline-block",
            marginLeft: "10px",
            border: "none",
            boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
            transition: "all 0.2s ease"
          }}

          // Hover
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(79,70,229,0.4)";
            e.currentTarget.style.filter = "brightness(1.1)";
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
            e.currentTarget.style.filter = "brightness(1)";
          }}

          // Click press
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(2px)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
          }}

          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
          }}
        >
            🌐 Try Demo Resumes
        </button>


        {files.length > 0 && (
          <p style={{ marginTop: "10px" }}>
            📄 {files.length} file(s) selected
          </p>
        )}

        {/* ---------------- TEXTAREA */}
        <textarea
          placeholder="Enter Job Description"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={textareaStyle}
        />

        {/* ---------------- BUTTONS */}
        <div style={{ marginTop: "15px" }}>
          <button type="button"
            onClick={handleUpload}
            style={{
              ...btnStyle,
              opacity: files.length && jobDesc.trim() && !uploading && !isUploaded ? 1 : 0.5,
              cursor:
                files.length && jobDesc.trim() && !uploading && !isUploaded
                  ? "pointer"
                  : "not-allowed"
            }}
            disabled={!files.length || !jobDesc.trim() || uploading || isUploaded}
          >
            {uploading ? "Uploading..." : isUploaded ? "Uploaded ✓": "Upload"}
          </button>

          
          <button type="button"
            onClick={handleAnalyze}
            style={{
              ...btnStyle,
              opacity: sessionId && !analyzing ? 1 : 0.5,
              cursor: sessionId && !analyzing ? "pointer" : "not-allowed"
            }}
            disabled={!sessionId || analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>

                {/* --------------------------------------------------Add RESET button  */}

          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setJobDesc("");
              setResults([]);
              setSessionId("");
              setIsUploaded(false);

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}

            style={{
              ...btnStyle,
              background: "linear-gradient(135deg, #6b7280, #4b5563)", // 🔥 subtle gray gradient
              marginLeft: "10px"
            }}

                      
            // 🔥 Click press effect
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(2px)";
              e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}

            onMouseUp={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            Reset
          </button>

        </div>

{/* ------------------------------------------------------------------- MESSAGE */}
        {(error || success) && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.3s",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "6px",
              background: error ? "#ffe6e6" : "#e6ffe6"
            }}
          >
            {error || success}
            <button onClick={handleCloseMessage} style={{ float: "right" }}>
              ×
            </button>
          </div>
        )}

        {/* ---------------- STATS CARDS */}
        <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
          <div style={cardStat}>
            <h3>{results.length}</h3>
            <p>Total Candidates</p>
          </div>

          <div style={cardStat}>
            <h3>{avgScore}%</h3>
            <p>Average Score</p>
          </div>

          <div style={cardStat}>
            <h3>{topScore}%</h3>
            <p>Top Score</p>
          </div>
        </div>

        

        {/* ---------------- RESULTS */}

        <div style={{ marginTop: "35px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "15px",
            color: "#111827",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📊 Candidate Analysis
          </h2>

          <div style={{
            height: "2px",
            width: "50px",
            background: "#3b82f6",
            borderRadius: "2px",
            marginBottom: "20px"
          }} />


          {/* ---------------- RECOMMENDED */}
          {recommended.length > 0 && (
            <>
              <h3 style={{ color: "green" }}>🔥 Recommended</h3>
              {recommended.map((r, i) => (
                <div key={i} style={resultCard(r.score)}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>{r.name}</h3>
                    <strong>{r.score.toFixed(1)}%</strong>
                  </div>

                  <div style={progressBar}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${r.score}%`,
                        background: "green"
                      }}
                    />
                  </div>

                  {/* <p>✅ {r.matched?.join(", ") || "None"}</p>
                  <p>❌ {r.missing?.join(", ") || "None"}</p> */}

                  <p>
                    <strong>✅ Skills Found:</strong>{" "}
                    {r.matched?.length > 0 ? (
                      <span style={{ color: "#22c55e" }}>
                        {r.matched.join(", ")}
                      </span>
                    ) : (
                      <span style={{ color: "#6b7280" }}>
                        No matching skills identified
                      </span>
                    )}
                  </p>
                  {r.missing?.length > 0 ? (
                    <p>
                      <strong>❌ Missing:</strong>{" "}
                      <span style={{ color: "#ef4444" }}>
                        {r.missing.join(", ")}
                      </span>
                    </p>
                  ) : (
                    r.matched?.length > 0 && (
                      <p>
                        <span style={{ color: "#22c55e", fontWeight: "500" }}>
                          ✅ All required skills present
                        </span>
                      </p>
                    )
                  )}
                </div>
              ))}
            </>
          )}

          {/* ---------------- MODERATE */}
          {moderate.length > 0 && (
            <>
              <h3 style={{ color: "orange", marginTop: "20px" }}>⚖️ Moderate</h3>
              {moderate.map((r, i) => (
                <div key={i} style={resultCard(r.score)}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>{r.name}</h3>
                    <strong>{r.score.toFixed(1)}%</strong>
                  </div>

                  <div style={progressBar}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${r.score}%`,
                        background: "orange"
                      }}
                    />
                  </div>

                  {/* <p>✅ {r.matched?.join(", ") || "None"}</p>
                  <p>❌ {r.missing?.join(", ") || "None"}</p> */}

                  <p>
                    <strong>✅ Skills Found:</strong>{" "}
                    {r.matched?.length > 0 ? (
                      <span style={{ color: "#22c55e" }}>
                        {r.matched.join(", ")}
                      </span>
                    ) : (
                      <span style={{ color: "#6b7280" }}>
                        No matching skills identified
                      </span>
                    )}
                  </p>
                  {r.missing?.length > 0 ? (
                    <p>
                      <strong>❌ Missing:</strong>{" "}
                      <span style={{ color: "#ef4444" }}>
                        {r.missing.join(", ")}
                      </span>
                    </p>
                  ) : (
                    r.matched?.length > 0 && (
                      <p>
                        <span style={{ color: "#22c55e", fontWeight: "500" }}>
                          ✅ All required skills present
                        </span>
                      </p>
                    )
                  )}

                </div>
              ))}
            </>
          )}

          {/* ---------------- NOT SUITABLE */}
          {notSuitable.length > 0 && (
            <>
              <h3 style={{ color: "red", marginTop: "20px" }}>❌ Not Suitable</h3>
              {notSuitable.map((r, i) => (
                <div key={i} style={resultCard(r.score)}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>{r.name}</h3>
                    <strong>{r.score.toFixed(1)}%</strong>
                  </div>

                  <div style={progressBar}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${r.score}%`,
                        background: "red"
                      }}
                    />
                  </div>

                  {/* <p>✅ {r.matched?.join(", ") || "None"}</p>
                  <p>❌ {r.missing?.join(", ") || "None"}</p> */}

                  <p>
                    <strong>✅ Skills Found:</strong>{" "}
                    {r.matched?.length > 0 ? (
                      <span style={{ color: "#22c55e" }}>
                        {r.matched.join(", ")}
                      </span>
                    ) : (
                      <span style={{ color: "#6b7280" }}>
                        No matching skills identified
                      </span>
                    )}
                  </p>
                  {r.missing?.length > 0 ? (
                    <p>
                      <strong>❌ Missing:</strong>{" "}
                      <span style={{ color: "#ef4444" }}>
                        {r.missing.join(", ")}
                      </span>
                    </p>
                  ) : (
                    r.matched?.length > 0 && (
                      <p>
                        <span style={{ color: "#22c55e", fontWeight: "500" }}>
                          ✅ All required skills present
                        </span>
                      </p>
                    )
                  )}

                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default App;