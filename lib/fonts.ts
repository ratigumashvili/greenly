import localFont from "next/font/local";

export const firaGo = localFont({
    src: [
        { path: "../public/fonts/firago-100.woff2", weight: "100" },
        { path: "../public/fonts/firago-200.woff2", weight: "200" },
        { path: "../public/fonts/firago-300.woff2", weight: "300" },
        { path: "../public/fonts/firago-400.woff2", weight: "400" },
        { path: "../public/fonts/firago-500.woff2", weight: "500" },
        { path: "../public/fonts/firago-600.woff2", weight: "600" },
        { path: "../public/fonts/firago-700.woff2", weight: "700" },
        { path: "../public/fonts/firago-800.woff2", weight: "800" },
        { path: "../public/fonts/firago-900.woff2", weight: "900" },
    ],
    variable: "--font-firaGo",
});
