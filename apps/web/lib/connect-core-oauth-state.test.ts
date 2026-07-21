import { describe, expect, it } from "vitest";

import {
  assertFreshOAuthState,
  clearOAuthStateMetadata,
  createSignedOAuthState,
  resolveSignedOAuthState
} from "./connect-core-oauth-state";

describe("connect-core OAuth state", () => {
  it("rejects expired state", () => {
    const now = Date.now();
    const { state } = createSignedOAuthState(
      { connectionId: "conn_1", integrationId: "gmail", userId: "user_1" },
      "state-secret",
      now
    );

    expect(() => resolveSignedOAuthState(state, "state-secret", now + 11 * 60 * 1000)).toThrow(
      "OAuth state expired."
    );
  });

  it("rejects reused state after metadata is cleared", () => {
    const now = Date.now();
    const started = createSignedOAuthState(
      { connectionId: "conn_1", integrationId: "gmail", userId: "user_1" },
      "state-secret",
      now
    );
    const state = resolveSignedOAuthState(started.state, "state-secret", now);

    assertFreshOAuthState(
      state,
      started.metadata,
      { connectionId: "conn_1", integrationId: "gmail", userId: "user_1" },
      now
    );

    expect(() =>
      assertFreshOAuthState(
        state,
        clearOAuthStateMetadata(started.metadata),
        { connectionId: "conn_1", integrationId: "gmail", userId: "user_1" },
        now
      )
    ).toThrow("OAuth state was already used");
  });
});
