export interface InvoiceData {
  id: string
  date: string
  name: string
  email: string
  phone: string
  description: string
  amount: number
  tax: number
  total: number
}

export interface InvoiceTemplate {
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  logo: string
  template: "modern" | "classic" | "minimal"
}
