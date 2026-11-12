import test from "node:test";
import assert from "node:assert/strict";
import { getTrip, trips } from "../lib/packages.js";

test("six unique, complete journeys have a matching day-by-day itinerary", () => {
  assert.equal(trips.length, 6);
  assert.equal(new Set(trips.map((trip) => trip.slug)).size, 6);
  for (const trip of trips) {
    assert.equal(getTrip(trip.slug), trip);
    assert.equal(trip.itinerary.length, trip.days, trip.slug);
    assert.ok(trip.title && trip.state && trip.start && trip.pace && trip.season && trip.note);
    assert.ok(trip.highlights.length >= 3);
    assert.ok(trip.itinerary.every(([title, detail]) => title && detail));
  }
});

test("unknown journeys are not found", () => {
  assert.equal(getTrip("unknown"), undefined);
  assert.equal(getTrip(undefined), undefined);
});
