export interface Review {
    id: string,
    rating: number,
    comment: string,
    date: Date,
    
    product?: {}
    productId?: string
    
    author?: {}
    authorId: string
}