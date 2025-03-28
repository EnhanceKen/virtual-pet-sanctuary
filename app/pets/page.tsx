"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Heart, Brain, Zap, Search } from "lucide-react"

export default function PetsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [petType, setPetType] = useState("all")
  const [rarity, setRarity] = useState("all")
  const [filteredPets, setFilteredPets] = useState([])
  const [availablePets, setAvailablePets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("https://r24i16yke4.execute-api.us-west-2.amazonaws.com/pets")
        const result = await res.json()
        const unadoptedPets = result.pets.filter((pet) => pet.isAdopted === false)

        console.log("🐾 Fetched pets:", unadoptedPets)

        setAvailablePets(unadoptedPets)
        setFilteredPets(unadoptedPets)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch pets:", error)
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  useEffect(() => {
    const filtered = availablePets.filter((pet) => {
      const matchesSearch =
        pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = petType === "all" || pet.type === petType
      const matchesRarity = rarity === "all" || pet.rarity === rarity

      return matchesSearch && matchesType && matchesRarity
    })

    setFilteredPets(filtered)
  }, [searchTerm, petType, rarity, availablePets])

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

    toast({
      title: "Pet adopted!",
      description: "Your new pet has been added to your sanctuary",
    })

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
          <p className="text-muted-foreground">
            {filteredPets.length} pets available for adoption
          </p>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredPets) && filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <Card key={pet.petId} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={pet.imageUrl || "/placeholder.svg"}
                      alt={pet.name}
                      fill
                      className="object-cover"
                    />
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
                        {pet.traits?.map((trait) => (
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
                          <span className="font-bold">{pet.stats?.energy}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center mb-1">
                            <Brain className="w-4 h-4 mr-1 text-purple-500" />
                            <span className="text-sm">Intel</span>
                          </div>
                          <span className="font-bold">{pet.stats?.intelligence}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center mb-1">
                            <Heart className="w-4 h-4 mr-1 text-red-500" />
                            <span className="text-sm">Love</span>
                          </div>
                          <span className="font-bold">{pet.stats?.affection}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleAdopt(pet.petId)}>
                      Adopt {pet.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No pets available at this time 🐾
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
