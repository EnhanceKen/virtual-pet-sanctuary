"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { PawPrint, Heart, Brain, Utensils, Play } from "lucide-react"
import PetCard from "@/components/pet-card"
import type { Pet } from "@/types/pet"

// Mock data for pets
const mockPets: Pet[] = [
  {
    id: "pet-1",
    name: "Fluffy",
    type: "Cat",
    image: "/placeholder.svg?height=200&width=200",
    happiness: 80,
    health: 90,
    hunger: 40,
    skills: ["Jumping", "Purring"],
    adoptedAt: new Date().toISOString(),
  },
  {
    id: "pet-2",
    name: "Rex",
    type: "Dog",
    image: "/placeholder.svg?height=200&width=200",
    happiness: 95,
    health: 85,
    hunger: 60,
    skills: ["Fetch", "Sit"],
    adoptedAt: new Date().toISOString(),
  },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // This would be replaced with actual API call to fetch user's pets
    const fetchPets = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPets(mockPets)
      } catch (error) {
        console.error("Error fetching pets:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPets()
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      <Tabs defaultValue="pets" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="pets">My Pets</TabsTrigger>
          <TabsTrigger value="stats">Stats & Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : pets.length > 0 ? (
              pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="flex justify-center mb-4">
                  <PawPrint className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No pets yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t adopted any pets yet. Visit the pet catalog to find your new companion.
                </p>
                <Button asChild>
                  <Link href="/pets">Browse Pets</Link>
                </Button>
              </div>
            )}

            {pets.length > 0 && (
              <Card className="flex flex-col items-center justify-center h-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <PawPrint className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Adopt a new pet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    There are more pets waiting for a loving home.
                  </p>
                  <Button asChild>
                    <Link href="/pets">Browse More Pets</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pet Care Stats</CardTitle>
                <CardDescription>Your overall pet care statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        <span>Overall Health</span>
                      </div>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                        <span>Feeding Consistency</span>
                      </div>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Play Time</span>
                      </div>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-purple-500" />
                        <span>Training Progress</span>
                      </div>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your recent interactions with your pets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Utensils className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Fed Fluffy</p>
                          <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Play className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Played with Rex</p>
                          <p className="text-sm text-muted-foreground">Today, 9:15 AM</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Trained Rex - New Trick</p>
                          <p className="text-sm text-muted-foreground">Yesterday, 4:45 PM</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Health check for Fluffy</p>
                          <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Utensils className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Fed Rex</p>
                          <p className="text-sm text-muted-foreground">Yesterday, 8:00 AM</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

