import { getdifficult } from "@/lib/GenerateLevels";
import { getlevel } from "@/lib/GenerateLevels";
import { notFound } from "next/navigation";
import Jeux from "@/components/jeux";

export function generateStaticParams() {
    const dif = getdifficult()
    // Retourner un tableau vide au lieu de undefined
    if (!dif) return []
    
    return dif.map(lev => {
        return ({
            slug: lev.slug
        })
    })
}

type Diff = "Debutant" | "Avance" | "Expert";

// Correction : params est maintenant une Promise
type Propos = {
    params: Promise<{
        slug: string
    }>
}

// Version avec async/await
export default async function PageL({ params }: Propos) {
    // Attendre la résolution de la Promise params
    const resolvedParams = await params
    
    if (!["Debutant", "Avance", "Expert"].includes(resolvedParams.slug as Diff)) {
        return notFound()
    }
    
    const level = getlevel(resolvedParams.slug as Diff)
    
    return <Jeux initiaLevel={level} />
}