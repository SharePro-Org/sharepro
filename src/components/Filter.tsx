"use client";

import React from "react";
import { DatePicker, Select } from "antd";
import { ListFilter } from "lucide-react";
const { RangePicker } = DatePicker;

export const Filter = ({
  onChange,
  filter,
}: {
  onChange?: (filters: any) => void;
  filter?: Boolean;
}) => {
  const [dateRange, setDateRange] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string | undefined>(undefined);

  const handleDateChange = (dates: any) => {
    setDateRange(dates);
    if (onChange) onChange({ status, dateRange: dates });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (onChange) onChange({ status: value, dateRange });
  };

  return (
    <div className="flex gap-4 items-center md:my-0 my-2">
      {filter === false ? null : (
        <div className="p-1 my-auto border border-[#CCCCCC] rounded">
          <Select
            allowClear
            placeholder="Filter"
            style={{ width: 140, border: "none", boxShadow: "none" }}
            value={status}
            onChange={handleStatusChange}
            suffixIcon={<ListFilter />}
            options={[
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "scheduled", label: "Scheduled" },
            ]}
            variant={"borderless"}
          />
        </div>
      )}

      <RangePicker
        style={{ padding: 10, border: "1px solid #CCCCCC" }}
        value={dateRange}
        onChange={handleDateChange}
      />
    </div>
  );
};
