import dayjs from 'dayjs'
import {
    forward,
    InferInput,
    isoDate,
    object,
    optional,
    partialCheck,
    picklist,
    pipe,
    string,
} from 'valibot'
export const CreateVacationSchema = pipe(
    object({
        type: picklist(
            ['vacation', 'sick', 'personal', 'maternity'],
            "Please select a vacation type of the following 'vacation' or 'sick' or 'personal' or'maternity'",
        ),
        description: optional(string()),
        startDate: pipe(
            string('Please enter a date'),
            isoDate('Please enter a date.'),
        ),
        endDate: pipe(
            string('Please enter a date'),
            isoDate('Please enter a date.'),
        ),
    }),
    forward(
        partialCheck(
            [['startDate'], ['endDate']],
            (input) =>
                dayjs(input.startDate).isBefore(dayjs(input.endDate)) ||
                dayjs(input.endDate).isSame(dayjs(input.startDate)),
            'The ending date should be after the startdate',
        ),
        ['endDate'],
    ),
)
export type CreateVacationFormFields = InferInput<typeof CreateVacationSchema>
