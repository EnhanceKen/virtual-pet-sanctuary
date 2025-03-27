"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Heart, Brain, Utensils, Play, ArrowLeft, Award } from "lucide-react"
import type { Pet } from "@/types/pet"

// Mock data for a specific pet
const mockPet: Pet & {
  description: string
  traits: string[]
  level: number
  experience: number
  nextLevelExp: number
  activities: {
    id: string
    name: string
    description: string
    icon: string
    effect: {
      happiness?: number
      health?: number
      hunger?: number
      experience?: number
    }
    cooldown: number
    lastUsed?: string
  }[]
} = {
  id: "pet-1",
  name: "Fluffy",
  type: "Cat",
  image: "/placeholder.svg?height=400&width=400",
  description: "A playful and curious cat who loves to explore and cuddle.",
  traits: ["Playful", "Curious", "Affectionate"],
  happiness: 80,
  health: 90,
  hunger: 40,
  level: 3,
  experience: 240,
  nextLevelExp: 500,
  skills: ["Jumping", "Purring", "Pouncing"],
  adoptedAt: new Date().toISOString(),
  activities: [
    {
      id: "feed",
      name: "Feed",
      description: "Give your pet some delicious food",
      icon: "Utensils",
      effect: {
        hunger: -30,
        happiness: 10,
        health: 5,
        experience: 5,
      },
      cooldown: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    },
    {
      id: "play",
      name: "Play",
      description: "Play with your pet to increase happiness",
      icon: "Play",
      effect: {
        happiness: 20,
        hunger: 10,
        experience: 10,
      },
      cooldown: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    },
    {
      id: "train",
      name: "Train",
      description: "Train your pet to learn new skills",
      icon: "Brain",
      effect: {
        experience: 20,
        happiness: -5,
        hunger: 15,
      },
      cooldown: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    },
    {
      id: "groom",
      name: "Groom",
      description: "Groom your pet to improve health",
      icon: "Heart",
      effect: {
        health: 15,
        happiness: 5,
        experience: 5,
      },
      cooldown: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    },
  ],
}

export default function PetDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [pet, setPet] = useState<typeof mockPet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // This would be replaced with actual API call to fetch pet details
    const fetchPet = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPet(mockPet)
      } catch (error) {
        console.error("Error fetching pet:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load pet details",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPet()
  }, [id, user, router, toast])

  const handleActivity = (activityId: string) => {
    if (!pet) return

    // Find the activity
    const activity = pet.activities.find((a) => a.id === activityId)
    if (!activity) return

    // Check if activity is on cooldown
    if (activity.lastUsed) {
      const lastUsed = new Date(activity.lastUsed).getTime()
      const now = new Date().getTime()
      const timeDiff = now - lastUsed

      if (timeDiff < activity.cooldown) {
        const remainingTime = Math.ceil((activity.cooldown - timeDiff) / (60 * 1000))
        toast({
          variant: "destructive",
          title: "Activity on cooldown",
          description: `You can ${activity.name.toLowerCase()} again in ${remainingTime} minutes`,
        })
        return
      }
    }

    // Apply activity effects
    const updatedPet = { ...pet }

    if (activity.effect.happiness) {
      updatedPet.happiness = Math.max(0, Math.min(100, pet.happiness + activity.effect.happiness))
    }

    if (activity.effect.health) {
      updatedPet.health = Math.max(0, Math.min(100, pet.health + activity.effect.health))
    }

    if (activity.effect.hunger) {
      updatedPet.hunger = Math.max(0, Math.min(100, pet.hunger + activity.effect.hunger))
    }

    if (activity.effect.experience) {
      updatedPet.experience += activity.effect.experience

      // Check for level up
      if (updatedPet.experience >= updatedPet.nextLevelExp) {
        updatedPet.level += 1
        updatedPet.experience -= updatedPet.nextLevelExp
        updatedPet.nextLevelExp = Math.floor(updatedPet.nextLevelExp * 1.5)

        toast({
          title: "Level Up!",
          description: `${pet.name} is now level ${updatedPet.level}!`,
        })
      }
    }

    // Set activity cooldown
    updatedPet.activities = updatedPet.activities.map((a) => {
      if (a.id === activityId) {
        return {
          ...a,
          lastUsed: new Date().toISOString(),
        }
      }
      return a
    })

    setPet(updatedPet)

    toast({
      title: `${activity.name} successful!`,
      description: `You ${activity.name.toLowerCase()}ed ${pet.name}`,
    })
  }

  if (loading || !pet) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">Loading pet details...</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="relative aspect-square w-full">
              <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{pet.name}</CardTitle>
                <Badge variant="outline">{pet.type}</Badge>
              </div>
              <CardDescription>{pet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {pet.traits.map((trait) => (
                    <Badge key={trait} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Level {pet.level}</span>
                    </div>
                    <span>
                      {pet.experience}/{pet.nextLevelExp} XP
                    </span>
                  </div>
                  <Progress value={(pet.experience / pet.nextLevelExp) * 100} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      <span>Happiness</span>
                    </div>
                    <span>{pet.happiness}%</span>
                  </div>
                  <Progress value={pet.happiness} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                      <span>Hunger</span>
                    </div>
                    <span>{pet.hunger}%</span>
                  </div>
                  <Progress value={pet.hunger} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-purple-500" />
                      <span>Skills</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pet.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pet.activities.map((activity) => {
                  // Check if activity is on cooldown
                  let cooldownRemaining = 0
                  if (activity.lastUsed) {
                    const lastUsed = new Date(activity.lastUsed).getTime()
                    const now = new Date().getTime()
                    const timeDiff = now - lastUsed
                    cooldownRemaining = Math.max(0, activity.cooldown - timeDiff)
                  }

                  const isOnCooldown = cooldownRemaining > 0
                  const cooldownMinutes = Math.ceil(cooldownRemaining / (60 * 1000))

                  return (
                    <Card key={activity.id} className={isOnCooldown ? "opacity-70" : ""}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          {activity.icon === "Utensils" && <Utensils className="mr-2 h-5 w-5 text-orange-500" />}
                          {activity.icon === "Play" && <Play className="mr-2 h-5 w-5 text-blue-500" />}
                          {activity.icon === "Brain" && <Brain className="mr-2 h-5 w-5 text-purple-500" />}
                          {activity.icon === "Heart" && <Heart className="mr-2 h-5 w-5 text-red-500" />}
                          {activity.name}
                        </CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">Effects:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {activity.effect.happiness && (
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1 text-red-500" />
                                <span className={activity.effect.happiness > 0 ? "text-green-600" : "text-red-600"}>
                                  {activity.effect.happiness > 0 ? "+" : ""}
                                  {activity.effect.happiness}%
                                </span>
                              </div>
                            )}

                            {activity.effect.health && (
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1 text-pink-500" />
                                <span className={activity.effect.health > 0 ? "text-green-600" : "text-red-600"}>
                                  {activity.effect.health > 0 ? "+" : ""}
                                  {activity.effect.health}%
                                </span>
                              </div>
                            )}

                            {activity.effect.hunger && (
                              <div className="flex items-center">
                                <Utensils className="w-4 h-4 mr-1 text-orange-500" />
                                <span className={activity.effect.hunger < 0 ? "text-green-600" : "text-red-600"}>
                                  {activity.effect.hunger > 0 ? "+" : ""}
                                  {activity.effect.hunger}%
                                </span>
                              </div>
                            )}

                            {activity.effect.experience && (
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1 text-yellow-500" />
                                <span className="text-green-600">+{activity.effect.experience} XP</span>
                              </div>
                            )}
                          </div>

                          <Button
                            className="w-full mt-2"
                            onClick={() => handleActivity(activity.id)}
                            disabled={isOnCooldown}
                          >
                            {isOnCooldown ? `Available in ${cooldownMinutes} min` : `${activity.name} ${pet.name}`}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Recent interactions with {pet.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fed {pet.name}</p>
                        <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Play className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Played with {pet.name}</p>
                        <p className="text-sm text-muted-foreground">Today, 9:15 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Trained {pet.name}</p>
                        <p className="text-sm text-muted-foreground">Yesterday, 4:45 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Groomed {pet.name}</p>
                        <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fed {pet.name}</p>
                        <p className="text-sm text-muted-foreground">Yesterday, 8:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

