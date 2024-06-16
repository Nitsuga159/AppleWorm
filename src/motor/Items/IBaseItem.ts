export interface ILocation {
    x: number
    y: number
}

export interface ISize {
    width: number
    height: number
}

export interface IBounds extends ILocation, ISize {}