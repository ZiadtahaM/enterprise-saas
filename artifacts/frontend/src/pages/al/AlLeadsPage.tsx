import { useState } from "react";
import { useListAlLeads, useCreateAlLead, useDeleteAlLead, getListAlLeadsQueryKey } from "@workspace/api-client-react";
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
import { UserCheck, Plus, Trash2, Mail, Phone } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/format";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  status: z.enum(["new", "contacted", "qualified", "lost"]).default("new"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().optional(),
  preferredCity: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", status: "new", email: "", phone: "", source: "", preferredCity: "", notes: "" },
  });

  const mutation = useCreateAlLead({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlLeadsQueryKey() }); toast({ title: "Lead added" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data: { ...data, email: data.email || undefined } });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Lead</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input {...register("name")} data-testid="input-name" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...register("email")} data-testid="input-email" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register("phone")} data-testid="input-phone" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Input {...register("source")} data-testid="input-source" placeholder="Referral, website…" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select defaultValue="new" onValueChange={v => setValue("status", v as "new" | "contacted" | "qualified" | "lost")}>
                <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["new", "contacted", "qualified", "lost"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Preferred City</Label>
            <Input {...register("preferredCity")} data-testid="input-preferred-city" />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input {...register("notes")} data-testid="input-notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-lead">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AlLeadsPage() {
  const { data: leads, isLoading } = useListAlLeads();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeleteAlLead({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlLeadsQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  return (
    <AppLayout>
      <PageHeader title="Leads" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-lead"><Plus className="h-4 w-4 mr-1.5" />New Lead</Button>} />
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : !leads?.length ? (
          <EmptyState icon={UserCheck} title="No leads yet" description="Add your first lead to start tracking prospects." action={<Button onClick={() => setShowCreate(true)}>Add Lead</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {leads.map(l => (
              <Card key={l.id} data-testid={`card-lead-${l.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{l.name}</p>
                      <div className="mt-1 space-y-0.5">
                        {l.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" /><span className="truncate">{l.email}</span></div>}
                        {l.phone && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /><span>{l.phone}</span></div>}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={l.status} />
                        {l.source && <span className="text-xs text-muted-foreground">{l.source}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: l.id })} data-testid={`button-delete-lead-${l.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Added {formatDate(l.createdAt)}</p>
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
