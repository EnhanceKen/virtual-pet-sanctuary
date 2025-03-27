"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Heart, Brain, Zap, Search } from "lucide-react"

// Mock data for available pets
const availablePets = [
  {
    id: "pet-3",
    name: "Luna",
    type: "Cat",
    rarity: "Common",
    image: "/placeholder.svg?height=200&width=200",
    description: "A playful and curious cat who loves to explore.",
    traits: ["Playful", "Curious", "Friendly"],
    stats: {
      energy: 85,
      intelligence: 70,
      affection: 90,
    },
  },
  {
    id: "pet-4",
    name: "Max",
    type: "Dog",
    rarity: "Uncommon",
    image: "/placeholder.svg?height=200&width=200",
    description: "A loyal and energetic dog who loves to play fetch.",
    traits: ["Loyal", "Energetic", "Friendly"],
    stats: {
      energy: 95,
      intelligence: 80,
      affection: 85,
    },
  },
  {
    id: "pet-5",
    name: "Bubbles",
    type: "Fish",
    rarity: "Rare",
    image: "/placeholder.svg?height=200&width=200",
    description: "A colorful and peaceful fish who brings calm to any environment.",
    traits: ["Peaceful", "Colorful", "Graceful"],
    stats: {
      energy: 60,
      intelligence: 40,
      affection: 30,
    },
  },
  {
    id: "pet-6",
    name: "Spike",
    type: "Lizard",
    rarity: "Epic",
    image: "/placeholder.svg?height=200&width=200",
    description: "A rare lizard with unique patterns and a calm demeanor.",
    traits: ["Calm", "Observant", "Rare"],
    stats: {
      energy: 50,
      intelligence: 65,
      affection: 40,
    },
  },
  {
    id: "pet-7",
    name: "Whiskers",
    type: "Rabbit",
    rarity: "Common",
    image: "/placeholder.svg?height=200&width=200",
    description: "A fluffy rabbit who loves to hop around and eat carrots.",
    traits: ["Fluffy", "Gentle", "Quick"],
    stats: {
      energy: 80,
      intelligence: 60,
      affection: 75,
    },
  },
  {
    id: "pet-8",
    name: "Tweety",
    type: "Bird",
    rarity: "Uncommon",
    image: "/placeholder.svg?height=200&width=200",
    description: "A melodious bird with beautiful feathers and a sweet song.",
    traits: ["Melodious", "Colorful", "Social"],
    stats: {
      energy: 90,
      intelligence: 75,
      affection: 60,
    },
  },
]

export default function PetsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [petType, setPetType] = useState("all")
  const [rarity, setRarity] = useState("all")
  const [filteredPets, setFilteredPets] = useState(availablePets)

  useEffect(() => {
    // Filter pets based on search term and filters
    const filtered = availablePets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = petType === "all" ? true : pet.type === petType
      const matchesRarity = rarity === "all" ? true : pet.rarity === rarity

      return matchesSearch && matchesType && matchesRarity
    })

    setFilteredPets(filtered)
  }, [searchTerm, petType, rarity])

  const handleAdopt = (petId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to adopt a pet",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // This would be replaced with actual API call to adopt a pet
    toast({
      title: "Pet adopted!",
      description: "Your new pet has been added to your sanctuary",
    })

    // Redirect to dashboard after adoption
    router.push("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Adoption Center</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={petType} onValueChange={setPetType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pet Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Dog">Dog</SelectItem>
              <SelectItem value="Fish">Fish</SelectItem>
              <SelectItem value="Bird">Bird</SelectItem>
              <SelectItem value="Rabbit">Rabbit</SelectItem>
              <SelectItem value="Lizard">Lizard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={rarity} onValueChange={setRarity}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="Common">Common</SelectItem>
              <SelectItem value="Uncommon">Uncommon</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">{filteredPets.length} pets available for adoption</p>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary">{pet.rarity}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{pet.name}</CardTitle>
                    <Badge variant="outline">{pet.type}</Badge>
                  </div>
                  <CardDescription>{pet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {pet.traits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center mb-1">
                          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="text-sm">Energy</span>
                        </div>
                        <span className="font-bold">{pet.stats.energy}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center mb-1">
                          <Brain className="w-4 h-4 mr-1 text-purple-500" />
                          <span className="text-sm">Intel</span>
                        </div>
                        <span className="font-bold">{pet.stats.intelligence}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex items-center mb-1">
                          <Heart className="w-4 h-4 mr-1 text-red-500" />
                          <span className="text-sm">Love</span>
                        </div>
                        <span className="font-bold">{pet.stats.affection}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleAdopt(pet.id)}>
                    Adopt {pet.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredPets.map((pet) => (
              <Card key={pet.id}>
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-24 sm:h-auto sm:w-48 flex-shrink-0">
                    <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <Badge variant="outline">{pet.type}</Badge>
                        <Badge className="bg-primary">{pet.rarity}</Badge>
                      </div>
                      <Button onClick={() => handleAdopt(pet.id)} size="sm">
                        Adopt
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-2">{pet.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pet.traits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-auto">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                        <span>Energy: {pet.stats.energy}</span>
                      </div>
                      <div className="flex items-center">
                        <Brain className="w-4 h-4 mr-1 text-purple-500" />
                        <span>Intel: {pet.stats.intelligence}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        <span>Love: {pet.stats.affection}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

