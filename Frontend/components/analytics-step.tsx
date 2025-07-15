"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InvoiceData } from "@/types/invoice"
import HistoryTab from "@/components/history-tab"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, DollarSign, Users, Mail, MessageSquare, Phone, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyticsStepProps {
  invoiceData: InvoiceData[]
  sendingHistory: any[]
}

export default function AnalyticsStep({ invoiceData, sendingHistory }: AnalyticsStepProps) {
  // Calculate analytics data
  const totalInvoices = invoiceData.length
  const totalAmount = invoiceData.reduce((sum, invoice) => sum + invoice.total, 0)
  const averageAmount = totalAmount / totalInvoices || 0
  const totalTax = invoiceData.reduce((sum, invoice) => sum + invoice.tax, 0)

  const exportAnalytics = () => {
    const analyticsData = {
      summary: {
        totalInvoices,
        totalAmount,
        averageAmount,
        totalTax,
      },
      channelPerformance: channelData,
      monthlyTrends: monthlyData,
      amountDistribution: amountRanges,
    }

    const csvContent = [
      ["Metric", "Value"],
      ["Total Invoices", totalInvoices],
      ["Total Amount", `$${totalAmount}`],
      ["Average Amount", `$${averageAmount.toFixed(2)}`],
      ["Total Tax", `$${totalTax}`],
      [""],
      ["Channel Performance"],
      ["Channel", "Sent", "Failed", "Success Rate"],
      ...channelData.map((ch) => [ch.name, ch.sent, ch.failed, `${((ch.sent / ch.total) * 100).toFixed(1)}%`]),
      [""],
      ["Monthly Trends"],
      ["Month", "Invoices", "Amount"],
      ...monthlyData.map((m) => [m.month, m.invoices, `$${m.amount}`]),
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "analytics-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    alert("PDF export functionality would be implemented here")
  }

  // Channel success rates (simulated)
  const channelData = [
    {
      name: "Email",
      sent: Math.floor(totalInvoices * 0.95),
      failed: Math.floor(totalInvoices * 0.05),
      total: totalInvoices,
    },
    {
      name: "SMS",
      sent: Math.floor(totalInvoices * 0.88),
      failed: Math.floor(totalInvoices * 0.12),
      total: totalInvoices,
    },
    {
      name: "WhatsApp",
      sent: Math.floor(totalInvoices * 0.92),
      failed: Math.floor(totalInvoices * 0.08),
      total: totalInvoices,
    },
  ]

  // Monthly data (simulated)
  const monthlyData = [
    { month: "Jan", invoices: 45, amount: 52000 },
    { month: "Feb", invoices: 52, amount: 61000 },
    { month: "Mar", invoices: 48, amount: 58000 },
    { month: "Apr", invoices: 61, amount: 72000 },
    { month: "May", invoices: 55, amount: 65000 },
    { month: "Jun", invoices: totalInvoices, amount: totalAmount },
  ]

  // Amount distribution
  const amountRanges = [
    { range: "$0-500", count: invoiceData.filter((inv) => inv.total <= 500).length },
    { range: "$501-1000", count: invoiceData.filter((inv) => inv.total > 500 && inv.total <= 1000).length },
    { range: "$1001-2000", count: invoiceData.filter((inv) => inv.total > 1000 && inv.total <= 2000).length },
    { range: "$2000+", count: invoiceData.filter((inv) => inv.total > 2000).length },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600">Comprehensive insights into your invoice campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportAnalytics} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
          <TabsTrigger value="history">Sending History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                    <p className="text-2xl font-bold">{totalInvoices}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Amount</p>
                    <p className="text-2xl font-bold">${averageAmount.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tax</p>
                    <p className="text-2xl font-bold">${totalTax.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Success Rates</CardTitle>
                <CardDescription>Success rate by sending channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill="#10B981" name="Sent" />
                    <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Amount Distribution</CardTitle>
                <CardDescription>Distribution of invoice amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={amountRanges}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, count }) => `${range}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {amountRanges.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Invoice count and amount trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="invoices" fill="#3B82F6" name="Invoices" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#10B981" name="Amount ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Channel Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Details</CardTitle>
              <CardDescription>Detailed breakdown of each sending channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelData.map((channel) => {
                  const successRate = ((channel.sent / channel.total) * 100).toFixed(1)
                  const Icon = channel.name === "Email" ? Mail : channel.name === "SMS" ? Phone : MessageSquare

                  return (
                    <div key={channel.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{channel.name}</h4>
                          <p className="text-sm text-gray-600">
                            {channel.sent} sent, {channel.failed} failed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={Number(successRate) > 90 ? "default" : "secondary"} className="mb-1">
                          {successRate}% Success Rate
                        </Badge>
                        <p className="text-sm text-gray-600">{channel.total} total</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Latest invoices processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoiceData.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{invoice.name}</h4>
                      <p className="text-sm text-gray-600">{invoice.email}</p>
                      <p className="text-sm text-gray-600">{invoice.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.total}</p>
                      <p className="text-sm text-gray-600">{invoice.date}</p>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Sent
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab sendingHistory={sendingHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
