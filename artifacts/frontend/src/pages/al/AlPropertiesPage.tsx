import { useState } from "react";
import { useListAlProperties, useCreateAlProperty, useDeleteAlProperty, getListAlPropertiesQueryKey } from "@workspace/api-client-react";
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
import { Home, Plus, Trash2, MapPin } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/format";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  locationText: z.string().min(1, "Location required"),
  city: z.string().min(1, "City required"),
  price: z.number({ invalid_type_error: "Required" }).positive(),
  currency: z.string().default("USD"),
  type: z.enum(["sale", "rent"]),
  status: z.enum(["available", "under_contract", "sold", "rented", "off_market"]).default("available"),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  neighborhood: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", locationText: "", city: "", price: 0, currency: "USD", type: "sale", status: "available" },
  });

  const mutation = useCreateAlProperty({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlPropertiesQueryKey() }); toast({ title: "Property added" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Property</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input {...register("title")} data-testid="input-title" placeholder="3BR Modern Apartment" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Location *</Label>
              <Input {...register("locationText")} data-testid="input-location" />
              {errors.locationText && <p className="text-xs text-destructive">{errors.locationText.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input {...register("city")} data-testid="input-city" />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Price *</Label>
              <Input type="number" {...register("price", { valueAsNumber: true })} data-testid="input-price" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input {...register("currency")} defaultValue="USD" data-testid="input-currency" />
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select defaultValue="sale" onValueChange={v => setValue("type", v as "sale" | "rent")}>
                <SelectTrigger data-testid="select-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bedrooms</Label>
              <Input type="number" {...register("bedrooms", { valueAsNumber: true })} data-testid="input-bedrooms" />
            </div>
            <div className="space-y-1.5">
              <Label>Bathrooms</Label>
              <Input type="number" {...register("bathrooms", { valueAsNumber: true })} data-testid="input-bathrooms" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-property">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AlPropertiesPage() {
  const { data: properties, isLoading } = useListAlProperties();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeleteAlProperty({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlPropertiesQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  return (
    <AppLayout>
      <PageHeader title="Properties" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-property"><Plus className="h-4 w-4 mr-1.5" />New Property</Button>} />
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
        ) : !properties?.length ? (
          <EmptyState icon={Home} title="No properties yet" description="Add properties to start managing your listings." action={<Button onClick={() => setShowCreate(true)}>Add Property</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {properties.map(p => (
              <Card key={p.id} data-testid={`card-property-${p.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" /><span className="truncate">{p.city}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: p.id })} data-testid={`button-delete-property-${p.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold text-primary">{p.currency} {formatCurrency(p.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-muted-foreground capitalize">{p.type}</span>
                    {p.bedrooms && <span className="text-xs text-muted-foreground">{p.bedrooms}bd</span>}
                    {p.bathrooms && <span className="text-xs text-muted-foreground">{p.bathrooms}ba</span>}
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
