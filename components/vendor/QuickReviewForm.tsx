"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { RatingCriterion } from "@/lib/types/domain";

type QuickReviewFormProps = {
  criteria: RatingCriterion[];
  onSubmit: (payload: { overallRating: number; title: string; body: string; criteriaScores: Record<string, number> }) => void;
};

export function QuickReviewForm({ criteria, onSubmit }: QuickReviewFormProps) {
  const [overallRating, setOverallRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map((criterion) => [criterion.id, 5]))
  );

  return (
    <form
      className="surface space-y-4 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ overallRating, title, body, criteriaScores });
      }}
    >
      <Input type="number" min={1} max={5} value={overallRating} onChange={(event) => setOverallRating(Number(event.target.value))} placeholder="Overall rating" />
      <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Review title" />
      <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} placeholder="Write your experience" />
      <div className="grid gap-2 sm:grid-cols-3">
        {criteria.map((criterion) => (
          <Input
            key={criterion.id}
            type="number"
            min={1}
            max={5}
            value={criteriaScores[criterion.id] ?? 5}
            onChange={(event) =>
              setCriteriaScores((current) => ({
                ...current,
                [criterion.id]: Number(event.target.value)
              }))
            }
            placeholder={criterion.name}
          />
        ))}
      </div>
      <Button type="submit">Submit review</Button>
    </form>
  );
}
