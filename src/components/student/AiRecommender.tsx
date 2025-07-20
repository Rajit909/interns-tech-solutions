'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { recommendCourses } from '@/ai/flows/recommend-courses'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AiRecommender() {
  const [recommendation, setRecommendation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRecommendation = async () => {
    setIsLoading(true)
    setRecommendation('')
    try {
      // Mock data for the AI flow
      const viewingHistory = 'Watched videos on React state management and Next.js routing. Viewed internships related to frontend engineering.'
      const profileData = 'Student interested in frontend development, proficient in JavaScript, React, and TypeScript. Looking for remote opportunities.'
      
      const result = await recommendCourses({ viewingHistory, profileData })
      setRecommendation(result.recommendations)
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      setRecommendation('Sorry, we couldn\'t generate recommendations at this time.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Wand2 className="text-accent" />
                    Personalized Recommendations
                </CardTitle>
                <CardDescription>Let our AI find the perfect opportunities for you.</CardDescription>
            </div>
            <Button onClick={handleGetRecommendation} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Generating...' : 'Get Recommendations'}
            </Button>
        </div>
      </CardHeader>
      {(isLoading || recommendation) && (
        <CardContent>
            {isLoading && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}
            {recommendation && (
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/50 p-4">
                <p>{recommendation}</p>
            </div>
            )}
        </CardContent>
      )}
    </Card>
  )
}
