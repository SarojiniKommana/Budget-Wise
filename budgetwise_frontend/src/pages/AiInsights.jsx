import React from "react";
import { useEffect, useRef, useState } from "react";
import "./transactions.css";

const SUGGESTIONS = [
  "How much did I spend on food this month?",
  "Which category am I overspending on?",
  "How can I save more next month?",
];

export default function AIInsights() {
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Chat state ----
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatWindowRef = useRef(null);

  const email = localStorage.getItem("userEmail") || "";

  // ---- Load insights ----
  useEffect(() => {
    fetch(`http://localhost:8080/api/ai/insights?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary || "");
        setInsights(data.insights || []);
        setTips(data.tips || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch insights:", err);
        setError("Could not load insights. Please try again.");
        setLoading(false);
      });
  }, [email]);

  // ---- Load chat history ----
  useEffect(() => {
    fetch(`http://localhost:8080/api/chat/history?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoadingHistory(false);
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
        setChatError("Could not load chat history.");
        setLoadingHistory(false);
      });
  }, [email]);

  // Scroll only the chat window (not the whole page) to the newest message
  useEffect(() => {
    const el = chatWindowRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const optimisticUserMsg = { role: "user", content: trimmed, id: `temp-${Date.now()}` };
    setMessages((prev) => [...prev, optimisticUserMsg]);
    setInput("");
    setSending(true);
    setChatError("");

    try {
      const res = await fetch("http://localhost:8080/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: trimmed }),
      });

      if (!res.ok) throw new Error("Request failed");

      const assistantMsg = await res.json();
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setChatError("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-page-container">
      {/* ---------- INSIGHTS SECTION ---------- */}
      <div className="ai-insights-container">
        <h2>AI Insights</h2>
        <p className="ai-subtitle">Your spending this month, compared with last month.</p>

        {loading && <p className="empty-state">Loading AI insights...</p>}
        {error && <p className="chat-error">{error}</p>}

        {!loading && !error && (
          <>
            {summary && <div className="insights-summary-card">{summary}</div>}

            <h3>Key Insights</h3>
            {insights.length === 0 ? (
              <p className="empty-state">No insights available for this month yet.</p>
            ) : (
              <div className="insight-cards">
                {insights.map((item, idx) => (
                  <div className="insight-card" key={idx}>
                    <div className="insight-card-header">
                      <span className="insight-category">{item.category}</span>
                      <span className="insight-amount">₹{item.currentAmount}</span>
                    </div>
                    {item.changePercent != null && (
                      <span className={`change-badge ${item.changePercent > 0 ? "badge-up" : "badge-down"}`}>
                        {item.changePercent > 0 ? "▲" : "▼"} {Math.abs(item.changePercent)}%
                      </span>
                    )}
                    <p className="insight-message">{item.message}</p>
                  </div>
                ))}
              </div>
            )}

            <h3>Saving Tips</h3>
            {tips.length === 0 ? (
              <p className="empty-state">No saving tips available right now.</p>
            ) : (
              <div className="tip-cards">
                {tips.map((tip, idx) => (
                  <div className="tip-card" key={idx}>
                    <div className="tip-card-header">
                      <span className="tip-category">{tip.category}</span>
                      {tip.potentialSavings > 0 && (
                        <span className="savings-badge">Save ~₹{tip.potentialSavings}</span>
                      )}
                    </div>
                    <p className="tip-suggestion">{tip.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- CHAT SECTION ---------- */}
      <div className="ai-chat-container">
        <div className="chat-header">
          <div className="chat-avatar">AI</div>
          <div>
            <h2>Ask BudgetWise AI</h2>
            <span className="chat-status">
              <span className="chat-status-dot" /> Online · knows your transactions
            </span>
          </div>
        </div>

        <div className="chat-window" ref={chatWindowRef}>
          {loadingHistory ? (
            <p className="chat-empty-state">Loading chat...</p>
          ) : messages.length === 0 ? (
            <div className="chat-empty-state">
              <p>Ask me anything about your spending.</p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chat-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}
              >
                {msg.content}
              </div>
            ))
          )}

          {sending && (
            <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>

        {chatError && <p className="chat-error">{chatError}</p>}

        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your spending..."
            disabled={sending}
          />
          <button onClick={handleSend} disabled={sending || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}