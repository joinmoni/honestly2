"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type CategoryFormProps = {
  onSubmit: (payload: { name: string; slug: string }) => void;
};

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  return (
    <form
      className="surface grid gap-3 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, slug });
      }}
    >
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
      <Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="Category slug" />
      <Button type="submit">Save category</Button>
    </form>
  );
}
