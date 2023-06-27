type Filter = {
    brand?: string[];
    search?: string;
    type?: string[];
    price?: number[];
    sort?: string;
    sortType?: string;
    }

export const getCars = async (page:number,filter?:Filter) => {
    let fetchString = `http://localhost:8080/cars?page=${page}`
    if (filter) {
        console.log(filter)
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
        if (filter.type && filter.type.length > 0) {
            const typeFilter = filter.type.join(',')
            fetchString += `&type=${typeFilter}`
        }
        if (filter.sort) {
            if (filter.sort == "brand") {
                fetchString += `&sort=brand&order=asc`
            }
            if (filter.sort == "price" && filter.sortType) {
                fetchString += `&sort=price&order=${filter.sortType}`
            }
        }
        if(!filter.sort){
            fetchString+="&sort=brand&order=asc"
        }
    }else{
        fetchString+="&sort=brand"
    }
    const cars = await fetch(fetchString)
    return cars.json();
}