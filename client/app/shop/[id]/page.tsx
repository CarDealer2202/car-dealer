type Props = {
    params:{
        id : string,
    }
}

export default function Car({params: {id} }: Props){
    return <h1>Car {id}</h1>
}