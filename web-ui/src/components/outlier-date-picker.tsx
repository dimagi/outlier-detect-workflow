import React, { useState } from "react";
import { useFormContext, ControllerRenderProps } from "react-hook-form";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FieldType = "from" | "to";

export default function OutlierDatePicker() {
  const { control } = useFormContext();
  const [tempValue, setTempValue] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [error, setError] = useState<string>("");

  const handleBlur = (
    field: ControllerRenderProps<any, "dateRange">,
    type: FieldType
  ) => (e: React.FocusEvent<HTMLInputElement>) => {
    const date = parse(e.target.value, "y-MM-dd", new Date());
    if (!isValid(date)) {
      setError("Invalid date format");
      setTempValue({ ...tempValue, [type]: "" });
      return;
    }

    const today = new Date();
    if (date > today) {
      setError("Dates cannot be in the future");
      setTempValue({ ...tempValue, [type]: "" });
      return;
    }

    const newFieldValue = { ...field.value, [type]: date };

    if (type === "from" && newFieldValue.to && newFieldValue.to < date) {
      setError("Start date cannot be after end date");
      setTempValue({ ...tempValue, from: "" });
    } else if (type === "to" && newFieldValue.from && date < newFieldValue.from) {
      setError("End date cannot be before start date");
      setTempValue({ ...tempValue, to: "" });
    } else {
      setError("");
      field.onChange(newFieldValue);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Date Picker</CardTitle>
        <CardDescription>Select the date range for the analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Range</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className={cn("w-full flex items-center justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <Button variant={"outline"} className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      </Button>
                      <Input
                        type="text"
                        className="w-32"
                        placeholder="Start Date"
                        value={tempValue.from || (field.value?.from ? format(field.value.from, "y-MM-dd") : "")}
                        onChange={(e) => setTempValue({ ...tempValue, from: e.target.value })}
                        onBlur={handleBlur(field, "from")}
                      />
                      <span className="mx-2">-</span>
                      <Input
                        type="text"
                        className="w-32"
                        placeholder="End Date"
                        value={tempValue.to || (field.value?.to ? format(field.value.to, "y-MM-dd") : "")}
                        onChange={(e) => setTempValue({ ...tempValue, to: e.target.value })}
                        onBlur={handleBlur(field, "to")}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={(range) => {
                        if (!range) {
                          return;
                        }
                        const today = new Date();
                        if (range.from && range.from > today) {
                          setError("Start date cannot be in the future");
                          return;
                        }
                        if (range.to && range.to > today) {
                          setError("End date cannot be in the future");
                          return;
                        }
                        if (range.from && range.to && range.from > range.to) {
                          setError("Start date cannot be after end date");
                          return;
                        }
                        setError("");
                        field.onChange(range);
                        setTempValue({
                          from: range?.from ? format(range.from, "y-MM-dd") : "",
                          to: range?.to ? format(range.to, "y-MM-dd") : "",
                        });
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              {error && <div className="text-red-500">{error}</div>}
              <FormDescription>Select the start and end dates for the period</FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
