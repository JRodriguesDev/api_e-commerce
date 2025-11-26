export interface Product {
    id: number
    title: string
    description: string
    category: string
    price: number
    rating: number
    stock: number
    availabilityStatus: string
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