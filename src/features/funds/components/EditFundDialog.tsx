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
  quantity: z.coerce.number().int('Adet tam sayı olmalı').positive('Adet pozitif olmalı'),
  cost_per_unit: z.coerce.number().min(0, 'Birim maliyet 0 veya üzeri olmalı'),
});

type FormValues = { quantity: number; cost_per_unit: number };

interface EditFundDialogProps {
  fundCode: string;
  currentQuantity: number;
  currentCostPerUnit: number;
  onSubmit: (values: { quantity: number; cost_per_unit: number }) => Promise<unknown>;
  isLoading: boolean;
}

export function EditFundDialog({
  fundCode,
  currentQuantity,
  currentCostPerUnit,
  onSubmit,
  isLoading,
}: EditFundDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { quantity: currentQuantity, cost_per_unit: currentCostPerUnit },
  });

  async function onValid(values: FormValues) {
    await onSubmit({ quantity: Number(values.quantity), cost_per_unit: Number(values.cost_per_unit) });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Düzenle"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle>{fundCode} — Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="fund-quantity">Adet</Label>
            <Input
              id="fund-quantity"
              type="number"
              step="1"
              {...register('quantity')}
              autoFocus
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fund-cost">
              Birim Pay Maliyeti (₺)
              <span className="ml-1 text-xs text-muted-foreground">— kaça aldın</span>
            </Label>
            <Input
              id="fund-cost"
              type="number"
              step="0.000001"
              placeholder="1450.000000"
              {...register('cost_per_unit')}
            />
            {errors.cost_per_unit && (
              <p className="text-xs text-destructive">{errors.cost_per_unit.message}</p>
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
