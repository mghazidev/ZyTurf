"use client";
import React from "react";

export default function Home() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <h1>{isClient ? "This is never prerendered" : "Prerendered"}</h1>;
}
