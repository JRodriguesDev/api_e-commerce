export interface Product {
    id: string
    title: string
    description: string
    category: string
    price: number
    rating: number
    stock: number
    thumbnail: string
    images?: []
    reviews?: []
}

export interface Reviews {
    id: string
    rating: number
    comment: string
    data: Date

}