export const getCars = async (page:number) => {
    const cars = await fetch(`http://localhost:8080/cars?page=${page}&limit=6`)
    // const result = await cars.json();
    // return result["cars"];
    return cars.json();
}