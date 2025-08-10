"use client"

import { useState, useEffect } from "react"
import { getComplianceDeadline } from "@/lib/utils"

export function ComplianceDeadline() {
  const [complianceDeadline, setComplianceDeadline] = useState("")

  useEffect(() => {
    setComplianceDeadline(getComplianceDeadline())
  }, [])

  // Return EXACTLY the same text that was in the original
  return <>{complianceDeadline}</>
}