import seedrandom from "seedrandom"
import { Cart } from "./type";
import fs from "fs"
import path from "path"

const imgdirectory = path.join(process.cwd(),"public")
const img = path.join(imgdirectory,"asset")
const allimg= fs.readdirSync(img)
export const allnameimg= allimg.filter(f=>f.endsWith('.jpg'))

function trie<T>(imgs:T[],seed:string):T[]{
    const rng = seedrandom(seed);
    const copy = [...imgs];
    const v = Math.floor(Math.random()*copy.length+1)
    // Nombre de passes aléatoires pour éviter la prévisibilité
    const shufflePasses = Math.floor(rng() * v) + 1; // Entre 1 et 3 passes

    for (let pass = 0; pass < shufflePasses; pass++) {
        for (let i = copy.length - 1; i >0; i--) {
            const j = Math.floor(rng() * (i + 1));

            // Ajout d'une légère perturbation sur l'index choisi
            const perturbation = Math.floor(rng() * copy.length);
            const index = (j + perturbation) % copy.length;

            [copy[i], copy[index]] = [copy[index], copy[i]];
        }
    }
      return copy

}

export default function GeneretCates(seed:string):Cart[]{
    let id = 0;
    const Cates:Cart[]=[];
    
    for(const img of allnameimg){
        Cates.push({
            id:++id,
            img,
            visible:false,
        });
        Cates.push({
            id:++id,
            img,
            visible:false,
        })
    }
    return trie(Cates,seed)

}