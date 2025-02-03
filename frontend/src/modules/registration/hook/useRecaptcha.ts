import { useState, useEffect } from "react";

const RECAPTCHA_SITE_KEY = "6Lcdz8oqAAAAAM3wXSl3vTQ80R7wGfoKKEtkuYQE";

export const useRecaptcha = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Register global function for callback
    (window as any).onRecaptchaSuccess = (token: string) => {
      setRecaptchaToken(token);
    };
  }, []);

  return { recaptchaToken, RECAPTCHA_SITE_KEY };
};
