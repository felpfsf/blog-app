import React from "react";
import CreateTweet from "./CreateTweet";

type Props = {};

function Timeline({}: Props) {
  return (
    <div>
      <h1>Tweet Something</h1>
      <CreateTweet />
    </div>
  );
}

export default Timeline;
