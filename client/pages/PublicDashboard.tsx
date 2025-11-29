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
  Upload,
  X,
  Plus,
  Filter,
} from "lucide-react";
import { Complaint } from "@shared/api";

export default function PublicDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "garbage" as const,
    location: "",
    latitude: 0,
    longitude: 0,
    image: null as File | null,
  });

  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (!authUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(authUser));
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
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("category", formData.category);
    formPayload.append("location", formData.location);
    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error("Failed to create complaint");
      }

      setFormData({
        title: "",
        description: "",
        category: "garbage",
        location: "",
        latitude: 0,
        longitude: 0,
        image: null,
      });
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      console.error("Error creating complaint:", error);
    }
  };

  const filteredComplaints = complaints.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <AlertCircle className="w-5 h-5 text-warning" />
        );
      case "in-progress":
        return (
          <Clock className="w-5 h-5 text-pending" />
        );
      case "resolved":
        return (
          <CheckCircle2 className="w-5 h-5 text-success" />
        );
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Report Issues
            </h1>
            <p className="text-muted-foreground">
              File complaints about civic issues in your area
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            New Complaint
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-border p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">
                File a New Complaint
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Issue Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Pothole on Main Street"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md text-foreground bg-background"
                  >
                    <option value="garbage">Garbage/Waste</option>
                    <option value="roads">Roads/Potholes</option>
                    <option value="electricity">Electricity Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-input rounded-md text-foreground bg-background"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location/Address
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter the location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Click on a map or enter address details
                </p>
              </div>

              <div>
                <Label htmlFor="image" className="text-sm font-medium">
                  Photo
                </Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {formData.image ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          {formData.image.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Submit Complaint
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
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
                  ? "All Complaints"
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
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No complaints found</p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>File a Complaint</Button>
            )}
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
                          {complaint.status === "in-progress" ? "In Progress" : complaint.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Category:{" "}
                        <span className="font-medium capitalize">
                          {complaint.category}
                        </span>
                      </span>
                      <span>
                        Reported:{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {complaint.updates.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-medium text-foreground mb-2">
                          Latest Update:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.updates[complaint.updates.length - 1].message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
