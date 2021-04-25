import React, { useState, useEffect } from 'react';
import { Group, Shape, Rect } from 'react-konva';
import {
    whiteToTransparent,
    turquoiseToTransparent,
    upperActiveBg,
    lowerActiveBg,
    centerActiveBg,
    blackBorderButtonGradient,
    activeButtonBorder,
    selectedBorderButtonGradient,
    selectedActiveButtonBackgroundGradient,
    selectedActiveBorderButtonGradient,
} from '../gradients';


function UpperActiveBg({
    bgBorderSize,
    buttonWidth,
    activeButtonHeight,
    cornerRadius,
    buttonActive
}) {
    return (
        <Rect
            x={-bgBorderSize}
            y={-bgBorderSize}
            width={buttonWidth + bgBorderSize * 2}
            height={activeButtonHeight}
            fill={upperActiveBg(activeButtonHeight)}
            strokeWidth={1}
            stroke={upperActiveBg(activeButtonHeight)}
            cornerRadius={[cornerRadius, cornerRadius, 0, 0]}
            opacity={buttonActive ? 1 : 0}
        />
    )
}


function LowerActiveBg({
    bgBorderSize,
    buttonWidth,
    activeButtonHeight,
    cornerRadius,
    buttonActive
}) {
    return (
        <Rect
            x={-bgBorderSize}
            y={-bgBorderSize + bgBorderSize}
            width={buttonWidth + bgBorderSize * 2}
            height={activeButtonHeight + 1}
            fill={lowerActiveBg(activeButtonHeight)}
            strokeWidth={1}
            stroke={lowerActiveBg(activeButtonHeight)}
            cornerRadius={[0, 0, cornerRadius, cornerRadius]}
            opacity={buttonActive ? 1 : 0}
        />
    )
}


function CenterActiveBg({
    bgBorderSize,
    buttonWidth,
    activeButtonHeight,
    cornerRadius,
    buttonActive,
    selected,
}) {
    return (
        <Rect
            x={-bgBorderSize}
            y={-bgBorderSize}
            width={buttonWidth + bgBorderSize * 2}
            height={activeButtonHeight + bgBorderSize}
            fill={selected ? selectedActiveButtonBackgroundGradient(activeButtonHeight) : centerActiveBg(activeButtonHeight)}
            strokeWidth={1}
            stroke={selected ? selectedActiveButtonBackgroundGradient(activeButtonHeight) : centerActiveBg(activeButtonHeight)}
            cornerRadius={cornerRadius}
            opacity={buttonActive ? 1 : 0}
        />
    )
}


function Button({
    x = 0, y = 0,
    content,
    buttonWidth,
    buttonHeight,
    bgBorderSize,
    cornerRadius,
    buttonStrokeWidth,
    activeButtonHeight,
    buttonActive,
    setButtonActive,
    position = "center",
    clickFunction = f => f,
    disable = false,
    selected,
}) {
    const [buttonActiveInside, setButtonActiveInside] = useState(false)
    const [mouseCoord, setMouseCoord] = useState(null)
    const mouseCoordDiff = 20
    const buttonActiveComponent = buttonActive ? buttonActive : buttonActiveInside
    const setButtonActiveComponent = setButtonActive ? setButtonActive : setButtonActiveInside

    const moveEvent = (e) => {
        if (!disable && buttonActiveComponent && mouseCoord) {
            const x = e.touches ? e.touches[0].pageX : e.pageX
            const y = e.touches ? e.touches[0].pageY : e.pageY

            if (
                x > mouseCoord.x + mouseCoordDiff
                || x < mouseCoord.x - mouseCoordDiff
                || y > mouseCoord.y + mouseCoordDiff
                || y < mouseCoord.y - mouseCoordDiff
            ) {
                setButtonActiveComponent(false)
                setMouseCoord(null)
            }
        }
    }

    const touchEnd = () => {
        if (!disable && buttonActiveComponent && mouseCoord) {
            setButtonActiveComponent(false)
            setMouseCoord(null)
        }
    }

    useEffect(() => {
        window.addEventListener('touchmove', moveEvent)
        window.addEventListener('touchend', touchEnd)
        window.addEventListener('mousemove', moveEvent)
        return () => {
            window.removeEventListener('touchmove', moveEvent)
            window.removeEventListener('mousemove', moveEvent)
            window.removeEventListener('touchend', touchEnd)
        }
    })


    const chooseActiveBg = () => {
        switch (position) {
            case "upper":
                return <UpperActiveBg
                    bgBorderSize={bgBorderSize}
                    buttonWidth={buttonWidth}
                    activeButtonHeight={activeButtonHeight}
                    cornerRadius={cornerRadius}
                    buttonActive={buttonActiveComponent}
                />

            case "lower":
                return <LowerActiveBg
                    bgBorderSize={bgBorderSize}
                    buttonWidth={buttonWidth}
                    activeButtonHeight={activeButtonHeight}
                    cornerRadius={cornerRadius}
                    buttonActive={buttonActiveComponent}
                />
            case "center":
                return <CenterActiveBg
                    bgBorderSize={bgBorderSize}
                    buttonWidth={buttonWidth}
                    activeButtonHeight={activeButtonHeight}
                    cornerRadius={cornerRadius}
                    buttonActive={buttonActiveComponent}
                    selected={selected}
                />

            default:
                return <CenterActiveBg
                    bgBorderSize={bgBorderSize}
                    buttonWidth={buttonWidth}
                    activeButtonHeight={activeButtonHeight}
                    cornerRadius={cornerRadius}
                    buttonActive={buttonActiveComponent}
                    selected={selected}
                />
        }
    }

    return (
        <Group x={x} y={y}>
            {chooseActiveBg()}
            {/* button */}
            <Group
                onTouchStart={(e) => {
                    if (!disable) {
                        setButtonActiveComponent(true)
                        setMouseCoord({ x: e.evt.touches[0].pageX, y: e.evt.touches[0].pageY })
                    }
                }}
                onTap={() => {
                    if (!disable && buttonActiveComponent) {
                        setButtonActiveComponent(false)
                        clickFunction()
                    }
                }}
                onMouseDown={(e) => {
                    if (!disable) {
                        setButtonActiveComponent(true)
                        setMouseCoord({ x: e.evt.pageX, y: e.evt.pageY })
                    }
                }}
                onClick={() => {
                    if (!disable && buttonActiveComponent) {
                        setButtonActiveComponent(false)
                        clickFunction()
                    }
                }}
                clipFunc={ctx => {
                    ctx.beginPath()
                    ctx.moveTo(cornerRadius, 0)
                    ctx.lineTo(buttonWidth - cornerRadius, 0)
                    ctx.quadraticCurveTo(buttonWidth, 0, buttonWidth, cornerRadius)
                    ctx.lineTo(buttonWidth, buttonHeight - cornerRadius)
                    ctx.quadraticCurveTo(buttonWidth, buttonHeight, buttonWidth - cornerRadius, buttonHeight)
                    ctx.lineTo(cornerRadius, buttonHeight)
                    ctx.quadraticCurveTo(0, buttonHeight, 0, buttonHeight - cornerRadius)
                    ctx.lineTo(0, cornerRadius)
                    ctx.quadraticCurveTo(0, 0, cornerRadius, 0)
                    ctx.closePath()
                }}>
                {/* button black (blue) background */}
                <Rect
                    width={buttonWidth}
                    height={buttonHeight}
                    fill={selected
                        ? buttonActiveComponent ? "#0080BE" : "#006284"
                        : buttonActiveComponent ? "#004482" : "black"
                    }
                    cornerRadius={cornerRadius}
                />
                {/* button white gradient */}
                <Rect
                    width={buttonWidth}
                    height={buttonHeight}
                    opacity={selected
                        ? buttonActiveComponent ? 1 : 0.5
                        : buttonActiveComponent ? 0.8 : 0.3}
                    fill={selected
                        ? turquoiseToTransparent(buttonHeight)
                        : whiteToTransparent(buttonHeight)
                    }
                    cornerRadius={cornerRadius}
                />
                {/* border inside button */}
                <Shape sceneFunc={(ctx, shape) => {
                    ctx.beginPath()
                    ctx.moveTo(cornerRadius, 0)
                    ctx.lineTo(buttonWidth - cornerRadius, 0)
                    ctx.quadraticCurveTo(buttonWidth, 0, buttonWidth, cornerRadius)
                    ctx.lineTo(buttonWidth, buttonHeight - cornerRadius)
                    ctx.quadraticCurveTo(buttonWidth, buttonHeight, buttonWidth - cornerRadius, buttonHeight)
                    ctx.lineTo(cornerRadius, buttonHeight)
                    ctx.quadraticCurveTo(0, buttonHeight, 0, buttonHeight - cornerRadius)
                    ctx.lineTo(0, cornerRadius)
                    ctx.quadraticCurveTo(0, 0, cornerRadius, 0)
                    ctx.fillStrokeShape(shape)
                    ctx.closePath()
                }}
                    stroke={selected
                        ? buttonActiveComponent ? selectedActiveBorderButtonGradient(buttonHeight) : selectedBorderButtonGradient(buttonHeight)
                        : buttonActiveComponent ? activeButtonBorder(buttonHeight) : blackBorderButtonGradient(buttonHeight)}
                    strokeWidth={buttonStrokeWidth}
                />
                <Group opacity={disable ? 0.4 : 1} listening={false}>
                    {typeof content === 'function' ? content() : content}
                </Group>
            </Group>
        </Group >
    )
}

export default Button
