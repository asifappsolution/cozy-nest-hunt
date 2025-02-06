import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

// Define the form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  location: z.string().min(1, "Location is required"),
  property_type: z.string().min(1, "Property type is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Bedrooms must be a non-negative number",
  }),
  bathrooms: z.string().min(1, "Number of bathrooms is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Bathrooms must be a non-negative number",
  }),
  tenant_type: z.string().min(1, "Tenant type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateProperty = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      property_type: "",
      bedrooms: "",
      bathrooms: "",
      tenant_type: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Create preview URLs for the selected images
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up the URL
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (propertyId: string) => {
    const uploadPromises = selectedImages.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${propertyId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(filePath);

      // Insert the image URL into the property_images table
      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
        });

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to create a property");
        return;
      }

      // Create the property object with all required fields
      const propertyData = {
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
        location: values.location,
        property_type: values.property_type,
        bedrooms: parseInt(values.bedrooms),
        bathrooms: parseInt(values.bathrooms),
        tenant_type: values.tenant_type,
        user_id: user.id,
      };

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert([propertyData])
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload images if any are selected
      if (selectedImages.length > 0) {
        await uploadImages(property.id);
      }

      toast.success("Property created successfully!");
      navigate(`/property/${property.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Property Listing</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter property description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rent (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter monthly rent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter property location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Flat Rent</SelectItem>
                      <SelectItem value="sublet">Sublet</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="commercial">Commercial Space</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenant_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Number of bedrooms"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Number of bathrooms"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Property Images</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center cursor-pointer hover:border-gray-400">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-gray-600">+ Add Images</span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? "Creating..." : "Create Property"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProperty;
