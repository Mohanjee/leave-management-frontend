import { useState } from "react";

const leaveTypes = [
  { type: "Casual Leave", days: 15 },
  { type: "Medical Leave", days: 20 },
];

export default function Comp1() {
  const [selectedLeave, setSelectedLeave] = useState("Casual Leave");
  const [daysRequested, setDaysRequested] = useState(0);
  const [availableLeaves, setAvailableLeaves] = useState(leaveTypes);
  const [history, setHistory] = useState([]);

  const handleApplyLeave = () => {
    const leaveIndex = availableLeaves.findIndex((leave) => leave.type === selectedLeave);
    if (leaveIndex !== -1 && daysRequested > 0 && availableLeaves[leaveIndex].days >= daysRequested) {
      const updatedLeaves = [...availableLeaves];
      updatedLeaves[leaveIndex] = {
        ...updatedLeaves[leaveIndex],
        days: updatedLeaves[leaveIndex].days - daysRequested,
      };
      setAvailableLeaves(updatedLeaves);
      setHistory([...history, { type: selectedLeave, days: daysRequested, date: new Date().toLocaleDateString() }]);
      setDaysRequested(0);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave Management System</h1>
      <div>
        <label>Select Leave Type:</label>
        <select value={selectedLeave} onChange={(e) => setSelectedLeave(e.target.value)}>
          {leaveTypes.map((leave) => (
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
