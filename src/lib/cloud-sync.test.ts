import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { pickState } from "./cloud-sync";
import { createInitialState } from "./store";

describe("cloud progress merge", () => {
  it("keeps the copy with more progress so the rating is never lost", () => {
    const phone = { ...createInitialState(), xp: 10 };
    const cloud = { ...createInitialState(), xp: 200 };
    expect(pickState(phone, cloud)).toBe("cloud");
    expect(pickState({ ...phone, xp: 300 }, cloud)).toBe("local");
    expect(pickState(phone, null)).toBe("local");
  });
});
