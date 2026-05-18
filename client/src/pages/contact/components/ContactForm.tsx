import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import PhoneInput from "@/components/PhoneInputField";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Building2, FlaskConical, Mail, MessageSquare, User } from "lucide-react";
import { contactData } from "@/mocks/contactData";
import { api } from "@/utils/api";
import { DEFAULT_COUNTRY_DIAL_CODE } from "@/utils/phoneCountryCodes";
import {
  buildContactProductOptions,
  groupProductOptionsByCategory,
} from "@/utils/contactProductOptions";
import { useCooldownTimer } from "@/hooks/useCooldownTimer";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";

const TOP_CITY_OPTIONS = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Surat, Gujarat",
];

function normalizeCityQuery(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9, ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const m = a.length;
  const n = b.length;
  const dp = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[n];
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 10000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#07273d]/90">
      <div className="relative w-full max-w-3xl rounded-2xl border border-brand/30 bg-gradient-to-br from-[#07273d] via-[#07324f] to-[#07273d] shadow-2xl overflow-hidden">
        <div className="relative px-8 py-10 md:px-12 md:py-12">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-brand/20" />
              <div className="relative h-20 w-20 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center mx-auto">
                <div className="h-12 w-12 rounded-full bg-brand flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold leading-none">✓</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-2xl rounded-xl border border-brand/25 bg-brand/10 px-6 py-5">
              <p className="text-white text-lg md:text-xl font-semibold font-raleway">
                Your enquiry has been <span className="text-brand">submitted successfully!</span>
              </p>
              <p className="mt-2 text-sm md:text-base text-white/90 leading-relaxed">
                Thank you for reaching out to Modepro.
                <br />
                Our <span className="text-brand font-semibold">Agentic AI</span> will call you shortly for
                further enquiry and details. During the call, you can provide more details and ask any
                queries regarding our businesses and products.
              </p>
              <p className="mt-3 text-sm text-brand font-semibold">We&apos;re here to help!</p>
            </div>

            <button
              type="button"
              onClick={onDone}
              className="text-xs text-white/70 hover:text-white underline underline-offset-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldKey = "name" | "company" | "email" | "mobile" | "product" | "message" | "city";

export default function ContactForm() {
  const productOptionsByCategory = useMemo(
    () => groupProductOptionsByCategory(buildContactProductOptions()),
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    product: "",
    mobileLocal: "",
    message: "",
  });
  const [countryDialCode, setCountryDialCode] = useState(DEFAULT_COUNTRY_DIAL_CODE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey | "phone", boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [indiaCityOptions, setIndiaCityOptions] = useState<string[]>([]);
  const [isCityListLoading, setIsCityListLoading] = useState(true);
  const [cityQuery, setCityQuery] = useState("");
  const { isCoolingDown, startCooldown } = useCooldownTimer(10);

  const emailValidation = useEmailValidation(formData.email, true);
  const phoneValidation = usePhoneValidation(formData.phone, true);
  const companyError = !formData.company.trim()
    ? "Company name is required"
    : formData.company.trim().length < 2
      ? "Company name must be at least 2 characters"
      : null;
  const productError = !formData.product.trim() ? "Product is required" : null;
  const messageError = !formData.message.trim()
    ? "Message is required"
    : formData.message.trim().length < 15
      ? "Message must be at least 15 characters"
      : null;

  useEffect(() => {
    const controller = new AbortController();
    const loadIndiaCities = async () => {
      try {
        const res = await fetch("/api/geo/india-cities", { signal: controller.signal });
        if (!res.ok) return;
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;
        const payload = await res.json();
        const cities = Array.isArray(payload?.data) ? payload.data : [];
        setIndiaCityOptions(cities);
      } catch {
        // API offline — city field still accepts typed values from top list
      } finally {
        setIsCityListLoading(false);
      }
    };
    loadIndiaCities();
    return () => controller.abort();
  }, []);

  const validateField = (field: FieldKey | "phone") => {
    if (field === "name") {
      const v = formData.name.trim();
      setFieldErrors((prev) => ({
        ...prev,
        name: !v ? "Name is required" : v.length < 2 ? "Name must be at least 2 characters" : undefined,
      }));
    }
    if (field === "company") {
      setFieldErrors((prev) => ({ ...prev, company: companyError || undefined }));
    }
    if (field === "email") {
      setFieldErrors((prev) => ({ ...prev, email: emailValidation.validate() || undefined }));
    }
    if (field === "phone") {
      setFieldErrors((prev) => ({ ...prev, mobile: phoneValidation.validate() || undefined }));
    }
    if (field === "product") {
      setFieldErrors((prev) => ({ ...prev, product: productError || undefined }));
    }
    if (field === "message") {
      setFieldErrors((prev) => ({ ...prev, message: messageError || undefined }));
    }
  };

  const filteredCityOptions = useMemo(() => {
    const cityOptions = indiaCityOptions;
    const q = normalizeCityQuery(cityQuery);
    if (!q) {
      const top = TOP_CITY_OPTIONS.filter((c) => cityOptions.includes(c));
      const topSet = new Set(top);
      const rest = cityOptions.filter((c) => !topSet.has(c));
      return [...top, ...rest].slice(0, 250);
    }
    const tokens = q.split(" ").filter(Boolean);
    const maxEdits = q.length >= 7 ? 3 : 2;
    const scored: Array<{ label: string; score: number }> = [];
    for (const label of cityOptions) {
      const normLabel = normalizeCityQuery(label);
      const [cityPart = "", statePart = ""] = normLabel.split(",").map((s) => s.trim());
      let score = 0;
      if (normLabel.startsWith(q)) score += 120;
      if (cityPart.startsWith(q)) score += 160;
      if (cityPart.includes(q)) score += 90;
      if (normLabel.includes(q)) score += 70;
      for (const t of tokens) {
        if (!t) continue;
        if (cityPart.startsWith(t)) score += 45;
        else if (cityPart.includes(t)) score += 18;
        if (statePart.startsWith(t)) score += 22;
        else if (statePart.includes(t)) score += 10;
      }
      if (q.length >= 4) {
        const dist = levenshteinDistance(q, cityPart.slice(0, Math.max(q.length + 2, 8)));
        if (dist <= maxEdits) score += (maxEdits - dist + 1) * 14;
      }
      if (score > 0) scored.push({ label, score });
    }
    scored.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "en", { sensitivity: "base" }));
    return scored.slice(0, 250).map((x) => x.label);
  }, [cityQuery, indiaCityOptions]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCoolingDown) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    setApiError(null);
    setFieldErrors({});

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }
    if (companyError) nextErrors.company = companyError;
    const emailErr = emailValidation.validate();
    if (emailErr) nextErrors.email = emailErr;
    const phoneErr = phoneValidation.validate();
    if (phoneErr) nextErrors.mobile = phoneErr;
    if (!formData.city.trim()) nextErrors.city = "City is required";
    if (productError) nextErrors.product = productError;
    if (messageError) nextErrors.message = messageError;

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      setTouched({
        name: true,
        company: true,
        email: true,
        phone: true,
        product: true,
        message: true,
        city: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/contact-submissions", {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        product: formData.product,
        countryDialCode,
        mobileLocal: formData.mobileLocal.replace(/\D/g, ""),
        mobile: formData.phone.trim(),
        city: formData.city,
        source: typeof window !== "undefined" ? window.location.href : "modepro-contact",
      });

      if (response.success) {
        setSubmitStatus("success");
        setShowSuccessOverlay(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          city: "",
          product: "",
          mobileLocal: "",
          message: "",
        });
        startCooldown();
      } else {
        setSubmitStatus("error");
        setApiError("Something went wrong. Please try again.");
      }
    } catch (error: unknown) {
      setSubmitStatus("error");
      setApiError(error instanceof Error ? error.message : "Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all duration-200 hover:border-brand/60 font-raleway text-sm";
  const inputError = "border-red-500";
  const inputOk = "border-gray-300";

  return (
    <>
      {showSuccessOverlay && (
        <SuccessOverlay
          onDone={() => {
            setShowSuccessOverlay(false);
            setSubmitStatus(null);
          }}
        />
      )}

      <section className="py-6 md:py-10 bg-white all-page-main-mrg-line">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="cont-main-line">
              <div className="subsection-title mb-6">{contactData.reachTitle}</div>

              <div className="space-y-5 mb-6">
                <div>
                  <p className="cont-add-title">{contactData.address.label}</p>
                  <div
                    className="cont-add-info-text"
                    dangerouslySetInnerHTML={{ __html: contactData.address.html }}
                  />
                </div>
                <div>
                  <p className="cont-add-title">{contactData.phone.label}</p>
                  <div className="cont-add-info-text">
                    {contactData.phone.numbers.map((num, i) => (
                      <span key={i}>
                        {num}
                        {i < contactData.phone.numbers.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="cont-add-title">{contactData.email.label}</p>
                  <div className="cont-add-info-text">
                    {contactData.email.addresses.map((addr, i) => (
                      <span key={i}>
                        <a href={addr.href} className="text-inherit no-underline hover:underline">
                          {addr.label}
                        </a>
                        {i < contactData.email.addresses.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <iframe
                src={contactData.map.embedSrc}
                title="Modepro India Pvt Ltd Location"
                width="100%"
                height="400"
                className="min-h-[320px] md:min-h-[400px] w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="lg:pt-2">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <Field
                    id="name"
                    label="Name"
                    error={fieldErrors.name}
                    icon={<User className="w-4 h-4 text-gray-400" />}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (touched.name) validateField("name");
                      }}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, name: true }));
                        validateField("name");
                      }}
                      autoComplete="name"
                      className={`${inputBase} ${fieldErrors.name ? inputError : inputOk}`}
                      placeholder="Your name"
                    />
                  </Field>

                  <Field
                    id="company"
                    label="Company Name"
                    error={fieldErrors.company}
                    icon={<Building2 className="w-4 h-4 text-gray-400" />}
                  >
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({ ...formData, company: e.target.value });
                        if (touched.company) validateField("company");
                      }}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, company: true }));
                        validateField("company");
                      }}
                      autoComplete="organization"
                      className={`${inputBase} ${fieldErrors.company ? inputError : inputOk}`}
                      placeholder="Your company name"
                    />
                  </Field>

                  <Field
                    id="email"
                    label="Email"
                    error={fieldErrors.email}
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (touched.email) validateField("email");
                      }}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, email: true }));
                        validateField("email");
                      }}
                      autoComplete="email"
                      className={`${inputBase} ${fieldErrors.email ? inputError : inputOk}`}
                      placeholder="your.email@example.com"
                    />
                  </Field>

                  <div className="relative z-50 overflow-visible">
                    <span className="block text-sm font-medium text-gray-700 mb-1.5 font-raleway">
                      Mobile <span className="text-red-500">*</span>
                    </span>
                    <div
                      className={`overflow-visible pl-10 pr-2 py-1.5 border rounded-lg focus-within:ring-2 focus-within:ring-brand ${
                        fieldErrors.mobile ? inputError : inputOk
                      }`}
                    >
                      <PhoneInput
                        country="in"
                        value={formData.phone.replace(/^\+/, "")}
                        onChange={(value) => {
                          const e164 = value ? `+${value}` : "";
                          setFormData((prev) => ({ ...prev, phone: e164 }));
                          if (!e164) {
                            setCountryDialCode(DEFAULT_COUNTRY_DIAL_CODE);
                            setFormData((prev) => ({ ...prev, mobileLocal: "" }));
                            return;
                          }
                          const parsed = parsePhoneNumberFromString(e164);
                          if (parsed) {
                            setCountryDialCode(`+${parsed.countryCallingCode}`);
                            setFormData((prev) => ({
                              ...prev,
                              mobileLocal: String(parsed.nationalNumber || ""),
                            }));
                          }
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoComplete: "tel",
                          onBlur: () => {
                            setTouched((p) => ({ ...p, phone: true }));
                            validateField("phone");
                          },
                        }}
                        containerClass="w-full"
                        inputClass="!w-full !border-0 !shadow-none focus:!outline-none !bg-transparent !pl-10"
                        buttonClass="!bg-transparent !border-0"
                        dropdownClass="!text-sm !z-[9999]"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {fieldErrors.mobile && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.mobile}</p>
                    )}
                  </div>

                  <div className="relative z-10">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 font-raleway">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      value={formData.city}
                      onChange={(value) => {
                        setFormData((prev) => ({ ...prev, city: value || "" }));
                        setCityQuery("");
                      }}
                    >
                      <div className="relative">
                        <ComboboxInput
                          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white font-raleway text-sm ${
                            fieldErrors.city ? inputError : inputOk
                          }`}
                          placeholder="Type to search city..."
                          displayValue={(value: string) => value}
                          onChange={(event) => setCityQuery(event.target.value)}
                          onBlur={() => {
                            const typed = cityQuery.trim();
                            if (typed && indiaCityOptions.includes(typed)) {
                              setFormData((prev) => ({ ...prev, city: typed }));
                            }
                            setCityQuery("");
                          }}
                        />
                        <input type="hidden" name="city" value={formData.city} required />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </ComboboxButton>
                        {(formData.city || cityQuery) && (
                          <button
                            type="button"
                            aria-label="Clear city"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, city: "" }));
                              setCityQuery("");
                            }}
                            className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-gray-600 text-xl"
                          >
                            ×
                          </button>
                        )}
                        <ComboboxOptions className="absolute z-[400] mt-2 max-h-64 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg">
                          {isCityListLoading ? (
                            <div className="px-4 py-2 text-gray-500">Loading cities...</div>
                          ) : filteredCityOptions.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No cities found.</div>
                          ) : (
                            filteredCityOptions.map((label) => (
                              <ComboboxOption
                                key={label}
                                value={label}
                                className={({ active }) =>
                                  `cursor-pointer select-none px-4 py-2 ${
                                    active ? "bg-brand text-white" : "text-gray-900"
                                  }`
                                }
                              >
                                {label}
                              </ComboboxOption>
                            ))
                          )}
                        </ComboboxOptions>
                      </div>
                    </Combobox>
                    {fieldErrors.city && <p className="text-sm text-red-600 mt-1">{fieldErrors.city}</p>}
                  </div>

                  <Field
                    id="product"
                    label="Product"
                    error={fieldErrors.product}
                    icon={<FlaskConical className="w-4 h-4 text-gray-400 pointer-events-none" />}
                  >
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={(e) => {
                        setFormData({ ...formData, product: e.target.value });
                        if (touched.product) validateField("product");
                      }}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, product: true }));
                        validateField("product");
                      }}
                      required
                      className={`${inputBase} appearance-none bg-white cursor-pointer ${
                        fieldErrors.product ? inputError : inputOk
                      }`}
                    >
                      <option value="" disabled>
                        Please select a product
                      </option>
                      {Array.from(productOptionsByCategory.entries()).map(([category, opts]) => (
                        <optgroup key={category} label={category}>
                          {opts.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="message"
                    label="Message"
                    error={fieldErrors.message}
                    icon={<MessageSquare className="w-4 h-4 text-gray-400 top-3.5" />}
                    iconTop
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (touched.message) validateField("message");
                      }}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, message: true }));
                        validateField("message");
                      }}
                      required
                      maxLength={500}
                      rows={5}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand outline-none resize-none font-raleway text-sm ${
                        fieldErrors.message ? inputError : inputOk
                      }`}
                      placeholder="Your message (min. 15 characters)"
                    />
                  </Field>
                  <p className="text-xs text-gray-500 -mt-3">{formData.message.length}/500</p>

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                      {apiError || "Sorry, there was an error. Please try again."}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || isCoolingDown}
                    className="btn-read-more w-full text-center disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  error,
  icon,
  iconTop,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  icon: ReactNode;
  iconTop?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5 font-raleway">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <span
          className={`absolute left-3.5 ${iconTop ? "top-3.5" : "top-1/2 -translate-y-1/2"} pointer-events-none`}
        >
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
