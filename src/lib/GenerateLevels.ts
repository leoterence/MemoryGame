import { Niveau } from "./type";
import GeneratePartie from "./GeneratePartie";

export default function GenerateLevels():Niveau[] {
  const levels:Niveau[] = []
  let debutant =GeneratePartie()[0]
  let avance =GeneratePartie()[1]
  let expert =GeneratePartie()[2]
  levels.push({
    id:0,
    difficulté:"Debutant",
    moves:40,
    partie:debutant
  })
  levels.push({
    id:1,
    difficulté:"Avance",
    moves:35,
    partie:avance
  })
  levels.push({
    id:2,
    difficulté:"Expert",
    moves:20,
    partie:expert
  })
  return levels
}

type Diff = "Debutant" | "Avance" | "Expert";
export const getlevel = (difficulte: Diff): Niveau|undefined => {
  const niveaux = GenerateLevels();
  return niveaux.find(n => n.difficulté === difficulte);
}

export const getdifficult=()=>{
    return GenerateLevels().flatMap(lev=>{
        return {
            slug:lev.difficulté
        }
    })
}
