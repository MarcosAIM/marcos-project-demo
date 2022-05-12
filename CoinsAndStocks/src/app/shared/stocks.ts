export interface Stock{
    name: string,
    value:number,
    increasePerShare:number;
}

export interface playerStocks extends Stock {
    quantity_owned:number,
}