import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

const CONTACT_EMAIL = "johnie@hjelm.im";
const MENU_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Writing", to: "/writing" },
  { label: "Notes", to: "/notes" },
  { label: "About", to: "/about" },
];

const HeaderPath = () => {
  const { pathname } = useLocation();
  const activeMenuItem =
    MENU_ITEMS.find(
      (item) => item.to !== "/" && pathname.startsWith(item.to)
    ) ?? MENU_ITEMS[0];
  const pathSegments = pathname.split("/").filter(Boolean);
  const isNestedPath = pathSegments.length > 1;
  const nestedPath = pathname.slice(activeMenuItem.to.length + 1);

  if (activeMenuItem.to === "/") {
    return null;
  }

  return (
    <div className="ml-2 inline-flex items-center space-x-1.5 pt-0.5 font-bold text-muted-foreground text-sm">
      <span>/</span>
      {isNestedPath ? (
        <>
          <Link
            className="transition-colors hover:text-accent-foreground"
            to={activeMenuItem.to}
          >
            {activeMenuItem.to.slice(1)}
          </Link>
          <span>/</span>
          <div
            className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap text-accent-foreground md:max-w-xs"
            title={nestedPath}
          >
            {nestedPath}
          </div>
        </>
      ) : (
        <span>{activeMenuItem.to.slice(1)}</span>
      )}
    </div>
  );
};

export const Header = () => (
  <div className="sticky top-0 z-50 border-accent border-b-2 bg-background/70 backdrop-blur-md">
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between border-accent border-r-0 border-l-0 p-2 md:border-r-2 md:border-l-2 md:p-4">
      <div className="inline-flex items-center font-mono">
        <Link to="/">
          <Logo height={21} width={17} />
        </Link>
        <HeaderPath />
      </div>
      <div className="flex items-center space-x-4">
        <Button className="font-mono" size="xs" variant="default">
          <a href={`mailto:${CONTACT_EMAIL}?subject=Let's%20Chat`}>
            Let's Chat
          </a>
        </Button>
        <CommandMenu />
      </div>
    </header>
  </div>
);

const CommandMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <Button
        className="gap-2.5 font-mono md:pr-0"
        onClick={() => setOpen(true)}
        size="xs"
        variant="outline"
      >
        <span>Menu</span>
        <KbdGroup className="hidden h-full md:inline-flex">
          <Kbd className="h-full px-1.5 text-xs tracking-tighter">⌘ K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Menu">
              {MENU_ITEMS.map((item) => (
                <CommandItem key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
