"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { scheduleClass } from "../actions";

type CT = {
  id: string;
  name: string;
  durationMinutes: number;
  defaultCapacity: number;
};

export function ScheduleClassDialog({
  classTypes,
  instructors,
  defaultDate,
  children,
}: {
  classTypes: CT[];
  instructors: { id: string; fullName: string }[];
  defaultDate?: string; // YYYY-MM-DD
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [classTypeId, setClassTypeId] = useState(classTypes[0]?.id ?? "");
  const [instructorId, setInstructorId] = useState<string>("");
  const [date, setDate] = useState(defaultDate ?? todayLocalISO());
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(
    String(classTypes[0]?.durationMinutes ?? 60),
  );
  const [capacity, setCapacity] = useState(
    String(classTypes[0]?.defaultCapacity ?? 15),
  );
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const onTypeChange = (id: string) => {
    setClassTypeId(id);
    const ct = classTypes.find((t) => t.id === id);
    if (ct) {
      setDuration(String(ct.durationMinutes));
      setCapacity(String(ct.defaultCapacity));
    }
  };

  const submit = () =>
    start(async () => {
      try {
        // Build the Date explicitly from local components to avoid any
        // ambiguity around how `new Date("YYYY-MM-DDTHH:MM:00")` is parsed.
        const [yy, mm, dd] = date.split("-").map(Number);
        const [hh, mi] = time.split(":").map(Number);
        const localDate = new Date(yy, (mm ?? 1) - 1, dd ?? 1, hh ?? 0, mi ?? 0, 0);
        const startsAt = localDate.toISOString();
        await scheduleClass({
          classTypeId,
          instructorId: instructorId || undefined,
          startsAt,
          durationMinutes: parseInt(duration, 10),
          capacity: parseInt(capacity, 10),
          location,
          notes,
        });
        toast.success("Class scheduled");
        setOpen(false);
        setLocation("");
        setNotes("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Schedule failed");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Class type</Label>
            <Select value={classTypeId} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Instructor</Label>
            <Select
              value={instructorId || "__none__"}
              onValueChange={(v) => setInstructorId(v === "__none__" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {instructors.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Start time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Studio A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending || !classTypeId}>
            {pending ? "Scheduling…" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function todayLocalISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60_000).toISOString().slice(0, 10);
}
