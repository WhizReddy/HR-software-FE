import {
    email,
    type InferInput,
    minLength,
    nonEmpty,
    object,
    pipe,
    string,
} from 'valibot'

export const LoginSchema = object({
    email: pipe(
        string('Email is required'),
        nonEmpty('Please type your email'),
        email('Invalid email format'),
    ),
    password: pipe(
        string('Password is required'),
        nonEmpty('Please type your password'),
        minLength(8, 'Password must be at least 8 characters long'),
    ),
})

export type LoginFormFields = InferInput<typeof LoginSchema>
