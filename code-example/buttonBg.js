import React from 'react';
import { Rect } from 'react-konva';
import {
    bgBorderGradient,
    buttonBackgroundGradient,
    selectedButtonBackgroundGradient,
} from '../gradients';


function ButtonBg({
    height,
    buttonWidth,
    cornerRadius,
    bgBorderSize,
    selected,
}) {

    return (
        <Rect
            x={-bgBorderSize}
            y={-bgBorderSize}
            width={buttonWidth + bgBorderSize * 2}
            height={height + bgBorderSize * 2}
            fill={selected
                ? selectedButtonBackgroundGradient(height)
                : buttonBackgroundGradient(height)}
            strokeWidth={bgBorderSize / 3}
            stroke={selected
                ? "#21888D"
                : bgBorderGradient(height)
            }
            cornerRadius={cornerRadius}
        />
    )
}

export default ButtonBg
