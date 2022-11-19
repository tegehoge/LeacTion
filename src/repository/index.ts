import { FirebaseEventRepository } from "~/repository/firebase";
import { EventRepository } from "~/repository/interface";

const eventRepository: EventRepository = new FirebaseEventRepository();

export const saveEvent = eventRepository.save;
