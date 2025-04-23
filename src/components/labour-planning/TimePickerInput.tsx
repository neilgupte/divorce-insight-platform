
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePickerInput({ id, value, onChange, className }: TimePickerInputProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hours, setHours] = useState<string>(value.split(":")[0] || "09");
  const [minutes, setMinutes] = useState<string>(value.split(":")[1] || "00");

  useEffect(() => {
    // Update internal state when value prop changes
    const [h, m] = value.split(":");
    if (h) setHours(h);
    if (m) setMinutes(m);
  }, [value]);

  const updateTime = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours);
    const m = parseInt(newMinutes);
    
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) return;
    
    const formattedHours = h.toString().padStart(2, "0");
    const formattedMinutes = m.toString().padStart(2, "0");
    
    setHours(formattedHours);
    setMinutes(formattedMinutes);
    
    onChange(`${formattedHours}:${formattedMinutes}`);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value;
    if (newHours === "") {
      setHours("");
      return;
    }
    
    const h = parseInt(newHours);
    if (isNaN(h) || h < 0 || h > 23) return;
    
    updateTime(h.toString(), minutes);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value;
    if (newMinutes === "") {
      setMinutes("");
      return;
    }
    
    const m = parseInt(newMinutes);
    if (isNaN(m) || m < 0 || m > 59) return;
    
    updateTime(hours, m.toString());
  };

  const handleBlur = () => {
    const formattedHours = hours.padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    
    setHours(formattedHours);
    setMinutes(formattedMinutes);
    
    onChange(`${formattedHours}:${formattedMinutes}`);
  };

  // Generate time options every 30 minutes
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeOptions.push({
        hour: hour.toString().padStart(2, "0"),
        minute: minute.toString().padStart(2, "0"),
        label: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      });
    }
  }

  return (
    <div className="flex items-center">
      <Input
        id={id}
        ref={inputRef}
        type="text"
        value={`${hours}:${minutes}`}
        className={cn("w-20", className)}
        onChange={(e) => {
          const [h, m] = e.target.value.split(":");
          if (h) setHours(h);
          if (m) setMinutes(m);
        }}
        onBlur={handleBlur}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            type="button"
            className="ml-1 h-8 w-8"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-48" align="start">
          <div className="grid grid-cols-2 gap-2 py-2">
            <div className="space-y-1">
              <div className="text-xs font-medium">Hours</div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <Button
                    key={`hour-${i}`}
                    variant={hours === i.toString().padStart(2, "0") ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateTime(i.toString().padStart(2, "0"), minutes)}
                  >
                    {i.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium">Minutes</div>
              <div className="grid grid-cols-2 gap-1">
                {["00", "15", "30", "45"].map((minute) => (
                  <Button
                    key={`minute-${minute}`}
                    variant={minutes === minute ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => updateTime(hours, minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="text-xs font-medium mb-1">Quick Select</div>
            <div className="grid grid-cols-2 gap-1">
              {["09:00", "12:00", "17:00", "20:00"].map((time) => (
                <Button
                  key={`quick-${time}`}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const [h, m] = time.split(":");
                    updateTime(h, m);
                    setOpen(false);
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
