import { getdifficult } from "@/lib/GenerateLevels";
import { getlevel } from "@/lib/GenerateLevels";
import { notFound } from "next/navigation";
import Jeux from "@/components/jeux";



export function generateStaticParams(){
    const dif = getdifficult()
    if(!dif)return
    return dif.map(lev=>{
        return({
            slug :lev.slug
        })
    })
}

type Diff = "Debutant" | "Avance" | "Expert";
type Propos={
    params:{
        slug:string
    }
}

export default function PageL({params}:Propos) {
    if(!["Debutant","Avance","Expert"].includes(params.slug))return notFound()
        
    const level = getlevel(params.slug as Diff)

    return <Jeux initiaLevel={level} />
  
}