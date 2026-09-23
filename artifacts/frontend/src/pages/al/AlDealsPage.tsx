import { useState } from "react";
import { useListAlDeals, useCreateAlDeal, useDeleteAlDeal, useUpdateAlDealStage, useListAlLeads, useListAlProperties, getListAlDealsQueryKey } from "@workspace/api-client-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Handshake, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/format";

const STAGES = ["prospect", "showing", "offer", "negotiation", "closing", "closed_won", "closed_lost"] as const;

const schema = z.object({
  title: z.string().min(1, "Title required"),
  stage: z.enum(STAGES).default("prospect"),
  dealValue: z.number({ invalid_type_error: "Required" }).positive(),
  currency: z.string().default("USD"),
  leadId: z.string().optional(),
  propertyId: z.string().optional(),
  commissionRate: z.number().optional(),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { data: leads } = useListAlLeads();
  const { data: properties } = useListAlProperties();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", stage: "prospect", dealValue: 0, currency: "USD" },
  });

  const mutation = useCreateAlDeal({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlDealsQueryKey() }); toast({ title: "Deal created" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Deal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input {...register("title")} data-testid="input-title" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Deal Value *</Label>
              <Input type="number" {...register("dealValue", { valueAsNumber: true })} data-testid="input-deal-value" />
              {errors.dealValue && <p className="text-xs text-destructive">{errors.dealValue.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input {...register("currency")} defaultValue="USD" data-testid="input-currency" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Stage</Label>
            <Select defaultValue="prospect" onValueChange={v => setValue("stage", v as typeof STAGES[number])}>
              <SelectTrigger data-testid="select-stage"><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Lead</Label>
              <Select onValueChange={v => setValue("leadId", v === "none" ? undefined : v)}>
                <SelectTrigger data-testid="select-lead"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {leads?.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Property</Label>
              <Select onValueChange={v => setValue("propertyId", v === "none" ? undefined : v)}>
                <SelectTrigger data-testid="select-property"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {properties?.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Commission Rate</Label>
              <Input type="number" step="0.001" {...register("commissionRate", { valueAsNumber: true })} data-testid="input-commission" placeholder="e.g. 0.03" />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Close</Label>
              <Input type="date" {...register("expectedCloseDate")} data-testid="input-close-date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-deal">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AlDealsPage() {
  const { data: deals, isLoading } = useListAlDeals();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeleteAlDeal({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlDealsQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const stageMutation = useUpdateAlDealStage({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAlDealsQueryKey() }) },
  });

  return (
    <AppLayout>
      <PageHeader title="Deals" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-deal"><Plus className="h-4 w-4 mr-1.5" />New Deal</Button>} />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : !deals?.length ? (
          <EmptyState icon={Handshake} title="No deals yet" description="Track your real estate deals from prospect to close." action={<Button onClick={() => setShowCreate(true)}>New Deal</Button>} />
        ) : (
          <div className="space-y-2">
            {deals.map(d => (
              <Card key={d.id} data-testid={`card-deal-${d.id}`}>
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.currency} {formatCurrency(d.dealValue)}
                      {d.leadName && ` · ${d.leadName}`}
                      {d.propertyTitle && ` · ${d.propertyTitle}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={d.stage} onValueChange={v => stageMutation.mutate({ id: d.id, data: { stage: v } })}>
                      <SelectTrigger className="h-7 text-xs w-36" data-testid={`select-stage-${d.id}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: d.id })} data-testid={`button-delete-deal-${d.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <CreateDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppLayout>
  );
}
