import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
});

export const UserPageDetailsSchema = z.object({
  name: z.optional(
    z
      .string({
        message: 'Invalid name',
      })
      .min(1, {
        message: 'Name is required',
      })
      .max(50, {
        message: 'Maximum 50 characters allowed',
      })
  ),
  biography: z.optional(
    z
      .string({
        message: 'Invalid biography',
      })
      .max(200, {
        message: 'Maximum 200 characters allowed',
      })
  ),
  location: z.optional(
    z
      .string({
        message: 'Invalid location',
      })
      .max(50, {
        message: 'Maximum 50 characters allowed',
      })
  ),
  contactEmail: z.optional(
    z
      .string({
        message: 'Invalid email',
      })
      .email({
        message: 'Invalid email',
      })
  ),
});

export const ProjectSchema = z.object({
  name: z
    .string({
      message: 'Invalid name',
    })
    .min(1, {
      message: 'Name is required',
    })
    .max(75, {
      message: 'Maximum 75 characters allowed',
    }),
  description: z.optional(
    z
      .string({
        message: 'Invalid description',
      })
      .max(200, {
        message: 'Maximum 200 characters allowed',
      })
  ),
  url: z.optional(
    z
      .string({
        message: 'Invalid URL',
      })
      .url({
        message: 'Invalid URL',
      })
  ),
  image: z.optional(z.string().url({ message: 'Invalid image URL' })),
  statusIsVisible: z.boolean().default(false),
  size: z.enum(['small', 'medium']).default('small'),
  category: z.optional(z.string()),
  status: z.optional(z.string()),
});
