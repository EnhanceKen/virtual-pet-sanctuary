import Image from "next/image"
import Link from "next/link"
import type { Pet } from "@/types/pet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PetCardProps {
  pet: Pet
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{pet.name}</CardTitle>
          <Badge variant="outline">{pet.type}</Badge>
        </div>
        <CardDescription>Adopted on {new Date(pet.adoptedAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                <span>Happiness</span>
              </div>
              <span>{pet.happiness}%</span>
            </div>
            <Progress value={pet.happiness} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Utensils className="w-4 h-4 mr-1 text-orange-500" />
                <span>Hunger</span>
              </div>
              <span>{pet.hunger}%</span>
            </div>
            <Progress value={pet.hunger} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-1 text-purple-500" />
                <span>Skills</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {pet.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/pets/${pet.id}`}>Care for {pet.name}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

