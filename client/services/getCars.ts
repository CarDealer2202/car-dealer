type Filter = {
    brand?: string[];
    search?: string;
    type?: string[];
    price?: [minPrice:number,maxPrice:number];
    }

export const getCars = async (page:number,filter?:Filter) => {
    let fetchString = `http://localhost:8080/cars?page=${page}`
    if (filter) {
        if (filter.price) {
            fetchString += `&minPrice=${filter.price[0]}&maxPrice=${filter.price[1]}`
        }
        if (filter.brand && !filter.search) {
            if (filter.brand.length > 0) {
                const brandFilter = filter.brand.join(',')
                fetchString += `&brand=${brandFilter}`
            }
        }
        if (filter.brand && filter.search) {
            if (filter.brand.length > 0) {
                const brandFilter = filter.brand.join(',')
                const brandFilterAndSearch = brandFilter + ','+ filter.search.split(' ')[0]
                fetchString += `&brand=${brandFilterAndSearch}`
            }
            else{
                const brandFilter = filter.search.split(' ')[0]
                fetchString += `&brand=${brandFilter}`
            }
            if (filter.search.split(' ').length > 1) {
                const model = filter.search.split(' ')[1]
                fetchString += `&model=${model}`
            }
        }
    }
    const cars = await fetch(fetchString)
    return cars.json();
}