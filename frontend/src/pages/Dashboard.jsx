import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Clock3,
  XCircle,
} from "lucide-react";
import { getRequests } from "../api/requests";
import StatCard from "../components/StatCard";
import RequestTable from "../components/RequestTable";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getRequests('STAFF')
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);
  const count = (status) =>
    requests.filter((request) => request.status === status).length;
  const firstName = "Admin";
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">OPERATIONS OVERVIEW</span>
          <h1>
            Good morning, {firstName} <span>👋</span>
          </h1>
          <p>Here's what's happening across your operations.</p>
        </div>
        <Link className="button button-primary" to="/requests">
          View requests
          <ArrowRight size={17} />
        </Link>
      </div>
      <section className="workflow-strip">
        <div>
          <span className="eyebrow">THE CAMPUSFLOW SYSTEM</span>
          <strong>
            Every request moves from intent to action — with a human in control.
          </strong>
        </div>
        <div className="flow-steps">
          <span>Request</span>
          <i />
          <span>AI</span>
          <i />
          <span>Approval</span>
          <i />
          <span>Action</span>
          <i />
          <span>Audit</span>
        </div>
      </section>
      <section className="stat-grid">
        <StatCard
          label="Total requests"
          value={loading ? "—" : requests.length}
          icon={ClipboardList}
          tone="blue"
          hint="All time"
        />
        <StatCard
          label="Pending approval"
          value={loading ? "—" : count("PENDING_APPROVAL")}
          icon={Clock3}
          tone="amber"
          hint="Needs your review"
        />
        <StatCard
          label="Completed"
          value={loading ? "—" : count("COMPLETED")}
          icon={CheckCircle2}
          tone="green"
          hint="Successfully closed"
        />
        <StatCard
          label="Rejected"
          value={loading ? "—" : count("REJECTED")}
          icon={XCircle}
          tone="red"
          hint="Declined requests"
        />
        <StatCard
          label="Automated"
          value={
            loading
              ? "—"
              : Math.max(0, requests.length - count("PENDING_APPROVAL"))
          }
          icon={Bot}
          tone="purple"
          hint="AI prepared"
        />
      </section>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent requests</h2>
            <p>Latest operations waiting to move forward.</p>
          </div>
          <Link to="/requests" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="table-loading">Loading requests…</div>
        ) : (
          <RequestTable requests={requests.slice(0, 4)} compact />
        )}
      </section>
    </>
  );
}
