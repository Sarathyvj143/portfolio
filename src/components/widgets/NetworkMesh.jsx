import "./NetworkMesh.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import Animable from "/src/components/capabilities/Animable.jsx"

/**
 * Animated "distributed system" node mesh used behind the preloader logo.
 * Nodes drift and link up with fading lines — an on-brand backdrop for a
 * backend / cloud / data portfolio. Purely decorative (aria-hidden).
 */
function NetworkMesh() {
    const utils = useUtils()

    const canvasId = `preloader-network-mesh-canvas`
    const nodeCount = 48
    const connectDistance = 132

    const [nodes, setNodes] = useState([])

    /** @constructs **/
    useEffect(() => {
        const width = window.innerWidth
        const height = window.innerHeight * 1.3
        const created = Array.from({length: nodeCount}, () =>
            new NodeData(width, height)
        )
        setNodes(created)
    }, [null])

    const _step = (event) => {
        const canvas = document.getElementById(canvasId)
        const context = canvas?.getContext("2d")
        if(!canvas || !context || nodes.length === 0)
            return

        const width = canvas.clientWidth || window.innerWidth
        const height = canvas.clientHeight || window.innerHeight
        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        if(canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        context.clearRect(0, 0, width, height)

        const dt = Math.min(event.currentTickElapsed / 0.017, 3)
        const reduceMotion = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches

        const primaryHex = utils.css.getRootSCSSVariable("--theme-primary") || "#46A6FF"

        if(!reduceMotion) {
            for(const node of nodes)
                node.update(dt, width, height)
        }

        _drawLines(context, connectDistance)
        _drawNodes(context, primaryHex)
    }

    const _drawLines = (context, maxDistance) => {
        for(let i = 0; i < nodes.length; i++) {
            for(let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i]
                const b = nodes[j]
                const dx = a.x - b.x
                const dy = a.y - b.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if(distance >= maxDistance)
                    continue

                const alpha = (1 - distance / maxDistance) * 0.16
                context.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                context.lineWidth = 1
                context.beginPath()
                context.moveTo(a.x, a.y)
                context.lineTo(b.x, b.y)
                context.stroke()
            }
        }
    }

    const _drawNodes = (context, primaryHex) => {
        for(const node of nodes) {
            context.beginPath()
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
            context.fillStyle = node.accent ?
                utils.css.hexToRgba(primaryHex, 0.85) :
                `rgba(255, 255, 255, ${node.opacity})`
            context.fill()
        }
    }

    return (
        <Animable className={`preloader-network-mesh`}
                  animationId={`preloader-network-mesh`}
                  onEnterFrame={_step}>
            <canvas id={canvasId}/>
        </Animable>
    )
}

class NodeData {
    constructor(width, height) {
        this.x = Math.random() * width
        this.y = Math.random() * height

        const speed = 0.15 + Math.random() * 0.35
        const angle = Math.random() * Math.PI * 2
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed

        this.radius = 1.2 + Math.random() * 1.8
        this.opacity = 0.35 + Math.random() * 0.5
        this.accent = Math.random() < 0.14
    }

    update(dt, width, height) {
        this.x += this.vx * dt
        this.y += this.vy * dt

        if(this.x <= 0) { this.x = 0; this.vx = Math.abs(this.vx) }
        else if(this.x >= width) { this.x = width; this.vx = -Math.abs(this.vx) }

        if(this.y <= 0) { this.y = 0; this.vy = Math.abs(this.vy) }
        else if(this.y >= height) { this.y = height; this.vy = -Math.abs(this.vy) }
    }
}

export default NetworkMesh
