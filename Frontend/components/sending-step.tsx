"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { InvoiceData } from "@/types/invoice"
import { Mail, MessageSquare, Phone, CheckCircle, XCircle, Clock } from "lucide-react"

interface SendingStepProps {
  invoiceData: InvoiceData[]
  invoiceTemplate: any
  credits: number
  setCredits: (credits: number) => void
  setSendingHistory: (history: any) => void
  onBack: () => void
  onComplete: () => void
}

interface SendingStatus {
  id: string
  email: "pending" | "sending" | "sent" | "failed"
  sms: "pending" | "sending" | "sent" | "failed"
  whatsapp: "pending" | "sending" | "sent" | "failed"
}

export default function SendingStep({
  invoiceData,
  invoiceTemplate,
  credits,
  setCredits,
  setSendingHistory,
  onBack,
  onComplete,
}: SendingStepProps) {
  const [sendingStatus, setSendingStatus] = useState<SendingStatus[]>([])
  const [isSending, setIsSending] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState({
    email: true,
    sms: true,
    whatsapp: true,
  })
  const [progress, setProgress] = useState(0)

useEffect(() => {
  const initialStatus: SendingStatus[] = invoiceData.map((invoice) => ({
    id: invoice.id,
    email: "pending" as const,
    sms: "pending" as const,
    whatsapp: "pending" as const,
  }))
  setSendingStatus(initialStatus)
}, [invoiceData])


  const creditRates = {
    email: 1,
    sms: 2,
    whatsapp: 1.5,
  }

  const calculateRequiredCredits = () => {
    const channels = Object.entries(selectedChannels).filter(([_, enabled]) => enabled)
    return (
      invoiceData.length *
      channels.reduce((sum, [channel]) => sum + creditRates[channel as keyof typeof creditRates], 0)
    )
  }

  const requiredCredits = calculateRequiredCredits()
  const hasEnoughCredits = credits >= requiredCredits

  const startSending = async () => {
    if (!hasEnoughCredits) {
      alert("Insufficient credits! Please top up your wallet.")
      return
    }

    setIsSending(true)
    setProgress(0)

    const totalOperations = invoiceData.length * Object.values(selectedChannels).filter(Boolean).length
    let completedOperations = 0
    let creditsUsed = 0
    let updatedCredits = credits

    for (const invoice of invoiceData) {
      const channels = Object.entries(selectedChannels).filter(([_, enabled]) => enabled)

      for (const [channel] of channels) {
        setSendingStatus((prev) =>
          prev.map((status) => (status.id === invoice.id ? { ...status, [channel]: "sending" } : status)),
        )

        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

        const success = Math.random() > 0.1

        setSendingStatus((prev) =>
          prev.map((status) =>
            status.id === invoice.id ? { ...status, [channel]: success ? "sent" : "failed" } : status,
          ),
        )

        if (success) {
          const channelCredits = creditRates[channel as keyof typeof creditRates]
          creditsUsed += channelCredits
          updatedCredits -= channelCredits
          setCredits(updatedCredits)
        }

        completedOperations++
        setProgress((completedOperations / totalOperations) * 100)
      }
    }

    const historyEntry = {
      id: Date.now().toString(),
      name: `Campaign ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split("T")[0],
      totalInvoices: invoiceData.length,
      totalAmount: invoiceData.reduce((sum, inv) => sum + inv.total, 0),
      channels: Object.keys(selectedChannels).filter((ch) => selectedChannels[ch as keyof typeof selectedChannels]),
      status: "completed",
      successRate: 90,
      creditsUsed,
    }

    setSendingHistory((prev: any) => [historyEntry, ...prev])
    setIsSending(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "sending":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      sending: "default",
      sent: "default",
      failed: "destructive",
    } as const

    const colors = {
      pending: "bg-gray-100 text-gray-800",
      sending: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTotalStats = () => {
    const channels = Object.keys(selectedChannels).filter(
      (channel) => selectedChannels[channel as keyof typeof selectedChannels],
    )
    const stats = {
      total: invoiceData.length * channels.length,
      sent: 0,
      failed: 0,
      pending: 0,
    }

    sendingStatus.forEach((status) => {
      channels.forEach((channel) => {
        const channelStatus = status[channel as keyof SendingStatus]
        if (channelStatus === "sent") stats.sent++
        else if (channelStatus === "failed") stats.failed++
        else stats.pending++
      })
    })

    return stats
  }

  const stats = getTotalStats()

  return (
    <div className="space-y-6">
      {!hasEnoughCredits && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="text-red-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-red-800">Insufficient Credits</h4>
              <p className="text-sm text-red-600">
                You need {requiredCredits} credits but only have {credits} available. Please top up your wallet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Continue rendering your cards and content here like in your existing UI */}
      {/* Button logic remains same */}
    </div>
  )
}
