import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

import { moveAt, getHue, getHueCoordinates } from "./utils";

import { HueBarStyleProps, HueProps } from "./types";

const HueBar = styled.div<HueBarStyleProps>`
  position: relative;
  width: ${props => props.width - 20}px;
  height: 12px;
  background-image: linear-gradient(
    to right,
    rgb(255, 0, 0),
    rgb(255, 255, 0),
    rgb(0, 255, 0),
    rgb(0, 255, 255),
    rgb(0, 0, 255),
    rgb(255, 0, 255),
    rgb(255, 0, 0)
  );
  border-radius: 10px;
  user-select: none;
`;

const HueBarCursor = styled.div`
  position: absolute;
  left: 8px;
  top: 0;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px;
  transform: translate(-8px, -2px);
  box-sizing: content-box;
`;

export const Hue = ({ width, color, hue, setHue }: HueProps) => {
  const hueBar = useRef<HTMLDivElement>(null);
  const hueBarCursor = useRef<HTMLDivElement>(null);

  const [x, setX] = useState(8);

  useEffect(() => {
    if (hueBar.current && hueBarCursor.current && color.inputted) {
      const x = getHueCoordinates(
        hue,
        0 + hueBarCursor.current.offsetWidth / 2,
        hueBar.current.offsetWidth - hueBarCursor.current.offsetWidth / 2,
        hueBar.current.offsetWidth - hueBarCursor.current.offsetWidth,
        hueBarCursor.current.offsetWidth
      );

      setX(x);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue]);

  const moveCursor = (e: React.MouseEvent | MouseEvent, shiftX: number) => {
    if (hueBar.current && hueBarCursor.current) {
      const [x] = moveAt(
        true,
        e.clientX,
        shiftX,
        0 + hueBarCursor.current.offsetWidth / 2,
        hueBar.current.offsetWidth - hueBarCursor.current.offsetWidth / 2,
        setX
      );
      const hue = getHue(
        x - hueBarCursor.current.offsetWidth / 2,
        hueBar.current.offsetWidth - hueBarCursor.current.offsetWidth
      );

      setHue(hue);
    }
  };

  const mouseDown = (e: React.MouseEvent) => {
    if (hueBar.current) {
      if (e.button === 2) return;

      document.getSelection()?.empty();

      const shiftX = hueBar.current.offsetLeft;

      moveCursor(e, shiftX);

      const mouseMove = (e: MouseEvent) => moveCursor(e, shiftX);
      const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouoseup", mouseUp);
      };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  return (
    <HueBar ref={hueBar} width={width} onMouseDown={mouseDown}>
      <HueBarCursor ref={hueBarCursor} style={{ left: x }} />
    </HueBar>
  );
};