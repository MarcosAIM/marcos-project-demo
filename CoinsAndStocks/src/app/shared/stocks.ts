export interface Stock{
    name: string,
    value:number
}

export interface playerStocks extends Stock {
    quantity_owned:number,
}