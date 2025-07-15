"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import DataImportStep from "@/components/data-import-step"
import InvoiceFormatStep from "@/components/invoice-format-step"
import SendingStep from "@/components/sending-step"
import AnalyticsStep from "@/components/analytics-step"
import WalletSidebar from "@/components/wallet-sidebar"
import type { InvoiceData } from "@/types/invoice"
import { Wallet } from "lucide-react"

export default function BulkInvoiceApp() {
  const [currentStep, setCurrentStep] = useState(1)
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([])
  const [invoiceTemplate, setInvoiceTemplate] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    logo: "",
    template: "modern",
  })

  const [credits, setCredits] = useState(100) // Starting credits
  const [sendingHistory, setSendingHistory] = useState<any[]>([])
  const [isWalletOpen, setIsWalletOpen] = useState(false)

  const steps = [
    { id: 1, title: "Import Data", description: "Upload or download CSV/Excel files" },
    { id: 2, title: "Invoice Format", description: "Setup invoice template and format" },
    { id: 3, title: "Send Invoices", description: "Send via Email, SMS, and WhatsApp" },
    { id: 4, title: "Analytics", description: "View reports and analytics" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Invoice Generator</h1>
            <p className="text-gray-600">Generate and send invoices in bulk via multiple channels</p>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Credits</p>
              <p className="text-lg font-bold text-blue-600">{credits}</p>
            </div>
            <Button onClick={() => setIsWalletOpen(true)} variant="outline" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={currentStep.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {steps.map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id.toString()}
                onClick={() => setCurrentStep(step.id)}
                disabled={step.id > 1 && invoiceData.length === 0 && step.id !== 4}
              >
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="1" className="mt-6">
            <DataImportStep
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              onNext={() => setCurrentStep(2)}
            />
          </TabsContent>

          <TabsContent value="2" className="mt-6">
            <InvoiceFormatStep
              invoiceTemplate={invoiceTemplate}
              setInvoiceTemplate={setInvoiceTemplate}
              invoiceData={invoiceData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          </TabsContent>

          <TabsContent value="3" className="mt-6">
            <SendingStep
              invoiceData={invoiceData}
              invoiceTemplate={invoiceTemplate}
              credits={credits}
              setCredits={setCredits}
              setSendingHistory={setSendingHistory}
              onBack={() => setCurrentStep(2)}
              onComplete={() => setCurrentStep(4)}
            />
          </TabsContent>

          <TabsContent value="4" className="mt-6">
            <AnalyticsStep invoiceData={invoiceData} sendingHistory={sendingHistory} />
          </TabsContent>
        </Tabs>

        {/* Wallet Sidebar */}
        <WalletSidebar
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          credits={credits}
          setCredits={setCredits}
        />
      </div>
    </div>
  )
}
