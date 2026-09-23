import { useGetPfDashboard } from "@workspace/api-client-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import { Users, FileText, DollarSign, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";

function StatCard({ label, value, icon: Icon, color = "text-primary" }: { label: string; value: string | number; icon: React.ElementType; color?: string }) {
  return (
    <Card data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={`rounded-full bg-muted p-3 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PfDashboardPage() {
  const { data, isLoading } = useGetPfDashboard();

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="ProposalForge Dashboard" />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="ProposalForge Dashboard" description="Overview of your proposals and revenue" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={data?.totalClients ?? 0} icon={Users} />
          <StatCard label="Total Proposals" value={data?.totalProposals ?? 0} icon={FileText} />
          <StatCard label="Revenue Pending" value={formatCurrency(data?.totalRevenuePending ?? 0)} icon={DollarSign} color="text-yellow-500" />
          <StatCard label="Revenue Collected" value={formatCurrency(data?.totalRevenueCollected ?? 0)} icon={DollarSign} color="text-green-500" />
        </div>

        {(data?.overdueDeposits ?? 0) > 0 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-4 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{data!.overdueDeposits} overdue deposit{data!.overdueDeposits > 1 ? "s" : ""} need attention</span>
            </CardContent>
          </Card>
        )}

        {(data?.proposalsByStatus && Object.keys(data.proposalsByStatus).length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Proposals by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data!.proposalsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    <span className="text-sm text-muted-foreground">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(data?.recentProposals?.length ?? 0) > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data!.recentProposals.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0" data-testid={`proposal-row-${p.id}`}>
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.currency} {formatCurrency(p.totalAmount)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
