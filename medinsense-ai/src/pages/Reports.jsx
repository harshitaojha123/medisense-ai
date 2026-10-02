import { motion } from "framer-motion";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  HeartPulse,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Trash2,
  Download,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

function Reports() {
  const [search, setSearch] = useState("");

  const [showUpload, setShowUpload] = useState(false);

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [uploadError, setUploadError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  /* =====================================================

     FETCH REPORTS

  ===================================================== */

  const fetchReports = async () => {
    const token = localStorage.getItem("medisense_token");

    if (!token) {
      setError("Authentication required. Please sign in again.");

      setLoading(false);

      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/reports`,

        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load your reports.");

        return;
      }

      const reportData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.reports)
          ? data.reports
          : Array.isArray(data)
            ? data
            : [];

      setReports(reportData);
    } catch (err) {
      console.error(
        "Reports request failed:",

        err,
      );

      setError("Unable to connect to the MediSense server.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================

     INITIAL LOAD

  ===================================================== */

  useEffect(() => {
    fetchReports();
  }, []);

  /* =====================================================

     NORMALIZE REPORT DATA

  ===================================================== */

  const normalizedReports = useMemo(() => {
    return reports.map((report) => {
      const parameterCount =
        report.parameter_count ??
        report.parameters_count ??
        report.parameters ??
        0;

      let status = report.status || report.analysis_status || "Uploaded";

      status = String(status)
        .toLowerCase()

        .replace("_", " ");

      status = status.charAt(0).toUpperCase() + status.slice(1);

      return {
        ...report,

        id: report.id ?? report.report_id,

        name:
          report.name || report.title || report.report_name || "Medical Report",

        type: report.type || report.report_type || "Medical Report",

        date: report.created_at || report.uploaded_at || report.date,

        status,

        parameters: Number(parameterCount) || 0,

        insight:
          report.insight || report.description || getStatusInsight(status),
      };
    });
  }, [reports]);

  /* =====================================================

     SEARCH

  ===================================================== */

  const filteredReports = normalizedReports.filter(
    (report) =>
      report.name

        .toLowerCase()

        .includes(search.toLowerCase()) ||
      report.type

        .toLowerCase()

        .includes(search.toLowerCase()),
  );

  /* =====================================================

     STATISTICS

  ===================================================== */

  const totalReports = normalizedReports.length;

  const analyzedReports = normalizedReports.filter(
    (report) => report.status.toLowerCase() === "analyzed",
  ).length;

  const processingReports = normalizedReports.filter((report) => {
    const status = report.status.toLowerCase();

    return status.includes("processing") || status.includes("pending");
  }).length;

  /*

   * The current backend does not calculate

   * an AI insight count in the report response.

   *

   * Therefore we only show the number of reports

   * that have actually reached analyzed state.

   */

  const aiInsights = normalizedReports.filter(
    (report) => report.status.toLowerCase() === "analyzed",
  ).length;

  /* =====================================================

     FILE SELECTION

  ===================================================== */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setUploadError("");

    if (!file) {
      setSelectedFile(null);

      return;
    }

    const allowedTypes = [
      "application/pdf",

      "image/jpeg",

      "image/png",

      "image/webp",
    ];

    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

    const fileName = file.name.toLowerCase();

    const extensionAllowed = allowedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    const typeAllowed = allowedTypes.includes(file.type);

    if (!typeAllowed && !extensionAllowed) {
      setUploadError(
        "Unsupported file type. Please upload a PDF, JPG, PNG or WEBP file.",
      );

      setSelectedFile(null);

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be 10 MB or less.");

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  /* =====================================================

     UPLOAD REPORT

  ===================================================== */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please choose a medical report first.");

      return;
    }

    const token = localStorage.getItem("medisense_token");

    if (!token) {
      setUploadError("Your session has expired. Please sign in again.");

      return;
    }

    setUploading(true);

    setUploadError("");

    try {
      const formData = new FormData();

      formData.append(
        "report",

        selectedFile,
      );

      const response = await fetch(
        `${API_URL}/api/reports/upload`,

        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.message || "Unable to upload the report.");

        return;
      }

      /*

       * Upload succeeded.

       *

       * Close modal and reload the

       * authenticated report list.

       */

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowUpload(false);

      await fetchReports();
    } catch (err) {
      console.error(
        "Report upload failed:",

        err,
      );

      setUploadError("Unable to connect to the MediSense server.");
    } finally {
      setUploading(false);
    }
  };

  /* =====================================================

     DELETE REPORT

  ===================================================== */

  const handleDelete = async (reportId) => {
    if (!reportId) return;

    const confirmed = window.confirm(
      "Delete this report? This action cannot be undone.",
    );

    if (!confirmed) return;

    const token = localStorage.getItem("medisense_token");

    if (!token) {
      setError("Authentication required.");

      return;
    }

    setDeletingId(reportId);

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${reportId}`,

        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete the report.");

        return;
      }

      setReports((previous) =>
        previous.filter((report) => report.id !== reportId),
      );
    } catch (err) {
      console.error(
        "Delete report failed:",

        err,
      );

      setError("Unable to connect to the MediSense server.");
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================

     DOWNLOAD REPORT

  ===================================================== */

  const handleDownload = async (report) => {
    const token = localStorage.getItem("medisense_token");

    if (!token || !report.id) {
      setError("Unable to access this report.");

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${report.id}/file`,

        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response

          .json()

          .catch(() => null);

        setError(data?.message || "Unable to download the report.");

        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;

      anchor.download =
        report.file_name || report.filename || report.name || "medical-report";

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "Download failed:",

        err,
      );

      setError("Unable to download the report.");
    }
  };

  /* =====================================================

     CLOSE MODAL

  ===================================================== */

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUpload(false);

    setSelectedFile(null);

    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================

     LOADING STATE

  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

            <p className="mt-5 text-sm text-slate-500">
              Loading your reports...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        {/* =====================================================

            HERO / PAGE HEADER

        ===================================================== */}

        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.06] blur-[150px]" />

          <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[150px]" />

          <div className="relative mx-auto max-w-[1400px] px-6 py-20 sm:px-8 lg:px-12">
            <motion.div
              initial={{
                opacity: 0,

                y: 20,
              }}
              animate={{
                opacity: 1,

                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium text-cyan-300">
                  <FileText size={14} />
                  Medical report center
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Your health reports,
                  <span className="block text-cyan-400">
                    organized intelligently.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                  Upload medical reports, organize your health information, and
                  prepare documents for AI-assisted analysis.
                </p>
              </div>

              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                <Upload size={17} />
                Upload Report
              </button>
            </motion.div>
          </div>
        </section>

        {/* =====================================================

            GLOBAL ERROR

        ===================================================== */}

        {error && (
          <section className="mx-auto max-w-[1400px] px-6 pt-8 sm:px-8 lg:px-12">
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-5 py-4">
              <p className="text-sm leading-6 text-red-300">{error}</p>

              <button
                onClick={() => setError("")}
                className="rounded-lg p-1 text-red-300/60 hover:bg-white/5 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================

            STATISTICS

        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={FileText}
              label="Total Reports"
              value={totalReports}
              detail="Across your health history"
            />

            <StatCard
              icon={CheckCircle2}
              label="Analyzed"
              value={analyzedReports}
              detail="Reports with completed analysis"
            />

            <StatCard
              icon={Clock3}
              label="Processing"
              value={processingReports}
              detail="Currently being processed"
            />

            <StatCard
              icon={Brain}
              label="AI Insights"
              value={aiInsights}
              detail="Analyzed reports available"
            />
          </div>
        </section>

        {/* =====================================================

            UPLOAD WORKSPACE

        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Upload card */}

            <motion.div
              whileHover={{
                y: -2,
              }}
              className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/[0.06] to-white/[0.02] p-7 sm:p-9"
            >
              <div className="flex flex-col justify-between gap-8 sm:flex-row">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Upload size={22} />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold">
                    Analyze a new report
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                    Upload a medical document and prepare it for extraction,
                    parameter detection and AI-assisted analysis.
                  </p>
                </div>

                <div className="hidden sm:block">
                  <Sparkles size={28} className="text-cyan-400/40" />
                </div>
              </div>

              <button
                onClick={() => setShowUpload(true)}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-400/20 bg-slate-950/50 px-6 py-10 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.03]"
              >
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Upload size={20} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-white">
                    Drop your report here or click to upload
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    PDF, JPG, PNG and WEBP files supported • Maximum 10 MB
                  </p>
                </div>
              </button>
            </motion.div>

            {/* Processing card */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                <Brain size={21} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                AI-assisted workflow
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                MediSense is designed to organize information before generating
                understandable insights.
              </p>

              <div className="mt-7 space-y-5">
                <ProcessItem
                  number="01"
                  title="Document upload"
                  description="Securely store your report"
                />

                <ProcessItem
                  number="02"
                  title="Parameter detection"
                  description="Identify health measurements"
                />

                <ProcessItem
                  number="03"
                  title="AI analysis"
                  description="Generate explainable insights"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================

            ANALYSIS PREVIEW

        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Activity size={17} />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Latest report
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  {normalizedReports.length > 0
                    ? normalizedReports[0].name
                    : "No reports uploaded yet"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {normalizedReports.length > 0
                    ? `Uploaded on ${formatDate(normalizedReports[0].date)}`
                    : "Upload your first report to begin."}
                </p>
              </div>

              {normalizedReports.length > 0 && (
                <Link
                  to="/health-ai"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Open Health AI
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {normalizedReports.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Parameter
                  name="Report type"
                  value={normalizedReports[0].type}
                  unit=""
                  status="Uploaded"
                />

                <Parameter
                  name="Parameters"
                  value={normalizedReports[0].parameters}
                  unit="detected"
                  status={
                    normalizedReports[0].parameters > 0
                      ? "Available"
                      : "Pending"
                  }
                />

                <Parameter
                  name="Status"
                  value={normalizedReports[0].status}
                  unit=""
                  status="Current"
                />

                <Parameter
                  name="Report ID"
                  value={shortId(normalizedReports[0].id)}
                  unit=""
                  status="Secure"
                />
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-white/[0.08] bg-slate-950/50 px-6 py-10 text-center">
                <FileText size={26} className="mx-auto text-slate-700" />

                <p className="mt-4 text-sm text-slate-500">
                  Your latest report will appear here.
                </p>
              </div>
            )}

            {normalizedReports.length > 0 && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">
                <Brain size={19} className="mt-0.5 shrink-0 text-cyan-400" />

                <div>
                  <p className="text-sm font-medium">AI analysis</p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    AI analysis is available through the Health AI workspace.
                    Results should be interpreted alongside the complete report
                    and appropriate professional guidance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================

            RECENT REPORTS

        ===================================================== */}

        <section className="border-t border-white/[0.06] bg-slate-900/20">
          <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Your documents
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Recent reports
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Browse and manage your uploaded health reports.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-64"
                  />
                </div>

                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/60">
              <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_120px] gap-6 border-b border-white/[0.06] px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-600 lg:grid">
                <span>Report</span>

                <span>Uploaded</span>

                <span>Parameters</span>

                <span>Status</span>

                <span>Actions</span>
              </div>

              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{
                      opacity: 0,

                      y: 10,
                    }}
                    whileInView={{
                      opacity: 1,

                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.35,

                      delay: index * 0.04,
                    }}
                    className="group border-b border-white/[0.06] px-5 py-6 last:border-0 sm:px-6"
                  >
                    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_120px] lg:items-center lg:gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          <FileText size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-medium">
                            {report.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-600">
                            {report.type}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600 lg:hidden">
                          Uploaded
                        </p>

                        <p className="mt-1 text-sm text-slate-400 lg:mt-0">
                          {formatDate(report.date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600 lg:hidden">
                          Parameters
                        </p>

                        <p className="mt-1 text-sm text-slate-400 lg:mt-0">
                          {report.parameters} detected
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            report.status

                              .toLowerCase()

                              .includes("analyzed")
                              ? "bg-emerald-400"
                              : report.status

                                    .toLowerCase()

                                    .includes("processing")
                                ? "bg-amber-400"
                                : "bg-cyan-400"
                          }`}
                        />

                        <span
                          className={`text-sm ${
                            report.status

                              .toLowerCase()

                              .includes("analyzed")
                              ? "text-emerald-400"
                              : report.status

                                    .toLowerCase()

                                    .includes("processing")
                                ? "text-amber-400"
                                : "text-cyan-400"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Download report"
                          onClick={() => handleDownload(report)}
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-cyan-400"
                        >
                          <Download size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete report"
                          disabled={deletingId === report.id}
                          onClick={() => handleDelete(report.id)}
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-red-400/10 hover:text-red-400 disabled:opacity-40"
                        >
                          <Trash2 size={17} />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Activity size={15} className="text-cyan-400" />

                        <span className="text-xs text-slate-500">
                          Report status
                        </span>

                        <span className="text-xs text-slate-300">
                          {report.insight}
                        </span>
                      </div>

                      {report.status

                        .toLowerCase()

                        .includes("analyzed") && (
                        <Link
                          to="/health-ai"
                          className="flex items-center gap-1 text-xs font-medium text-cyan-400"
                        >
                          View Health AI
                          <ArrowUpRight size={14} />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                    <FileText size={25} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {search ? "No matching reports" : "No reports yet"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {search
                      ? "Try a different search term."
                      : "Upload your first medical report to start building your MediSense health workspace."}
                  </p>

                  {!search && (
                    <button
                      onClick={() => setShowUpload(true)}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      <Upload size={16} />
                      Upload Report
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================

            SECURITY SECTION

        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-28 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <InfoCard
              icon={ShieldCheck}
              title="Privacy focused"
              text="Health information should be handled carefully. MediSense uses authenticated access so your reports are associated with your account."
            />

            <InfoCard
              icon={Brain}
              title="Explainable AI"
              text="The goal is not only to produce an output, but to make important factors and insights easier to understand."
            />

            <InfoCard
              icon={HeartPulse}
              title="Health context"
              text="AI-generated information should be interpreted alongside the complete report and appropriate professional guidance."
            />
          </div>
        </section>
      </main>

      {/* =====================================================

          UPLOAD MODAL

      ===================================================== */}

      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,

              scale: 0.96,

              y: 10,
            }}
            animate={{
              opacity: 1,

              scale: 1,

              y: 0,
            }}
            className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
          >
            <button
              onClick={closeUploadModal}
              disabled={uploading}
              className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <X size={19} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
              <Upload size={21} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Upload medical report
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add a document and store it securely in your MediSense health
              workspace.
            </p>

            {/* FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-7 w-full rounded-2xl border border-dashed border-cyan-400/20 bg-cyan-400/[0.03] p-10 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={28} className="mx-auto text-cyan-400" />

              <h3 className="mt-5 font-medium">
                {selectedFile
                  ? selectedFile.name
                  : "Choose your medical report"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {selectedFile
                  ? formatFileSize(selectedFile.size)
                  : "PDF, JPG, PNG or WEBP"}
              </p>

              <div className="mt-6 inline-flex rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300">
                {selectedFile ? "Choose another file" : "Choose file"}
              </div>

              <p className="mt-5 text-xs text-slate-600">
                Maximum file size: 10 MB
              </p>
            </button>

            {/* ERROR */}

            {uploadError && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                {uploadError}
              </div>
            )}

            {/* FILE SELECTED */}

            {selectedFile && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                <FileText size={18} className="shrink-0 text-cyan-400" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setSelectedFile(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* UPLOAD BUTTON */}

            <button
              type="button"
              disabled={uploading || !selectedFile}
              onClick={handleUpload}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Uploading report...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Upload Report
                </>
              )}
            </button>

            <div className="mt-5 flex gap-3 rounded-xl bg-white/[0.03] p-4">
              <ShieldCheck size={17} className="shrink-0 text-cyan-400" />

              <p className="text-xs leading-5 text-slate-500">
                Your report is uploaded through an authenticated MediSense
                session and is associated with your account. AI analysis is
                handled separately from document storage.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* =============================================================

   STAT CARD

\============================================================= */

function StatCard({
  icon: Icon,

  label,

  value,

  detail,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-cyan-400/10">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          <Icon size={18} />
        </div>

        <ArrowUpRight size={16} className="text-slate-700" />
      </div>

      <p className="mt-5 text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </div>
  );
}

/* =============================================================

   PROCESS ITEM

\============================================================= */

function ProcessItem({
  number,

  title,

  description,
}) {
  return (
    <div className="flex gap-4">
      <span className="text-xs font-bold text-cyan-400">{number}</span>

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

/* =============================================================

   PARAMETER

\============================================================= */

function Parameter({
  name,

  value,

  unit,

  status,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-slate-950/60 p-5">
      <p className="text-xs text-slate-600">{name}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="max-w-full truncate text-2xl font-semibold">
          {value}
        </span>

        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

        <span className="text-xs text-cyan-400">{status}</span>
      </div>
    </div>
  );
}

/* =============================================================

   INFO CARD

\============================================================= */

function InfoCard({
  icon: Icon,

  title,

  text,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        <Icon size={20} />
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
    </div>
  );
}

/* =============================================================

   HELPERS

\============================================================= */

function formatDate(date) {
  if (!date) {
    return "Recently";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString(
    "en-IN",

    {
      day: "2-digit",

      month: "short",

      year: "numeric",
    },
  );
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function shortId(id) {
  if (!id) {
    return "--";
  }

  const value = String(id);

  return value.length > 8 ? `${value.slice(0, 8)}...` : value;
}

function getStatusInsight(status) {
  const normalized = String(status).toLowerCase();

  if (normalized.includes("analyzed")) {
    return "Report analysis available";
  }

  if (normalized.includes("processing")) {
    return "Processing in progress";
  }

  if (normalized.includes("pending")) {
    return "Awaiting analysis";
  }

  return "Report uploaded successfully";
}

export default Reports;
