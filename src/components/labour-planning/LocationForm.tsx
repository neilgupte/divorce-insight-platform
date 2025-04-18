
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Location name must be at least 2 characters." }),
  type: z.string(),
  size: z.string().regex(/^\d+$/, { message: "Must be a number." }),
  posSystems: z.string().regex(/^\d+$/, { message: "Must be a number." }),
  hours: z.string(),
  address: z.string().min(5, { message: "Please provide a valid address." }),
  region: z.string(),
});

export default function LocationForm({ onSubmit }: { onSubmit: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Restaurant",
      size: "",
      posSystems: "",
      hours: "",
      address: "",
      region: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Location added successfully!");
    console.log(values);
    onSubmit();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogDescription>
          Enter the details for the new location. All fields are required.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Downtown Restaurant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Footage</FormLabel>
                  <FormControl>
                    <Input placeholder="3500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posSystems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of POS Systems</FormLabel>
                  <FormControl>
                    <Input placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="9AM - 10PM" {...field} />
                  </FormControl>
                  <FormDescription>Format: 9AM - 10PM or 24/7</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Region</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="Central">Central</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onSubmit}>
              Cancel
            </Button>
            <Button type="submit">Add Location</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
