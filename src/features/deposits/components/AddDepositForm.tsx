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
import type { DepositFormValues } from '../../../types';

const schema = z
  .object({
    bank_name: z.string().min(1, 'Banka adı zorunlu').max(100),
    principal: z.coerce.number().positive('Ana para pozitif olmalı'),
    annual_rate: z.coerce
      .number()
      .positive('Faiz oranı pozitif olmalı')
      .max(200, 'Oran çok yüksek'),
    start_date: z.string().min(1, 'Başlangıç tarihi zorunlu'),
    maturity_date: z.string().min(1, 'Vade tarihi zorunlu'),
  })
  .refine((d) => new Date(d.maturity_date) > new Date(d.start_date), {
    message: 'Vade tarihi başlangıçtan sonra olmalı',
    path: ['maturity_date'],
  });

interface AddDepositFormProps {
  onSubmit: (values: DepositFormValues) => Promise<unknown>;
  isLoading: boolean;
}

export function AddDepositForm({ onSubmit, isLoading }: AddDepositFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(schema) as Resolver<DepositFormValues>,
    defaultValues: {
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  async function onValid(values: DepositFormValues) {
    await onSubmit({
      ...values,
      principal: Number(values.principal),
      annual_rate: Number(values.annual_rate),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Mevduat Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Vadeli Mevduat Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Banka Adı</Label>
            <Input id="bank_name" placeholder="Akbank" {...register('bank_name')} />
            {errors.bank_name && (
              <p className="text-xs text-destructive">{errors.bank_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="principal">Ana Para (₺)</Label>
            <Input
              id="principal"
              type="number"
              step="0.01"
              placeholder="1000000"
              {...register('principal')}
            />
            {errors.principal && (
              <p className="text-xs text-destructive">{errors.principal.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_rate">Yıllık Faiz Oranı (%)</Label>
            <Input
              id="annual_rate"
              type="number"
              step="0.01"
              placeholder="45"
              {...register('annual_rate')}
            />
            {errors.annual_rate && (
              <p className="text-xs text-destructive">{errors.annual_rate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start_date">Başlangıç Tarihi</Label>
              <Input id="start_date" type="date" {...register('start_date')} />
              {errors.start_date && (
                <p className="text-xs text-destructive">{errors.start_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maturity_date">Vade Tarihi</Label>
              <Input id="maturity_date" type="date" {...register('maturity_date')} />
              {errors.maturity_date && (
                <p className="text-xs text-destructive">{errors.maturity_date.message}</p>
              )}
            </div>
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
