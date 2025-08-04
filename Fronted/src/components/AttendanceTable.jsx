/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx-js-style';

const AttendanceTable = () => {
  const [records, setRecords] = useState({});
  const [dates, setDates] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  const fetchRangeAttendance = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/all`);
      setRawData(res.data);
      const grouped = {};
      const dateSet = new Set();

      res.data.forEach((entry) => {
        const entryDate = new Date(entry.date).toISOString().slice(0, 10);
        if (entryDate >= fromDate && entryDate <= toDate) {
          dateSet.add(entryDate);
          if (Array.isArray(entry.records)) {
            entry.records.forEach((rec) => {
              if (!rec || !rec.rollNumber || !rec.status) return;
              const roll = rec.rollNumber;
              const status = rec.status.toLowerCase() === 'present' ? 'P' : 'A';

              if (!grouped[roll]) grouped[roll] = {};
              grouped[roll][entryDate] = status;
            });
          }
        }
      });

      const sortedDates = Array.from(dateSet).sort();
      setDates(sortedDates);
      setRecords(grouped);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  useEffect(() => {
    fetchRangeAttendance();
  }, [fromDate, toDate]);

  const exportToExcel = () => {
    const data = Object.entries(records).map(([roll, dateStatus]) => {
      const row = { RollNumber: roll };

      // Extract name from rawData
      let studentName = 'Unknown';
      for (const entry of rawData) {
        for (const rec of entry.records || []) {
          if (rec.rollNumber === roll && rec.studentId?.name) {
            studentName = rec.studentId.name;
            break;
          }
        }
        if (studentName !== 'Unknown') break;
      }

      row['Name'] = studentName;

      dates.forEach((date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        row[formattedDate] = dateStatus[date] || '--';
      });

      const total = dates.length;
      const present = dates.filter((d) => dateStatus[d] === 'P').length;
      row['Attendance %'] = total ? `${Math.round((present / total) * 100)}%` : '0%';

      return row;
    });

    const ws = XLSX.utils.json_to_sheet([]);

    // Format heading and subheading
    XLSX.utils.sheet_add_aoa(ws, [["Attendance Sheet"]], { origin: "A1" });
    const formattedFrom = new Date(fromDate).toLocaleDateString('en-GB');
    const formattedTo = new Date(toDate).toLocaleDateString('en-GB');
    XLSX.utils.sheet_add_aoa(ws, [[`Date Range: ${formattedFrom} to ${formattedTo}`]], { origin: "A2" });

    const headers = ["RollNumber", "Name", ...dates.map(d => new Date(d).toLocaleDateString('en-GB')), "Attendance %"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });
    XLSX.utils.sheet_add_json(ws, data, { origin: "A5", skipHeader: true });

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];

    // Heading style
    ws['A1'].s = {
      font: { bold: true, sz: 20 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };

    // Subheading style
    ws['A2'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };

    // Header row styling
    headers.forEach((_, i) => {
      const col = XLSX.utils.encode_col(i);
      const cell = `${col}4`;
      if (!ws[cell]) ws[cell] = { t: 's', v: headers[i] };
      ws[cell].s = {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: "000000" } },
          bottom: { style: 'thin', color: { rgb: "000000" } },
          left: { style: 'thin', color: { rgb: "000000" } },
          right: { style: 'thin', color: { rgb: "000000" } }
        }
      };
    });

    // Add border to data rows
    const rowCount = data.length;
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < headers.length; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: i + 4, c: j }); // +4 due to heading rows
        if (ws[cellRef]) {
          ws[cellRef].s = {
            border: {
              top: { style: 'thin', color: { rgb: "000000" } },
              bottom: { style: 'thin', color: { rgb: "000000" } },
              left: { style: 'thin', color: { rgb: "000000" } },
              right: { style: 'thin', color: { rgb: "000000" } }
            },
            alignment: { horizontal: 'center' }
          };
        }
      }
    }

    ws['!cols'] = headers.map(() => ({ wch: 18 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${fromDate}_to_${toDate}.xlsx`);
  };

  const sortedRolls = Object.keys(records).sort();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="overflow-x-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-4">Attendance Sheet</h2>

      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <label>
          From:{' '}
          <input
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>

        <label>
          To:{' '}
          <input
            type="date"
            value={toDate}
            max={today}
            min={fromDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>

        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </button>
      </div>

      {dates.length === 0 ? (
        <p className="text-gray-600">No attendance records found in the selected range.</p>
      ) : (
        <table className="border-collapse border w-full text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-100">Roll No</th>
              {dates.map((date) => (
                <th key={date} className="border px-3 py-2 bg-gray-100">
                  {new Date(date).toLocaleDateString('en-GB')}
                </th>
              ))}
              <th className="border px-3 py-2 bg-gray-100">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {sortedRolls.map((roll) => {
              const present = dates.filter((d) => records[roll][d] === 'P').length;
              const percent = dates.length ? Math.round((present / dates.length) * 100) : 0;

              return (
                <tr key={roll}>
                  <td className="border px-3 py-2 text-center font-medium">{roll}</td>
                  {dates.map((date) => (
                    <td key={date} className="border px-3 py-2 text-center">
                      {records[roll][date] || '--'}
                    </td>
                  ))}
                  <td className="border px-3 py-2 text-center font-semibold">{percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceTable;
