import { useState } from "react";
import { useListPfProposals, useCreatePfProposal, useDeletePfProposal, useUpdatePfProposalStatus, useListPfClients, getListPfProposalsQueryKey } from "@workspace/api-client-react";
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
import { FileText, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/format";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  title: z.string().min(1, "Title required"),
  currency: z.string().default("USD"),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { data: clients } = useListPfClients();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientId: "", title: "", currency: "USD", validUntil: "", notes: "" },
  });

  const mutation = useCreatePfProposal({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPfProposalsQueryKey() });
        toast({ title: "Proposal created" });
        reset();
        onClose();
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data: { ...data, lineItems: [] } });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Proposal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client *</Label>
            <Select onValueChange={v => setValue("clientId", v)}>
              <SelectTrigger data-testid="select-client"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input {...register("title")} data-testid="input-title" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input {...register("currency")} data-testid="input-currency" defaultValue="USD" />
            </div>
            <div className="space-y-1.5">
              <Label>Valid Until</Label>
              <Input type="date" {...register("validUntil")} data-testid="input-valid-until" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input {...register("notes")} data-testid="input-notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-proposal">
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PfProposalsPage() {
  const { data: proposals, isLoading } = useListPfProposals();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeletePfProposal({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPfProposalsQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const statusMutation = useUpdatePfProposalStatus({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPfProposalsQueryKey() }),
    },
  });

  const statuses = ["draft", "sent", "viewed", "accepted", "rejected"];

  return (
    <AppLayout>
      <PageHeader
        title="Proposals"
        action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-proposal"><Plus className="h-4 w-4 mr-1.5" />New Proposal</Button>}
      />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : !proposals?.length ? (
          <EmptyState icon={FileText} title="No proposals yet" description="Create your first proposal for a client." action={<Button onClick={() => setShowCreate(true)}>New Proposal</Button>} />
        ) : (
          <div className="space-y-2">
            {proposals.map(p => (
              <Card key={p.id} data-testid={`card-proposal-${p.id}`}>
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.clientName} · {p.currency} {formatCurrency(p.totalAmount)} · {formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={p.status}
                      onValueChange={v => statusMutation.mutate({ id: p.id, data: { status: v } })}
                    >
                      <SelectTrigger className="h-7 text-xs w-28" data-testid={`select-status-${p.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: p.id })} data-testid={`button-delete-proposal-${p.id}`}>
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
