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
  username: z.optional(
    z
      .string({
        required_error: 'Username is required',
      })
      .min(3, {
        message: 'Username must be at least 3 characters long',
      })
      .regex(/^[a-z0-9_]*$/, {
        message: 'Only lowercase letters, numbers and underscores are allowed!',
      })
  ),
});

export const UsernameSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, {
      message: 'Username must be at least 3 characters long',
    })
    .regex(/^[a-z0-9_]*$/, {
      message: 'Only lowercase letters, numbers and underscores are allowed!',
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
      .or(z.literal(''))
  ),
  location: z.optional(
    z
      .string({
        message: 'Invalid location',
      })
      .max(50, {
        message: 'Maximum 50 characters allowed',
      })
      .or(z.literal(''))
  ),
  contactEmail: z.optional(
    z
      .string({
        message: 'Invalid email',
      })
      .email({
        message: 'Invalid email address',
      })
      .or(z.literal(''))
  ),
});

export const SocialLinksSchema = z.object({
  instagram: z.optional(
    z
      .string()
      .min(1, {
        message: 'Minimum 1 character required',
      })
      .max(30, {
        message: 'Maximum 30 characters allowed',
      })
      .regex(/^[a-zA-Z0-9._]{1,30}(?<![._])$/, {
        message: 'Invalid Instagram username',
      })
      .or(z.literal(''))
  ),
  github: z.optional(
    z
      .string()
      .min(1, {
        message: 'Minimum 1 character required',
      })
      .max(39, {
        message: 'Maximum 39 characters allowed',
      })
      .regex(/^[a-zA-Z0-9-]{1,39}(?<!-)$/, {
        message: 'Invalid Github username',
      })
      .or(z.literal(''))
  ),
  linkedin: z.optional(
    z
      .string()
      .min(3, {
        message: 'Minimum 3 characters required',
      })
      .max(100, {
        message: 'Maximum 100 characters allowed',
      })
      .regex(/^[a-zA-Z0-9-]{3,100}$/, {
        message: 'Invalid Linkedin username',
      })
      .or(z.literal(''))
  ),
  dribbble: z.optional(
    z
      .string()
      .min(2, {
        message: 'Minimum 2 characters required',
      })
      .max(30, {
        message: 'Maximum 30 characters allowed',
      })
      .regex(/^[a-zA-Z0-9_]{2,30}$/, {
        message: 'Invalid Dribbble username',
      })
      .or(z.literal(''))
  ),
  youtube: z.optional(
    z
      .string()
      .min(3, {
        message: 'Minimum 3 characters required',
      })
      .max(23, {
        message: 'Maximum 23 characters allowed',
      })
      .regex(/^[a-zA-Z0-9_-]{3,23}$/, {
        message: 'Invalid Youtube username',
      })
      .or(z.literal(''))
  ),
  x: z.optional(
    z
      .string()
      .min(4, {
        message: 'Minimum 4 characters required',
      })
      .max(50, {
        message: 'Maximum 50 characters allowed',
      })
      .regex(/^[a-zA-Z0-9_]{4,50}$/, {
        message: 'Invalid X username',
      })
      .or(z.literal(''))
  ),
});

export const CreateProjectSchema = z.object({
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
    z.string({ message: 'Invalid URL' }).url({ message: 'Invalid URL' })
  ),
  category: z
    .string({
      message: 'Category is required',
    })
    .min(1, {
      message: 'Category is required',
    }),
  project_status: z
    .string({
      message: 'Status is required',
    })
    .min(1, {
      message: 'Status is required',
    }),
  revenue: z.optional(
    z
      .string({
        message: 'Invalid revenue (eq. 1000.00)',
      })
      .max(1000000000, 'Revenue must be less than 1,000,000,000')
      .regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Invalid revenue (eq. 1000.00)')
  ),
});

export const ProjectEditSchema = z.object({
  image: z
    .optional(
      z
        .string({ message: 'Invalid image URL' })
        .url({ message: 'Invalid image URL' })
    )
    .or(z.literal('')),
  name: z
    .string({
      message: 'Invalid name',
    })
    .min(1, {
      message: 'Name is required',
    })
    .max(75, {
      message: 'Maximum 75 characters allowed',
    })
    .optional(),
  description: z
    .optional(
      z
        .string({
          message: 'Invalid description',
        })
        .max(200, {
          message: 'Maximum 200 characters allowed',
        })
    )
    .or(z.literal('')),
  url: z
    .optional(
      z.string({ message: 'Invalid URL' }).url({ message: 'Invalid URL' })
    )
    .or(z.literal('')),
  category: z
    .optional(
      z.string({
        message: 'Invalid category',
      })
    )
    .or(z.literal('')),
  project_status: z
    .optional(
      z.string({
        message: 'Invalid status',
      })
    )
    .or(z.literal('')),
  revenue: z
    .optional(
      z
        .string({
          message: 'Invalid revenue (eq. 1000.00)',
        })
        .max(1000000000, 'Revenue must be less than 1,000,000,000')
        .regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Invalid revenue (eq. 1000.00)')
    )
    .or(z.literal('')),
});
