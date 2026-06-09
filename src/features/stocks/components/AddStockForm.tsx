import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
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
import { useState } from 'react';
import type { StockFormValues } from '../../../types';

const schema = z.object({
  symbol: z.string().min(1, 'Hisse kodu zorunlu').max(10, 'En fazla 10 karakter'),
  quantity: z.coerce.number().positive('Adet pozitif olmalı'),
  avg_cost: z.coerce.number().positive('Maliyet pozitif olmalı').optional().or(z.literal('')),
});

interface AddStockFormProps {
  onSubmit: (values: StockFormValues) => Promise<unknown>;
  isLoading: boolean;
}

export function AddStockForm({ onSubmit, isLoading }: AddStockFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(schema) as Resolver<StockFormValues>,
  });

  async function onValid(values: StockFormValues) {
    await onSubmit({
      symbol: values.symbol.toUpperCase().trim(),
      quantity: Number(values.quantity),
      avg_cost: values.avg_cost ? Number(values.avg_cost) : null,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Hisse Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hisse Senedi Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="symbol">Hisse Kodu</Label>
            <Input
              id="symbol"
              placeholder="THYAO"
              className="uppercase"
              {...register('symbol')}
            />
            {errors.symbol && (
              <p className="text-xs text-destructive">{errors.symbol.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Adet</Label>
            <Input
              id="quantity"
              type="number"
              step="0.0001"
              placeholder="5000"
              {...register('quantity')}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avg_cost">
              Ortalama Alış Fiyatı (₺)
              <span className="ml-1 text-xs text-muted-foreground">— isteğe bağlı</span>
            </Label>
            <Input
              id="avg_cost"
              type="number"
              step="0.0001"
              placeholder="250.50"
              {...register('avg_cost')}
            />
            {errors.avg_cost && (
              <p className="text-xs text-destructive">{errors.avg_cost.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                İptal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
