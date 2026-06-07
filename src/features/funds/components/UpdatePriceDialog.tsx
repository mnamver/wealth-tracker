import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, ExternalLink } from 'lucide-react';
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
import type { UpdatePriceValues } from '../../../types';

const schema = z.object({
  unit_price: z.coerce.number().positive('Birim pay değeri pozitif olmalı'),
});

interface UpdatePriceDialogProps {
  fundCode: string;
  currentPrice: number;
  onSubmit: (values: UpdatePriceValues) => Promise<unknown>;
  isLoading: boolean;
}

export function UpdatePriceDialog({
  fundCode,
  currentPrice,
  onSubmit,
  isLoading,
}: UpdatePriceDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePriceValues>({
    resolver: zodResolver(schema) as Resolver<UpdatePriceValues>,
    defaultValues: { unit_price: currentPrice },
  });

  async function onValid(values: UpdatePriceValues) {
    await onSubmit({ unit_price: Number(values.unit_price) });
    setOpen(false);
  }

  const tefasUrl = `https://www.tefas.gov.tr/tr/fon-detayli-analiz/${fundCode}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{fundCode} — Fiyat Güncelle</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <a
            href={tefasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            TEFAS'ta {fundCode} fiyatına bak
          </a>
        </div>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="unit_price">Birim Pay Değeri (₺)</Label>
            <Input
              id="unit_price"
              type="number"
              step="0.000001"
              placeholder="1535.692328"
              {...register('unit_price')}
              autoFocus
            />
            {errors.unit_price && (
              <p className="text-xs text-destructive">{errors.unit_price.message}</p>
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
