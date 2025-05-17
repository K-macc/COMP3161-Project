import React, { useState } from "react";
import useAuthFetch from "@/context/AuthFetch";

const reportOptions = [
  {
    label: "Courses with 50+ Students",
    value: "courses_with_50_or_more_students",
  },
  {
    label: "Lecturers Teaching 3+ Courses",
    value: "lecturers_teaching_3_or_more_courses",
  },
  {
    label: "Students with 5+ Courses",
    value: "students_with_5_or_more_courses",
  },
  {
    label: "Top 10 Most Enrolled Courses",
    value: "top_10_most_enrolled_courses",
  },
  {
    label: "Top 10 Students by Average Grade",
    value: "top_10_students_by_average_grade",
  },
];

const ReportView = () => {
  const [reportName, setReportName] = useState("");
  const [reportHeader, setReportHeader] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authFetch = useAuthFetch();

  const fetchReport = async (name) => {
    setLoading(true);
    setError("");
    setReportData([]);
    setReportHeader([]);
    setReportName(name);

    try {
      const token = localStorage.getItem("token");
      const response = await authFetch(`/api/reports/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReportHeader(data.headers);
        setReportData(data.rows);
      } else {
        setError(data.message || "Failed to load report");
      }
    } catch (err) {
      setError("An error occurred while fetching the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Reports</h2>

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
        {reportOptions.map((option) => (
          <button
            key={option.value}
            className={`btn btn-md ${
              reportName === option.value
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => fetchReport(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {reportName && (
        <h4 className="mb-3 text-capitalize text-center">
          {reportName.replace(/_/g, " ")}
        </h4>
      )}

      {loading && (
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-2 spinner"
            role="status"
          >
            <span className="visually-hidden"></span>
          </div>
          <p>Loading report...</p>
        </div>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && reportData.length > 0 && (
        <div className="card shadow-lg p-3 mb-5 bg-body rounded">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-light">
                <tr>
                  {reportHeader.map((header) => (
                    <th key={header} className="text-capitalize">
                      {header.replace(/_/g, " ").replace(/N/g, " N")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    {reportHeader.map((header, i) => (
                      <td key={i}>{row[i] ?? row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && reportData.length === 0 && reportName && (
        <p className="text-muted text-center">No data found for this report.</p>
      )}
    </div>
  );
};

export default ReportView;
