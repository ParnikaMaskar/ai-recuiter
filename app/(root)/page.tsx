import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCurrentUser } from '@/lib/actions/auth.action'
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from '@/lib/actions/general.action'

const Page = async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id, limit: 20 }),
  ])

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0
  const hasUpcomingInterviews = (latestInterviews?.length ?? 0) > 0

  // ✅ Resolve async work BEFORE JSX
  const userInterviewCards = hasPastInterviews
    ? await Promise.all(
        userInterviews!.map(async (interview) => {
          const feedback = await getFeedbackByInterviewId({
            interviewId: interview.id,
            userId: interview.userId,
          })

          return (
            <InterviewCard
              key={interview.id}
              {...interview}
              feedback={feedback}
            />
          )
        })
      )
    : []

  const latestInterviewCards = hasUpcomingInterviews
    ? await Promise.all(
        latestInterviews!.map(async (interview) => {
          const feedback = await getFeedbackByInterviewId({
            interviewId: interview.id,
            userId: interview.userId,
          })

          return (
            <InterviewCard
              key={interview.id}
              {...interview}
              feedback={feedback}
            />
          )
        })
      )
    : []

  return (
    <>
      {/* CTA */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice job interviews with AI, get personalized feedback, and improve your skills.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="Robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Your Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {userInterviewCards.length > 0 ? (
            userInterviewCards
          ) : (
            <p>You haven't conducted any interviews yet</p>
          )}
        </div>
      </section>

      {/* Other Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {latestInterviewCards.length > 0 ? (
            latestInterviewCards
          ) : (
            <p>There are no other interviews available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Page
