import { useState } from "react";
import { useListPfDeposits, useCreatePfDeposit, useDeletePfDeposit, useUpdatePfDepositStatus, useListPfClients, getListPfDepositsQueryKey } from "@workspace/api-client-react";
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
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/format";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  title: z.string().min(1, "Title required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be positive"),
  currency: z.string().default("USD"),
  dueDate: z.string().min(1, "Due date required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { data: clients } = useListPfClients();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientId: "", title: "", amount: 0, currency: "USD", dueDate: "", notes: "" },
  });

  const mutation = useCreatePfDeposit({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPfDepositsQueryKey() }); toast({ title: "Deposit created" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data: { ...data, amount: data.amount } });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Deposit</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client *</Label>
            <Select onValueChange={v => setValue("clientId", v)}>
              <SelectTrigger data-testid="select-client"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>{clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}</SelectContent>
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
              <Label>Amount *</Label>
              <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} data-testid="input-amount" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input {...register("currency")} defaultValue="USD" data-testid="input-currency" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Due Date *</Label>
            <Input type="date" {...register("dueDate")} data-testid="input-due-date" />
            {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input {...register("notes")} data-testid="input-notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-deposit">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PfDepositsPage() {
  const { data: deposits, isLoading } = useListPfDeposits();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeletePfDeposit({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPfDepositsQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const statusMutation = useUpdatePfDepositStatus({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPfDepositsQueryKey() }) },
  });

  const statuses = ["pending", "paid", "overdue", "cancelled"];

  return (
    <AppLayout>
      <PageHeader title="Deposits" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-deposit"><Plus className="h-4 w-4 mr-1.5" />New Deposit</Button>} />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : !deposits?.length ? (
          <EmptyState icon={CreditCard} title="No deposits yet" description="Track deposit requests for your proposals." action={<Button onClick={() => setShowCreate(true)}>New Deposit</Button>} />
        ) : (
          <div className="space-y-2">
            {deposits.map(d => (
              <Card key={d.id} data-testid={`card-deposit-${d.id}`}>
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.clientName} · {d.currency} {formatCurrency(d.amount)} · Due {formatDate(d.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={d.status} onValueChange={v => statusMutation.mutate({ id: d.id, data: { status: v } })}>
                      <SelectTrigger className="h-7 text-xs w-28" data-testid={`select-status-${d.id}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: d.id })} data-testid={`button-delete-deposit-${d.id}`}>
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
