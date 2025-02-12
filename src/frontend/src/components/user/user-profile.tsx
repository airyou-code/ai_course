"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function UserProfile() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="shadcn" />
            <p className="text-sm text-muted-foreground">
              This is your public display name. It can be your real name or a pseudonym. You can only change this once
              every 30 days.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">main@example.com</SelectItem>
                <SelectItem value="work">work@example.com</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              You can manage verified email addresses in your email settings.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="I own a computer." className="min-h-[100px]" />
            <p className="text-sm text-muted-foreground">
              You can @mention other users and organizations to link to them.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="urls">URLs</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website, blog, or social media profiles.
              </p>
            </div>

            <div className="space-y-4">
              <Input placeholder="https://shadcn.com" />
              <Input placeholder="http://twitter.com/shadcn" />
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add URL
              </Button>
            </div>
          </div>

          <Button className="mt-6">Update profile</Button>
        </CardContent>
      </Card>
    </div>
  )
}
