import { useState, useEffect } from "react";

export default function Comp1() {
  const [selectedLeave, setSelectedLeave] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);
  const [availableLeaves, setAvailableLeaves] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaves")
      .then((res) => res.json())
      .then((data) => {
        setAvailableLeaves(data);
        if (data.length > 0) {
          setSelectedLeave(data[0].type); // Default to first available leave type
        }
      })
      .catch((error) => console.error("Error fetching leaves:", error));
  }, []);

  const handleApplyLeave = () => {
    const requestBody = { type: selectedLeave, days: daysRequested };
    console.log("Applying leave with:", requestBody);

    fetch("http://localhost:5000/apply-leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to apply leave");
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        setAvailableLeaves((prev) =>
          prev.map((leave) =>
            leave.type === selectedLeave ? { ...leave, days: leave.days - daysRequested } : leave
          )
        );
        setHistory([...history, { type: selectedLeave, days: daysRequested, date: new Date().toLocaleDateString() }]);
        setDaysRequested(0);
      })
      .catch((error) => console.error("Error applying leave:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave Management System</h1>
      <div>
        <label>Select Leave Type:</label>
        <select value={selectedLeave} onChange={(e) => setSelectedLeave(e.target.value)}>
          {availableLeaves.map((leave) => (
            <option key={leave.type} value={leave.type}>{leave.type}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Enter Days:</label>
        <input type="number" value={daysRequested} onChange={(e) => setDaysRequested(Number(e.target.value))} />
      </div>
      <button onClick={handleApplyLeave}>Apply Leave</button>
      <h2>Available Leaves</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Days Available</th>
          </tr>
        </thead>
        <tbody>
          {availableLeaves.map((leave) => (
            <tr key={leave.type}>
              <td>{leave.type}</td>
              <td>{leave.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Leave History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Days Taken</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.type}</td>
              <td>{entry.days}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
