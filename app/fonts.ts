import localFont from "next/font/local";

export const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/Inter_24pt-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_24pt-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});