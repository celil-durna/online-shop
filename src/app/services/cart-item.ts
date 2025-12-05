/**
 * Represents an item in the cart.
 * 
 * id, color, and size make the item unique.
 */
export interface CartItem {
    // The id of the associated product.
    // Useful for querying additional information such as price
    id: string;
    // Selected color id of the product in the cart
    color: string;
    // Selected size of the product in the cart
    size: string;
    quantity: number;
}