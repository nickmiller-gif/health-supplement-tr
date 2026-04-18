import { useRef, useEffect, useId } from 'react'
import * as d3 from 'd3'

interface TrendSparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function TrendSparkline({
  data,
  width = 120,
  height = 40,
  color = 'oklch(0.65 0.15 195)'
}: TrendSparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  // Stable, collision-free gradient ID. Using Math.random() here produced a new
  // ID on every access, so the <linearGradient> id and the fill url(#...) never
  // matched and the area fill was silently broken.
  const reactId = useId()
  const gradientId = `trend-sparkline-gradient-${reactId.replace(/:/g, '')}`

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 2, right: 2, bottom: 2, left: 2 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([d3.min(data) || 0, d3.max(data) || 100])
      .range([innerHeight, 0])

    const line = d3.line<number>()
      .x((_: number, i: number) => xScale(i))
      .y((d: number) => yScale(d))
      .curve(d3.curveMonotoneX)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.3)

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0)

    const area = d3.area<number>()
      .x((_: number, i: number) => xScale(i))
      .y0(innerHeight)
      .y1((d: number) => yScale(d))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area)

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line)
  }, [data, width, height, color, gradientId])

  return <svg ref={svgRef} width={width} height={height} />
}
