"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleLoginButtonInner({
  onSuccess,
  onError,
  loading,
  label,
  loadingLabel,
}: {
  onSuccess: (tokenResponse: { access_token: string }) => void;
  onError: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  const googleLogin = useGoogleLogin({ onSuccess, onError });

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2"
      type="button"
      onClick={() => googleLogin()}
      disabled={loading}
    >
      <FcGoogle /> {loading ? loadingLabel : label}
    </Button>
  );
}

export default function GoogleLoginButton(props: {
  onSuccess: (tokenResponse: { access_token: string }) => void;
  onError: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  if (!googleClientId) return null;
  return <GoogleLoginButtonInner {...props} />;
}
