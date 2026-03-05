export interface Voter {
    _id: string
    firstName: string
    lastName: string
}

export interface PollOption {
    option: string
    votes: number
    voters: Voter[]
}

export interface Poll {
    question: string
    options: PollOption[]
}

export interface EventPollProps {
    poll: Poll
    eventId: string
    userId: string | undefined
}