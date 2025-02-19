"use client"

import ReactTimeAgo from "react-time-ago";

export function CreatedAt({data}) {
    return (
        <ReactTimeAgo date={data} locale="en-US"/>
    )
}