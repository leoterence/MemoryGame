export type Cart = {
    id:number,
    img:string
    visible:boolean
}

export type Party ={
    id:number
    score:number
    moves:number
    cartes:Cart[]
}

export type Niveau ={
    id:number
    difficulté:"Debutant"|"Avance"|"Expert"
    moves:40|35|20
    partie:Party
}