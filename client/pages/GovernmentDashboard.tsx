import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  X,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Complaint } from "@shared/api";

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "in-progress" | "resolved">("pending");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (!authUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(authUser);
    if (parsedUser.userType !== "government") {
      navigate("/dashboard/public");
      return;
    }

    setUser(parsedUser);
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      const allComplaints = data.complaints || [];
      setComplaints(allComplaints);

      setStats({
        total: allComplaints.length,
        pending: allComplaints.filter((c: Complaint) => c.status === "pending")
          .length,
        inProgress: allComplaints.filter(
          (c: Complaint) => c.status === "in-progress"
        ).length,
        resolved: allComplaints.filter((c: Complaint) => c.status === "resolved")
          .length,
      });
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId: string) => {
    if (!selectedComplaint) return;

    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          status: newStatus,
          message: updateMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update complaint");
      }

      setUpdateMessage("");
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  const filteredComplaints = complaints.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-pending" />;
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "in-progress":
        return "bg-pending/10 text-pending";
      case "resolved":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Complaint Management Portal
          </h1>
          <p className="text-muted-foreground">
            Review and manage citizen complaints reported in your jurisdiction
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Complaints
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.total}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Pending
                </p>
                <p className="text-3xl font-bold text-warning mt-2">
                  {stats.pending}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-warning opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-pending mt-2">
                  {stats.inProgress}
                </p>
              </div>
              <Clock className="w-8 h-8 text-pending opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Resolved
                </p>
                <p className="text-3xl font-bold text-success mt-2">
                  {stats.resolved}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success opacity-50" />
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        {stats.total > 0 && (
          <div className="bg-white rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Resolution Rate</h2>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-success h-full transition-all"
                style={{
                  width: `${((stats.resolved / stats.total) * 100).toFixed(1)}%`,
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {((stats.resolved / stats.total) * 100).toFixed(1)}% of complaints resolved
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              ["all", "pending", "in-progress", "resolved"] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "in-progress"
                    ? "In Progress"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-border">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No complaints in this category</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {complaint.imageUrl && (
                    <img
                      src={complaint.imageUrl}
                      alt={complaint.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {complaint.location.address}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {getStatusIcon(complaint.status)}
                        <span className="text-sm font-medium capitalize">
                          {complaint.status === "in-progress"
                            ? "In Progress"
                            : complaint.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span>
                        Category:{" "}
                        <span className="font-medium capitalize">
                          {complaint.category}
                        </span>
                      </span>
                      <span>
                        Reported by:{" "}
                        <span className="font-medium">{complaint.createdBy}</span>
                      </span>
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setNewStatus(complaint.status);
                        }}
                        className="gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Update Complaint Status
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {selectedComplaint.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedComplaint.description.substring(0, 100)}...
                  </p>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium">
                    New Status
                  </Label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as any)
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md text-foreground bg-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Update Message
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Add an update message (optional)"
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md text-foreground bg-background"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() =>
                      handleUpdateStatus(selectedComplaint.id)
                    }
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedComplaint(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
