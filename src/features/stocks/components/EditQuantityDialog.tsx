import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../../../components/ui/dialog';

const schema = z.object({
  quantity: z.coerce.number().positive('Adet pozitif olmalı'),
});

type FormValues = { quantity: number };

interface EditQuantityDialogProps {
  symbol: string;
  currentQuantity: number;
  onSubmit: (quantity: number) => Promise<unknown>;
  isLoading: boolean;
}

export function EditQuantityDialog({
  symbol,
  currentQuantity,
  onSubmit,
  isLoading,
}: EditQuantityDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { quantity: currentQuantity },
  });

  async function onValid(values: FormValues) {
    await onSubmit(Number(values.quantity));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle>{symbol} — Adet Güncelle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="quantity">Yeni Adet</Label>
            <Input
              id="quantity"
              type="number"
              step="0.0001"
              {...register('quantity')}
              autoFocus
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">İptal</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Güncelle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
