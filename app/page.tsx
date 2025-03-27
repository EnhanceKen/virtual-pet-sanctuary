import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PawPrint, Heart, Users, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to Virtual Pet Sanctuary
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Adopt, care for, and connect with virtual pets in your own personal sanctuary.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/pets">
                  <Button size="lg" className="gap-1">
                    <PawPrint className="h-5 w-5" />
                    Adopt a Pet
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="gap-1">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Virtual pets playing together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover all the ways you can interact with your virtual pets
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <PawPrint className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Adopt Unique Pets</h3>
              <p className="text-center text-muted-foreground">
                Choose from a variety of virtual pets with unique personalities and traits
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Heart className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Care & Nurture</h3>
              <p className="text-center text-muted-foreground">
                Feed, play with, and train your pets to keep them happy and healthy
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-center text-muted-foreground">
                Connect with other pet owners, share tips, and showcase your pets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Secure & Reliable</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Your data is protected with industry-leading security measures
                </p>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>AWS Cognito for secure authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>DynamoDB for reliable data storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>VPC configurations for network security</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Security illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

