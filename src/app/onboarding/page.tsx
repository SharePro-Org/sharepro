"use client";
import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
  Suspense,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import userCheck from "../../../public/assets/userCheck.svg";
import { useMutation } from "@apollo/client";
import { ONBOARDING_BUSINESS } from "@/apollo/mutations/auth";

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
  loading: boolean;
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
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}

interface SubscriptionStepProps extends StepProps {
  billing: "monthly" | "yearly";
  setBilling: Setter<"monthly" | "yearly">;
  selectedPlan: string | null;
  setSelectedPlan: Setter<string | null>;
  showModal: boolean;
  setShowModal: Setter<boolean>;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
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
  { value: "food", label: "Food" },
  { value: "health", label: "Health" },
  { value: "technology", label: "Technology" },
];
const businessTypes = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "service", label: "Service" },
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
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>("pro");
  const [showModal, setShowModal] = useState(false);

  const [onboardingBusiness, { loading }] = useMutation(ONBOARDING_BUSINESS);

  const handleSubmit = async () => {
    try {
      const input = {
        businessId,
        businessName,
        businessCategory: category,
        businessType,
        email,
        phone,
        address,
        country,
        billing: "monthly",
        selectedPlan: "free",
        website,
      };
      const { data } = await onboardingBusiness({ variables: { input } });
      if (data?.onboardingBusiness?.success) {
        setShowModal(true);
      } else {
        console.error(
          "Onboarding API call failed:",
          data?.onboardingBusiness?.message
        );
        // You can add user-facing error handling here
      }
    } catch (err) {
      console.error("Onboarding submission failed:", err);
      // Optionally show an error to the user
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setBusinessName(userData.businessName || "");
    setEmail(userData.email || "");
    setPhone(userData.phone || "");
    setBusinessId(userData.businessId || "");
  }, []);

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
      loading={loading}
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
      onContinue={handleSubmit}
      onBack={() => setStep(0)}
      onSaveForLater={() => router.push("/business/dashboard")}
      stepIndex={1}
      loading={loading}
      router={router}
    />,
    // <SubscriptionStep
    //   key="subscription"
    //   billing={billing}
    //   setBilling={setBilling}
    //   selectedPlan={selectedPlan}
    //   setSelectedPlan={setSelectedPlan}
    //   showModal={showModal}
    //   setShowModal={setShowModal}
    //   onBack={() => setStep(1)}
    //   stepIndex={2}
    //   onSubmit={handleSubmit}
    // />,
  ];

  return (
    <>
      {steps[step]}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
          {/* Success Icon */}

          <div className="flex justify-center">
            <div className="  flex items-center justify-center">
              <Image
                src={userCheck}
                alt="userchecker"
                width={110}
                height={21}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-heading text-[20px] font-bold mb-2">
              You're all set!
            </div>
            <div className="text-body text-base mb-2">
              Your profile is ready. Start rewarding your customers and growing
              your business.
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              className="w-4/5 "
              onClick={() => router.push("/business/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
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
  loading,
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
              disabled
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
            <CustomSelect
              options={businessTypes}
              value={businessType}
              onChange={setBusinessType}
              placeholder="Select a business type"
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
            <div></div>
            {/* <button
              type="button"
              className="border border-gray5 text-heading inline-flex w-[150px] h-[59px] items-center justify-center rounded-md text-sm font-medium cursor-pointer"
              onClick={onSaveForLater}
            >
              Save for later
            </button> */}
            <button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm font-medium cursor-pointer disabled:opacity-30"
              disabled={!canContinue || loading}
            >
              {loading ? "Saving..." : "Continue"}
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
  loading,
  router,
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
              disabled
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
              disabled
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
              className="border border-gray5 text-heading inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-primary text-sm font-medium cursor-pointer"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm font-medium cursor-pointer disabled:opacity-30"
              disabled={!canContinue || loading}
            >
              {loading ? "Saving..." : "Continue"}
            </button>
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
  onSubmit,
  loading,
}) => {
  const activePlans = plans[billing];
  const router = useRouter();

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
        <div className="flex justify-between gap-10">
          <button
            type="button"
            className="border border-gray5 text-heading inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm text-primary font-medium cursor-pointer"
            onClick={onBack}
          >
            Back
          </button>

          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={!selectedPlan || loading}
                className={cn(
                  "bg-primary text-white hover:bg-primary/90 inline-flex w-[110px] h-[44px] items-center justify-center rounded-md text-sm font-medium",
                  !selectedPlan && "opacity-30 cursor-not-allowed"
                )}
                onClick={onSubmit}
              >
                Continue
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
              {/* Success Icon */}

              <div className="flex justify-center">
                <div className="  flex items-center justify-center">
                  <Image
                    src={userCheck}
                    alt="userchecker"
                    width={110}
                    height={21}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-heading text-[20px] font-bold mb-2">
                  You're all set!
                </div>
                <div className="text-body text-base mb-2">
                  Your profile is ready. Start rewarding your customers and
                  growing your business.
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  className="w-4/5 "
                  onClick={() => router.push("/business/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </OnboardingLayout>
  );
};

function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-xl mx-auto mt-20 text-center text-lg">
          Loading...
        </div>
      }
    >
      <Onboarding />
    </Suspense>
  );
}

export default OnboardingPage;
