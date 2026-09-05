import { useState } from "react";
import { createRoot } from "react-dom/client";
import { SidebarProfile } from "@/components/sidebar-profile";
import { AppShell } from "@/components/app-shell";
import "@/index.css";
function Fixture() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  return <AppShell brand="Fixture" navigation={[{ id: "empty", label: "Hidden group", items: [] }, { id: "main", items: [{ id: "home", label: "Home", href: "#home", active: true }] }]}
    footer={<SidebarProfile user={{ name: "Ana Silva", image: "/missing-avatar.png" }}
      profile={{ render: <a href="#profile" /> }} organization={{ disabled: true, onSelect: () => {} }}
      labels={{ trigger: "Account", profile: "Profile", signOut: "Sign out", signingOut: "Signing out" }}
      signOut={{ pending, onSelect: () => { setPending(true); setAttempts(value => value + 1); } }} />}
    mobileNavigation="drawer" open={open} onOpenChange={setOpen} labels={{ toggleNavigation: "Toggle navigation", navigation: "Main navigation", skipToContent: "Skip content" }}>
    <h1>Controlled shell</h1><button onClick={() => setOpen(value => !value)}>External toggle</button>
    <output aria-label="Sign out attempts">{attempts}</output>
    <output aria-label="Sidebar state">{open ? "open" : "closed"}</output>
    <div className="max-w-full overflow-x-auto"><div style={{ width: 1800 }}>Wide table</div></div>
  </AppShell>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
