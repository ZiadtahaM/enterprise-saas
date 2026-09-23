import { useGetAlDashboard } from "@workspace/api-client-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import { Home, UserCheck, Handshake, DollarSign, Bell } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/format";

function StatCard({ label, value, icon: Icon, color = "text-primary" }: { label: string; value: string | number; icon: React.ElementType; color?: string }) {
  return (
    <Card data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={`rounded-full bg-muted p-3 ${color}`}><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AlDashboardPage() {
  const { data, isLoading } = useGetAlDashboard();

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="AgentLead Dashboard" />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="AgentLead Dashboard" description="Your real estate pipeline at a glance" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Properties" value={data?.totalProperties ?? 0} icon={Home} />
          <StatCard label="Leads" value={data?.totalLeads ?? 0} icon={UserCheck} />
          <StatCard label="Active Deals" value={data?.totalDeals ?? 0} icon={Handshake} />
          <StatCard label="Pipeline Value" value={formatCurrency(data?.totalPipelineValue ?? 0)} icon={DollarSign} color="text-green-500" />
        </div>

        {(data?.dealsByStage && Object.keys(data.dealsByStage).length > 0) && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Deals by Stage</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data!.dealsByStage).map(([stage, count]) => (
                  <div key={stage} className="flex items-center gap-2">
                    <StatusBadge status={stage} />
                    <span className="text-sm text-muted-foreground">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(data?.upcomingReminders?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Upcoming Reminders</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data!.upcomingReminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0" data-testid={`reminder-row-${r.id}`}>
                    <p className="text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(r.dueAt)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(data?.recentLeads?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-4 w-4" />Recent Leads</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data!.recentLeads.map(l => (
                  <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0" data-testid={`lead-row-${l.id}`}>
                    <p className="text-sm font-medium">{l.name}</p>
                    <StatusBadge status={l.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
