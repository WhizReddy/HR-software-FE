import {
    email,
    InferInput,
    minLength,
    nonEmpty,
    object,
    pipe,
    regex,
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
        regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
    ),
})
export type LoginFormFields = InferInput<typeof LoginSchema>
