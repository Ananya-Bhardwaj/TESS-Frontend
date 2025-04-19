import React, { useState } from "react";
import { filterOptions } from "../assets/assets"; // Assuming filter options are here

const CustomDropdown = ({ id, label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col w-44 text-sm relative">
      <button
        type="button"
        className="peer group w-full text-left px-4 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
      >
        <span>{value || label}</span>
        <span className="text-gray-500 transform transition-transform duration-200">
          {isOpen ? "⌃" : "⌄"}
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2 top-full max-h-60 overflow-y-auto"
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DropdownButton = ({ filters, setFilters }) => {
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <CustomDropdown
        id="subject"
        label="Select Subject"
        options={filterOptions.subjects}
        value={filters.subject}
        onChange={(val) => handleFilterChange("subject", val)}
      />
      <CustomDropdown
        id="year"
        label="Select Year"
        options={filterOptions.years}
        value={filters.year}
        onChange={(val) => handleFilterChange("year", val)}
      />
      <CustomDropdown
        id="session"
        label="Select Session"
        options={filterOptions.sessions}
        value={filters.session}
        onChange={(val) => handleFilterChange("session", val)}
      />
      {/* <button
        type="submit"
        className="bg-indigo-500 w-32 h-[46px] rounded-md text-sm text-white"
      >
        Search
      </button> */}
      <button
        className="bg-red-500 cursor-pointer hover:bg-red-800 w-32 h-[46px] rounded-md text-sm text-white"
        onClick={() => setFilters({ subject: "", year: "", session: "" })}
      >
        Clear all filters
      </button>
    </div>
  );
};

export default DropdownButton;
