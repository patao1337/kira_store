'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Address } from '@/lib/services/order.service'; // Assuming Address type is exported

// Define the Zod schema for address validation
const addressSchema = z.object({
  fullName: z.string().min(2, { message: 'Повне ім\'я має містити щонайменше 2 символи.' }),
  street: z.string().min(3, { message: 'Адреса має містити щонайменше 3 символи.' }),
  city: z.string().min(2, { message: 'Місто має містити щонайменше 2 символи.' }),
  postalCode: z.string().min(3, { message: 'Поштовий індекс має містити щонайменше 3 символи.' }),
  country: z.string().min(2, { message: 'Країна має містити щонайменше 2 символи.' }),
  phone: z.string().optional(), // Optional phone number
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  formTitle: string;
  initialData?: Partial<Address>;
  onSubmit: (data: AddressFormData) => void;
  submitButtonText?: string;
}

export function AddressForm({ 
  formTitle, 
  initialData,
  onSubmit,
  submitButtonText = 'Зберегти адресу' 
}: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || '',
      phone: initialData?.phone || '',
    },
  });

  const handleFormSubmit = (data: AddressFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">{formTitle}</h2>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повне ім'я</FormLabel>
              <FormControl>
                <Input placeholder="Іван Петренко" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адреса</FormLabel>
              <FormControl>
                <Input placeholder="вул. Шевченка, 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Місто</FormLabel>
              <FormControl>
                <Input placeholder="Київ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Поштовий індекс</FormLabel>
              <FormControl>
                <Input placeholder="01001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Країна</FormLabel>
              <FormControl>
                <Input placeholder="Україна" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер телефону (необов'язково)</FormLabel>
              <FormControl>
                <Input placeholder="+380 50 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{submitButtonText}</Button>
      </form>
    </Form>
  );
} 