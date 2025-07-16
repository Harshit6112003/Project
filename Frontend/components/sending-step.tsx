"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { InvoiceData } from "@/types/invoice"

interface SendingStepProps {
  invoiceData: InvoiceData[]
  invoiceTemplate: any
  credits: number
  setCredits: (credits: number) => void
  setSendingHistory: (history: any) => void
  onBack: () => void
  onComplete: () => void
}

export default function SendingStep({
  invoiceData,
  credits,
  setCredits,
  setSendingHistory,
  onBack,
  onComplete,
}: SendingStepProps) {
  const [selectedChannels, setSelectedChannels] = useState({
    email: true,
    sms: false,
    whatsapp: false,
  })
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<{ [id: string]: "pending" | "sent" | "failed" }>({})

  const creditRates = { email: 1, sms: 2, whatsapp: 1.5 }

  const requiredCredits = invoiceData.length *
    Object.entries(selectedChannels)
      .filter(([, enabled]) => enabled)
      .reduce((sum, [ch]) => sum + creditRates[ch as keyof typeof creditRates], 0)

  const startSending = async () => {
    if (credits < requiredCredits) {
      alert("Not enough credits!")
      return
    }

    setIsSending(true)
    setProgress(0)

    try {
      const res = await fetch("http://localhost:5000/api/send-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: invoiceData }),
      })

      const result = await res.json()

      if (result.success) {
        const updatedStatus: { [id: string]: "sent" | "failed" } = {}
        result.results.forEach((r: any) => {
          updatedStatus[r.id] = r.status === "sent" ? "sent" : "failed"
        })
        setStatus(updatedStatus)
        setCredits(credits - requiredCredits)

        setSendingHistory((prev: any[]) => [
          {
            id: Date.now().toString(),
            name: `Campaign ${new Date().toLocaleDateString()}`,
            totalInvoices: invoiceData.length,
            totalAmount: invoiceData.reduce((sum, i) => sum + i.total, 0),
            status: "completed",
            creditsUsed: requiredCredits,
            date: new Date().toISOString(),
          },
          ...prev,
        ])
      } else {
        alert("Failed to send some invoices.")
      }
    } catch (err) {
      console.error(err)
      alert("Error sending invoices.")
    }

    setIsSending(false)
    setProgress(100)
    onComplete()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Invoices</CardTitle>
          <CardDescription>Send PDF invoices via email (or SMS/WhatsApp coming soon)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            {["email", "sms", "whatsapp"].map((channel) => (
              <Label key={channel}>
                <Checkbox
                  checked={selectedChannels[channel as keyof typeof selectedChannels]}
                  onCheckedChange={(val) =>
                    setSelectedChannels((prev) => ({ ...prev, [channel]: !!val }))
                  }
                />
                <span className="ml-2 capitalize">{channel}</span>
              </Label>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Required Credits: <strong>{requiredCredits}</strong> | Available Credits:{" "}
            <strong>{credits}</strong>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button disabled={isSending || credits < requiredCredits} onClick={startSending}>
              {isSending ? "Sending..." : "Start Sending"}
            </Button>
          </div>

          {isSending && <Progress value={progress} className="h-2" />}

          {Object.keys(status).length > 0 && (
            <div className="space-y-2 mt-4">
              {invoiceData.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <span>{inv.name}</span>
                  <Badge
                    variant={status[inv.id] === "sent" ? "default" : "destructive"}
                  >
                    {status[inv.id]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
