import { useState } from "react";
import { useListAlReminders, useCreateAlReminder, useDeleteAlReminder, useMarkAlReminderDone, getListAlRemindersQueryKey } from "@workspace/api-client-react";
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
import { Bell, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  dueAt: z.string().min(1, "Due date required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", dueAt: "", notes: "" },
  });

  const mutation = useCreateAlReminder({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlRemindersQueryKey() }); toast({ title: "Reminder set" }); reset(); onClose(); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate({ data });

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Reminder</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input {...register("title")} data-testid="input-title" placeholder="Follow up with client…" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Due Date & Time *</Label>
            <Input type="datetime-local" {...register("dueAt")} data-testid="input-due-at" />
            {errors.dueAt && <p className="text-xs text-destructive">{errors.dueAt.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input {...register("notes")} data-testid="input-notes" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-reminder">{mutation.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AlRemindersPage() {
  const { data: reminders, isLoading } = useListAlReminders();
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useDeleteAlReminder({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAlRemindersQueryKey() }); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    },
  });

  const doneMutation = useMarkAlReminderDone({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAlRemindersQueryKey() }) },
  });

  const pending = reminders?.filter(r => !r.done) ?? [];
  const done = reminders?.filter(r => r.done) ?? [];
  const now = new Date();

  return (
    <AppLayout>
      <PageHeader title="Reminders" action={<Button onClick={() => setShowCreate(true)} data-testid="button-new-reminder"><Plus className="h-4 w-4 mr-1.5" />New Reminder</Button>} />
      <div className="p-6 space-y-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : !reminders?.length ? (
          <EmptyState icon={Bell} title="No reminders" description="Set reminders to follow up on leads and deals." action={<Button onClick={() => setShowCreate(true)}>Add Reminder</Button>} />
        ) : (
          <>
            {pending.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pending ({pending.length})</h3>
                {pending.map(r => {
                  const overdue = new Date(r.dueAt) < now;
                  return (
                    <Card key={r.id} className={cn("border", overdue ? "border-destructive/30" : "")} data-testid={`card-reminder-${r.id}`}>
                      <CardContent className="pt-3 pb-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={cn("flex-shrink-0", overdue ? "text-destructive" : "text-muted-foreground")}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-sm font-medium truncate", overdue ? "text-destructive" : "")}>{r.title}</p>
                            <p className={cn("text-xs", overdue ? "text-destructive/70" : "text-muted-foreground")}>{formatDateTime(r.dueAt)}{overdue ? " · Overdue" : ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-600" onClick={() => doneMutation.mutate({ id: r.id })} data-testid={`button-done-reminder-${r.id}`} title="Mark done">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: r.id })} data-testid={`button-delete-reminder-${r.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            {done.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Completed ({done.length})</h3>
                {done.map(r => (
                  <Card key={r.id} className="opacity-60" data-testid={`card-reminder-done-${r.id}`}>
                    <CardContent className="pt-3 pb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm line-through text-muted-foreground truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(r.dueAt)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate({ id: r.id })} data-testid={`button-delete-done-reminder-${r.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <CreateDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppLayout>
  );
}
