"use client"

/**
 * Endpoint editor component with code editor
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react"
import Link from "next/link"
import type { Endpoint } from "beddel/server"
import { useToast } from "@/hooks/use-toast"

interface EndpointEditorProps {
  endpoint?: Endpoint
}

export function EndpointEditor({ endpoint }: EndpointEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isNew = !endpoint

  const [name, setName] = useState(endpoint?.name || "")
  const [description, setDescription] = useState(endpoint?.description || "")
  const [code, setCode] = useState(
    endpoint?.code ||
      `async function execute(params, props) {\n  // Your code here\n  return { result: "success" };\n}`,
  )
  const [visibility, setVisibility] = useState<"public" | "private">(endpoint?.visibility || "public")
  const [requiredProps, setRequiredProps] = useState<string[]>(endpoint?.requiredProps || [])
  const [newProp, setNewProp] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddProp = () => {
    if (newProp && !requiredProps.includes(newProp)) {
      setRequiredProps([...requiredProps, newProp])
      setNewProp("")
    }
  }

  const handleRemoveProp = (prop: string) => {
    setRequiredProps(requiredProps.filter((p) => p !== prop))
  }

  const handleSave = async () => {
    if (!name || !description || !code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/endpoints", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: endpoint?.id,
          name,
          description,
          code,
          visibility,
          requiredProps,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save endpoint")
      }

      toast({
        title: "Success",
        description: `Endpoint ${isNew ? "created" : "updated"} successfully`,
      })

      router.push("/admin/endpoints")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save endpoint",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!endpoint || !confirm("Are you sure you want to delete this endpoint?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/endpoints?id=${endpoint.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete endpoint")
      }

      toast({
        title: "Success",
        description: "Endpoint deleted successfully",
      })

      router.push("/admin/endpoints")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete endpoint",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/endpoints">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isNew ? "New Endpoint" : "Edit Endpoint"}</h1>
            <p className="text-muted-foreground">{isNew ? "Create a new API method" : `Editing ${endpoint.name}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>
                Write your endpoint implementation. The function receives params and props.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="async function execute(params, props) { ... }"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Method Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="summarizeText" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this endpoint do?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as any)}>
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Props</CardTitle>
              <CardDescription>API keys and secrets needed by this endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newProp}
                  onChange={(e) => setNewProp(e.target.value)}
                  placeholder="geminiApiKey"
                  onKeyDown={(e) => e.key === "Enter" && handleAddProp()}
                />
                <Button onClick={handleAddProp} size="icon" variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {requiredProps.map((prop) => (
                  <Badge key={prop} variant="secondary" className="gap-1">
                    {prop}
                    <button onClick={() => handleRemoveProp(prop)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
