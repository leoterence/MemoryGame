import { Party } from "./type";
import GeneretCates from "./GenerateCarte";


export default function GeneratePartie():Party[]{
    let id = 0
    const Parties:Party[]=[]
    const levels = ["Debutant","Avance","Expert"]

    for(const level of levels){
        Parties.push({
            id:++id,
            score:0,
            moves:0,
            cartes:GeneretCates(level)
        })
    }

    return Parties

}