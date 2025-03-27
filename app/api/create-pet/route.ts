import { NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"

const client = new DynamoDBClient({})
const ddb = DynamoDBDocumentClient.from(client)

export async function POST() {
  const stats = {
    energy: Math.floor(Math.random() * 100),
    intelligence: Math.floor(Math.random() * 100),
    affection: Math.floor(Math.random() * 100),
  }

  const traits = ["Fluffy", "Gentle", "Playful", "Loyal", "Brave"]
  const selectedTraits = traits.sort(() => 0.5 - Math.random()).slice(0, 3)

  const newPet = {
    petId: uuidv4(),
    name: "Fluffy",
    type: "Cat",
    species: "Dragon Pup",
    rarity: "Common",
    stats,
    traits: selectedTraits,
    imageUrl: "https://virtual-pet-images.s3.amazonaws.com/pets/sample.png",
    isAdopted: false,
    createdAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 86400,
    description: "A magical and curious creature.",
    color: "Sky Blue",
  }

  try {
    await ddb.send(
      new PutCommand({
        TableName: "Pets",
        Item: newPet,
      })
    )

    return NextResponse.json({ message: "Pet created!", pet: newPet }, { status: 201 })
  } catch (error) {
    console.error("Error creating pet:", error)
    return NextResponse.json({ error: "Failed to create pet" }, { status: 500 })
  }
}
