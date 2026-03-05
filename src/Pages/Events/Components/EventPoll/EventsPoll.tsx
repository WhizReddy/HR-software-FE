import React, { useState, useEffect } from 'react'

import AxiosInstance from '@/Helpers/Axios'
import { useAuth } from '@/Context/AuthProvider'
import { EventPollProps, Poll, PollOption, Voter } from './Interface/Interface'

const EventPoll: React.FC<EventPollProps> = ({ poll, eventId, userId }) => {
    const { currentUser } = useAuth()
    const [localPoll, setLocalPoll] = useState<Poll>(poll)
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'

    useEffect(() => {
        setLocalPoll(poll)
    }, [poll, userId])

    const hasUserVoted = (voters: Voter[]): boolean => {
        return userId
            ? voters.some((voter) => voter._id === userId.toString())
            : false
    }

    const handleVote = async (option: string) => {
        if (!userId) return

        const existingVotedOption = localPoll.options.find((opt) =>
            opt.voters.some((voter) => voter._id === userId.toString()),
        )

        try {
            if (existingVotedOption && existingVotedOption.option !== option) {
                await AxiosInstance.delete(`/event/${eventId}/vote`, {
                    data: { option: existingVotedOption.option, userId },
                })

                setLocalPoll((prevPoll) => ({
                    ...prevPoll,
                    options: prevPoll.options.map((opt) =>
                        opt.option === existingVotedOption.option
                            ? {
                                ...opt,
                                votes: opt.votes - 1,
                                voters: opt.voters.filter(
                                    (voter) =>
                                        voter._id !== userId.toString(),
                                ),
                            }
                            : opt,
                    ),
                }))
            }

            await AxiosInstance.post(`/event/${eventId}/vote`, {
                option,
                userId,
            })

            setLocalPoll((prevPoll) => ({
                ...prevPoll,
                options: prevPoll.options.map((opt) =>
                    opt.option === option
                        ? {
                            ...opt,
                            votes: opt.votes + 1,
                            voters: [
                                ...opt.voters,
                                {
                                    _id: userId.toString(),
                                    firstName: currentUser?.firstName || '',
                                    lastName: currentUser?.lastName || '',
                                },
                            ],
                        }
                        : opt,
                ),
            }))
        } catch (error) {
            console.error('Error updating vote:', error)
            setLocalPoll(poll)
        }
    }

    const renderOptionContent = (option: PollOption, totalVotes: number) => {
        const userVoted = hasUserVoted(option.voters)
        const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

        return (
            <div className="relative w-full py-3 px-4 flex justify-between items-center bg-white z-10 rounded-xl overflow-hidden group">
                {/* Background progress bar */}
                <div
                    className={`absolute top-0 left-0 bottom-0 z-0 transition-all duration-500 ease-out ${userVoted ? 'bg-blue-50' : 'bg-slate-50 group-hover:bg-slate-100'}`}
                    style={{ width: `${percent}%` }}
                />

                {/* Foreground content */}
                <span className={`z-10 text-sm font-medium ${userVoted ? 'text-blue-700' : 'text-slate-700'}`}>
                    {option.option}
                </span>

                <div className="z-10 flex items-center gap-3">
                    {renderAdminTooltip(option)}
                    <span className={`text-xs font-semibold ${userVoted ? 'text-blue-600' : 'text-slate-400'}`}>
                        {percent}%
                    </span>
                    {renderDevCheckbox(userVoted)}
                </div>
            </div>
        )
    }

    const renderDevCheckbox = (userVoted: boolean) => {
        if (isAdmin) return null

        return (
            <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors ${userVoted ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
            >
                {userVoted && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        )
    }

    const renderAdminTooltip = (option: PollOption) => {
        if (!isAdmin) return null

        const tooltipText = option.voters.map(v => `${v.firstName} ${v.lastName}`).join('\n')

        return (
            <div title={tooltipText} className="flex items-center gap-1.5 cursor-help">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                </span>
            </div>
        )
    }

    // Calculate total votes
    const totalVotes = localPoll.options.reduce((acc, opt) => acc + opt.votes, 0)

    return (
        <div className="w-full flex flex-col gap-4 font-sans">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {localPoll.question}
            </h3>
            <div className="flex flex-col gap-3">
                {localPoll.options.map((option, index) => {
                    const userVoted = hasUserVoted(option.voters)
                    return (
                        <div
                            key={index}
                            className={`relative rounded-xl border transition-colors cursor-pointer w-full overflow-hidden ${userVoted ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            onClick={() => handleVote(option.option)}
                        >
                            {renderOptionContent(option, totalVotes)}
                        </div>
                    )
                })}
            </div>

            <div className="text-xs text-slate-400 mt-1">
                {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
            </div>
        </div>
    )
}

export default EventPoll