import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BookOpen, Brain, Droplet, Pill } from "lucide-react"
import Link from "next/link"

export default function EducationPage() {
  const articles = [
    {
      id: 1,
      title: "The Science of Hangovers",
      description: "What actually causes the 'bad day' after drinking and how to prevent it",
      category: "alcohol",
      icon: <Brain className="h-5 w-5" />,
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Hydration and Substance Use",
      description: "Why staying hydrated matters and how it affects your body's response to substances",
      category: "general",
      icon: <Droplet className="h-5 w-5" />,
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "No Bad Days Supplement Guide",
      description: "How our supplements work to protect your body and brain",
      category: "supplements",
      icon: <Pill className="h-5 w-5" />,
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Cannabis and Sleep Quality",
      description: "Understanding how cannabis affects your sleep cycles",
      category: "cannabis",
      icon: <Brain className="h-5 w-5" />,
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "Alcohol's Effect on the Brain",
      description: "The short and long-term impacts of alcohol on brain function",
      category: "alcohol",
      icon: <Brain className="h-5 w-5" />,
      readTime: "8 min read",
    },
    {
      id: 6,
      title: "Harm Reduction Strategies",
      description: "Evidence-based approaches to reduce risks while still enjoying yourself",
      category: "general",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "10 min read",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Education</h1>
              <p className="text-muted-foreground">Learn about substances, harm reduction, and wellness strategies.</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="alcohol">Alcohol</TabsTrigger>
                <TabsTrigger value="cannabis">Cannabis</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {articles.map((article) => (
                    <Card key={article.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {article.icon}
                          </div>
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            {article.category}
                          </span>
                        </div>
                        <CardTitle>{article.title}</CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <div className="text-xs text-muted-foreground">{article.readTime}</div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/education/${article.id}`}>
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alcohol">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {articles
                    .filter((article) => article.category === "alcohol")
                    .map((article) => (
                      <Card key={article.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {article.icon}
                            </div>
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                              {article.category}
                            </span>
                          </div>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <div className="text-xs text-muted-foreground">{article.readTime}</div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/education/${article.id}`}>
                              Read Article
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="cannabis">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {articles
                    .filter((article) => article.category === "cannabis")
                    .map((article) => (
                      <Card key={article.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {article.icon}
                            </div>
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                              {article.category}
                            </span>
                          </div>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <div className="text-xs text-muted-foreground">{article.readTime}</div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/education/${article.id}`}>
                              Read Article
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="general">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {articles
                    .filter((article) => article.category === "general" || article.category === "supplements")
                    .map((article) => (
                      <Card key={article.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {article.icon}
                            </div>
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                              {article.category}
                            </span>
                          </div>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <div className="text-xs text-muted-foreground">{article.readTime}</div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/education/${article.id}`}>
                              Read Article
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
