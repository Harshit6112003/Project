"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { InvoiceData } from "@/types/invoice"
import { Upload, Check } from "lucide-react"

interface InvoiceFormatStepProps {
  invoiceTemplate: any
  setInvoiceTemplate: (template: any) => void
  invoiceData: InvoiceData[]
  onNext: () => void
  onBack: () => void
}

export default function InvoiceFormatStep({
  invoiceTemplate,
  setInvoiceTemplate,
  invoiceData,
  onNext,
  onBack,
}: InvoiceFormatStepProps) {
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(invoiceData[0] || null)

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and professional design",
      image: "/placeholder.svg?height=200&width=300&text=Modern+Template",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional invoice layout",
      image: "/placeholder.svg?height=200&width=300&text=Classic+Template",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant design",
      image: "/placeholder.svg?height=200&width=300&text=Minimal+Template",
    },
  ]

  const updateTemplate = (field: string, value: string) => {
    setInvoiceTemplate({ ...invoiceTemplate, [field]: value })
  }

  const selectTemplate = (templateId: string) => {
    updateTemplate("template", templateId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Invoice</CardTitle>
            <CardDescription>Select from saved template designs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative cursor-pointer border-2 rounded-lg p-3 transition-all ${
                    invoiceTemplate.template === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => selectTemplate(template.id)}
                >
                  {invoiceTemplate.template === template.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Enter your company details for the invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={invoiceTemplate.companyName}
                onChange={(e) => updateTemplate("companyName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={invoiceTemplate.companyAddress}
                onChange={(e) => updateTemplate("companyAddress", e.target.value)}
                placeholder="123 Business St, City, State 12345"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={invoiceTemplate.companyEmail}
                onChange={(e) => updateTemplate("companyEmail", e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input
                id="companyPhone"
                value={invoiceTemplate.companyPhone}
                onChange={(e) => updateTemplate("companyPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo"
                  value={invoiceTemplate.logo}
                  onChange={(e) => updateTemplate("logo", e.target.value)}
                  placeholder="Logo URL or upload"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Company Details</CardTitle>
            <CardDescription>Add extra company information and signature</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyDetails">Additional Company Details</Label>
              <Textarea
                id="companyDetails"
                value={invoiceTemplate.companyDetails || ""}
                onChange={(e) => updateTemplate("companyDetails", e.target.value)}
                placeholder="Tax ID: ... Bank: ... Website: ..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="signature">Authorized Signature</Label>
              <Input
                id="signature"
                value={invoiceTemplate.signature || ""}
                onChange={(e) => updateTemplate("signature", e.target.value)}
                placeholder="John Doe, CEO"
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <CardDescription>Add your payment terms and conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoiceTemplate.termsAndConditions || ""}
              onChange={(e) => updateTemplate("termsAndConditions", e.target.value)}
              placeholder="Payment is due in 30 days..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Next: Send Invoices
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewInvoice && (
              <div className="border rounded-lg p-6 bg-white">
                {/* Header */}
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600">
                      {invoiceTemplate.companyName || "Your Company"}
                    </h2>
                    <p className="text-gray-600 whitespace-pre-line">
                      {invoiceTemplate.companyAddress || "Company Address"}
                    </p>
                    <p className="text-gray-600">{invoiceTemplate.companyEmail}</p>
                    <p className="text-gray-600">{invoiceTemplate.companyPhone}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold">INVOICE</h3>
                    <p className="text-gray-600">#{previewInvoice.id}</p>
                    <p className="text-gray-600">Date: {previewInvoice.date}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <p className="font-medium">{previewInvoice.name}</p>
                  <p className="text-gray-600">{previewInvoice.email}</p>
                  <p className="text-gray-600">{previewInvoice.phone}</p>
                </div>

                {/* Items */}
                <div className="border-t border-b py-4 mb-4">
                  <div className="grid grid-cols-4 font-semibold mb-2">
                    <div>Description</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Tax</div>
                    <div className="text-right">Total</div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div>{previewInvoice.description}</div>
                    <div className="text-right">${previewInvoice.amount}</div>
                    <div className="text-right">${previewInvoice.tax}</div>
                    <div className="text-right font-semibold">${previewInvoice.total}</div>
                  </div>
                </div>

                <div className="text-right text-xl font-bold mb-6">
                  Total: ${previewInvoice.total}
                </div>

                <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
                  {invoiceTemplate.companyDetails && (
                    <div>
                      <h4 className="font-semibold mb-2">Company Details:</h4>
                      <div className="text-sm text-gray-600 whitespace-pre-line">{invoiceTemplate.companyDetails}</div>
                    </div>
                  )}
                  {invoiceTemplate.signature && (
                    <div className="text-right">
                      <h4 className="font-semibold mb-2">Authorized By:</h4>
                      <div className="mt-8 text-sm text-gray-700 font-medium">
                        {invoiceTemplate.signature}
                      </div>
                    </div>
                  )}
                </div>

                {invoiceTemplate.termsAndConditions && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Terms and Conditions:</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {invoiceTemplate.termsAndConditions}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Preview Different Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={previewInvoice?.id || ""}
              onChange={(e) =>
                setPreviewInvoice(invoiceData.find((inv) => inv.id === e.target.value) || null)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select invoice to preview</option>
              {invoiceData.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.name} - ${invoice.total}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
