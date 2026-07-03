"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  completeProfileSchema,
  CompleteProfileInput,
} from "@/lib/validations/profile";

import { updateProfile } from "../../services/user.service";
import { useDispatch } from "react-redux";

import { updateUser } from "@/redux/slices/authSlice";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

import ProfileAvatarUpload from "./profile-avatar-upload";
import { useState } from "react";

import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  onOpenChange: (open: boolean) => void;
}

export default function ProfileForm({ onOpenChange }: ProfileFormProps) {
  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      avatar: "",
    },
  });

  const dispatch = useDispatch();

  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: CompleteProfileInput) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phone", values.phone ?? "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await updateProfile(formData);

      dispatch(updateUser(res.user));

      showSuccessToast("Welcome to Project Hub 👋");

      onOpenChange(false);
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    } else {
      setAvatarFile(null);
      setPreview(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5">
          <ProfileAvatarUpload
            preview={preview}
            onChange={handleAvatarChange}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>

                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>

                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
                <FormLabel>Phone Number</FormLabel>

                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
