import React, { useState } from "react";
import { Button, Spinner, Card, Table, Container, Row } from "react-bootstrap";
import { FaFileInvoice, FaInfoCircle } from "react-icons/fa";
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setReportHeader(data.headers);
        setReportData(data.rows);
      } else {
        setError(data.message || "Failed to load report");
      }
    } catch {
      setError("An error occurred while fetching the report.");
    } finally {
      setLoading(false);
    }
  };

  const clearReport = () => {
    setReportName("");
    setReportHeader([]);
    setReportData([]);
    setError("");
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Reports</h2>

      <Row className="justify-content-center mb-3 gap-2">
        {reportOptions.map((option) => (
          <Button
            key={option.value}
            variant={
              reportName === option.value ? "primary" : "outline-primary"
            }
            onClick={() => fetchReport(option.value)}
            className="d-flex align-items-center justify-content-center"
            style={{ width: "330px", height: "40px" }}
          >
            <FaFileInvoice size={24} className="me-2" />
            <span className="text-center">{option.label}</span>
          </Button>
        ))}
      </Row>

      {reportName && (
        <div className="d-flex justify-content-center align-items-center mb-4 gap-3">
          <h4 className="text-capitalize mb-0">
            {reportName.replace(/_/g, " ")}
          </h4>
          <Button variant="outline-danger" size="sm" onClick={clearReport}>
            Deselect Report
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-2">Loading report...</p>
        </div>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && reportData.length > 0 && (
        <Card className="shadow-lg p-3 mb-5 bg-body rounded">
            <Table
              responsive
              bordered
              hover
              className="align-middle"
              style={{
                borderColor: "#cfe2ff",
                borderRadius: "0.375rem",
                overflow: "hidden",
              }}
            >
              <thead
                style={{
                  backgroundColor:
                    "linear-gradient(90deg, #0d6efd 0%, #4dabf7 100%)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                <tr>
                  {reportHeader.map((header) => (
                    <th
                      key={header}
                      className="text-capitalize text-center"
                      style={{ borderColor: "#a5d8ff", padding: "12px 10px" }}
                    >
                      {header.replace(/_/g, " ").replace(/N/g, " N")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "white",
                      transition: "background-color 0.2s ease",
                    }}
                    className="table-row-hover"
                  >
                    {reportHeader.map((header, i) => (
                      <td
                        key={i}
                        className="text-center"
                        style={{ borderColor: "#cfe2ff", padding: "10px" }}
                      >
                        {row[i] ?? row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
        </Card>
      )}

      {!loading && !error && reportData.length === 0 && reportName && (
        <p className="text-muted text-center">
          {" "}
          <FaInfoCircle />
          No No data found for this report.
        </p>
      )}
    </Container>
  );
};

export default ReportView;
