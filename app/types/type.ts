import { paths } from "./schema";

export type position =
	paths["/api/messages"]["post"]["requestBody"]["content"]["application/json"]["position"];

export type messagesDto =
	paths["/api/messages"]["get"]["responses"]["200"]["content"]["application/json"];
export type messages = messagesDto["messages"];
export type message = messages[0];

export type createMessage =
	paths["/api/messages"]["post"]["requestBody"]["content"]["application/json"];
export type createMessageResponse =
	paths["/api/messages"]["post"]["responses"]["201"]["content"]["application/json"];
