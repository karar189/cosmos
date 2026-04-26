"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, FileBarChart2, Plus, ShieldCheck, Upload, X } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFreighter } from "@/hooks/useFreighter";
import {
  clearLatestComplianceResult,
  getLatestComplianceResult,
  setPendingComplianceRequest,
} from "@/lib/compliance-agent-session";

const MAX_WEBSITES = 5;
const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

const COUNTRY_OPTIONS = [
  "United States",
  "United Kingdom",
  "European Union",
  "India",
  "Singapore",
  "United Arab Emirates",
  "Philippines",
  "Nigeria",
  "Brazil",
  "Other",
] as const;

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  if (i < 0) return "";
  return filename.slice(i).toLowerCase();
}

function isValidWebsiteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function dedupeFiles(files: File[]): File[] {
  const seen = new Set<string>();
  const out: File[] = [];
  for (const file of files) {
    const key = `${file.name.toLowerCase()}::${file.size}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(file);
  }
  return out;
}

export default function ComplianceAgentPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();

  const [country, setCountry] = useState<string>("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [notes, setNotes] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [websites, setWebsites] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasLastAnalysis = useMemo(() => !!getLatestComplianceResult(), []);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to view this page.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const addWebsite = () => {
    const candidate = websiteInput.trim();
    if (!candidate) {
      setError("Website URL cannot be empty.");
      return;
    }
    if (!isValidWebsiteUrl(candidate)) {
      setError("Invalid website URL. Only http/https public URLs are allowed.");
      return;
    }
    if (websites.length >= MAX_WEBSITES) {
      setError(`You can add up to ${MAX_WEBSITES} websites.`);
      return;
    }
    const duplicate = websites.some((w) => w.toLowerCase() === candidate.toLowerCase());
    if (duplicate) {
      setError("Duplicate website URL detected.");
      return;
    }
    setWebsites((prev) => [...prev, candidate]);
    setWebsiteInput("");
    setError(null);
  };

  const removeWebsite = (url: string) => {
    setWebsites((prev) => prev.filter((w) => w !== url));
  };

  const onFileInput = (nextFiles: FileList | null) => {
    if (!nextFiles) return;
    const incoming = Array.from(nextFiles);
    const combined = dedupeFiles([...files, ...incoming]);
    if (combined.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }
    for (const file of combined) {
      const ext = getExtension(file.name);
      if (!SUPPORTED_EXTENSIONS.includes(ext as (typeof SUPPORTED_EXTENSIONS)[number])) {
        setError("Unsupported file type. Supported types are PDF, DOCX, and TXT.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }
    }
    setFiles(combined);
    setError(null);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const validateRequiredFields = (): string | null => {
    const company = companyDetails.trim();
    const model = businessModel.trim();
    if (!country) return "Country/Region is required.";
    if (company.length < 10 || company.length > 500) return "Company details must be between 10 and 500 characters.";
    if (model.length < 20 || model.length > 1000) return "Business model must be between 20 and 1000 characters.";
    if (notes.trim().length > 3000) return "Notes can be up to 3000 characters.";
    return null;
  };

  const continueToLoading = () => {
    const validationError = validateRequiredFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    clearLatestComplianceResult();
    setPendingComplianceRequest({
      country,
      companyDetails: companyDetails.trim(),
      businessModel: businessModel.trim(),
      notes: notes.trim(),
      websites,
      files,
    });
    router.push("/dashboard/compliance-agent/loading");
  };

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Compliance Agent</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>Dashboard</Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>Disconnect</Button>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <ShieldCheck className="h-6 w-6" />
                Compliance Agent
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure your context and launch AI analysis. You will be redirected to a live analysis screen.
              </p>
            </div>
            {hasLastAnalysis && (
              <Button variant="outline" onClick={() => router.push("/dashboard/compliance-agent/analysis")}> 
                <FileBarChart2 className="mr-2 h-4 w-4" />
                View Last Analysis
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Guard rails: company details 10-500 chars, business model 20-1000 chars, up to 5 websites, and up to
                5 files (PDF/DOCX/TXT, 10MB each).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Country/Region</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country/region" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-xs font-medium text-amber-200">Safety note</p>
                  <p className="mt-1 text-xs text-amber-100/80">
                    Do not upload secrets unless necessary. AI-generated guidance should be validated with legal and
                    compliance professionals.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company details</Label>
                <Textarea
                  value={companyDetails}
                  onChange={(e) => setCompanyDetails(e.target.value)}
                  placeholder="What does your company do, who are your users, and where are you operating?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Business model</Label>
                <Textarea
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value)}
                  placeholder="Describe revenue model, product lines, transaction flow, custody and fiat rails."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Websites</Label>
                <div className="flex gap-2">
                  <Input
                    value={websiteInput}
                    onChange={(e) => setWebsiteInput(e.target.value)}
                    placeholder="https://example.com/regulations"
                  />
                  <Button type="button" variant="outline" onClick={addWebsite}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {websites.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {websites.map((url) => (
                      <span
                        key={url}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs"
                      >
                        {url}
                        <button type="button" onClick={() => removeWebsite(url)} aria-label={`remove ${url}`}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Documents (PDF, DOCX, TXT)</Label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <Upload className="h-4 w-4" />
                    Upload files
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => onFileInput(e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">Max {MAX_FILES} files, 10MB each.</p>
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={`${file.name}-${file.size}`}
                        className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => removeFile(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Extra notes (optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any constraints, audit timeline, legal counsel notes, or operational details."
                  className="min-h-[90px]"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button onClick={continueToLoading} className="w-full sm:w-auto">
                Start Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardMain>
    </>
  );
}
