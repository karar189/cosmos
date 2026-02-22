"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils";
import {
  CreditCard,
  FileText,
  Bot,
  Users,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from "lucide-react";

const BUSINESS_NATURES = [
  { value: "agency", label: "Agency" },
  { value: "rwa", label: "RWA (Real World Assets)" },
  { value: "fintech", label: "Fintech" },
  { value: "marketplace", label: "Marketplace" },
  { value: "saas", label: "SaaS" },
  { value: "other", label: "Other" },
] as const;

const WIDGETS: { id: string; label: string; description: string; icon: LucideIcon }[] = [
  { id: "payments", label: "Payments solution", description: "Accept and manage payments", icon: CreditCard },
  { id: "doc-hub", label: "Doc hub", description: "Store and manage documents", icon: FileText },
  { id: "ai-assistant", label: "AI assistant", description: "Smart automation and support", icon: Bot },
  { id: "employee-mgmt", label: "Employee management", description: "Team and HR tools", icon: Users },
  { id: "compliance", label: "Compliance checker", description: "Regulatory and policy checks", icon: ShieldCheck },
];

// Which widgets to pre-select by business nature
const BUSINESS_TO_WIDGETS: Record<string, string[]> = {
  agency: ["payments", "doc-hub", "ai-assistant", "employee-mgmt"],
  rwa: ["payments", "doc-hub", "compliance"],
  fintech: ["payments", "doc-hub", "ai-assistant", "compliance"],
  marketplace: ["payments", "doc-hub", "ai-assistant"],
  saas: ["payments", "doc-hub", "ai-assistant", "employee-mgmt"],
  other: ["payments", "doc-hub"],
};

export type OnboardingData = {
  name: string;
  email: string;
  businessNature: string;
  selectedWidgets: string[];
  importFileName?: string;
};

const ONBOARDING_STORAGE_KEY = "onboarding_completed";
const ONBOARDING_DATA_KEY = "onboarding_data";

export function getOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
}

export function setOnboardingCompleted(data?: OnboardingData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  if (data) {
    try {
      localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
}

type OnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: OnboardingData) => void;
};

export function OnboardingModal({
  open,
  onOpenChange,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessNature, setBusinessNature] = useState<string>("");
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;
  const isStep1Valid = name.trim().length > 0 && email.trim().length > 0;
  const isStep2Valid = businessNature.length > 0;

  const goNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
      return;
    }
    if (step === 2 && isStep2Valid) {
      const suggested = BUSINESS_TO_WIDGETS[businessNature] ?? BUSINESS_TO_WIDGETS.other;
      setSelectedWidgets(Array.from(new Set(suggested)));
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4) {
      const data: OnboardingData = {
        name: name.trim(),
        email: email.trim(),
        businessNature,
        selectedWidgets,
        ...(importFile && { importFileName: importFile.name }),
      };
      setOnboardingCompleted(data);
      onComplete?.(data);
      onOpenChange(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleWidget = (id: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const canProceed =
    (step === 1 && isStep1Valid) ||
    (step === 2 && isStep2Valid) ||
    step === 3 ||
    step === 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (step < totalSteps) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          <DialogTitle className="pt-2">
            {step === 1 && "About you"}
            {step === 2 && "Nature of your business"}
            {step === 3 && "Suggestions"}
            {step === 4 && "Import"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "We'll use this to personalize your experience."}
            {step === 2 && "This helps us suggest the right tools."}
            {step === 3 && "Based on your business, we think you'll need these. You can change them anytime."}
            {step === 4 && "Import your data or skip and add it later."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="onb-name">Name</Label>
                <Input
                  id="onb-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="onb-email">Email</Label>
                <Input
                  id="onb-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label>What best describes your business?</Label>
              <div className="grid gap-2 pt-2">
                {BUSINESS_NATURES.map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50",
                      businessNature === value && "border-primary bg-primary/5"
                    )}
                  >
                    <input
                      type="radio"
                      name="businessNature"
                      value={value}
                      checked={businessNature === value}
                      onChange={() => setBusinessNature(value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select the widgets you want to use. Pre-selected based on your business type.
              </p>
              <div className="grid gap-3">
                {WIDGETS.map((w) => {
                  const Icon = w.icon;
                  const checked = selectedWidgets.includes(w.id);
                  return (
                    <label
                      key={w.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                        checked && "border-primary bg-primary/5"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleWidget(w.id)}
                      />
                      <div className="flex flex-1 items-start gap-3">
                        <div className="rounded-md bg-muted p-2">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{w.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept=".csv,.json,.xlsx"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors hover:bg-muted/50",
                  importFile ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
              >
                <Upload className="size-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {importFile ? importFile.name : "Choose file to import"}
                </span>
                <span className="text-xs text-muted-foreground">
                  CSV, JSON, or XLSX — or skip
                </span>
              </button>
              {importFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setImportFile(null);
                    fileInputRef.current?.value && (fileInputRef.current.value = "");
                  }}
                >
                  Remove file
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={goBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button type="button" onClick={goNext} disabled={!canProceed}>
            {step < totalSteps ? "Continue" : "Get started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
