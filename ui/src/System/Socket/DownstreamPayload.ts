/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventStreamType } from "@/System/Socket/EventStreamTypes";

export enum DownstreamPayloadType
{
    Event = 0,
    Response = 1,
}

export type DownstreamPayload = DownstreamResponsePayload | DownstreamEventPayload;

export type DownstreamResponsePayload = {
    kind: DownstreamPayloadType.Response,
    id: number,
    value: any,
    isError: boolean,
};

export type DownstreamEventPayload = {
    kind: DownstreamPayloadType.Event,
    name: keyof EventStreamType,
    data: any,
};