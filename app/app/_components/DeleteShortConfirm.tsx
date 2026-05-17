"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  onConfirm: () => Promise<{ ok: boolean; error?: string }>;
  onSuccess?: () => void;
  successMessage?: string;
  triggerClassName?: string;
  iconClassName?: string;
  variant?: "card" | "button";
  buttonLabel?: string;
};

export default function DeleteShortConfirm({
  title,
  description,
  onConfirm,
  onSuccess,
  successMessage = "Deleted",
  triggerClassName,
  iconClassName,
  variant = "card",
  buttonLabel = "Delete",
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      const res = await onConfirm();
      if (!res.ok) {
        toast.error(res.error ?? "Could not delete");
        return;
      }
      toast.success(successMessage);
      setOpen(false);
      onSuccess?.();
    } catch {
      toast.error("Could not delete");
    } finally {
      setBusy(false);
    }
  };

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "card" ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className={cn(
              "absolute top-2 right-2 z-20 size-7 shadow-md",
              triggerClassName,
            )}
            onClick={stop}
            onKeyDown={stop}
          >
            <Trash2 className={cn("size-3.5", iconClassName)} />
            <span className="sr-only">Delete</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={cn(
              "gap-1.5 text-destructive hover:text-destructive border-destructive/30",
              triggerClassName,
            )}
            onClick={stop}
          >
            <Trash2 className="size-3.5" />
            {buttonLabel}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={stop}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy} onClick={stop}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            disabled={busy}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => void handleConfirm(e)}
          >
            {busy ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
