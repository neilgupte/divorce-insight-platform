import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const industries = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Other",
];

const formSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  adminEmail: z.string().email("Please enter a valid email"),
  emailDomain: z.string().optional(),
  status: z.enum(["lead", "active", "suspended"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyProfileFormProps {
  onSubmit: (data: FormData) => void;
}

export function CompanyProfileForm({ onSubmit }: CompanyProfileFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "active",
    },
  });

  const status = form.watch("status");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} className="max-w-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="max-w-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Domain (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="company.com" className="max-w-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Company Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="lead" />
                    <FormLabel className="font-normal">Lead</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="active" />
                    <FormLabel className="font-normal">Active Client</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="suspended" />
                    <FormLabel className="font-normal">Suspended</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="max-w-2xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button 
            type="submit" 
            variant="secondary"
            onClick={() => form.setValue('status', 'lead')}
          >
            Save as Lead
          </Button>
          <Button 
            type="submit" 
            onClick={() => form.setValue('status', 'active')}
            disabled={status === "lead" || status === "suspended"}
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
