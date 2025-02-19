"use client"

import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgoLib from "javascript-time-ago";

TimeAgoLib.addDefaultLocale(en);

export function CreatedAt({ date }: { date: Date }) {
    return (
        <ReactTimeAgo date={date} locale="en-US"/>
    )
}