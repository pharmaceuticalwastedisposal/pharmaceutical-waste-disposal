"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
// Enterprise-grade tree-shaking via Next.js modularizeImports
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FACILITY_TYPES, WASTE_TYPES, VOLUME_RANGES } from "@/lib/constants"
import { formatPhoneNumber } from "@/lib/utils"

const formSchema = z.object({
  facilityType: z.string().min(1, "Please select a facility type"),
  wasteTypes: z.array(z.string()).min(1, "Please select at least one waste type"),
  volume: z.string().min(1, "Please select your volume range"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code"),
})

type FormData = z.infer<typeof formSchema>

function ProgressiveLeadForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  })

  const watchedFacilityType = watch("facilityType")
  const watchedWasteTypes = watch("wasteTypes", [])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // Submit to API route which handles Supabase and email notifications
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone || undefined,
          company: data.company || undefined,
          facility_type: data.facilityType,
          waste_types: data.wasteTypes,
          volume: data.volume,
          zip_code: data.zipCode,
          source: "homepage_progressive_form",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      console.log("Lead captured successfully:", result)
      
      // Track conversion event if analytics is set up
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('lead_captured', {
          lead_id: result.leadId,
          facility_type: data.facilityType,
          waste_types: data.wasteTypes,
          volume: data.volume,
        })
      }
      
      // Redirect to thank you page
      window.location.href = "/thank-you"
      
    } catch (error) {
      console.error("Failed to submit form:", error)
      // Show error message to user
      alert("There was an error submitting your information. Please try again or call us directly at 1-800-PHARMWASTE.")
      setIsSubmitting(false)
    }
  }

  const calculateLeadScore = (data: FormData): number => {
    let score = 0
    if (data.facilityType === "hospital") score += 30
    if (data.wasteTypes.includes("controlled")) score += 20
    if (data.volume === "large" || data.volume === "enterprise") score += 25
    if (data.phone) score += 15
    if (data.company) score += 10
    return score
  }

  const nextStep = () => {
    setFormData({ ...formData, ...watch() })
    setStep(step + 1)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-lg mx-auto w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            Connect with Certified Specialists
          </h3>
          <span className="text-sm text-gray-500">
            Step {step} of 4
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What type of facility are you?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {FACILITY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setValue("facilityType", type.value)
                        setTimeout(nextStep, 300)
                      }}
                      className={`p-3 text-sm border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all ${
                        watchedFacilityType === type.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-300"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {errors.facilityType && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.facilityType.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What types of waste do you need to dispose?
                </Label>
                <div className="space-y-2">
                  {WASTE_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={type.value}
                        {...register("wasteTypes")}
                        className="h-4 w-4 text-primary-600 rounded"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
                {errors.wasteTypes && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.wasteTypes.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={nextStep}
                className="w-full"
                variant="cta"
                size="lg"
                disabled={watchedWasteTypes.length === 0}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Estimated monthly volume?
                </Label>
                <div className="space-y-3">
                  {VOLUME_RANGES.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => {
                        setValue("volume", range.value)
                        setTimeout(nextStep, 300)
                      }}
                      className={`w-full p-4 text-left border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all ${
                        watch("volume") === range.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{range.label}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Typical cost: {range.priceRange}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Almost done! Where should we send your compliance report?
                </Label>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="compliance@yourfacility.com"
                      {...register("email")}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (for urgent updates)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      {...register("phone")}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setValue("phone", formatted)
                      }}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Facility Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Memorial Hospital"
                      {...register("company")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="90210"
                      maxLength={5}
                      {...register("zipCode")}
                      className="mt-1"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="cta"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Your Report...
                  </>
                ) : (
                  <>
                    Connect with Specialists
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                100% free. Multiple quotes. Pre-vetted specialists only.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

export default ProgressiveLeadForm