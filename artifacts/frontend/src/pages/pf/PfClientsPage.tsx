import { useState } from "react";
import { useListPfClients, useCreatePfClient, useDeletePfClient } from "@workspace/api-client-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Trash2, Building2, Mail, Phone } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { getListPfClientsQueryKey } from "@workspace/api-client-react";
import { formatDate } from "@/lib/format";

const schema = z.object({
  companyName: z.string().min(1, "Company name required"),
  contactName: z.string().min(1, "Contact name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateClientDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { companyName: "", contactName: "", email: "", phone: "", address: "", notes: "" },
  });

  const mutation = useCreatePfClient({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPfClientsQueryKey() });
        toast({ title: "Client created" });
        reset();
        onClose();
      },
      onError: () => toast({ title: "Error", description: "Failed to create client", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Client</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Company Name *</Label>
              <Input {...register("companyName")} data-testid="input-company-name" />
              {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Contact Name *</Label>
              <Input {...register("contactName")} data-testid="input-contact-name" />
              {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" {...register("email")} data-testid="input-email" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register("phone")} data-testid="input-phone" />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input {...register("address")} data-testid="input-address" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input {...register("notes")} data-testid="input-notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-client">
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PfClientsPage() {
  const { data: clients, isLoading } = useListPfClients();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeletePfClient({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPfClientsQueryKey() });
        toast({ title: "Client deleted" });
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  return (
    <AppLayout>
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
        action={
          <Button onClick={() => setShowCreate(true)} data-testid="button-new-client">
            <Plus className="h-4 w-4 mr-1.5" /> New Client
          </Button>
        }
      />

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : !clients?.length ? (
          <EmptyState icon={Users} title="No clients yet" description="Add your first client to start creating proposals." action={<Button onClick={() => setShowCreate(true)}>Add Client</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map(client => (
              <Card key={client.id} data-testid={`card-client-${client.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="font-semibold text-sm truncate">{client.companyName}</p>
                      </div>
                      <p className="text-sm text-foreground">{client.contactName}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate({ id: client.id })}
                      data-testid={`button-delete-client-${client.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Added {formatDate(client.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateClientDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppLayout>
  );
}
