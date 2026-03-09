import { Interview } from '../interface/interface'

export const formatDate = (dateString: string | number | Date) => {
    if (!dateString) {
        return 'No Date Provided'
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return 'Invalid Date'
    }
    const formattedDate = date.toLocaleDateString('en-GB')
    const formattedTime = date.toLocaleTimeString('en-GB')
    return `${formattedDate} ${formattedTime}`
}

export const getInterviewsByPhase = (
    interviews: Interview[],
    phase: string,
) => {
    return interviews.filter((interview) =>
        phase === 'applicant'
            ? interview.currentPhase === 'applicant' ||
              interview.status === 'active'
            : interview.currentPhase === phase,
    )
}
