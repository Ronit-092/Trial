import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Eye,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { StatsResponse } from "@shared/api";

export default function Home() {
  const [stats, setStats] = useState<StatsResponse>({
    totalComplaints: 0,
    resolvedComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const user = localStorage.getItem("auth_user")
    ? JSON.parse(localStorage.getItem("auth_user")!)
    : null;

  return (
    <Layout user={user}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background pt-20 pb-24 px-4 md:px-0">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              <Zap className="w-4 h-4" />
              Transparency in Government Services
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Report Issues, Track Progress, See Results
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              CivicVoice empowers citizens to report civic issues like garbage,
              broken roads, and electricity problems directly to authorities.
              Monitor government action in real-time and ensure accountability
              through complete transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {user ? (
                <>
                  <Link to="/dashboard/public">
                    <Button size="lg" className="gap-2">
                      View Dashboard <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  {user.userType === "government" && (
                    <Link to="/dashboard/government">
                      <Button size="lg" variant="outline">
                        Government Panel
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Get Started Free <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Total Issues Reported
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {loading ? "..." : stats.totalComplaints}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Citizens have reported issues affecting their communities
              </p>
            </div>

            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-xl p-8 border border-success/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Issues Resolved
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-success">
                    {loading ? "..." : stats.resolvedComplaints}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Successfully addressed by government authorities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Simple, transparent, and effective. Report issues and track
              government action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div className="pt-20 pb-8">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Report Issues
                </h3>
                <p className="text-muted-foreground text-sm">
                  Upload photos, describe the problem, and mark the exact
                  location on the map. Issues are immediately sent to authorities.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-8 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <div className="pt-20 pb-8">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Track Progress
                </h3>
                <p className="text-muted-foreground text-sm">
                  Monitor real-time updates from government officials as they
                  work on your reported issues. Full transparency every step.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-8 w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-success">3</span>
              </div>
              <div className="pt-20 pb-8">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  See Results
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get notifications when issues are resolved. View before and
                  after updates to confirm action has been taken.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-white py-20 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Complete Transparency
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Real-Time Updates
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track every step as government officials respond to your
                      reports
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Location Mapping
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Precise location marking ensures issues are addressed
                      quickly
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Community Impact
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      See how your reports contribute to improving public
                      services
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background rounded-xl p-8 border border-primary/20">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        Broken Road at Main Street
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported 2 hours ago
                      </p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-warning/20 text-warning rounded">
                      In Progress
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        Garbage Collection Issue
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported 3 days ago
                      </p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-success/20 text-success rounded">
                      Resolved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-primary to-secondary py-16 px-4 md:px-0 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens creating transparency and accountability
              in government services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-white text-primary hover:bg-slate-100"
                >
                  Create Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Already Have Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
