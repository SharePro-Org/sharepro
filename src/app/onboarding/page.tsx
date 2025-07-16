"use client";
import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { CustomSelect } from "@/components/ui/custom-select";
import { FiCamera, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";

// Shared types
interface StepProps {
  stepIndex: number;
}

type Setter<T> = Dispatch<SetStateAction<T>>;

// Step-specific prop types
interface BusinessInfoStepProps extends StepProps {
  businessName: string;
  setBusinessName: Setter<string>;
  category: string;
  setCategory: Setter<string>;
  businessType: string;
  setBusinessType: Setter<string>;
  website: string;
  setWebsite: Setter<string>;
  onContinue: () => void;
  onSaveForLater: () => void;
}

interface ContactLocationStepProps extends StepProps {
  email: string;
  setEmail: Setter<string>;
  phone: string;
  setPhone: Setter<string>;
  address: string;
  setAddress: Setter<string>;
  country: string;
  setCountry: Setter<string>;
  onContinue: () => void;
  onBack: () => void;
  onSaveForLater: () => void;
}

interface BrandingStepProps extends StepProps {
  logo: File | null;
  setLogo: Setter<File | null>;
  primaryColor: string;
  setPrimaryColor: Setter<string>;
  accentColor: string;
  setAccentColor: Setter<string>;
  tagline: string;
  setTagline: Setter<string>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onContinue: () => void;
  onBack: () => void;
  onSaveForLater: () => void;
}

interface SubscriptionStepProps extends StepProps {
  billing: "monthly" | "yearly";
  setBilling: Setter<"monthly" | "yearly">;
  selectedPlan: string | null;
  setSelectedPlan: Setter<string | null>;
  showModal: boolean;
  setShowModal: Setter<boolean>;
  onBack: () => void;
}

interface Plan {
  name: string;
  price: string;
  per: string;
  features: string[];
  planType: string;
  type: string;
  recommended?: boolean;
}

// Data
const categories = [
  { value: "retail", label: "Retail" },
  { value: "education", label: "Education" },
  { value: "services", label: "Services" },
  { value: "tech", label: "Tech" },
];
const countries = [
  { value: "my", label: "Malaysia" },
  { value: "sg", label: "Singapore" },
  { value: "id", label: "Indonesia" },
  { value: "th", label: "Thailand" },
  { value: "ph", label: "Philippines" },
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
];
const plans: Record<"monthly" | "yearly", Plan[]> = {
  monthly: [
    {
      name: "Growth",
      price: "₦7,500",
      per: "/ month",
      features: ["10 Campaigns", "Basic Analytics", "Limited Reward Budget"],
      planType: "growth",
      type: "paid",
    },
    {
      name: "Pro",
      price: "₦18,000",
      per: "/ month",
      features: [
        "Unlimited Campaigns",
        "Full Analytics",
        "₦50K Reward Cap",
        "₦200k Reward Budget",
      ],
      planType: "pro",
      type: "paid",
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      per: "",
      features: [
        "Unlimited Campaigns",
        "Full Analytics",
        "Dedicated Support",
        "Custom Integrations",
        "Flexible Budgeting",
      ],
      planType: "enterprise",
      type: "custom",
    },
  ],
  yearly: [
    {
      name: "Growth",
      price: "₦75,000",
      per: "/ year",
      features: ["10 Campaigns", "Basic Analytics", "Limited Reward Budget"],
      planType: "growth",
      type: "paid",
    },
    {
      name: "Pro",
      price: "₦180,000",
      per: "/ year",
      features: [
        "Unlimited Campaigns",
        "Full Analytics",
        "₦600K Reward Cap",
        "₦2M Reward Budget",
      ],
      planType: "pro",
      type: "paid",
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      per: "",
      features: [
        "Unlimited Campaigns",
        "Full Analytics",
        "Dedicated Support",
        "Custom Integrations",
        "Flexible Budgeting",
      ],
      planType: "enterprise",
      type: "custom",
    },
  ],
};

const Onboarding: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // State for all steps
  const [logo, setLogo] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [tagline, setTagline] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>("pro");
  const [showModal, setShowModal] = useState(false);

  const steps = [
    <BusinessInfoStep
      key="business-info"
      businessName={businessName}
      setBusinessName={setBusinessName}
      category={category}
      setCategory={setCategory}
      businessType={businessType}
      setBusinessType={setBusinessType}
      website={website}
      setWebsite={setWebsite}
      onContinue={() => setStep(1)}
      onSaveForLater={() => router.push("/business/dashboard")}
      stepIndex={0}
    />,
    <ContactLocationStep
      key="contact-location"
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      address={address}
      setAddress={setAddress}
      country={country}
      setCountry={setCountry}
      onContinue={() => setStep(2)}
      onBack={() => setStep(0)}
      onSaveForLater={() => router.push("/business/dashboard")}
      stepIndex={1}
    />,
    <BrandingStep
      key="branding"
      logo={logo}
      setLogo={setLogo}
      primaryColor={primaryColor}
      setPrimaryColor={setPrimaryColor}
      accentColor={accentColor}
      setAccentColor={setAccentColor}
      tagline={tagline}
      setTagline={setTagline}
      fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
      onContinue={() => setStep(3)}
      onBack={() => setStep(1)}
      onSaveForLater={() => router.push("/business/dashboard")}
      stepIndex={2}
    />,
    <SubscriptionStep
      key="subscription"
      billing={billing}
      setBilling={setBilling}
      selectedPlan={selectedPlan}
      setSelectedPlan={setSelectedPlan}
      showModal={showModal}
      setShowModal={setShowModal}
      onBack={() => setStep(2)}
      stepIndex={3}
    />,
  ];

  return <>{steps[step]}</>;
};

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  businessName,
  setBusinessName,
  category,
  setCategory,
  businessType,
  setBusinessType,
  website,
  setWebsite,
  onContinue,
  onSaveForLater,
  stepIndex,
}) => {
  const canContinue =
    businessName.trim() && category.trim() && businessType.trim();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canContinue) onContinue();
  };
  return (
    <OnboardingLayout stepIndex={stepIndex}>
      <Card>
        <h2 className="text-2xl font-semibold mb-1 text-heading">
          Let’s set up your business profile
        </h2>
        <p className="text-gray-600 mb-7 text-sm">
          We’ll use this info to personalize your dashboard and help you launch
          campaigns faster.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-2">
            <span className="font-semibold text-primary text-[16px]">
              Business Info
            </span>
          </div>
          <div>
            <Label htmlFor="business-name" className="block mb-2 text-sm">
              Business name
            </Label>
            <Input
              id="business-name"
              placeholder="Power House"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="category" className="block mb-2 text-sm">
              Business category
            </Label>
            <CustomSelect
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="Select a category"
              allowCustomInput
            />
          </div>
          <div>
            <Label htmlFor="business-type" className="block mb-2 text-sm">
              Business type
            </Label>
            <Input
              id="business-type"
              placeholder="e.g. Sole Proprietor, Ltd, Online, Physical"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="website" className="block mb-2 text-sm">
              Website or Instagram handle (optional)
            </Label>
            <Input
              id="website"
              placeholder="input a link"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-between pt-28">
            <button
              type="button"
              className="border border-gray5 text-heading inline-flex w-[150px] h-[59px] items-center justify-center rounded-md text-sm font-medium cursor-pointer"
              onClick={onSaveForLater}
            >
              Save for later
            </button>
            <button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 inline-flex w-[150px] h-[59px] items-center justify-center rounded-md text-sm font-medium cursor-pointer disabled:opacity-30"
              disabled={!canContinue}
            >
              Continue
            </button>
          </div>
        </form>
      </Card>
    </OnboardingLayout>
  );
};

const ContactLocationStep: React.FC<ContactLocationStepProps> = ({
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  country,
  setCountry,
  onContinue,
  onBack,
  onSaveForLater,
  stepIndex,
}) => {
  const canContinue =
    email.trim() && phone.trim() && address.trim() && country.trim();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canContinue) onContinue();
  };
  return (
    <OnboardingLayout stepIndex={stepIndex}>
      <Card>
        <h2 className="text-2xl font-semibold mb-1 text-heading">
          Let’s set up your business profile
        </h2>
        <p className="text-gray-600 mb-7 text-sm">
          We’ll use this info to personalize your dashboard and help you launch
          campaigns faster.
        </p>
        <div className="mb-2">
          <span className="font-semibold text-primary text-[16px]">
            Contact & Location Info
          </span>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="business-email" className="block mb-2 text-sm">
              Business email
            </Label>
            <Input
              id="business-email"
              placeholder="powerhouse@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="business-phone" className="block mb-2 text-sm">
              Phone number
            </Label>
            <Input
              id="business-phone"
              placeholder="e.g. 01938193839"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="business-address" className="block mb-2 text-sm">
              Business address
            </Label>
            <Input
              id="business-address"
              placeholder="e.g. Sole Proprietor, Ltd, Online, Physical"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="country" className="block mb-2 text-sm">
              Country
            </Label>
            <CustomSelect
              options={countries}
              value={country}
              onChange={setCountry}
              placeholder="Select a country"
            />
          </div>
          <div className="flex justify-between pt-28">
            <button
              type="button"
              className="border border-gray5 text-heading inline-flex w-[150px] h-[59px] items-center justify-center rounded-md text-sm font-medium cursor-pointer"
              onClick={onSaveForLater}
            >
              Save for later
            </button>
            <div className="flex items-center gap-28">
              <button
                type="button"
                className="text-primary font-medium"
                onClick={onBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90 inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm font-medium cursor-pointer disabled:opacity-30"
                disabled={!canContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </Card>
    </OnboardingLayout>
  );
};

const BrandingStep: React.FC<BrandingStepProps> = ({
  logo,
  setLogo,
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  tagline,
  setTagline,
  fileInputRef,
  onContinue,
  onBack,
  onSaveForLater,
  stepIndex,
}) => {
  const handleLogoClick = () => fileInputRef.current?.click();
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setLogo(e.target.files[0]);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContinue();
  };
  return (
    <OnboardingLayout stepIndex={stepIndex}>
      <Card>
        <h2 className="text-2xl font-semibold mb-1 text-heading">
          Let’s set up your business profile
        </h2>
        <p className="text-gray-600 mb-7 text-sm">
          We’ll use this info to personalize your dashboard and help you launch
          campaigns faster.
        </p>
        <div className="mb-7 flex items-center gap-2">
          <span className="font-semibold text-primary text-[16px]">
            Branding
          </span>
          <span className="text-gray-400 text-[16px]">(Optional)</span>
        </div>
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-[82px] h-[82px] rounded-full border flex flex-col justify-center items-center cursor-pointer"
                  onClick={handleLogoClick}
                >
                  {logo ? (
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Logo preview"
                      className="w-[80px] h-[80px] rounded-full object-cover"
                    />
                  ) : (
                    <FiCamera className="text-gray-400 w-7 h-7" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
              <span
                onClick={handleLogoClick}
                className="text-base text-heading font-medium cursor-pointer"
              >
                Upload logo
              </span>
            </div>
            <button
              type="button"
              className="bg-[#F4F7FF] text-primary font-medium px-7 h-9 rounded-md"
              onClick={handleLogoClick}
            >
              Add image
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="primary-color" className="block mb-2 text-sm">
                Brand Colors
              </Label>
              <Input
                id="primary-color"
                placeholder="Primary color  e.g. #0047AB"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 flex items-end">
              <Input
                id="accent-color"
                placeholder="Accent color  e.g. #0047AB"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tagline" className="block mb-2 text-sm">
              Brand Tagline
            </Label>
            <Input
              id="tagline"
              placeholder="e.g. “Fresh groceries delivered in under 30 minutes.”"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-between pt-28">
            <button
              type="button"
              className="border border-gray5 text-heading inline-flex w-[150px] h-[59px] items-center justify-center rounded-md text-sm font-medium cursor-pointer"
              onClick={onSaveForLater}
            >
              Save for later
            </button>
            <div className="flex items-center gap-10">
              <button
                type="button"
                className="text-primary font-medium"
                onClick={onBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90 inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm font-medium cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </Card>
    </OnboardingLayout>
  );
};

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({
  billing,
  setBilling,
  selectedPlan,
  setSelectedPlan,
  showModal,
  setShowModal,
  onBack,
  stepIndex,
}) => {
  const activePlans = plans[billing];
  return (
    <OnboardingLayout stepIndex={stepIndex}>
      <Card>
        <h2 className="text-2xl font-semibold mb-1 text-heading">
          Subscription Plan
        </h2>
        <p className="text-gray-600 mb-7 text-sm">
          Select a plan that fits your business needs to start creating
          campaigns and rewarding your customers.
        </p>
        <div className="flex gap-2 mb-7">
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              billing === "monthly"
                ? "bg-[#E9F0FF] text-primary"
                : "text-gray-600"
            )}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              billing === "yearly"
                ? "bg-[#E9F0FF] text-primary"
                : "text-gray-600"
            )}
            onClick={() => setBilling("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {activePlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "border rounded-xl flex flex-col items-start min-h-[350px] relative bg-white transition-all duration-200 overflow-hidden",
                selectedPlan === plan.planType
                  ? "border-primary bg-[#F4F7FF]"
                  : "border-gray-200 bg-white"
              )}
            >
              {" "}
              {plan.name === "Pro" && (
                <div
                  style={{
                    height: 4,
                    width: "100%",
                    background:
                      "linear-gradient(90deg, #233E97 0%, #605BFF 100%)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                />
              )}
              <div className="w-full pt-7 pb-5 px-6 flex flex-col flex-1 relative z-10">
                <div className="flex items-center justify-between gap-2 mb-1 w-full">
                  <span
                    className="text-sm font-semibold"
                    style={{
                      background:
                        "linear-gradient(90.04deg, #233E97 0.03%, #A16AD4 19.11%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {plan.name}
                  </span>
                  {plan.recommended && (
                    <span className="ml-2 bg-[#F1ECFF] text-[#6E42E5] text-xs font-semibold px-3 py-[2px] rounded-full flex items-center">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-[#000000] font-semibold text-[26px] align-middle">
                    {plan.price}
                  </span>
                  <span className="text-[#000000] text-base align-middle ml-1">
                    {plan.per}
                  </span>
                </div>
                <ul className="mb-6 mt-2 flex-1 text-[15px] text-gray-800">
                  <hr className="mt-2 mb-4" />
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 mb-2">
                      <span className="text-[#000000] text-base font-bold leading-none">
                        <FiCheck />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.type === "custom" ? (
                  <button
                    type="button"
                    className={cn(
                      "w-full h-12 rounded-md bg-[#E9F0FF] text-primary font-medium mt-auto",
                      "hover:bg-[#d7e3fc] transition"
                    )}
                    onClick={() => setSelectedPlan(plan.planType)}
                  >
                    Contact Us
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan.planType)}
                    className={cn(
                      "w-full h-12 rounded-md flex items-center gap-12 mt-auto border transition-all pl-4 font-medium text-base",
                      selectedPlan === plan.planType
                        ? "bg-[#ECF3FF] border-[#DDE3ED] text-primary hover:bg-[#E9F0FF]"
                        : "bg-[#ECF3FF] border-[#DDE3ED] text-primary hover:bg-[#E9F0FF]"
                    )}
                  >
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlan === plan.planType}
                      onChange={() => setSelectedPlan(plan.planType)}
                      className="accent-primary bg-[#ECF3FF]"
                    />
                    <span>{plan.name}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-10">
          <button
            type="button"
            className="text-primary font-medium"
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </Card>
    </OnboardingLayout>
  );
};

export default Onboarding;
