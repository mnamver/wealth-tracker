import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
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
import type { FundFormValues } from '../../../types';

const schema = z.object({
  fund_code: z.string().min(1, 'Fon kodu zorunlu').max(10),
  quantity: z.coerce.number().int('Adet tam sayı olmalı').positive('Adet pozitif olmalı'),
  unit_price: z.coerce.number().min(0, 'Birim pay değeri 0 veya üzeri olmalı'),
});

interface AddFundFormProps {
  onSubmit: (values: FundFormValues) => Promise<unknown>;
  isLoading: boolean;
}

export function AddFundForm({ onSubmit, isLoading }: AddFundFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FundFormValues>({
    resolver: zodResolver(schema) as Resolver<FundFormValues>,
    defaultValues: { unit_price: 0 },
  });

  async function onValid(values: FundFormValues) {
    await onSubmit({
      fund_code: values.fund_code.toUpperCase().trim(),
      quantity: Number(values.quantity),
      unit_price: Number(values.unit_price),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Fon Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Yatırım Fonu Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="fund_code">Fon Kodu</Label>
            <Input
              id="fund_code"
              placeholder="TI1"
              className="uppercase"
              {...register('fund_code')}
            />
            {errors.fund_code && (
              <p className="text-xs text-destructive">{errors.fund_code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Adet (Pay Sayısı)</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              placeholder="255"
              {...register('quantity')}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_price">
              Birim Pay Değeri (₺)
              <span className="ml-1 text-xs text-muted-foreground">— TEFAS'tan bakıp gir</span>
            </Label>
            <Input
              id="unit_price"
              type="number"
              step="0.000001"
              placeholder="1535.692328"
              {...register('unit_price')}
            />
            {errors.unit_price && (
              <p className="text-xs text-destructive">{errors.unit_price.message}</p>
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
