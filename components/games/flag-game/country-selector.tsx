"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { resolveCountryQuery, searchCountries, type Country } from "@/data/countries";
import { CyberButton } from "@/components/ui/cyber-button";
import { cn } from "@/lib/utils";

interface CountrySelectorProps {
  excluded: ReadonlySet<string>;
  disabled?: boolean;
  autoFocus?: boolean;
  onGuess: (code: string) => void;
}

export default function CountrySelector({
  excluded,
  disabled = false,
  autoFocus = false,
  onGuess,
}: CountrySelectorProps) {
  const inputId = useId();
  const listId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Country | null>(null);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(
    () => searchCountries(query, { exclude: excluded, limit: 8 }),
    [query, excluded]
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!open || results.length === 0) return;
    const active = document.getElementById(`${listId}-option-${results[activeIndex]?.alpha2}`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, results, listId]);

  const choose = (country: Country) => {
    setSelected(country);
    setQuery(country.name);
    setOpen(false);
    setError(null);
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const submitCountry = (country: Country | null) => {
    if (!country) {
      setError("Choose a country from the list.");
      setOpen(query.trim().length > 0);
      return;
    }
    if (excluded.has(country.alpha2)) {
      setError("You already guessed that country.");
      return;
    }
    setError(null);
    setQuery("");
    setSelected(null);
    setOpen(false);
    onGuess(country.alpha2);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    submitCountry(selected ?? resolveCountryQuery(query));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      if (results.length === 0) return;
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      if (results.length === 0) return;
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Enter" && open && results.length > 0) {
      event.preventDefault();
      choose(results[Math.min(activeIndex, results.length - 1)]);
    }
  };

  const showList = open && query.trim().length > 0 && !disabled;
  const active = results[activeIndex];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor={inputId} className="hud-label block">
        Search country
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="relative min-w-0 flex-1">
          <div className="cyber-input-wrap">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              value={query}
              disabled={disabled}
              placeholder="Search country..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={showList}
              aria-controls={listId}
              aria-activedescendant={
                showList && active ? `${listId}-option-${active.alpha2}` : undefined
              }
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="cyber-input text-base"
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(null);
                setActiveIndex(0);
                setError(null);
                setOpen(true);
              }}
              onFocus={() => {
                if (query.trim()) setOpen(true);
              }}
              onBlur={() => {
                window.setTimeout(() => setOpen(false), 120);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {showList && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Matching countries"
              className="z-30 mt-1 max-h-60 overflow-y-auto border border-primary/40 bg-card shadow-[var(--box-shadow-neon-sm)]"
            >
              {results.length === 0 ? (
                <li className="px-3 py-3 font-mono text-sm text-muted-foreground">
                  No matching country
                </li>
              ) : (
                results.map((country, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={country.alpha2}
                      id={`${listId}-option-${country.alpha2}`}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 font-mono text-sm",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-foreground hover:bg-primary/10"
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        choose(country);
                      }}
                    >
                      <span className="truncate">{country.name}</span>
                      <span className="shrink-0 font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                        {country.continent}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>

        <CyberButton
          type="submit"
          disabled={disabled || query.trim().length === 0}
          className="w-full shrink-0 px-5 text-xs disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Submit guess
        </CyberButton>
      </div>

      {error && (
        <p id={errorId} role="alert" className="font-mono text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
