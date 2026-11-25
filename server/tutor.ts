import { defineWebSocketHandler } from "nitro";
import { tutorHooks } from "../src/lib/tutor-relay.server";
export default defineWebSocketHandler(tutorHooks);
