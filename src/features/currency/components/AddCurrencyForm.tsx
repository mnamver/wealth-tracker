import { useState } from 'react';
import { z } from 'zod';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { CURRENCY_OPTIONS } from '../constants';
import type { CurrencyAssetFormValues, CurrencyAssetType } from '../../../types';

const schema = z.object({
  asset_type: z.enum(['USD', 'EUR', 'GOLD']),
  quantity: z.coerce.number().positive('Miktar pozitif olmalı'),
});

interface AddCurrencyFormProps {
  onSubmit: (values: CurrencyAssetFormValues) => Promise<unknown>;
  isLoading: boolean;
}

export function AddCurrencyForm({ onSubmit, isLoading }: AddCurrencyFormProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CurrencyAssetFormValues>({
    resolver: zodResolver(schema) as Resolver<CurrencyAssetFormValues>,
    defaultValues: {
      asset_type: 'USD',
      quantity: 0,
    },
  });

  async function onValid(values: CurrencyAssetFormValues) {
    await onSubmit({
      asset_type: values.asset_type,
      quantity: Number(values.quantity),
    });
    reset({ asset_type: 'USD', quantity: 0 });
    setOpen(false);
  }

  const selectedType = watch('asset_type');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Döviz Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Döviz / Altın Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Döviz Türü</Label>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setValue('asset_type', value as CurrencyAssetType, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Döviz seç" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.type} value={option.type}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset_type && (
              <p className="text-xs text-destructive">{errors.asset_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Miktar</Label>
            <Input
              id="quantity"
              type="number"
              step="0.0001"
              placeholder="10"
              {...register('quantity')}
            />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
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
