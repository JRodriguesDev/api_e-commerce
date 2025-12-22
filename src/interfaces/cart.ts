export interface Cart {
    id: string
    items: []
    userId: string
}

export interface CartItem{
    id: string
    quantity: number,
    productId: string
}