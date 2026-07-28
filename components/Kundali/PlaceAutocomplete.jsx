"use client";

import { useEffect, useRef, useState } from "react";
import { searchLocation } from "@/services/kundali.service";

export default function PlaceAutocomplete({
  value,
  selectedPlace,
  onInputChange,
  onSelectPlace,
  error,
  theme = "public",
}) {
  const wrapperRef = useRef(null);
  const requestRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState("");

  const isAstrologer = theme === "astrologer";
  const inputClass = isAstrologer
    ? "border-[#d8a84a]/45 bg-white text-[#211704] focus:border-[#b8860b] focus:ring-[#d8a84a]/25"
    : "border-[#eadcae] bg-white text-[#211704] focus:border-[#dfff00] focus:ring-[#dfff00]/35";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const keyword = value.trim();

    if (requestRef.current) {
      requestRef.current.abort();
    }

    if (keyword.length < 2 || selectedPlace?.placeName === value) {
      return undefined;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const places = await searchLocation(keyword, { signal: controller.signal });
        setOptions(places);
        setIsOpen(true);
        setActiveIndex(places.length ? 0 : -1);
      } catch (err) {
        if (!controller.signal.aborted) {
          setOptions([]);
          setIsOpen(true);
          setSearchError(err?.message || "Unable to search locations.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [selectedPlace, value]);

  const selectPlace = (place) => {
    onSelectPlace(place);
    setSearchError("");
    setOptions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (nextValue) => {
    onInputChange(nextValue);
    setSearchError("");

    if (nextValue.trim().length < 2) {
      setOptions([]);
      setIsOpen(false);
      setIsSearching(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!isOpen || !options.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? options.length - 1 : current - 1,
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectPlace(options[activeIndex]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
        Birth Place
      </label>
      <div className="relative mt-2">
        <input
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (options.length || searchError) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search birth place"
          className={`h-12 w-full rounded-xl border px-3 pr-11 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
          aria-autocomplete="list"
        />
        {isSearching && (
          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#b8860b]/25 border-t-[#b8860b] motion-safe:animate-spin" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#eadcae] bg-white p-1 text-[#211704] shadow-[0_18px_42px_rgba(70,48,8,0.16)]">
          {options.map((place, index) => (
            <button
              type="button"
              key={`${place.placeName}-${place.latitude}-${place.longitude}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectPlace(place)}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                activeIndex === index ? "bg-[#fbf8cc]" : "hover:bg-[#fff8ee]"
              }`}
            >
              {place.placeName}
            </button>
          ))}

          {!isSearching && !options.length && (
            <div className="px-3 py-3 text-sm text-[#766747]">
              {searchError || "No places found."}
            </div>
          )}
        </div>
      )}

      {(error || selectedPlace) && (
        <div className="mt-1.5 min-h-5 text-xs">
          {error ? (
            <span className="font-semibold text-red-600">{error}</span>
          ) : (
            <span className="text-[#6f5930]">
              Selected: {selectedPlace.placeName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
