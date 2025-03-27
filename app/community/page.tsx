"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Heart, MessageSquare, Share2, PawPrint } from "lucide-react"

// Mock data for community posts
const mockPosts = [
  {
    id: "post-1",
    author: {
      id: "user-1",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just adopted a new virtual pet! Meet Luna, my adorable cat. She's already learned how to jump and purr. Any tips for training cats?",
    image: "/placeholder.svg?height=300&width=500",
    petTag: "Cat",
    createdAt: "2023-06-15T10:30:00Z",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: "post-2",
    author: {
      id: "user-2",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Max just reached level 10! So proud of my virtual dog. We've been training every day and it's finally paying off. His fetch skill is now at expert level.",
    petTag: "Dog",
    createdAt: "2023-06-14T15:45:00Z",
    likes: 42,
    comments: 12,
    shares: 5,
  },
  {
    id: "post-3",
    author: {
      id: "user-3",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Does anyone else's fish do this? Bubbles keeps swimming in patterns that look like hearts. It's the cutest thing ever!",
    image: "/placeholder.svg?height=300&width=500",
    petTag: "Fish",
    createdAt: "2023-06-13T09:15:00Z",
    likes: 18,
    comments: 6,
    shares: 2,
  },
  {
    id: "post-4",
    author: {
      id: "user-4",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just discovered that feeding your rabbit carrots twice a day increases their happiness by 20%! Game changer for Whiskers' training.",
    petTag: "Rabbit",
    createdAt: "2023-06-12T14:20:00Z",
    likes: 31,
    comments: 15,
    shares: 8,
  },
]

// Mock data for community topics
const mockTopics = [
  {
    id: "topic-1",
    title: "Training Tips & Tricks",
    description: "Share and discover the best ways to train your virtual pets",
    posts: 156,
    followers: 423,
  },
  {
    id: "topic-2",
    title: "Pet Showcase",
    description: "Show off your virtual pets and their achievements",
    posts: 289,
    followers: 512,
  },
  {
    id: "topic-3",
    title: "Troubleshooting",
    description: "Get help with any issues you're experiencing with your pets",
    posts: 98,
    followers: 201,
  },
  {
    id: "topic-4",
    title: "Feature Requests",
    description: "Suggest new features for the Virtual Pet Sanctuary",
    posts: 64,
    followers: 187,
  },
]

export default function CommunityPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState(mockPosts)
  const [topics, setTopics] = useState(mockTopics)
  const [newPostContent, setNewPostContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      })
      return
    }

    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    // Create new post
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name || "Anonymous",
        avatar: user.avatar || "/placeholder.svg?height=40&width=40",
      },
      content: newPostContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")

    toast({
      title: "Post created",
      description: "Your post has been published to the community",
    })
  }

  const handleLikePost = (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      }),
    )
  }

  const handleFollowTopic = (topicId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow topics",
        variant: "destructive",
      })
      return
    }

    setTopics(
      topics.map((topic) => {
        if (topic.id === topicId) {
          return { ...topic, followers: topic.followers + 1 }
        }
        return topic
      }),
    )

    toast({
      title: "Topic followed",
      description: "You will now receive updates from this topic",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create Post</CardTitle>
                    <CardDescription>Share your pet adventures with the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="What's on your mind?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Add Image</Button>
                    <Button onClick={handleCreatePost}>Post</Button>
                  </CardFooter>
                </Card>
              )}

              {loading
                ? // Loading skeleton for posts
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-muted animate-pulse rounded" />
                          <div className="h-4 w-full bg-muted animate-pulse rounded" />
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-4">
                          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                : posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{post.author.name}</h3>
                              <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
                            </div>
                          </div>
                          {post.petTag && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <PawPrint className="h-3 w-3" />
                              {post.petTag}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{post.content}</p>
                        {post.image && (
                          <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post attachment"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleLikePost(post.id)}
                          >
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Be respectful to other community members</li>
                    <li>Share helpful tips and experiences</li>
                    <li>Keep content appropriate for all ages</li>
                    <li>Don't spam or promote unrelated content</li>
                    <li>Report inappropriate behavior</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#VirtualPets</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">245 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#PetTraining</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">189 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#CutePets</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">156 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">#PetCare</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">132 posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? // Loading skeleton for topics
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 w-full bg-muted animate-pulse rounded" />
                    </CardFooter>
                  </Card>
                ))
              : topics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader>
                      <CardTitle>{topic.title}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{topic.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{topic.followers} followers</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleFollowTopic(topic.id)}>
                        Follow Topic
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

