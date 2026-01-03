import { paths } from "./schema";

export type position =
	paths["/api/messages"]["post"]["requestBody"]["content"]["application/json"]["position"];
export type createMessage =
	paths["/api/messages"]["post"]["requestBody"]["content"]["application/json"];
export type messages =
	paths["/api/messages"]["get"]["responses"]["200"]["content"]["application/json"];
