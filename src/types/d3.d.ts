declare module 'd3' {
  export * from 'd3-array'
  export * from 'd3-axis'
  export * from 'd3-brush'
  export * from 'd3-chord'
  export * from 'd3-color'
  export * from 'd3-contour'
  export * from 'd3-delaunay'
  export * from 'd3-dispatch'
  export * from 'd3-drag'
  export * from 'd3-dsv'
  export * from 'd3-ease'
  export * from 'd3-fetch'
  export * from 'd3-force'
  export * from 'd3-format'
  export * from 'd3-geo'
  export * from 'd3-hierarchy'
  export * from 'd3-interpolate'
  export * from 'd3-path'
  export * from 'd3-polygon'
  export * from 'd3-quadtree'
  export * from 'd3-random'
  export * from 'd3-scale'
  export * from 'd3-scale-chromatic'
  export * from 'd3-selection'
  export * from 'd3-shape'
  export * from 'd3-time'
  export * from 'd3-time-format'
  export * from 'd3-timer'
  export * from 'd3-transition'
  export * from 'd3-zoom'
}

declare module 'd3-array' {
  export function min(array: ArrayLike<any>): any
  export function max(array: ArrayLike<any>): any
}

declare module 'd3-scale' {
  export interface ScaleLinear<Range, Output> {
    (value: any): Output
    domain(domain: any[]): this
    range(range: Range[]): this
  }
  export function scaleLinear(): ScaleLinear<number, number>
}

declare module 'd3-selection' {
  export interface Selection<GElement extends Element, Datum, PElement extends Element, PDatum> {
    select(selector: string): Selection<any, Datum, PElement, PDatum>
    selectAll(selector: string): Selection<any, any, GElement, Datum>
    attr(name: string, value: any): this
    append(type: string): Selection<any, Datum, PElement, PDatum>
    datum(value?: any): any
    remove(): this
  }
  export function select(selector: any): Selection<any, any, any, any>
}

declare module 'd3-shape' {
  export interface Line<Datum> {
    (data: Datum[]): string | null
    x(x: number | ((d: Datum, index: number) => number)): this
    y(y: number | ((d: Datum, index: number) => number)): this
    curve(curve: any): this
  }
  
  export interface Area<Datum> {
    (data: Datum[]): string | null
    x(x: number | ((d: Datum, index: number) => number)): this
    y0(y: number | ((d: Datum, index: number) => number)): this
    y1(y: number | ((d: Datum, index: number) => number)): this
    curve(curve: any): this
  }
  
  export function line<Datum = any>(): Line<Datum>
  export function area<Datum = any>(): Area<Datum>
  export const curveMonotoneX: any
}
