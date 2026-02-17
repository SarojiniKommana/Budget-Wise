import { useEffect, useState } from "react";
import "./transactions.css";

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    fetch(`http://localhost:8080/api/ai/insights?email=${email}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          return { message: text, candidates: [] };
        }
      })
      .then((data) => {
        let aiText = "";

        if (data.candidates && data.candidates.length > 0) {
          aiText = data.candidates[0]?.content?.parts?.[0]?.text || "";
        } else if (data.message) {
          aiText = data.message;
        }

        if (!aiText || aiText.toLowerCase().includes("unavailable")) {
          setInsights(["No insights available"]);
          setTips(["No tips available"]);
        } else {
          const insightsSection = aiText.split("Insights:")[1]?.split("Saving Tips:")[0];
          const tipsSection = aiText.split("Saving Tips:")[1];

          const insightsArray = insightsSection
              ? insightsSection
                  .split("\n")
                  .map(i =>
                    i
                      .replace(/^[\d]+[.)-]?\s*/, "")  // remove 1. 2) 3-
                      .replace(/[#•*]/g, "")          // DON'T remove hyphen
                      .trim()
                  )
                  .filter(i => i !== "")
              : [];

          const tipsArray = tipsSection
                ? tipsSection
                    .split("\n")
                    .map(i =>
                      i
                        .replace(/[#•*]/g, "")   // DON'T remove hyphen
                        .trim()
                    )
                    .filter(i => i !== "")
                : [];

          setInsights(insightsArray.length ? insightsArray : ["No insights available"]);
          setTips(tipsArray.length ? tipsArray : ["No tips available"]);
        }

        setLoading(false);
      })
      .catch(() => {
        setInsights(["No insights available"]);
        setTips(["No tips available"]);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <p>Loading AI insights...</p>;

  return (
    <div className="ai-insights-container">
      <h2>🤖 AI Insights</h2>

      <h3>📊 Key Insights</h3>
      <ul className="insights-list">
        {insights.map((insight, idx) => (
          <li key={idx}>{insight}</li>
        ))}
      </ul>

      <h3>💰 Saving Tips</h3>
      <ul className="tips-list">
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}