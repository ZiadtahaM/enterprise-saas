import { useState } from "react";
import { useListPfContracts, useCreatePfContract, useDeletePfContract, useUpdatePfContractStatus, useListPfClients, getListPfContractsQueryKey } from "@workspace/api-client-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileSignature, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/format";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { data: clients } = useListPfClients();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientId: "", title: "", content: "" },
  });

  const mutation = useCreatePfContract({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPfContractsQueryKey() }); toast({ title: "Contract created" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Contract</DialogTitle></DialogHeader>
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
          <div className="space-y-1.5">
            <Label>Contract Content *</Label>
            <Textarea {...register("content")} rows={6} data-testid="input-content" placeholder="Enter contract terms and conditions…" />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-contract">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PfContractsPage() {
  const { data: contracts, isLoading } = useListPfContracts();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeletePfContract({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPfContractsQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const statusMutation = useUpdatePfContractStatus({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPfContractsQueryKey() }) },
  });

  const statuses = ["draft", "sent", "signed", "cancelled"];

  return (
    <AppLayout>
      <PageHeader title="Contracts" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-contract"><Plus className="h-4 w-4 mr-1.5" />New Contract</Button>} />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : !contracts?.length ? (
          <EmptyState icon={FileSignature} title="No contracts yet" description="Create your first contract for a client." action={<Button onClick={() => setShowCreate(true)}>New Contract</Button>} />
        ) : (
          <div className="space-y-2">
            {contracts.map(c => (
              <Card key={c.id} data-testid={`card-contract-${c.id}`}>
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.clientName} · {formatDate(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={c.status} onValueChange={v => statusMutation.mutate({ id: c.id, data: { status: v } })}>
                      <SelectTrigger className="h-7 text-xs w-28" data-testid={`select-status-${c.id}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: c.id })} data-testid={`button-delete-contract-${c.id}`}>
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
