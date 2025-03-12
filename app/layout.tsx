import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import SplashCursor from "@/components/splash-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mohammad Faizan Shaikh | Mobile Application Developer",
  description:
    "Portfolio of Mohammad Faizan Shaikh, a mobile application developer specializing in Java, Flutter, React Native, and Node.js",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SplashCursor />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'