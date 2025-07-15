"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, Trash2, Plus } from "lucide-react"
import type { InvoiceData } from "@/types/invoice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DataImportStepProps {
  invoiceData: InvoiceData[]
  setInvoiceData: (data: InvoiceData[]) => void
  onNext: () => void
}

export default function DataImportStep({ invoiceData, setInvoiceData, onNext }: DataImportStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAddingManually, setIsAddingManually] = useState(false)
  const [newInvoice, setNewInvoice] = useState<Partial<InvoiceData>>({})

  const sampleData: InvoiceData[] = [
    {
      id: "1",
      date: "2024-01-15",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      description: "Web Development Services",
      amount: 1000,
      tax: 100,
      total: 1100,
    },
    {
      id: "2",
      date: "2024-01-16",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      description: "Graphic Design Services",
      amount: 750,
      tax: 75,
      total: 825,
    },
  ]

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:5000/api/upload-excel", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      // Optionally map the keys to match your InvoiceData format
      const parsedData = result.data.map((item: any, index: number) => ({
        id: (Date.now() + index).toString(),
        date: item.Date,
        name: item.Name,
        email: item.Email,
        phone: item.Phone,
        description: item.Description,
        amount: Number(item.Amount),
        tax: Number(item.Tax),
        total: Number(item.Total),
      }));

      setInvoiceData(parsedData);
    } else {
      alert("Failed to parse Excel");
    }
  } catch (error) {
    console.error("Upload failed", error);
    alert("Upload failed");
  }
};


  const downloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Name,Email,Phone,Description,Amount,Tax,Total\n" +
      "2024-01-15,John Doe,john@example.com,+1234567890,Web Development Services,1000,100,1100\n"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "invoice_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const addManualInvoice = () => {
    if (newInvoice.name && newInvoice.email && newInvoice.amount) {
      const invoice: InvoiceData = {
        id: Date.now().toString(),
        date: newInvoice.date || new Date().toISOString().split("T")[0],
        name: newInvoice.name,
        email: newInvoice.email,
        phone: newInvoice.phone || "",
        description: newInvoice.description || "",
        amount: Number(newInvoice.amount),
        tax: Number(newInvoice.tax) || 0,
        total: Number(newInvoice.amount) + (Number(newInvoice.tax) || 0),
      }
      setInvoiceData([...invoiceData, invoice])
      setNewInvoice({})
      setIsAddingManually(false)
    }
  }

  const removeInvoice = (id: string) => {
    setInvoiceData(invoiceData.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Invoice Data</CardTitle>
          <CardDescription>Upload your invoice data via CSV/Excel file or add entries manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6" />
              <span>Upload CSV/Excel</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
              onClick={downloadTemplate}
            >
              <Download className="h-6 w-6" />
              <span>Download Template</span>
            </Button>

            <Dialog open={isAddingManually} onOpenChange={setIsAddingManually}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Manually</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Invoice Manually</DialogTitle>
                  <DialogDescription>Enter invoice details manually</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newInvoice.date || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newInvoice.name || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInvoice.email || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newInvoice.phone || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newInvoice.description || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newInvoice.amount || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax">Tax</Label>
                    <Input
                      id="tax"
                      type="number"
                      value={newInvoice.tax || ""}
                      onChange={(e) => setNewInvoice({ ...newInvoice, tax: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addManualInvoice} className="flex-1">
                      Add Invoice
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingManually(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {invoiceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Invoice Data ({invoiceData.length} entries)</span>
              <Button onClick={() => setInvoiceData([])} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.name}</TableCell>
                      <TableCell>{invoice.email}</TableCell>
                      <TableCell>{invoice.phone}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>${invoice.tax}</TableCell>
                      <TableCell>${invoice.total}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeInvoice(invoice.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={onNext} disabled={invoiceData.length === 0}>
                Next: Setup Invoice Format
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
