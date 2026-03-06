"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { RatingCriterion } from "@/lib/types/domain";

type RatingCriteriaManagerProps = {
  criteria: RatingCriterion[];
  onAdd: (name: string) => void;
};

export function RatingCriteriaManager({ criteria, onAdd }: RatingCriteriaManagerProps) {
  const [name, setName] = useState("");

  return (
    <div className="surface space-y-4 p-4">
      <ul className="space-y-2">
        {criteria.map((criterion) => (
          <li key={criterion.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
            <span>{criterion.name}</span>
            <span className="text-xs text-muted">{criterion.active ? "Active" : "Inactive"}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="New criterion" />
        <Button
          onClick={() => {
            if (!name.trim()) return;
            onAdd(name.trim());
            setName("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
