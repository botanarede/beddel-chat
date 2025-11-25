"use client"

/**
 * Client editor component for managing clients and API keys
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2, Plus, Copy, X } from "lucide-react"
import Link from "next/link"
import type { Client } from "beddel/server"
import { useToast } from "@/hooks/use-toast"

interface ClientEditorProps {
  client?: Client
}

export function ClientEditor({ client }: ClientEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isNew = !client

  const [name, setName] = useState(client?.name || "")
  const [email, setEmail] = useState(client?.email || "")
  const [rateLimit, setRateLimit] = useState(client?.rateLimit || 60)
  const [apiKeys, setApiKeys] = useState<string[]>(client?.apiKeys || [])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const generateApiKey = () => {
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return `opal_${name.toLowerCase().replace(/\s+/g, "_")}_key_${randomPart}`
  }

  const handleAddApiKey = () => {
    const newKey = generateApiKey()
    setApiKeys([...apiKeys, newKey])
    toast({
      title: "API Key Generated",
      description: "New API key added. Remember to save changes.",
    })
  }

  const handleRemoveApiKey = (key: string) => {
    if (apiKeys.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "Client must have at least one API key",
        variant: "destructive",
      })
      return
    }
    setApiKeys(apiKeys.filter((k) => k !== key))
  }

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  const handleSave = async () => {
    if (!name || !email || apiKeys.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one API key",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/clients", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: client?.id,
          name,
          email,
          rateLimit,
          apiKeys,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save client")
      }

      toast({
        title: "Success",
        description: `Client ${isNew ? "created" : "updated"} successfully`,
      })

      router.push("/admin/clients")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save client",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!client || !confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/clients?id=${client.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      toast({
        title: "Success",
        description: "Client deleted successfully",
      })

      router.push("/admin/clients")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete client",
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
          <Link href="/admin/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isNew ? "New Client" : "Edit Client"}</h1>
            <p className="text-muted-foreground">{isNew ? "Create a new API client" : `Editing ${client.name}`}</p>
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Basic details about the client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Demo Client" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
              <Input
                id="rateLimit"
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number.parseInt(e.target.value) || 60)}
                min={1}
                max={1000}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage authentication keys for this client</CardDescription>
              </div>
              <Button onClick={handleAddApiKey} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Generate Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiKeys.map((key, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg border p-3">
                  <code className="flex-1 text-sm font-mono">{key}</code>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyApiKey(key)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveApiKey(key)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">No API keys yet. Generate one to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isNew && (
          <Card>
            <CardHeader>
              <CardTitle>Client ID</CardTitle>
              <CardDescription>Internal identifier for this client</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="text-sm">{client.id}</code>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
