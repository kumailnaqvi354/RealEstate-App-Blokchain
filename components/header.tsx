"use client"

import Link from "next/link"
import { Building, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import Web3Provider from "./Provider"
import { ConnectKitButton } from "connectkit"


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
    <Web3Provider>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <span className="font-bold text-xl hidden md:inline-block">BlockEstate</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/properties" className="text-sm font-medium transition-colors hover:text-primary">
            Properties
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Link href="/list-property">
              <Button variant="outline" size="sm">
                List Property
              </Button>
            </Link>
            
              {/* <Button variant="ghost" size="sm"> */}
              <ConnectKitButton wallet-connect-button />
                            {/* </Button> */}
            
            {/* <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/list-property"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              List Property
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Connect Wallet
                </Button>
              </Link>
              {/* <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-start">Sign Up</Button>
              </Link> */}
            </div>
          </nav>
        </div>
      )}
    </header>
    </Web3Provider>
    </>
  )
}
