import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustomInput?: boolean; // for "Enter a defined method"
  prefix?: React.ReactNode; // optional prefix
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  allowCustomInput = false,
  prefix,
}: CustomSelectProps) {
  // Render placeholder as a non-selectable option
  // If allowCustomInput, show an Input at the end

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={cn("relative w-full flex items-center gap-2", className)}>
        {/* Prefix inside bordered container */}
        <Listbox.Button
          className={cn(
            "relative w-full h-[55px] rounded-md border border-gray5 bg-white px-3 pr-12 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary transition flex items-center gap-2",
            !value ? "text-gray5" : "text-gray-900"
          )}
        >
          {prefix && <span className="text-sm text-nowrap text-[#030229] mr-2">{prefix}</span>}
          <span>
            {value
              ? options.find((o) => o.value === value)?.label || value
              : placeholder}
          </span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <FiChevronDown size={20} className="text-gray5" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray5 focus:outline-none max-h-56 py-2 text-sm overflow-y-scroll hide-scrollbar">
            {/* Placeholder option (not selectable) */}
            {!value && (
              <div
                className="cursor-default select-none px-4 py-2 text-gray5"
                aria-disabled="true"
              >
                {placeholder}
              </div>
            )}
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  cn(
                    "flex items-center gap-2 cursor-pointer select-none px-4 py-2",
                    active ? "bg-gray-50" : "",
                    selected ? "text-body font-medium text-sm" : "text-body font-medium text-sm"
                  )
                }
              >
                {({ selected }) => (
                  <>
                    {selected ? (
                      <FiCheck className="text-body mr-2" size={18} />
                    ) : (
                      <span className="w-[18px] mr-2" />
                    )}
                    <span>{option.label}</span>
                  </>
                )}
              </Listbox.Option>
            ))}
            {allowCustomInput && (
              <div className=" ">
                <hr />
                <input
                  type="text"
                  placeholder="Others"
                  value={value && !options.find((o) => o.value === value) ? value : ""}
                  className="w-4/5 mx-12 py-2   text-body font-semibold text-sm focus:ring-0 placeholder:text-[#030229B2] outline-none "
                  onChange={e => onChange(e.target.value)}
                  onBlur={e => {
                    if (e.target.value) onChange(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      onChange(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
