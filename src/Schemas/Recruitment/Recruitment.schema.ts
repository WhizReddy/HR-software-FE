import {
    array,
    check,
    email,
    instance,
    isoDate,
    maxSize,
    mimeType,
    minLength,
    object,
    picklist,
    pipe,
    regex,
    startsWith,
    string,
    transform,
} from 'valibot'
import dayjs from 'dayjs'
import {
    experience as experienceList,
    foundMethod as applicationMethodList,
    technologies as technologiesList,
} from '@/Pages/Recruitment/Component/RecruitmentData'

export const RecruitmentSchema = object({
    applicationMethod: picklist(
        applicationMethodList,
        'Please pick one value from the list',
    ),
    dob: pipe(
        string('Please enter a date'),
        isoDate('Please enter a date.'),
        check((input) => {
            const birthDate = dayjs(input)
            const currDate = dayjs()
            const age = currDate.diff(birthDate, 'year')

            return age >= 16 && age <= 65
        }, 'You must be between 16-65 years old'),
    ),
    email: pipe(string('Email is required'), email('Invalid email format')),
    experience: picklist(experienceList, 'Please pick one value from the list'),
    file: pipe(
        instance(FileList, 'Please enter a file'),
        check((input) => input.length > 0),
        transform((input) => input[0]),
        mimeType(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
        maxSize(1024 * 1024 * 10),
    ),

    firstName: pipe(
        string('First Name is required'),
        minLength(2, 'First Name needs to be at least 2 characters'),
    ),
    lastName: pipe(
        string('Last Name is required'),
        minLength(2, 'Last Name needs to be at least 2 characters'),
    ),

    phoneNumber: pipe(
        string('Phone Number is required'),
        regex(/^6[6-9]\d{7}$/, 'Invalid phone number format'),
        startsWith('6', 'The number should start with a 6   '),
    ),

    positionApplied: pipe(
        string('Position Applied is required'),
        minLength(1, 'Write a work position'),
    ),
    salaryExpectations: pipe(
        string('Salary Expectation is required'),
        minLength(3, 'Enter a wage expectation'),
    ),

    technologiesUsed: pipe(
        array(picklist(technologiesList, 'Technologies Used is required')),
        minLength(1, 'Choose at least one technology'),
    ),
})
