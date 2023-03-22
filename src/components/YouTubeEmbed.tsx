import React from "react";

interface P {
  embedId: string;
}

export const YoutubeEmbed = (props: P) => {
  const { embedId } = props;

  return (
    <div
      className="video-responsive"
      style={{
        overflow: "hidden",
        paddingBottom: "56.25%",
        position: "relative",
        height: 0,
        margin: "1em",
      }}
    >
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        // frameBorder="0"
        style={{
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};
